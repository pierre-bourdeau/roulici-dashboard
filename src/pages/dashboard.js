/**
 * Webflow Cloud — API Proxy Booqable
 * Route : src/pages/dashboard.js (mount path /api)
 * Méthode : GET
 * Headers : x-member-id: <memberstack_member_id>
 * Query params :
 *   - tab : "stock" | "calendar" | "revenue" | "all"
 *   - month : YYYY-MM (utilisé pour calendar, défaut = mois courant)
 */

export const config = { runtime: "edge" };

const COMMISSION_RATES = {
  mecanique: 0.30,
  vae: 0.10,
  remorque: 0.15,
  "porte-bebe": 0.15,
  casque: 0,
  enfant: 0.15,
};

function getCommissionRate(productName) {
  const name = productName.toLowerCase();
  if (name.includes("lectrique") || name.includes("vae") || name.includes("assistance")) return COMMISSION_RATES.vae;
  if (name.includes("remorque")) return COMMISSION_RATES.remorque;
  if (name.includes("porte") && name.includes("b")) return COMMISSION_RATES["porte-bebe"];
  if (name.includes("casque")) return COMMISSION_RATES.casque;
  if (name.includes("enfant") || name.includes("20") || name.includes("24")) return COMMISSION_RATES.enfant;
  return COMMISSION_RATES.mecanique;
}

// ─── TRACKING TYPE (trackable vs bulk) ────────────────────────────────────────

function isTrackable(pg) {
  const a = pg.attributes || {};
  if (typeof a.trackable === "boolean") return a.trackable;
  if (a.tracking_type) return a.tracking_type === "trackable";
  return true; // défaut prudent : traité comme trackable
}

/**
 * La quantité de stock d'un produit BULK n'est pas un attribut du product group.
 * Elle se lit via l'endpoint /availabilities avec subject_type=item et le subject_id
 * du variant (product). La réponse renvoie une "quantity" par jour = quantité bookable.
 * On prend le max des quantités du mois courant (= stock physique, hors jours réservés).
 * @returns {number} quantité totale du variant, ou 0 si introuvable.
 */
async function getBulkQuantityForVariant(variantId, env) {
  const now = new Date();
  const params = new URLSearchParams({
    "filter[subject_id]": variantId,
    "filter[subject_type]": "item",
    "filter[year]": String(now.getFullYear()),
    "filter[month]": String(now.getMonth() + 1),
    "fields[availabilities]": "date,quantity,status",
  });

  try {
    const data = await booqableFetch(`/availabilities?${params.toString()}`, env);
    const records = data.data || [];
    let maxQty = 0;
    for (const rec of records) {
      const q = rec.attributes?.quantity;
      if (typeof q === "number" && q > maxQty) maxQty = q;
    }
    return maxQty;
  } catch (err) {
    console.error(`getBulkQuantityForVariant(${variantId}) failed:`, err.message);
    return 0;
  }
}

async function validateMemberstack(memberId, env) {
  const res = await fetch(`https://admin.memberstack.com/members/${memberId}`, {
    headers: { "x-api-key": env.MEMBERSTACK_SECRET_KEY },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data || null;
}

async function booqableFetch(path, env) {
  const base = `https://${env.BOOQABLE_SHOP}.booqable.com/api/4`;
  const res = await fetch(`${base}${path}`, {
    headers: {
      Authorization: `Bearer ${env.BOOQABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Booqable API error ${res.status} on ${path}`);
  return res.json();
}

async function booqableSearch(resource, body, env) {
  const base = `https://${env.BOOQABLE_SHOP}.booqable.com/api/4`;
  const res = await fetch(`${base}/${resource}/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.BOOQABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Booqable search error ${res.status} on /${resource}/search: ${text}`);
  }
  return res.json();
}

async function getProductGroupsAndItems(partnerSlug, env) {
  const pgData = await booqableFetch(
    `/product_groups?filter[tag_list]=${encodeURIComponent(partnerSlug)}&fields[product_groups]=id,name,trackable,tracking_type&per=100`,
    env
  );

  const productGroups = pgData.data || [];
  if (!productGroups.length) {
    return { productGroups: [], stockItems: [], products: [], bulkQuantities: {} };
  }

  const pgIds = productGroups.map(pg => pg.id).join(",");

  // Fetch stock items et products en parallèle
  const [siData, productsData] = await Promise.all([
    booqableFetch(
      `/stock_items?filter[product_group_id]=${pgIds}&filter[archived]=false&fields[stock_items]=id,identifier,product_group_id,status,properties&per=200`,
      env
    ),
    booqableFetch(
      `/products?filter[product_group_id]=${pgIds}&fields[products]=id,product_group_id&per=200`,
      env
    ),
  ]);

  const products = productsData.data || [];

  // Pour chaque product group BULK, résoudre la quantité via /availabilities
  // (subject = le variant/product du groupe). On mappe pgId -> quantité.
  const bulkGroups = productGroups.filter(pg => !isTrackable(pg));
  const bulkQuantities = {};

  if (bulkGroups.length) {
    const productByPg = {};
    for (const p of products) {
      const pgId = p.attributes.product_group_id;
      if (!productByPg[pgId]) productByPg[pgId] = p.id; // 1er variant du groupe
    }

    await Promise.all(bulkGroups.map(async pg => {
      const variantId = productByPg[pg.id];
      if (!variantId) { bulkQuantities[pg.id] = 0; return; }
      bulkQuantities[pg.id] = await getBulkQuantityForVariant(variantId, env);
    }));
  }

  return {
    productGroups,
    stockItems: siData.data || [],
    products,
    bulkQuantities,
  };
}

async function handleStock(productGroups, stockItems, bulkQuantities = {}) {
  const groups = {};
  for (const pg of productGroups) {
    const trackable = isTrackable(pg);
    const bulkQty = trackable ? 0 : (bulkQuantities[pg.id] || 0);
    groups[pg.id] = {
      id: pg.id,
      name: pg.attributes.name.split(/\s*[–—]\s*/)[0].trim(),
      trackable,
      total: bulkQty,
      available: bulkQty,
      unavailable: 0,
      items: [],
    };
  }

  for (const si of stockItems) {
    const pgId = si.attributes.product_group_id;
    if (!groups[pgId]) continue;
    const isAvail = si.attributes.status === "in_stock";
    groups[pgId].total++;
    if (isAvail) groups[pgId].available++;
    else groups[pgId].unavailable++;

    const props = si.attributes.properties || {};
    groups[pgId].items.push({
      id: si.id,
      identifier: si.attributes.identifier,
      status: si.attributes.status,
      cadenas: props.cadenas || null,
      code: props.code || null,
      couleur: props.couleur_du_collier || props.couleur_de_collier || props.couleur_collier || null,
    });
  }

  const trackableItems = stockItems.length;
  const trackableAvailable = stockItems.filter(s => s.attributes.status === "in_stock").length;

  const bulkTotal = productGroups
    .filter(pg => !isTrackable(pg))
    .reduce((s, pg) => s + (bulkQuantities[pg.id] || 0), 0);

  const totalEquipments = trackableItems + bulkTotal;
  const totalAvailable = trackableAvailable + bulkTotal;

  return {
    summary: {
      totalEquipments,
      totalAvailable,
      totalUnavailable: totalEquipments - totalAvailable,
    },
    groups: Object.values(groups),
  };
}

async function handleCalendar(productGroups, products, month, env) {
  const [year, mon] = month.split("-");
  const startDate = `${year}-${mon}-01`;
  const lastDay = new Date(parseInt(year), parseInt(mon), 0).getDate();
  const endDate = `${year}-${mon}-${String(lastDay).padStart(2, "0")}`;

  if (!productGroups.length || !products.length) return { month, reservations: [] };

  const itemIds = products.map(p => p.id);

  // Chunks de 5 en parallèle
  const chunks = [];
  for (let i = 0; i < itemIds.length; i += 5) chunks.push(itemIds.slice(i, i + 5));

  const planningResults = await Promise.all(chunks.map(chunk =>
    booqableFetch(
      `/plannings?filter[item_id]=${chunk.join(",")}&filter[starts_at][gte]=${startDate}T00:00:00Z&filter[starts_at][lte]=${endDate}T23:59:59Z&fields[plannings]=order_id&per=200`,
      env
    )
  ));

  const partnerOrderIdsSet = new Set();
  for (const result of planningResults) {
    for (const p of result.data || []) {
      if (p.attributes?.order_id) partnerOrderIdsSet.add(p.attributes.order_id);
    }
  }

  const partnerOrderIds = [...partnerOrderIdsSet];
  if (!partnerOrderIds.length) return { month, reservations: [] };

  const ordersData = await booqableSearch("orders", {
    filter: { id: partnerOrderIds },
    include: "customer",
    fields: {
      orders: "id,number,starts_at,stops_at,status",
      customers: "id,name,email",
    },
    per: 200,
  }, env);

  const orders = ordersData.data || [];
  const included = ordersData.included || [];

  const customers = {};
  for (const inc of included) {
    if (inc.type === "customers") {
      customers[inc.id] = {
        name: (inc.attributes.name || "").trim() || inc.attributes.email || "Client inconnu",
        email: inc.attributes.email,
      };
    }
  }

  const reservations = orders
    .filter(o => ["reserved", "started", "concept", "stopped"].includes(o.attributes.status))
    .map(order => {
      const customerId = order.relationships?.customer?.data?.id;
      return {
        id: order.id,
        number: order.attributes.number,
        startsAt: order.attributes.starts_at,
        stopsAt: order.attributes.stops_at,
        status: order.attributes.status,
        customer: customerId ? customers[customerId] : null,
      };
    })
    .sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt));

  return { month, reservations };
}

async function handleRevenue(productGroups, products, env) {
  async function handleRevenue(productGroups, products, env) {
  // ─── LOG TEMPORAIRE — à retirer après diagnostic ───
  console.log("PG NAMES:", productGroups.map(pg => JSON.stringify(pg.attributes.name)));
  console.log("CLEAN+RATE:", productGroups.map(pg => {
    const c = pg.attributes.name.split(/\s*[–—]\s*/)[0].trim();
    return `${JSON.stringify(c)} => ${getCommissionRate(c)}`;
  }));
  // ────────────────────────────────────────────────────

  if (!productGroups.length || !products.length) {
    return { summary: { totalLocations: 0, totalRevenue: 0, totalCommission: 0 }, byProduct: [] };
  }

  const itemIdSet = new Set(products.map(p => p.id));
  const itemToPgId = {};
  for (const p of products) itemToPgId[p.id] = p.attributes.product_group_id;

  const pgIndex = {};
  for (const pg of productGroups) pgIndex[pg.id] = pg.attributes.name;

  const byProduct = {};
  for (const pg of productGroups) {
    const cleanName = pg.attributes.name.split(/\s*[–—]\s*/)[0].trim();
    const rate = getCommissionRate(cleanName);
    byProduct[cleanName] = { name: cleanName, count: 0, revenue: 0, commissionRate: rate, commission: 0 };
  }

  const itemIds = products.map(p => p.id);
  const chunks = [];
  for (let i = 0; i < itemIds.length; i += 5) chunks.push(itemIds.slice(i, i + 5));

  const planningResults = await Promise.all(chunks.map(chunk =>
    booqableFetch(
      `/plannings?filter[item_id]=${chunk.join(",")}&fields[plannings]=order_id&per=500`,
      env
    )
  ));

  const partnerOrderIdsSet = new Set();
  for (const result of planningResults) {
    for (const p of result.data || []) {
      if (p.attributes?.order_id) partnerOrderIdsSet.add(p.attributes.order_id);
    }
  }

  const partnerOrderIds = [...partnerOrderIdsSet];
  if (!partnerOrderIds.length) {
    return {
      summary: { totalLocations: 0, totalRevenue: 0, totalCommission: 0 },
      byProduct: Object.values(byProduct),
    };
  }

  const orderChunks = [];
  for (let i = 0; i < partnerOrderIds.length; i += 50) orderChunks.push(partnerOrderIds.slice(i, i + 50));

  const orderResults = await Promise.all(orderChunks.map(orderChunk =>
    booqableSearch("orders", {
      filter: { id: orderChunk },
      include: "lines",
      fields: { orders: "id", lines: "id,price_in_cents,item_id" },
      per: 200,
    }, env)
  ));

  let totalRevenue = 0;
  let totalLocations = 0;

  for (const ordersData of orderResults) {
    for (const line of ordersData.included || []) {
      if (line.type !== "lines") continue;
      const itemId = line.attributes?.item_id;
      if (!itemId || !itemIdSet.has(itemId)) continue;

      const pgId = itemToPgId[itemId];
      const pgName = pgIndex[pgId] || "";
      const cleanName = pgName.split(/\s*[–—]\s*/)[0].trim();
      const amount = (line.attributes.price_in_cents || 0) / 100;
      const rate = getCommissionRate(cleanName);

      if (!byProduct[cleanName]) {
        byProduct[cleanName] = { name: cleanName, count: 0, revenue: 0, commissionRate: rate, commission: 0 };
      }
      byProduct[cleanName].count++;
      byProduct[cleanName].revenue += amount;
      byProduct[cleanName].commission += amount * rate;
      totalRevenue += amount;
      totalLocations++;
    }
  }

  const totalCommission = Object.values(byProduct).reduce((s, p) => s + p.commission, 0);

  return {
    summary: {
      totalLocations,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalCommission: Math.round(totalCommission * 100) / 100,
    },
    byProduct: Object.values(byProduct).map(p => ({
      ...p,
      revenue: Math.round(p.revenue * 100) / 100,
      commission: Math.round(p.commission * 100) / 100,
    })),
  };
}

export async function GET({ request, locals }) {
  const env = locals.runtime.env;

  const origin = request.headers.get("origin") || "";
  const allowedOrigins = ["https://www.roulici.fr", "https://roulici.webflow.io"];
  const allowOrigin = allowedOrigins.includes(origin) ? origin : "https://www.roulici.fr";

  const corsHeaders = {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "x-member-id, Content-Type",
    "Content-Type": "application/json",
  };

  const memberId = request.headers.get("x-member-id");
  if (!memberId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const member = await validateMemberstack(memberId, env);
  if (!member) {
    return new Response(JSON.stringify({ error: "Invalid member" }), { status: 401, headers: corsHeaders });
  }

  const partnerSlug = member.customFields?.["partner-slug"];
  if (!partnerSlug) {
    return new Response(JSON.stringify({ error: "No partner associated" }), { status: 403, headers: corsHeaders });
  }

  const url = new URL(request.url);
  const tab = url.searchParams.get("tab") || "all";
  const month = url.searchParams.get("month") || new Date().toISOString().slice(0, 7);

  try {
    // Un seul appel pour récupérer product groups + stock items + products + quantités bulk
    const { productGroups, stockItems, products, bulkQuantities } = await getProductGroupsAndItems(partnerSlug, env);

    let data;

    if (tab === "all") {
      // Tout en parallèle en un seul round-trip
      const [stock, calendar, revenue] = await Promise.all([
        handleStock(productGroups, stockItems, bulkQuantities),
        handleCalendar(productGroups, products, month, env),
        handleRevenue(productGroups, products, env),
      ]);
      data = { stock, calendar, revenue };
    } else if (tab === "stock") {
      data = await handleStock(productGroups, stockItems, bulkQuantities);
    } else if (tab === "calendar") {
      data = await handleCalendar(productGroups, products, month, env);
    } else if (tab === "revenue") {
      data = await handleRevenue(productGroups, products, env);
    } else {
      return new Response(JSON.stringify({ error: "Invalid tab" }), { status: 400, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ partnerSlug, tab, ...data }), {
      status: 200,
      headers: { ...corsHeaders, "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal error", detail: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function OPTIONS({ request }) {
  const origin = request.headers.get("origin") || "";
  const allowedOrigins = ["https://www.roulici.fr", "https://roulici.webflow.io"];
  const allowOrigin = allowedOrigins.includes(origin) ? origin : "https://www.roulici.fr";
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "x-member-id, Content-Type",
    },
  });
}

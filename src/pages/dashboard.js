/**
 * Webflow Cloud — API Proxy Booqable
 * Route : src/pages/dashboard.js (mount path /api)
 * Méthode : GET
 * Headers : x-member-id: <memberstack_member_id>
 * Query params :
 *   - tab : "stock" | "calendar" | "revenue"
 *   - month : YYYY-MM (utilisé uniquement pour calendar)
 */

export const config = { runtime: "edge" };

const COMMISSION_RATES = {
  mecanique: 0.30,
  vae: 0.10,
  remorque: 0.15,
  "porte-bebe": 0.15,
  casque: 0,
  enfant: 0,
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
    `/product_groups?filter[tag_list]=${encodeURIComponent(partnerSlug)}&fields[product_groups]=id,name&per=100`,
    env
  );

  const productGroups = pgData.data || [];
  if (!productGroups.length) return { productGroups: [], stockItems: [], pgIndex: {} };

  const pgIndex = {};
  for (const pg of productGroups) {
    pgIndex[pg.id] = pg.attributes.name;
  }

  const pgIds = productGroups.map(pg => pg.id).join(",");
  const siData = await booqableFetch(
    `/stock_items?filter[product_group_id]=${pgIds}&filter[archived]=false&fields[stock_items]=id,identifier,product_group_id,status,properties&per=200`,
    env
  );

  return { productGroups, stockItems: siData.data || [], pgIndex };
}

async function handleStock(partnerSlug, env) {
  const { productGroups, stockItems } = await getProductGroupsAndItems(partnerSlug, env);

  const groups = {};
  for (const pg of productGroups) {
    groups[pg.id] = {
      id: pg.id,
      name: pg.attributes.name.split(/\s*[–—]\s*/)[0].trim(),
      total: 0,
      available: 0,
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

  const totalEquipments = stockItems.length;
  const totalAvailable = stockItems.filter(s => s.attributes.status === "in_stock").length;

  return {
    summary: {
      totalEquipments,
      totalAvailable,
      totalUnavailable: totalEquipments - totalAvailable,
    },
    groups: Object.values(groups),
  };
}

async function handleCalendar(partnerSlug, month, env) {
  const [year, mon] = month.split("-");
  const startDate = `${year}-${mon}-01`;
  const lastDay = new Date(parseInt(year), parseInt(mon), 0).getDate();
  const endDate = `${year}-${mon}-${String(lastDay).padStart(2, "0")}`;

  const { productGroups } = await getProductGroupsAndItems(partnerSlug, env);
  if (!productGroups.length) return { month, reservations: [] };

  // Récupérer les products (variants) de chaque product_group
  const pgIds = productGroups.map(pg => pg.id).join(",");
  const productsData = await booqableFetch(
    `/products?filter[product_group_id]=${pgIds}&fields[products]=id&per=200`,
    env
  );
  const itemIds = (productsData.data || []).map(p => p.id);
  if (!itemIds.length) return { month, reservations: [] };

  // Plannings du mois filtrés par item_id via GET (chunks de 5)
  const partnerOrderIdsSet = new Set();
  const chunks = [];
  for (let i = 0; i < itemIds.length; i += 5) {
    chunks.push(itemIds.slice(i, i + 5));
  }

  for (const chunk of chunks) {
    const planningsData = await booqableFetch(
      `/plannings?filter[item_id]=${chunk.join(",")}&filter[starts_at][gte]=${startDate}T00:00:00Z&filter[starts_at][lte]=${endDate}T23:59:59Z&fields[plannings]=order_id&per=200`,
      env
    );
    for (const p of planningsData.data || []) {
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

async function handleRevenue(partnerSlug, env) {
  const { productGroups } = await getProductGroupsAndItems(partnerSlug, env);
  if (!productGroups.length) {
    return { summary: { totalLocations: 0, totalRevenue: 0, totalCommission: 0 }, byProduct: [] };
  }

  // Récupérer les products (variants) des product_groups du partenaire
  const pgIds = productGroups.map(pg => pg.id).join(",");
  const productsData = await booqableFetch(
    `/products?filter[product_group_id]=${pgIds}&fields[products]=id,product_group_id&per=200`,
    env
  );
  const products = productsData.data || [];
  const itemIdSet = new Set(products.map(p => p.id));

  // Index product_group_id par item_id
  const itemToPgId = {};
  for (const p of products) {
    itemToPgId[p.id] = p.attributes.product_group_id;
  }

  // Index nom par product_group_id
  const pgIndex = {};
  for (const pg of productGroups) {
    pgIndex[pg.id] = pg.attributes.name;
  }

  // Initialiser byProduct avec TOUS les product groups à 0
  const byProduct = {};
  for (const pg of productGroups) {
    const cleanName = pg.attributes.name.split(/\s*[–—]\s*/)[0].trim();
    const rate = getCommissionRate(cleanName);
    byProduct[cleanName] = { name: cleanName, count: 0, revenue: 0, commissionRate: rate, commission: 0 };
  }

  // Toutes les commandes terminées sans filtre de date
  const ordersData = await booqableSearch("orders", {
    filter: { status: "stopped" },
    include: "lines",
    fields: {
      orders: "id",
      lines: "id,title,price_in_cents,item_id",
    },
    per: 500,
  }, env);

  const included = ordersData.included || [];
  let totalRevenue = 0;
  let totalLocations = 0;

  for (const line of included) {
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

  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://www.roulici.fr",
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
  const tab = url.searchParams.get("tab") || "stock";
  const month = url.searchParams.get("month") || new Date().toISOString().slice(0, 7);

  try {
    let data;
    if (tab === "stock") data = await handleStock(partnerSlug, env);
    else if (tab === "calendar") data = await handleCalendar(partnerSlug, month, env);
    else if (tab === "revenue") data = await handleRevenue(partnerSlug, env);
    else return new Response(JSON.stringify({ error: "Invalid tab" }), { status: 400, headers: corsHeaders });

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

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://www.roulici.fr",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "x-member-id, Content-Type",
    },
  });
}

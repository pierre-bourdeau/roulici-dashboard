/**
 * Webflow Cloud — API Proxy Booqable
 * Route : src/pages/dashboard.js (mount path /api)
 * Méthode : GET
 * Headers : x-member-id: <memberstack_member_id>
 * Query params :
 *   - tab : "stock" | "calendar" | "revenue"
 *   - month : YYYY-MM (défaut = mois courant)
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

// Étape 1 : récupérer les product_groups filtrés par tag (= partner slug)
// Étape 2 : récupérer les stock_items filtrés par product_group_id
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
    `/stock_items?filter[product_group_id]=${pgIds}&fields[stock_items]=id,identifier,product_group_id,status&per=200`,
    env
  );

  return { productGroups, stockItems: siData.data || [], pgIndex };
}

async function handleStock(partnerSlug, env) {
  const { stockItems, pgIndex } = await getProductGroupsAndItems(partnerSlug, env);

  const totalEquipments = stockItems.length;
  const totalAvailable = stockItems.filter(s => s.attributes.status === "available").length;
  const totalUnavailable = totalEquipments - totalAvailable;

  return {
    summary: { totalEquipments, totalAvailable, totalUnavailable },
    items: stockItems.map(si => ({
      id: si.id,
      identifier: si.attributes.identifier,
      productName: pgIndex[si.attributes.product_group_id] || "Inconnu",
      status: si.attributes.status,
    })),
  };
}

async function handleCalendar(partnerSlug, month, env) {
  const [year, mon] = month.split("-");
  const startDate = `${year}-${mon}-01`;
  const lastDay = new Date(parseInt(year), parseInt(mon), 0).getDate();
  const endDate = `${year}-${mon}-${String(lastDay).padStart(2, "0")}`;

  // Récupérer les product_groups du partenaire pour filtrer les orders
  const { productGroups } = await getProductGroupsAndItems(partnerSlug, env);
  if (!productGroups.length) return { month, reservations: [] };

  // Récupérer les orders qui contiennent des lignes avec ces produits
  // On récupère toutes les orders du mois et on inclut le customer
  const ordersData = await booqableFetch(
    `/orders?filter[starts_at_gte]=${startDate}T00:00:00Z&filter[starts_at_lte]=${endDate}T23:59:59Z&include=customer&fields[orders]=id,number,starts_at,stops_at,status&fields[customers]=first_name,last_name,email&per=100`,
    env
  );

  const orders = ordersData.data || [];
  const included = ordersData.included || [];

  const customers = {};
  for (const inc of included) {
    if (inc.type === "customers") {
      customers[inc.id] = {
        name: `${inc.attributes.first_name || ""} ${inc.attributes.last_name || ""}`.trim(),
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
    .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));

  return { month, reservations };
}

async function handleRevenue(partnerSlug, month, env) {
  const [year, mon] = month.split("-");
  const startDate = `${year}-${mon}-01`;
  const lastDay = new Date(parseInt(year), parseInt(mon), 0).getDate();
  const endDate = `${year}-${mon}-${String(lastDay).padStart(2, "0")}`;

  const { productGroups, pgIndex } = await getProductGroupsAndItems(partnerSlug, env);
  if (!productGroups.length) return { month, summary: { totalLocations: 0, totalRevenue: 0, totalCommission: 0 }, byProduct: [] };

  const pgIds = new Set(productGroups.map(pg => pg.id));

  const ordersData = await booqableFetch(
    `/orders?filter[stops_at_gte]=${startDate}T00:00:00Z&filter[stops_at_lte]=${endDate}T23:59:59Z&filter[status][]=stopped&include=lines&fields[orders]=id,number&fields[lines]=id,title,total_price_in_cents,product_group_id&per=200`,
    env
  );

  const included = ordersData.included || [];

  const byProduct = {};
  let totalRevenue = 0;
  let totalLocations = 0;

  for (const line of included) {
    if (line.type !== "lines") continue;
    // Filtrer uniquement les lignes appartenant aux product_groups du partenaire
    if (!pgIds.has(line.attributes.product_group_id)) continue;

    const pgName = pgIndex[line.attributes.product_group_id] || line.attributes.title || "";
    const cleanName = pgName.split("—")[0].trim();
    const amount = (line.attributes.total_price_in_cents || 0) / 100;
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
    month,
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
    else if (tab === "revenue") data = await handleRevenue(partnerSlug, month, env);
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

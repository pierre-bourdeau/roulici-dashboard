/**
 * Webflow Cloud — API Proxy Booqable
 * Route : /api/dashboard
 * Méthode : GET
 * Query params :
 *   - tab : "stock" | "calendar" | "revenue"
 *   - partner_slug : ex. "la-cotiniere"
 *   - month : YYYY-MM (pour calendar/revenue, défaut = mois courant)
 *
 * Sécurité : valide le token Memberstack transmis en header
 * Authorization: Bearer <memberstack_token>
 */

export const config = { runtime: "edge" };

// Taux de commission par type de produit (Roulici)
const COMMISSION_RATES = {
  mecanique: 0.30,
  vae: 0.10,
  remorque: 0.15,
  "porte-bebe": 0.15,
  casque: 0,
  enfant: 0,
};

// Mapping slug Webflow → tag Booqable (balise = slug en majuscules avec tirets)
function slugToTag(slug) {
  return slug.toUpperCase().replace(/-/g, "-");
}

// Déterminer le taux de commission selon le nom du produit
function getCommissionRate(productName) {
  const name = productName.toLowerCase();
  if (name.includes("électrique") || name.includes("vae") || name.includes("assistance")) return COMMISSION_RATES.vae;
  if (name.includes("remorque")) return COMMISSION_RATES.remorque;
  if (name.includes("porte") && name.includes("bébé")) return COMMISSION_RATES["porte-bebe"];
  if (name.includes("casque")) return COMMISSION_RATES.casque;
  if (name.includes("enfant") || name.includes("20\"") || name.includes("24\"")) return COMMISSION_RATES.enfant;
  return COMMISSION_RATES.mecanique; // défaut = méca
}

async function booqableFetch(path, env) {
  const BOOQABLE_API_KEY = env.BOOQABLE_API_KEY;
  const BOOQABLE_SHOP = env.BOOQABLE_SHOP || "roulici";
  const base = `https://${BOOQABLE_SHOP}.booqable.com/api/4`;

  const res = await fetch(`${base}${path}`, {
    headers: {
      Authorization: `Bearer ${BOOQABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Booqable API error ${res.status} on ${path}`);
  }
  return res.json();
}

// Valider le token Memberstack et récupérer le member
async function validateMemberstack(token, env) {
  const res = await fetch("https://api.memberstack.com/v1/members/current", {
    headers: {
      "x-memberstack-token": token,
      "x-api-key": env.MEMBERSTACK_SECRET_KEY,
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data || null;
}

// ─── HANDLERS PAR ONGLET ────────────────────────────────────────────────────

async function handleStock(partnerSlug, env) {
  // Récupérer tous les stock_items filtrés par tag = partnerSlug
  const tag = slugToTag(partnerSlug);

  // Récupérer les product_groups avec ce tag pour avoir les types
  const pgData = await booqableFetch(
    `/product_groups?filter[tag_list][]=${encodeURIComponent(tag)}&fields[product_groups]=id,name,slug,tag_list,stock_count&per=100`,
    env
  );

  // Récupérer les stock_items pour ce tag
  const siData = await booqableFetch(
    `/stock_items?filter[tag_list][]=${encodeURIComponent(tag)}&fields[stock_items]=id,identifier,product_group_id,status&per=200`,
    env
  );

  const productGroups = pgData.data || [];
  const stockItems = siData.data || [];

  // Construire un index product_group_id → name
  const pgIndex = {};
  for (const pg of productGroups) {
    pgIndex[pg.id] = pg.attributes.name;
  }

  // Grouper les stock items par product_group
  const grouped = {};
  for (const si of stockItems) {
    const pgId = si.attributes.product_group_id;
    const pgName = pgIndex[pgId] || "Inconnu";
    if (!grouped[pgId]) {
      grouped[pgId] = { name: pgName, total: 0, available: 0, unavailable: 0, items: [] };
    }
    grouped[pgId].total++;
    if (si.attributes.status === "available") grouped[pgId].available++;
    else grouped[pgId].unavailable++;
    grouped[pgId].items.push({
      id: si.id,
      identifier: si.attributes.identifier,
      status: si.attributes.status,
    });
  }

  const totalEquipments = stockItems.length;
  const totalAvailable = stockItems.filter(s => s.attributes.status === "available").length;
  const totalUnavailable = totalEquipments - totalAvailable;

  return {
    summary: { totalEquipments, totalAvailable, totalUnavailable },
    groups: Object.values(grouped),
    items: stockItems.map(si => ({
      id: si.id,
      identifier: si.attributes.identifier,
      productGroupId: si.attributes.product_group_id,
      productName: pgIndex[si.attributes.product_group_id] || "Inconnu",
      status: si.attributes.status,
    })),
  };
}

async function handleCalendar(partnerSlug, month, env) {
  // month = "YYYY-MM"
  const [year, mon] = month.split("-");
  const startDate = `${year}-${mon}-01`;
  const lastDay = new Date(parseInt(year), parseInt(mon), 0).getDate();
  const endDate = `${year}-${mon}-${String(lastDay).padStart(2, "0")}`;
  const tag = slugToTag(partnerSlug);

  // Récupérer les orders pour ce partenaire sur ce mois
  // On filtre par product tag via les order lines (approximation via tag product_group)
  const ordersData = await booqableFetch(
    `/orders?filter[starts_at_gte]=${startDate}T00:00:00Z&filter[starts_at_lte]=${endDate}T23:59:59Z&filter[status]=started,reserved,concept&include=customer,lines&fields[orders]=id,number,starts_at,stops_at,status&fields[customers]=first_name,last_name,email&per=100`,
    env
  );

  const orders = ordersData.data || [];
  const included = ordersData.included || [];

  // Index customers
  const customers = {};
  for (const inc of included) {
    if (inc.type === "customers") {
      customers[inc.id] = {
        firstName: inc.attributes.first_name,
        lastName: inc.attributes.last_name,
        email: inc.attributes.email,
      };
    }
  }

  // Formater pour le calendrier liste
  const reservations = orders.map(order => {
    const customerId = order.relationships?.customer?.data?.id;
    const customer = customerId ? customers[customerId] : null;
    return {
      id: order.id,
      number: order.attributes.number,
      startsAt: order.attributes.starts_at,
      stopsAt: order.attributes.stops_at,
      status: order.attributes.status,
      customer: customer
        ? { name: `${customer.firstName} ${customer.lastName}`, email: customer.email }
        : null,
    };
  });

  // Trier par date de début
  reservations.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));

  return { month, reservations };
}

async function handleRevenue(partnerSlug, month, env) {
  const [year, mon] = month.split("-");
  const startDate = `${year}-${mon}-01`;
  const lastDay = new Date(parseInt(year), parseInt(mon), 0).getDate();
  const endDate = `${year}-${mon}-${String(lastDay).padStart(2, "0")}`;
  const tag = slugToTag(partnerSlug);

  // Récupérer les orders finalisées (status=stopped) pour ce mois
  const ordersData = await booqableFetch(
    `/orders?filter[stops_at_gte]=${startDate}T00:00:00Z&filter[stops_at_lte]=${endDate}T23:59:59Z&filter[status]=stopped&include=lines&fields[orders]=id,number,grand_total_in_cents,stops_at&fields[lines]=id,title,total_price_in_cents,product_group_id&per=200`,
    env
  );

  const orders = ordersData.data || [];
  const included = ordersData.included || [];

  // Agréger par type de produit
  const byProduct = {};
  let totalRevenue = 0;
  let totalLocations = 0;

  for (const line of included) {
    if (line.type !== "lines") continue;
    const title = line.attributes.title || "";
    const amount = (line.attributes.total_price_in_cents || 0) / 100;
    const rate = getCommissionRate(title);

    if (!byProduct[title]) {
      byProduct[title] = { name: title, count: 0, revenue: 0, commissionRate: rate, commission: 0 };
    }
    byProduct[title].count++;
    byProduct[title].revenue += amount;
    byProduct[title].commission += amount * rate;
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

// ─── HANDLER PRINCIPAL ───────────────────────────────────────────────────────

export async function GET({ request, locals }) {
  const env = locals.runtime.env;

  // CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://www.roulici.fr",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Content-Type": "application/json",
  };

  // Auth Memberstack
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }
  const token = authHeader.replace("Bearer ", "");

  // Valider le member et récupérer son partner_slug
  const member = await validateMemberstack(token, env);
  if (!member) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: corsHeaders });
  }

  // Lire le partner_slug depuis les custom fields Memberstack
  const partnerSlug = member.customFields?.["partner-slug"];
  if (!partnerSlug) {
    return new Response(JSON.stringify({ error: "No partner associated" }), { status: 403, headers: corsHeaders });
  }

  const url = new URL(request.url);
  const tab = url.searchParams.get("tab") || "stock";
  const month = url.searchParams.get("month") || new Date().toISOString().slice(0, 7);

  try {
    let data;
    if (tab === "stock") {
      data = await handleStock(partnerSlug, env);
    } else if (tab === "calendar") {
      data = await handleCalendar(partnerSlug, month, env);
    } else if (tab === "revenue") {
      data = await handleRevenue(partnerSlug, month, env);
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

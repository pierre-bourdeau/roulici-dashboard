/**
 * Webflow Cloud — API Proxy Booqable
 * Route : src/pages/reservation.js (mount path /api)
 * Méthode : GET
 * Headers : x-member-id: <memberstack_member_id>
 * Query params : orderId
 *
 * Retourne les stock_items planifiés sur une commande
 * avec leurs custom properties (cadenas, code, couleur_du_collier) + prix total
 */

export const config = { runtime: "edge" };

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
  if (!member || !member.customFields?.["partner-slug"]) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId");
  if (!orderId) {
    return new Response(JSON.stringify({ error: "Missing orderId" }), { status: 400, headers: corsHeaders });
  }

  try {
    // Récupérer le prix de la commande + plannings en parallèle
    const [orderData, planningsData] = await Promise.all([
      booqableFetch(
        `/orders/${orderId}?fields[orders]=id,price_in_cents`,
        env
      ),
      booqableFetch(
        `/stock_item_plannings?filter[order_id]=${orderId}&include=stock_item&fields[stock_item_plannings]=id,stock_item_id&fields[stock_items]=id,identifier,product_group_id,properties&per=50`,
        env
      ),
    ]);

    const priceInCents = orderData.data?.attributes?.price_in_cents || 0;

    const plannings = planningsData.data || [];
    const included = planningsData.included || [];

    // Index des stock_items inclus
    const stockItemsIndex = {};
    for (const inc of included) {
      if (inc.type === "stock_items") {
        stockItemsIndex[inc.id] = inc;
      }
    }

    // Récupérer les product_groups pour avoir les noms
    const pgIds = [...new Set(
      Object.values(stockItemsIndex).map(si => si.attributes.product_group_id).filter(Boolean)
    )];

    let pgIndex = {};
    if (pgIds.length > 0) {
      const pgData = await booqableFetch(
        `/product_groups?filter[id]=${pgIds.join(",")}&fields[product_groups]=id,name&per=50`,
        env
      );
      for (const pg of pgData.data || []) {
        pgIndex[pg.id] = pg.attributes.name;
      }
    }

    // Construire la liste des vélos planifiés
    const items = plannings.map(planning => {
      const siId = planning.attributes?.stock_item_id || planning.relationships?.stock_item?.data?.id;
      const si = stockItemsIndex[siId];
      if (!si) return null;

      const props = si.attributes.properties || {};
      const pgName = pgIndex[si.attributes.product_group_id] || "";
      const cleanName = pgName.split(/\s*[–—]\s*/)[0].trim();

      return {
        id: si.id,
        identifier: si.attributes.identifier,
        product: cleanName,
        cadenas: props.cadenas || null,
        code: props.code || null,
        couleur: props.couleur_du_collier || props.couleur_de_collier || props.couleur_collier || null,
      };
    }).filter(Boolean);

    return new Response(JSON.stringify({
      orderId,
      price: priceInCents / 100,
      items,
    }), {
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

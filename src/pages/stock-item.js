/**
 * Webflow Cloud — API Proxy Booqable
 * Route : /api/stock-item (mount path /api → fichier src/pages/stock-item.js)
 * Méthode : PATCH
 * Headers : x-member-id: <memberstack_member_id>
 * Body : { stockItemId: string, available: boolean }
 */

export const config = { runtime: "edge" };

async function validateMemberstack(memberId, env) {
  const res = await fetch(`https://admin.memberstack.com/members/${memberId}`, {
    headers: {
      "x-api-key": env.MEMBERSTACK_SECRET_KEY,
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data || null;
}

async function booqableFetch(path, method, body, env) {
  const base = `https://${env.BOOQABLE_SHOP}.booqable.com/api/4`;
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.BOOQABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Booqable ${method} ${path} → ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function PATCH({ request, locals }) {
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

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: corsHeaders });
  }

  const { stockItemId, available } = body;
  if (!stockItemId || typeof available !== "boolean") {
    return new Response(JSON.stringify({ error: "Missing stockItemId or available" }), { status: 400, headers: corsHeaders });
  }

  try {
    if (!available) {
      // Créer un downtime pour bloquer l'article
      const now = new Date().toISOString();
      const farFuture = "2099-12-31T00:00:00Z";
      await booqableFetch("/downtimes", "POST", {
        data: {
          type: "downtimes",
          attributes: {
            stock_item_id: stockItemId,
            starts_at: now,
            stops_at: farFuture,
            reason: "Indisponible (dashboard dépositaire)",
          },
        },
      }, env);
    } else {
      // Supprimer tous les downtimes actifs sur cet item
      const downtimesData = await booqableFetch(
        `/downtimes?filter[stock_item_id]=${stockItemId}`,
        "GET", null, env
      );
      const downtimes = downtimesData?.data || [];
      await Promise.all(downtimes.map(dt =>
        booqableFetch(`/downtimes/${dt.id}`, "DELETE", null, env)
      ));
    }

    return new Response(JSON.stringify({ success: true, stockItemId, available }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://www.roulici.fr",
      "Access-Control-Allow-Methods": "PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "x-member-id, Content-Type",
    },
  });
}

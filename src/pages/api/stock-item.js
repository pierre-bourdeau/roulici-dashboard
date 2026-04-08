/**
 * Webflow Cloud — API Proxy Booqable
 * Route : /api/stock-item
 * Méthode : PATCH
 * Body : { stockItemId: string, available: boolean }
 *
 * Permet au dépositaire de rendre un vélo dispo/indispo
 * (lecture seule côté Booqable = pas possible de changer status directement,
 *  on utilise les "downtimes" pour bloquer un article)
 */

export const config = { runtime: "edge" };

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

async function booqableFetch(path, method, body, env) {
  const BOOQABLE_API_KEY = env.BOOQABLE_API_KEY;
  const BOOQABLE_SHOP = env.BOOQABLE_SHOP || "roulici";
  const base = `https://${BOOQABLE_SHOP}.booqable.com/api/4`;

  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${BOOQABLE_API_KEY}`,
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
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Content-Type": "application/json",
  };

  // Auth
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }
  const member = await validateMemberstack(authHeader.replace("Bearer ", ""), env);
  if (!member || !member.customFields?.["partner-slug"]) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
  }

  const { stockItemId, available } = await request.json();
  if (!stockItemId || typeof available !== "boolean") {
    return new Response(JSON.stringify({ error: "Missing stockItemId or available" }), { status: 400, headers: corsHeaders });
  }

  try {
    if (!available) {
      // Créer un downtime sur cet item (rend indisponible)
      // Durée très longue = jusqu'à révocation manuelle
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
        "GET",
        null,
        env
      );
      const downtimes = downtimesData?.data || [];
      for (const dt of downtimes) {
        await booqableFetch(`/downtimes/${dt.id}`, "DELETE", null, env);
      }
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
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  });
}

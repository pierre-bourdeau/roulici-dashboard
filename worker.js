/**
 * Roulici Dashboard — Webflow Cloud Worker
 * Proxy sécurisé entre le dashboard partenaire et l'API Booqable
 *
 * Variables d'environnement à configurer dans Webflow Cloud :
 *   BOOQABLE_API_KEY   → ta clé API Booqable (lecture + écriture)
 *   MEMBERSTACK_APP_ID → ton App ID Memberstack
 *
 * Routes exposées :
 *   GET  /api/dashboard?tab=stock|calendar|revenue  → données filtrées par partenaire
 *   POST /api/stock-item                            → toggle dispo/indispo d'un stock item
 */

const COMMISSION_RATES = {
  'vélo mécanique': 0.30,
  'vélo mécanique nouvelle génération': 0.30,
  'vae': 0.10,
  'vélo à assistance électrique': 0.10,
  'remorque': 0.15,
  'porte bébé': 0.15,
  'porte-bébé': 0.15,
  'casque': 0,
  'casque adulte': 0,
  'casque enfant': 0,
};

function getCommissionRate(productName) {
  const lower = productName.toLowerCase();
  for (const [key, rate] of Object.entries(COMMISSION_RATES)) {
    if (lower.includes(key)) return rate;
  }
  return 0;
}

function extractPartnerName(productName) {
  // Format attendu : "Type d'article — Nom du partenaire"
  const parts = productName.split('—');
  if (parts.length >= 2) {
    return parts[parts.length - 1].trim();
  }
  return null;
}

function extractProductType(productName) {
  const parts = productName.split('—');
  return parts[0].trim();
}

async function verifyMemberstackToken(token, secretKey) {
  // Memberstack v2 — vérifie le membre via la Secret Key
  const res = await fetch('https://api.memberstack.com/v1/members/currentMember', {
    headers: {
      'X-API-KEY': secretKey,
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    // Essai avec l'endpoint alternatif v2
    const res2 = await fetch(`https://api.memberstack.com/v1/members/${token}`, {
      headers: { 'X-API-KEY': secretKey },
    });
    if (!res2.ok) return null;
    const data2 = await res2.json();
    return data2?.data || null;
  }
  const data = await res.json();
  return data?.data || null;
}

async function fetchBooqable(path, apiKey, options = {}) {
  const base = 'https://api.booqable.com/api/boomerang/v1';
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Booqable API error ${res.status}: ${err}`);
  }
  return res.json();
}

async function getAllProducts(apiKey) {
  let products = [];
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const data = await fetchBooqable(
      `/product_groups?filter[archived]=false&page[number]=${page}&page[size]=100`,
      apiKey
    );
    products = products.concat(data.data || []);
    hasMore = data.meta?.total_count > products.length;
    page++;
  }
  return products;
}

async function getStockItems(apiKey, productGroupIds) {
  const filter = productGroupIds.map(id => `filter[product_group_id][]=${id}`).join('&');
  const data = await fetchBooqable(
    `/stock_items?${filter}&page[size]=250&include=product`,
    apiKey
  );
  return data.data || [];
}

async function getOrders(apiKey, locationName) {
  // Récupère les commandes des 12 derniers mois
  const since = new Date();
  since.setFullYear(since.getFullYear() - 1);
  const sinceStr = since.toISOString().split('T')[0];

  let orders = [];
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const data = await fetchBooqable(
      `/orders?filter[starts_at_gte]=${sinceStr}&page[number]=${page}&page[size]=100&include=lines,products`,
      apiKey
    );
    orders = orders.concat(data.data || []);
    hasMore = data.meta?.total_count > orders.length;
    page++;
    // Sécurité : max 10 pages
    if (page > 10) break;
  }
  return orders;
}

// ─── Handlers ──────────────────────────────────────────────────────────────

async function handleDashboard(request, env) {
  const url = new URL(request.url);
  const tab = url.searchParams.get('tab') || 'stock';

  // 1. Auth Memberstack
  const token = request.headers.get('x-memberstack-token');
  if (!token) return jsonError('Token manquant', 401);

  const member = await verifyMemberstackToken(token, env.MEMBERSTACK_APP_ID);
  if (!member) return jsonError('Token invalide', 401);

  const locationName = member.customFields?.booqable_location_name;
  if (!locationName) return jsonError('Aucun partenaire associé à ce compte', 403);

  // 2. Récupère tous les produits Booqable et filtre par partenaire
  const allProducts = await getAllProducts(env.BOOQABLE_API_KEY);
  const partnerProducts = allProducts.filter(p => {
    const name = p.attributes?.name || '';
    const partner = extractPartnerName(name);
    return partner && partner.toLowerCase() === locationName.toLowerCase();
  });

  if (partnerProducts.length === 0) {
    return jsonResponse({
      locationName,
      products: [],
      stockItems: [],
      orders: [],
      tab,
    });
  }

  const productGroupIds = partnerProducts.map(p => p.id);

  // 3. Données selon l'onglet demandé
  let stockItems = [];
  let orders = [];

  if (tab === 'stock' || tab === 'calendar') {
    stockItems = await getStockItems(env.BOOQABLE_API_KEY, productGroupIds);
  }
  if (tab === 'calendar' || tab === 'revenue') {
    orders = await getOrders(env.BOOQABLE_API_KEY, locationName);
  }

  // 4. Calcul des commissions côté serveur
  const productsWithMeta = partnerProducts.map(p => {
    const fullName = p.attributes?.name || '';
    const type = extractProductType(fullName);
    const commissionRate = getCommissionRate(type);
    return {
      id: p.id,
      name: fullName,
      type,
      commissionRate,
      trackStockCount: p.attributes?.tracking === 'trackable',
    };
  });

  // 5. Filtre les commandes qui concernent ce partenaire
  // (via le nom du produit dans les lignes de commande)
  const partnerProductIds = new Set(productGroupIds);
  const relevantOrders = orders.filter(order => {
    const lines = order.relationships?.lines?.data || [];
    return lines.some(line => {
      const productId = line.attributes?.product_group_id;
      return partnerProductIds.has(productId);
    });
  });

  return jsonResponse({
    locationName,
    products: productsWithMeta,
    stockItems: stockItems.map(item => ({
      id: item.id,
      identifier: item.attributes?.identifier,
      status: item.attributes?.status,
      productGroupId: item.attributes?.product_group_id,
    })),
    orders: relevantOrders.map(order => ({
      id: order.id,
      number: order.attributes?.number,
      status: order.attributes?.status,
      startsAt: order.attributes?.starts_at,
      stopsAt: order.attributes?.stops_at,
      totalPrice: order.attributes?.price_in_cents / 100,
      customerName: order.attributes?.customer_name || '',
      lines: (order.relationships?.lines?.data || []).map(line => ({
        productGroupId: line.attributes?.product_group_id,
        quantity: line.attributes?.quantity,
        priceInCents: line.attributes?.price_in_cents,
      })),
    })),
    tab,
  });
}

async function handleStockToggle(request, env) {
  // Auth Memberstack
  const token = request.headers.get('x-memberstack-token');
  if (!token) return jsonError('Token manquant', 401);

  const member = await verifyMemberstackToken(token, env.MEMBERSTACK_APP_ID);
  if (!member) return jsonError('Token invalide', 401);

  const locationName = member.customFields?.booqable_location_name;
  if (!locationName) return jsonError('Aucun partenaire associé', 403);

  const body = await request.json();
  const { stockItemId, available } = body;
  if (!stockItemId || typeof available !== 'boolean') {
    return jsonError('Paramètres manquants : stockItemId et available requis', 400);
  }

  // Vérifie que ce stock item appartient bien au partenaire connecté
  const itemData = await fetchBooqable(`/stock_items/${stockItemId}?include=product`, env.BOOQABLE_API_KEY);
  const productGroupId = itemData.data?.attributes?.product_group_id;

  // Récupère le produit parent pour vérifier le partenaire
  const productData = await fetchBooqable(`/product_groups/${productGroupId}`, env.BOOQABLE_API_KEY);
  const productName = productData.data?.attributes?.name || '';
  const partner = extractPartnerName(productName);

  if (!partner || partner.toLowerCase() !== locationName.toLowerCase()) {
    return jsonError('Ce vélo ne vous appartient pas', 403);
  }

  // PATCH sur Booqable pour changer la dispo
  const updated = await fetchBooqable(`/stock_items/${stockItemId}`, env.BOOQABLE_API_KEY, {
    method: 'PATCH',
    body: JSON.stringify({
      data: {
        type: 'stock_items',
        id: stockItemId,
        attributes: {
          out_of_stock: !available,
        },
      },
    }),
  });

  return jsonResponse({
    success: true,
    stockItemId,
    available,
    updatedAttributes: updated.data?.attributes,
  });
}

// ─── Utilitaires ───────────────────────────────────────────────────────────

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://www.roulici.fr',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-memberstack-token',
    },
  });
}

function jsonError(message, status = 400) {
  return jsonResponse({ error: message }, status);
}

// ─── Entry point ───────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': 'https://www.roulici.fr',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-memberstack-token',
        },
      });
    }

    try {
      if (url.pathname === '/api/dashboard' && request.method === 'GET') {
        return await handleDashboard(request, env);
      }
      if (url.pathname === '/api/stock-item' && request.method === 'POST') {
        return await handleStockToggle(request, env);
      }
      return jsonError('Route inconnue', 404);
    } catch (err) {
      console.error('Worker error:', err);
      return jsonError(`Erreur serveur : ${err.message}`, 500);
    }
  },
};

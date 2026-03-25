/**
 * Roulici Dashboard — Script client
 * À injecter en tant que custom code sur la page /partenaire/dashboard
 *
 * Dépendances :
 *   - Memberstack v2 (déjà présent sur le site Roulici)
 *   - Chart.js (chargé dynamiquement si onglet Revenus)
 *
 * Configuration :
 *   Remplacer WORKER_BASE_URL par l'URL de ton Worker Webflow Cloud
 *   Ex : https://roulici-dashboard.your-workspace.webflow-cloud.com
 */

(function () {
  'use strict';

  const WORKER_BASE_URL = 'https://roulici-dashboard.pierre-bourdeau49.workers.dev';

  // ─── Taux de commission (copie côté client pour l'affichage) ─────────────
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

  function getCommissionRate(productType) {
    const lower = productType.toLowerCase();
    for (const [key, rate] of Object.entries(COMMISSION_RATES)) {
      if (lower.includes(key)) return rate;
    }
    return 0;
  }

  function extractProductType(fullName) {
    return fullName.split('—')[0].trim();
  }

  function formatEur(amount) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  }

  function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  // ─── État global ──────────────────────────────────────────────────────────
  let state = {
    token: null,
    locationName: null,
    products: [],
    stockItems: [],
    orders: [],
    activeTab: 'calendrier',
    currentMonth: new Date(),
    revenueChart: null,
    revenuePeriod: 'mois',
  };

  // ─── Init ─────────────────────────────────────────────────────────────────
  async function init() {
    // Attend que Memberstack v2 soit prêt
    const $memberstackDom = window.$memberstackDom;
    if (!$memberstackDom) {
      setTimeout(init, 500);
      return;
    }

    // Memberstack v2 — récupère le membre courant
    let member = null;
    try {
      const result = await $memberstackDom.getCurrentMember();
      member = result?.data || null;
    } catch (e) {
      console.error('Memberstack getCurrentMember error:', e);
    }

    if (!member) {
      // Pas connecté
      return;
    }

    // Récupère le token depuis le cookie Memberstack v2
    const tokenCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('_ms-mid=') || row.startsWith('ms-token=') || row.startsWith('_ms='));
    const cookieToken = tokenCookie ? tokenCookie.split('=')[1] : null;

    // Fallback : token dans l'objet member
    state.token = member.tokens?.accessToken || cookieToken || member.id;
    state.locationName = member.customFields?.booqable_location_name || member.auth?.email || '';

    // Nom du partenaire dans le header
    const titleEl = document.querySelector('.dashboard_header_title, [data-db-partner-name]');
    if (titleEl) titleEl.textContent = state.locationName;

    // Navigation par onglets
    bindTabNavigation();

    // Charge l'onglet actif par défaut
    await switchTab('calendrier');
  }

  // ─── Navigation ───────────────────────────────────────────────────────────
  function bindTabNavigation() {
    // Liens dans la sidebar
    const links = document.querySelectorAll('.db-aside_link');
    links.forEach(link => {
      const label = link.querySelector('.db-aside_link_label');
      if (!label) return;
      const text = label.textContent.trim().toLowerCase();
      if (['calendrier', 'stock', 'revenus'].includes(text)) {
        link.addEventListener('click', async (e) => {
          e.preventDefault();
          await switchTab(text === 'revenus' ? 'revenus' : text);
        });
      }
    });
  }

  async function switchTab(tab) {
    state.activeTab = tab;

    // Active visuellement le bon lien
    document.querySelectorAll('.db-aside_link').forEach(link => {
      const label = link.querySelector('.db-aside_link_label');
      if (!label) return;
      const linkText = label.textContent.trim().toLowerCase();
      const isActive = (tab === 'revenus' && linkText === 'revenus') ||
                       (tab === 'stock' && linkText === 'stock') ||
                       (tab === 'calendrier' && linkText === 'calendrier');
      link.classList.toggle('is-active', isActive);
    });

    // Affiche le bon panneau
    showLoading();

    // Map tab → paramètre API
    const tabParam = tab === 'revenus' ? 'revenue' : tab === 'calendrier' ? 'calendar' : 'stock';
    await fetchAndRender(tabParam);
  }

  // ─── Fetch ────────────────────────────────────────────────────────────────
  async function fetchAndRender(tabParam) {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/api/dashboard?tab=${tabParam}`, {
        headers: { 'x-memberstack-token': state.token },
      });

      if (!res.ok) {
        const err = await res.json();
        showError(err.error || 'Erreur de chargement');
        return;
      }

      const data = await res.json();
      state.products = data.products || [];
      state.stockItems = data.stockItems || [];
      state.orders = data.orders || [];
      state.locationName = data.locationName || state.locationName;

      if (tabParam === 'calendar') renderCalendar();
      else if (tabParam === 'stock') renderStock();
      else if (tabParam === 'revenue') renderRevenue();

    } catch (err) {
      showError('Impossible de contacter le serveur');
      console.error('Dashboard fetch error:', err);
    }
  }

  // ─── Onglet Calendrier ────────────────────────────────────────────────────
  function renderCalendar() {
    const container = getDashboardContainer();
    container.innerHTML = buildCalendarHTML();
    bindCalendarEvents();
  }

  function buildCalendarHTML() {
    const stockByProduct = buildStockByProduct();
    const calendarGrid = buildCalendarGrid();

    return `
      <div class="db-content">
        <div class="db-calendar_layout">
          <div class="db-calendar_sidebar">
            <h2 class="db-section_title">Stock disponible</h2>
            <div class="db-stock_summary">
              ${stockByProduct.map(p => `
                <div class="db-stock_item">
                  <div class="db-stock_item_icon" style="background-color: ${p.color}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/>
                      <path d="M15 17.5H9M20 9.5l-1.5-5H3l-1 5M15 5l3 4.5M8.5 5v4.5"/>
                    </svg>
                  </div>
                  <div class="db-stock_item_info">
                    <div class="db-stock_item_name">${p.type}</div>
                    <div class="db-stock_item_count">Total: ${p.total} &nbsp;
                      <span class="db-badge is-available">${p.available} disponibles</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="db-calendar_main">
            <div class="db-calendar_header">
              <h2 class="db-section_title">Calendrier des réservations</h2>
              <div class="db-calendar_nav">
                <button class="db-btn-icon" id="db-cal-prev">&#8249;</button>
                <span class="db-calendar_month" id="db-cal-month">${getMonthLabel(state.currentMonth)}</span>
                <button class="db-btn-icon" id="db-cal-next">&#8250;</button>
              </div>
            </div>
            <div class="db-calendar_grid">
              ${['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => `<div class="db-calendar_day-header">${d}</div>`).join('')}
              ${calendarGrid}
            </div>
            <div class="db-calendar_legend">
              <span class="db-legend-dot is-today"></span> Aujourd'hui
              <span class="db-legend-dot is-reservation"></span> Réservation
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function buildStockByProduct() {
    const map = {};
    state.products.forEach(p => {
      const type = extractProductType(p.name);
      if (!map[type]) {
        map[type] = { type, total: 0, available: 0, color: getProductColor(type) };
      }
    });
    state.stockItems.forEach(item => {
      const product = state.products.find(p => p.id === item.productGroupId);
      if (!product) return;
      const type = extractProductType(product.name);
      if (!map[type]) return;
      map[type].total++;
      if (item.status === 'available') map[type].available++;
    });
    return Object.values(map).filter(p => p.total > 0);
  }

  function buildCalendarGrid() {
    const year = state.currentMonth.getFullYear();
    const month = state.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();

    // Lundi = 0
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    let cells = '';
    // Cellules vides avant le 1er
    for (let i = 0; i < startDow; i++) {
      cells += '<div class="db-calendar_cell is-empty"></div>';
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const reservations = getReservationsForDay(date);

      cells += `
        <div class="db-calendar_cell ${isToday ? 'is-today' : ''}">
          <span class="db-calendar_day-num">${day}</span>
          ${reservations.map(r => `
            <div class="db-calendar_event" title="${r.customerName} — ${r.productType}">
              <span class="db-event_id">${r.id.slice(-4).toUpperCase()}</span>
              <span class="db-event_name">${r.customerName}</span>
            </div>
          `).join('')}
        </div>
      `;
    }
    return cells;
  }

  function getReservationsForDay(date) {
    return state.orders
      .filter(order => {
        if (!order.startsAt) return false;
        const start = new Date(order.startsAt);
        const stop = order.stopsAt ? new Date(order.stopsAt) : start;
        return date >= new Date(start.toDateString()) && date <= new Date(stop.toDateString());
      })
      .map(order => ({
        id: order.id,
        customerName: order.customerName || 'Client',
        productType: '',
      }))
      .slice(0, 3); // max 3 events par case
  }

  function bindCalendarEvents() {
    document.getElementById('db-cal-prev')?.addEventListener('click', () => {
      state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() - 1, 1);
      renderCalendar();
    });
    document.getElementById('db-cal-next')?.addEventListener('click', () => {
      state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() + 1, 1);
      renderCalendar();
    });
  }

  function getMonthLabel(date) {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  }

  // ─── Onglet Stock ─────────────────────────────────────────────────────────
  function renderStock() {
    const container = getDashboardContainer();

    const total = state.stockItems.length;
    const available = state.stockItems.filter(i => i.status === 'available').length;
    const unavailable = total - available;

    container.innerHTML = `
      <div class="db-content">
        <h1 class="dashboard_header_title">Gestion du stock</h1>
        <p class="db-subtitle">Gérez la disponibilité de vos vélos et équipements</p>
        <div class="dashboard_summarized_grid">
          <div class="dashboard_summarized_card">
            <div class="dashboard_summerized_value u-text-style-h3">${total}</div>
            <div class="dashboard_summerized_label u-text-style-main">Total équipements</div>
          </div>
          <div class="dashboard_summarized_card is-success">
            <div class="dashboard_summerized_value u-text-style-h3" style="color: var(--color-status-green-foreground-primary-rest)">${available}</div>
            <div class="dashboard_summerized_label u-text-style-main">Disponibles</div>
          </div>
          <div class="dashboard_summarized_card is-danger">
            <div class="dashboard_summerized_value u-text-style-h3" style="color: var(--color-status-red-foreground-primary-rest)">${unavailable}</div>
            <div class="dashboard_summerized_label u-text-style-main">Indisponibles</div>
          </div>
        </div>
        <div class="db-table_wrap">
          <table class="db-table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Disponible</th>
              </tr>
            </thead>
            <tbody>
              ${state.stockItems.map(item => {
                const product = state.products.find(p => p.id === item.productGroupId);
                const type = product ? extractProductType(product.name) : '—';
                const isAvailable = item.status === 'available';
                return `
                  <tr>
                    <td><strong>${item.identifier || item.id.slice(-6).toUpperCase()}</strong></td>
                    <td>${type}</td>
                    <td>
                      <span class="db-badge ${isAvailable ? 'is-available' : 'is-unavailable'}">
                        ${isAvailable ? 'Disponible' : 'Indisponible'}
                      </span>
                    </td>
                    <td>
                      <label class="db-toggle" title="${isAvailable ? 'Rendre indisponible' : 'Rendre disponible'}">
                        <input
                          type="checkbox"
                          class="db-toggle_input"
                          data-item-id="${item.id}"
                          ${isAvailable ? 'checked' : ''}
                        >
                        <span class="db-toggle_track"></span>
                      </label>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Bind les toggles
    container.querySelectorAll('.db-toggle_input').forEach(input => {
      input.addEventListener('change', async (e) => {
        const itemId = e.target.dataset.itemId;
        const available = e.target.checked;
        e.target.disabled = true;
        await toggleStockItem(itemId, available);
        e.target.disabled = false;
      });
    });
  }

  async function toggleStockItem(stockItemId, available) {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/api/stock-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-memberstack-token': state.token,
        },
        body: JSON.stringify({ stockItemId, available }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(`Erreur : ${err.error}`);
        // Recharge le stock pour remettre l'état correct
        await fetchAndRender('stock');
      }
    } catch (err) {
      alert('Impossible de mettre à jour la disponibilité');
      await fetchAndRender('stock');
    }
  }

  // ─── Onglet Revenus ───────────────────────────────────────────────────────
  function renderRevenue() {
    const container = getDashboardContainer();

    // Calcul des stats
    const stats = computeRevenueStats();

    container.innerHTML = `
      <div class="db-content">
        <h1 class="dashboard_header_title">Revenus &amp; Commissions</h1>
        <p class="db-subtitle">Suivez vos gains par type d'équipement</p>

        <div class="dashboard_summarized_grid">
          <div class="dashboard_summarized_card">
            <div class="db-card_icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div class="dashboard_summerized_label u-text-style-main">Total locations</div>
            <div class="dashboard_summerized_value u-text-style-h3">${stats.totalOrders}</div>
          </div>
          <div class="dashboard_summarized_card">
            <div class="db-card_icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div class="dashboard_summerized_label u-text-style-main">Revenus totaux</div>
            <div class="dashboard_summerized_value u-text-style-h3">${formatEur(stats.totalRevenue)}</div>
          </div>
          <div class="dashboard_summarized_card is-highlighted">
            <div class="db-card_icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div class="dashboard_summerized_label u-text-style-main">Vos commissions</div>
            <div class="dashboard_summerized_value u-text-style-h3">${formatEur(stats.totalCommission)}</div>
          </div>
        </div>

        <div class="db-products_grid">
          ${stats.byProduct.map(p => `
            <div class="db-product_card">
              <div class="db-product_header">
                <div class="db-product_icon" style="background-color: ${getProductColor(p.type)}">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/>
                    <path d="M15 17.5H9M20 9.5l-1.5-5H3l-1 5M15 5l3 4.5M8.5 5v4.5"/>
                  </svg>
                </div>
                <div class="dashboard_product_title">${p.type}</div>
              </div>
              <div class="db-product_rows">
                <div class="db-product_row">
                  <span class="dashboard_product_data_label">Nombre de locations</span>
                  <span class="dashboard_product_data_value">${p.count}</span>
                </div>
                <div class="db-product_row">
                  <span class="dashboard_product_data_label">Revenus générés</span>
                  <span class="dashboard_product_data_value">${formatEur(p.revenue)}</span>
                </div>
                <div class="db-product_row">
                  <span class="dashboard_product_data_label">Commission (${Math.round(p.commissionRate * 100)}%)</span>
                  <span class="dashboard_product_data_value is-highlighted">${formatEur(p.commission)}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="db-chart_card">
          <div class="db-chart_header">
            <h3 class="db-section_title">Évolution des revenus</h3>
            <div class="db-period_tabs">
              ${['Semaine', 'Mois', 'Année'].map(p => `
                <button class="db-period_btn ${state.revenuePeriod === p.toLowerCase() ? 'is-active' : ''}"
                  data-period="${p.toLowerCase()}">${p}</button>
              `).join('')}
            </div>
          </div>
          <canvas id="db-revenue-chart" height="120"></canvas>
        </div>
      </div>
    `;

    // Chart
    loadChartJS(() => renderRevenueChart(stats));

    // Période
    container.querySelectorAll('.db-period_btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.revenuePeriod = btn.dataset.period;
        container.querySelectorAll('.db-period_btn').forEach(b => b.classList.toggle('is-active', b === btn));
        const newStats = computeRevenueStats();
        renderRevenueChart(newStats);
      });
    });
  }

  function computeRevenueStats() {
    const byProduct = {};

    state.products.forEach(p => {
      const type = extractProductType(p.name);
      if (!byProduct[type]) {
        byProduct[type] = {
          type,
          count: 0,
          revenue: 0,
          commissionRate: getCommissionRate(type),
          commission: 0,
        };
      }
    });

    state.orders.forEach(order => {
      (order.lines || []).forEach(line => {
        const product = state.products.find(p => p.id === line.productGroupId);
        if (!product) return;
        const type = extractProductType(product.name);
        if (!byProduct[type]) return;
        byProduct[type].count += line.quantity || 1;
        const lineRevenue = (line.priceInCents || 0) / 100;
        byProduct[type].revenue += lineRevenue;
        byProduct[type].commission += lineRevenue * byProduct[type].commissionRate;
      });
    });

    const productList = Object.values(byProduct).filter(p => p.count > 0 || p.revenue > 0);
    const totalRevenue = productList.reduce((s, p) => s + p.revenue, 0);
    const totalCommission = productList.reduce((s, p) => s + p.commission, 0);
    const totalOrders = state.orders.length;

    // Données pour le graphique
    const chartData = buildChartData();

    return { byProduct: productList, totalRevenue, totalCommission, totalOrders, chartData };
  }

  function buildChartData() {
    const now = new Date();
    const period = state.revenuePeriod;
    let labels = [];
    let data = [];

    if (period === 'semaine') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }));
        const dayRevenue = state.orders
          .filter(o => o.startsAt && new Date(o.startsAt).toDateString() === d.toDateString())
          .reduce((s, o) => s + (o.totalPrice || 0), 0);
        data.push(dayRevenue);
      }
    } else if (period === 'mois') {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }));
        const monthRevenue = state.orders
          .filter(o => {
            if (!o.startsAt) return false;
            const od = new Date(o.startsAt);
            return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
          })
          .reduce((s, o) => s + (o.totalPrice || 0), 0);
        data.push(monthRevenue);
      }
    } else {
      // Année
      for (let i = 3; i >= 0; i--) {
        const year = now.getFullYear() - i;
        labels.push(String(year));
        const yearRevenue = state.orders
          .filter(o => o.startsAt && new Date(o.startsAt).getFullYear() === year)
          .reduce((s, o) => s + (o.totalPrice || 0), 0);
        data.push(yearRevenue);
      }
    }
    return { labels, data };
  }

  function renderRevenueChart(stats) {
    const canvas = document.getElementById('db-revenue-chart');
    if (!canvas || !window.Chart) return;

    if (state.revenueChart) {
      state.revenueChart.destroy();
    }

    const { labels, data } = stats.chartData || buildChartData();

    state.revenueChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Revenus (€)',
          data,
          borderColor: '#7829B8',
          backgroundColor: 'rgba(120, 41, 184, 0.08)',
          borderWidth: 2,
          pointBackgroundColor: '#7829B8',
          pointRadius: 4,
          tension: 0.4,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${formatEur(ctx.parsed.y)}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.06)' },
            ticks: {
              callback: val => formatEur(val),
              font: { size: 11 },
            },
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } },
          },
        },
      },
    });
  }

  function loadChartJS(cb) {
    if (window.Chart) { cb(); return; }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js';
    script.onload = cb;
    document.head.appendChild(script);
  }

  // ─── Utilitaires UI ───────────────────────────────────────────────────────
  function getDashboardContainer() {
    let el = document.getElementById('db-dynamic-content');
    if (!el) {
      // Crée un conteneur dans la zone principale du dashboard
      const main = document.querySelector('.dashboard_main, .db-main, [data-db-main]') || document.body;
      el = document.createElement('div');
      el.id = 'db-dynamic-content';
      // Vide le contenu statique existant
      const existing = main.querySelector('.dashboard_content, [data-db-content]');
      if (existing) {
        existing.replaceWith(el);
      } else {
        main.appendChild(el);
      }
    }
    return el;
  }

  function showLoading() {
    const container = getDashboardContainer();
    container.innerHTML = `
      <div class="db-loading">
        <div class="db-spinner"></div>
        <p>Chargement de vos données…</p>
      </div>
    `;
  }

  function showError(message) {
    const container = getDashboardContainer();
    container.innerHTML = `
      <div class="db-error">
        <p>⚠️ ${message}</p>
        <button onclick="location.reload()">Réessayer</button>
      </div>
    `;
  }

  function getProductColor(type) {
    const lower = type.toLowerCase();
    if (lower.includes('vae') || lower.includes('électrique')) return '#7829B8';
    if (lower.includes('méca') || lower.includes('mécanique')) return '#7829B8';
    if (lower.includes('enfant 20')) return '#22C55E';
    if (lower.includes('enfant 24')) return '#3B82F6';
    if (lower.includes('remorque')) return '#F97316';
    if (lower.includes('porte') || lower.includes('bébé')) return '#F97316';
    if (lower.includes('casque')) return '#6B7280';
    return '#7829B8';
  }

  // ─── CSS injecté dynamiquement ────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('db-dynamic-styles')) return;
    const style = document.createElement('style');
    style.id = 'db-dynamic-styles';
    style.textContent = `
      #db-dynamic-content { width: 100%; }
      .db-content { padding: 0; }
      .db-subtitle { color: var(--color-neutral-foreground-secondary-rest, #666); margin-top: -8px; margin-bottom: 24px; font-size: 14px; }
      .db-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; gap: 16px; color: #888; }
      .db-spinner { width: 32px; height: 32px; border: 3px solid #e5e7eb; border-top-color: #7829B8; border-radius: 50%; animation: db-spin 0.8s linear infinite; }
      @keyframes db-spin { to { transform: rotate(360deg); } }
      .db-error { padding: 40px; text-align: center; color: #dc2626; }
      .db-badge { display: inline-flex; align-items: center; padding: 2px 10px; border-radius: 100px; font-size: 12px; font-weight: 500; }
      .db-badge.is-available { background: #dcfce7; color: #16a34a; }
      .db-badge.is-unavailable { background: #fee2e2; color: #dc2626; }
      .db-toggle { display: flex; align-items: center; cursor: pointer; }
      .db-toggle_input { position: absolute; opacity: 0; width: 0; height: 0; }
      .db-toggle_track { position: relative; width: 40px; height: 22px; background: #e5e7eb; border-radius: 100px; transition: background 0.2s; }
      .db-toggle_track::after { content: ''; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; background: #fff; border-radius: 50%; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
      .db-toggle_input:checked + .db-toggle_track { background: #7829B8; }
      .db-toggle_input:checked + .db-toggle_track::after { transform: translateX(18px); }
      .db-table_wrap { background: #fff; border-radius: 12px; border: 1px solid #f1f0f9; overflow: hidden; margin-top: 16px; }
      .db-table { width: 100%; border-collapse: collapse; }
      .db-table th { padding: 12px 16px; background: #fafafa; font-size: 13px; color: #888; font-weight: 500; text-align: left; border-bottom: 1px solid #f1f0f9; }
      .db-table td { padding: 14px 16px; border-bottom: 1px solid #f9f9f9; font-size: 14px; }
      .db-table tr:last-child td { border-bottom: none; }
      .db-products_grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; margin-bottom: 24px; }
      .db-product_card { background: #fff; border-radius: 12px; border: 1px solid #f1f0f9; padding: 20px; }
      .db-product_header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
      .db-product_icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
      .db-product_rows { display: flex; flex-direction: column; gap: 0; }
      .db-product_row { display: flex; justify-content: space-between; padding: 10px 0; border-top: 1px solid #f1f0f9; }
      .db-chart_card { background: #fff; border-radius: 12px; border: 1px solid #f1f0f9; padding: 20px; }
      .db-chart_header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
      .db-period_tabs { display: flex; gap: 4px; background: #f9f9f9; border-radius: 8px; padding: 3px; }
      .db-period_btn { padding: 5px 12px; border: none; background: transparent; border-radius: 6px; font-size: 13px; cursor: pointer; color: #888; transition: all 0.15s; }
      .db-period_btn.is-active { background: #7829B8; color: #fff; }
      .db-section_title { font-size: 18px; font-weight: 600; margin: 0 0 16px 0; }
      .db-calendar_layout { display: grid; grid-template-columns: 280px 1fr; gap: 24px; }
      .db-calendar_sidebar { background: #fff; border-radius: 12px; border: 1px solid #f1f0f9; padding: 20px; height: fit-content; }
      .db-stock_item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f9f9f9; }
      .db-stock_item:last-child { border-bottom: none; }
      .db-stock_item_icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
      .db-stock_item_name { font-size: 13px; font-weight: 500; }
      .db-stock_item_count { font-size: 12px; color: #888; margin-top: 2px; }
      .db-calendar_main { background: #fff; border-radius: 12px; border: 1px solid #f1f0f9; padding: 20px; }
      .db-calendar_header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
      .db-calendar_nav { display: flex; align-items: center; gap: 8px; }
      .db-calendar_month { font-size: 14px; font-weight: 500; min-width: 120px; text-align: center; text-transform: capitalize; }
      .db-btn-icon { width: 28px; height: 28px; border: 1px solid #e5e7eb; background: #fff; border-radius: 6px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; }
      .db-calendar_grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
      .db-calendar_day-header { padding: 8px 4px; font-size: 12px; color: #888; text-align: center; font-weight: 500; }
      .db-calendar_cell { min-height: 80px; padding: 6px; background: #fafafa; border-radius: 6px; font-size: 12px; }
      .db-calendar_cell.is-today { background: #f3ebfc; }
      .db-calendar_cell.is-empty { background: transparent; }
      .db-calendar_day-num { font-size: 13px; font-weight: 500; display: block; margin-bottom: 4px; }
      .db-calendar_cell.is-today .db-calendar_day-num { color: #7829B8; }
      .db-calendar_event { background: #ede9fe; border-radius: 4px; padding: 2px 6px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .db-event_id { font-size: 10px; color: #7829B8; font-weight: 600; margin-right: 4px; }
      .db-event_name { font-size: 11px; color: #4b5563; }
      .db-calendar_legend { display: flex; align-items: center; gap: 16px; margin-top: 12px; font-size: 12px; color: #888; }
      .db-legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 4px; }
      .db-legend-dot.is-today { background: #7829B8; }
      .db-legend-dot.is-reservation { background: #ede9fe; border: 1px solid #7829B8; }
      .db-btn-icon:hover { background: #f9f9f9; }
      @media (max-width: 900px) {
        .db-calendar_layout { grid-template-columns: 1fr; }
        .db-products_grid { grid-template-columns: 1fr; }
      }
    `;
    document.head.appendChild(style);
  }

  // ─── Démarrage ────────────────────────────────────────────────────────────
  injectStyles();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

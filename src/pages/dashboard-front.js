<script>
/**
 * ROULICI — Dashboard Dépositaire
 * Coller dans "Before </body> tag" des paramètres du site Webflow
 */

(function () {
  "use strict";

  const API_BASE = "/api";

  let msId = null;
  let currentTab = "calendar";
  let currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  let currentView = "month"; // "month" | "week" | "day"
  let currentDayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  let allReservations = []; // cache des réservations du mois courant
  const cache = {};

  // ─── UTILS ──────────────────────────────────────────────────────────────────

  function cacheKey(tab) {
    return tab === "stock" ? "stock" : `${tab}-${currentMonth}`;
  }

  function fmt(isoString) {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function fmtShort(isoString) {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  }

  function fmtMonth(yyyyMM) {
    const [y, m] = yyyyMM.split("-");
    const label = new Date(+y, +m - 1, 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  function fmtMoney(n) {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);
  }

  function dateStr(isoString) {
    // Retourne YYYY-MM-DD en heure locale
    return new Date(isoString).toLocaleDateString("fr-CA"); // fr-CA = YYYY-MM-DD
  }

  const STATUS_LABELS = {
    reserved: "Réservé",
    started: "En cours",
    stopped: "Terminé",
    concept: "Brouillon",
  };

  // ─── AUTH ────────────────────────────────────────────────────────────────────

  async function getMemberId() {
    if (!window.$memberstackDom) return null;
    const { data: member } = await window.$memberstackDom.getCurrentMember();
    return member?.id || null;
  }

  // ─── API ─────────────────────────────────────────────────────────────────────

  async function apiFetch(tab) {
    const key = cacheKey(tab);
    if (cache[key]) return cache[key];

    const params = new URLSearchParams({ tab });
    if (tab !== "stock") params.set("month", currentMonth);

    const res = await fetch(`${API_BASE}/dashboard?${params}`, {
      headers: { "x-member-id": msId },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erreur ${res.status}`);
    }
    const data = await res.json();
    cache[key] = data;
    return data;
  }

  async function apiFetchReservation(orderId) {
    const res = await fetch(`${API_BASE}/reservation?orderId=${orderId}`, {
      headers: { "x-member-id": msId },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erreur ${res.status}`);
    }
    return res.json();
  }

  async function apiToggleStock(stockItemId, makeAvailable) {
    delete cache["stock"];
    const res = await fetch(`${API_BASE}/stock-item`, {
      method: "PATCH",
      headers: { "x-member-id": msId, "Content-Type": "application/json" },
      body: JSON.stringify({ stockItemId, available: makeAvailable }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erreur ${res.status}`);
    }
  }

  // ─── HELPERS DOM ─────────────────────────────────────────────────────────────

  function cloneTemplate(scope, attr) {
    const el = (scope || document).querySelector(`[data-template="${attr}"]`);
    if (!el) return null;
    const clone = el.cloneNode(true);
    clone.removeAttribute("data-template");
    clone.style.display = "";
    return clone;
  }

  function setField(el, field, value) {
    const t = el.querySelector(`[data-field="${field}"]`);
    if (t) t.textContent = value ?? "—";
  }

  function clearList(scope, attr) {
    const list = (scope || document).querySelector(`[data-list="${attr}"]`);
    if (!list) return null;
    [...list.children].forEach(c => { if (!c.dataset.template) c.remove(); });
    return list;
  }

  // ─── FEEDBACK ────────────────────────────────────────────────────────────────

  function showFeedback(msg) {
    const el = document.querySelector('[data-dashboard="error"]');
    if (el) { el.textContent = msg; el.style.display = msg ? "" : "none"; }
  }

  function setLoading(active) {
    const el = document.querySelector('[data-dashboard="loading"]');
    if (el) el.style.display = active ? "" : "none";
  }

  // ─── MODALES ─────────────────────────────────────────────────────────────────

  function openModal(name) {
    const modal = document.querySelector(`[data-modal="${name}"]`);
    if (modal) modal.style.display = "";
    document.body.style.overflow = "hidden";
  }

  function closeModal(name) {
    const modal = document.querySelector(`[data-modal="${name}"]`);
    if (modal) modal.style.display = "none";
    document.body.style.overflow = "";
  }

  function initModals() {
    document.querySelectorAll("[data-modal-close]").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.dataset.modalClose;
        closeModal(name);
      });
    });
    document.querySelectorAll("[data-modal-overlay]").forEach(overlay => {
      overlay.addEventListener("click", () => {
        const name = overlay.dataset.modalOverlay;
        closeModal(name);
      });
    });
  }

  // ─── MODALE RÉSERVATION ───────────────────────────────────────────────────────

  async function openReservationModal(reservation) {
    const modal = document.querySelector('[data-modal="reservation"]');
    if (!modal) return;

    // Remplir les champs header
    const setMF = (field, val) => {
      const el = modal.querySelector(`[data-modal-field="${field}"]`);
      if (el) el.textContent = val ?? "—";
    };
    setMF("customer", reservation.customer?.name || "Client inconnu");
    setMF("number", `#${reservation.number}`);
    setMF("start", fmt(reservation.startsAt));
    setMF("end", fmt(reservation.stopsAt));
    setMF("status", STATUS_LABELS[reservation.status] || reservation.status);

    const statusEl = modal.querySelector('[data-modal-field="status"]');
    if (statusEl) statusEl.setAttribute("data-status", reservation.status);

    // Vider la liste des vélos et afficher un loader
    const list = clearList(modal, "reservation-items");
    if (list) {
      const loading = document.createElement("div");
      loading.className = "reservation-modal_loading";
      loading.textContent = "Chargement des vélos…";
      loading.setAttribute("data-reservation-loading", "true");
      list.appendChild(loading);
    }

    openModal("reservation");

    // Charger les stock_items planifiés
    try {
      const data = await apiFetchReservation(reservation.id);
      if (list) {
        list.querySelector("[data-reservation-loading]")?.remove();

        if (!data.items?.length) {
          const empty = cloneTemplate(modal, "reservation-empty");
          if (empty) list.appendChild(empty);
        } else {
          for (const item of data.items) {
            const row = cloneTemplate(modal, "reservation-item");
            if (!row) continue;
            setField(row, "identifier", item.identifier);
            setField(row, "product", item.product);
            setField(row, "cadenas", item.cadenas || "Clé");
            setField(row, "code", item.code || "—");
            setField(row, "couleur", item.couleur || "—");
            list.appendChild(row);
          }
        }
      }
    } catch (err) {
      if (list) {
        list.querySelector("[data-reservation-loading]")?.remove();
        const errEl = document.createElement("div");
        errEl.textContent = `Erreur : ${err.message}`;
        list.appendChild(errEl);
      }
    }
  }

  // ─── MODALE STOCK ─────────────────────────────────────────────────────────────

  function openStockModal(group) {
    const modal = document.querySelector('[data-modal="stock"]');
    if (!modal) return;

    const nameEl = modal.querySelector('[data-modal-field="name"]');
    if (nameEl) nameEl.textContent = group.name;

    const list = clearList(modal, "stock-items");
    if (!list) { openModal("stock"); return; }

    for (const item of group.items) {
      const row = cloneTemplate(modal, "stock-item");
      if (!row) continue;

      setField(row, "identifier", item.identifier);
      setField(row, "cadenas", item.cadenas || "Clé");
      setField(row, "code", item.code || "—");
      setField(row, "couleur", item.couleur || "—");

      // Chip statut = bouton toggle
      const chip = row.querySelector('[data-field="status"]');
      if (chip) {
        const isAvail = item.status === "available";
        chip.textContent = isAvail ? "Disponible" : "Indisponible";
        chip.setAttribute("data-available", isAvail ? "true" : "false");

        chip.addEventListener("click", async () => {
          const currentlyAvail = chip.dataset.available === "true";
          chip.disabled = true;
          chip.textContent = "…";

          try {
            await apiToggleStock(item.id, !currentlyAvail);
            // Mettre à jour l'item en mémoire
            item.status = currentlyAvail ? "unavailable" : "available";
            chip.textContent = item.status === "available" ? "Disponible" : "Indisponible";
            chip.setAttribute("data-available", item.status === "available" ? "true" : "false");
            chip.disabled = false;

            // Mettre à jour les compteurs de la card en arrière-plan
            updateGroupCard(group);
          } catch (err) {
            chip.disabled = false;
            chip.textContent = currentlyAvail ? "Disponible" : "Indisponible";
            chip.setAttribute("data-available", currentlyAvail ? "true" : "false");
            showFeedback(`Erreur : ${err.message}`);
          }
        });
      }

      list.appendChild(row);
    }

    openModal("stock");
  }

  // Mettre à jour les compteurs d'une card sans recharger tout l'onglet
  function updateGroupCard(group) {
    const available = group.items.filter(i => i.status === "available").length;
    const unavailable = group.items.length - available;
    group.available = available;
    group.unavailable = unavailable;

    // Trouver la card dans le DOM via data-group-id
    const card = document.querySelector(`[data-group-id="${group.id}"]`);
    if (!card) return;
    const availEl = card.querySelector('[data-field="available"]');
    const unavailEl = card.querySelector('[data-field="unavailable"]');
    if (availEl) availEl.textContent = available;
    if (unavailEl) unavailEl.textContent = unavailable;
  }

  // ─── RENDER STOCK ─────────────────────────────────────────────────────────────

  function renderStock(data) {
    const panel = document.querySelector('.w-tab-pane.w--tab-active');
    if (!panel) return;

    const list = clearList(panel, "stock-groups");
    if (!list) return;

    const groups = data.groups || [];
    if (!groups.length) {
      const empty = cloneTemplate(panel, "empty");
      if (empty) list.appendChild(empty);
      return;
    }

    for (const group of groups) {
      const card = cloneTemplate(panel, "stock-card");
      if (!card) continue;

      card.setAttribute("data-group-id", group.id);
      setField(card, "name", group.name);
      setField(card, "total", group.total);
      setField(card, "available", group.available);
      setField(card, "unavailable", group.unavailable);

      // Clic sur la card → ouvre la modale
      card.addEventListener("click", () => openStockModal(group));

      list.appendChild(card);
    }
  }

  // ─── RENDER REVENUS ───────────────────────────────────────────────────────────

  function renderRevenue(data) {
    const panel = document.querySelector('.w-tab-pane.w--tab-active');
    if (!panel) return;

    const label = panel.querySelector('[data-revenue="month-label"]');
    if (label) label.textContent = fmtMonth(data.month);

    const locEl = panel.querySelector('[data-revenue="total-locations"]');
    const revEl = panel.querySelector('[data-revenue="total-revenue"]');
    const comEl = panel.querySelector('[data-revenue="total-commission"]');
    if (locEl) locEl.textContent = data.summary.totalLocations;
    if (revEl) revEl.textContent = fmtMoney(data.summary.totalRevenue);
    if (comEl) comEl.textContent = fmtMoney(data.summary.totalCommission);

    const list = clearList(panel, "revenue");
    if (!list) return;

    if (!data.byProduct?.length) {
      const empty = cloneTemplate(panel, "empty");
      if (empty) list.appendChild(empty);
      return;
    }

    for (const p of data.byProduct) {
      const card = cloneTemplate(panel, "revenue-card");
      if (!card) continue;
      setField(card, "name", p.name);
      setField(card, "count", p.count);
      setField(card, "revenue", fmtMoney(p.revenue));
      setField(card, "rate", p.commissionRate > 0 ? `${Math.round(p.commissionRate * 100)}%` : "—");
      setField(card, "commission", p.commission > 0 ? fmtMoney(p.commission) : "—");
      list.appendChild(card);
    }
  }

  // ─── CALENDRIER NATIF ─────────────────────────────────────────────────────────

  function renderCalendarList(reservations) {
    const panel = document.querySelector('.w-tab-pane.w--tab-active');
    if (!panel) return;

    const list = clearList(panel, "calendar");
    if (!list) return;

    if (!reservations.length) {
      const empty = cloneTemplate(panel, "calendar-empty");
      if (empty) list.appendChild(empty);
      return;
    }

    // Déjà trié décroissant par l'API
    for (const r of reservations) {
      const item = cloneTemplate(panel, "calendar-item");
      if (!item) continue;

      setField(item, "customer", r.customer?.name || "Client inconnu");
      setField(item, "number", `#${r.number}`);
      setField(item, "dates", `${fmtShort(r.startsAt)}`);

      const statusEl = item.querySelector('[data-field="status"]');
      if (statusEl) {
        statusEl.textContent = STATUS_LABELS[r.status] || r.status;
        statusEl.setAttribute("data-status", r.status);
      }

      item.addEventListener("click", () => openReservationModal(r));
      item.style.cursor = "pointer";

      list.appendChild(item);
    }
  }

  function buildCalendarGrid(reservations) {
    const grid = document.querySelector('[data-cal="grid"]');
    if (!grid) return;
    grid.innerHTML = "";

    if (currentView === "month") buildMonthView(grid, reservations);
    else if (currentView === "week") buildWeekView(grid, reservations);
    else if (currentView === "day") buildDayView(grid, reservations);
  }

  function buildMonthView(grid, reservations) {
    const [year, mon] = currentMonth.split("-").map(Number);
    const firstDay = new Date(year, mon - 1, 1);
    const lastDay = new Date(year, mon, 0);
    const todayStr = new Date().toLocaleDateString("fr-CA");

    // Grouper les réservations par jour de début
    const byDay = {};
    for (const r of reservations) {
      const key = dateStr(r.startsAt);
      if (!byDay[key]) byDay[key] = [];
      byDay[key].push(r);
    }

    // Lundi = 0 en France (0=lun, 6=dim)
    let startDow = firstDay.getDay(); // 0=dim JS
    startDow = startDow === 0 ? 6 : startDow - 1; // convertir en lun=0

    // Cellules vides avant le 1er
    for (let i = 0; i < startDow; i++) {
      const empty = document.createElement("div");
      empty.className = "cal_cell is-empty";
      empty.setAttribute("data-cal-cell", "empty");
      grid.appendChild(empty);
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dayDate = new Date(year, mon - 1, d);
      const dayKey = dayDate.toLocaleDateString("fr-CA");
      const isToday = dayKey === todayStr;

      const cell = document.createElement("div");
      cell.className = "cal_cell" + (isToday ? " is-today" : "");
      cell.setAttribute("data-cal-cell", dayKey);

      const num = document.createElement("div");
      num.className = "cal_cell_number";
      num.textContent = d;
      cell.appendChild(num);

      const dayReservations = byDay[dayKey] || [];
      for (const r of dayReservations) {
        const chip = document.createElement("div");
        chip.className = "cal_event";
        chip.setAttribute("data-status", r.status);
        chip.textContent = r.customer?.name || `#${r.number}`;
        chip.style.cursor = "pointer";
        chip.addEventListener("click", (e) => {
          e.stopPropagation();
          openReservationModal(r);
        });
        cell.appendChild(chip);
      }

      grid.appendChild(cell);
    }

    // Compléter la dernière ligne avec des cellules vides
    let endDow = lastDay.getDay();
    endDow = endDow === 0 ? 6 : endDow - 1;
    for (let i = endDow + 1; i < 7; i++) {
      const empty = document.createElement("div");
      empty.className = "cal_cell is-empty";
      grid.appendChild(empty);
    }
  }

  function buildWeekView(grid, reservations) {
    // Trouver le lundi de la semaine courante
    const current = new Date(currentDayStr);
    const dow = current.getDay();
    const monday = new Date(current);
    monday.setDate(current.getDate() - (dow === 0 ? 6 : dow - 1));

    // Grouper par jour
    const byDay = {};
    for (const r of reservations) {
      const key = dateStr(r.startsAt);
      if (!byDay[key]) byDay[key] = [];
      byDay[key].push(r);
    }

    const todayStr = new Date().toLocaleDateString("fr-CA");

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      const dayKey = day.toLocaleDateString("fr-CA");
      const isToday = dayKey === todayStr;

      const col = document.createElement("div");
      col.className = "cal_week_col" + (isToday ? " is-today" : "");

      const header = document.createElement("div");
      header.className = "cal_week_header";
      header.textContent = day.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
      col.appendChild(header);

      for (const r of byDay[dayKey] || []) {
        const chip = document.createElement("div");
        chip.className = "cal_event";
        chip.setAttribute("data-status", r.status);
        chip.textContent = r.customer?.name || `#${r.number}`;
        chip.style.cursor = "pointer";
        chip.addEventListener("click", () => openReservationModal(r));
        col.appendChild(chip);
      }

      grid.appendChild(col);
    }
  }

  function buildDayView(grid, reservations) {
    const todayLabel = new Date(currentDayStr).toLocaleDateString("fr-FR", {
      weekday: "long", day: "numeric", month: "long",
    });

    const header = document.createElement("div");
    header.className = "cal_day_header";
    header.textContent = todayLabel.charAt(0).toUpperCase() + todayLabel.slice(1);
    grid.appendChild(header);

    const dayReservations = reservations.filter(r => dateStr(r.startsAt) === currentDayStr);

    if (!dayReservations.length) {
      const empty = document.createElement("div");
      empty.className = "cal_day_empty";
      empty.textContent = "Aucune réservation ce jour.";
      grid.appendChild(empty);
      return;
    }

    for (const r of dayReservations) {
      const row = document.createElement("div");
      row.className = "cal_event cal_event--day";
      row.setAttribute("data-status", r.status);
      row.innerHTML = `
        <strong>${r.customer?.name || "Client inconnu"}</strong>
        <span>#${r.number}</span>
        <span>${fmt(r.startsAt)} → ${fmt(r.stopsAt)}</span>
      `;
      row.style.cursor = "pointer";
      row.addEventListener("click", () => openReservationModal(r));
      grid.appendChild(row);
    }
  }

  function updateCalLabel() {
    const label = document.querySelector('[data-cal="label"]');
    if (!label) return;

    if (currentView === "month") {
      label.textContent = fmtMonth(currentMonth);
    } else if (currentView === "week") {
      const current = new Date(currentDayStr);
      const dow = current.getDay();
      const monday = new Date(current);
      monday.setDate(current.getDate() - (dow === 0 ? 6 : dow - 1));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      label.textContent = `${monday.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} – ${sunday.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}`;
    } else {
      label.textContent = new Date(currentDayStr).toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      });
    }
  }

  function setActiveViewBtn(view) {
    document.querySelectorAll("[data-cal-view]").forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.calView === view);
    });
  }

  async function renderCalendar() {
    const panel = document.querySelector('.w-tab-pane.w--tab-active');
    if (!panel) return;

    setLoading(true);
    showFeedback("");

    try {
      const data = await apiFetch("calendar");
      allReservations = data.reservations || [];

      renderCalendarList(allReservations);
      buildCalendarGrid(allReservations);
      updateCalLabel();
    } catch (err) {
      showFeedback(`Impossible de charger le calendrier : ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function initCalendarNav() {
    // Prev / Next
    document.querySelector('[data-cal="prev"]')?.addEventListener("click", () => {
      if (currentView === "month") {
        const [y, m] = currentMonth.split("-").map(Number);
        const d = new Date(y, m - 2, 1);
        currentMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        // Invalider le cache calendrier
        delete cache[`calendar-${currentMonth}`];
        renderCalendar();
      } else if (currentView === "week") {
        const d = new Date(currentDayStr);
        d.setDate(d.getDate() - 7);
        currentDayStr = d.toLocaleDateString("fr-CA");
        buildCalendarGrid(allReservations);
        updateCalLabel();
      } else {
        const d = new Date(currentDayStr);
        d.setDate(d.getDate() - 1);
        currentDayStr = d.toLocaleDateString("fr-CA");
        buildCalendarGrid(allReservations);
        updateCalLabel();
      }
    });

    document.querySelector('[data-cal="next"]')?.addEventListener("click", () => {
      if (currentView === "month") {
        const [y, m] = currentMonth.split("-").map(Number);
        const d = new Date(y, m, 1);
        currentMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        delete cache[`calendar-${currentMonth}`];
        renderCalendar();
      } else if (currentView === "week") {
        const d = new Date(currentDayStr);
        d.setDate(d.getDate() + 7);
        currentDayStr = d.toLocaleDateString("fr-CA");
        buildCalendarGrid(allReservations);
        updateCalLabel();
      } else {
        const d = new Date(currentDayStr);
        d.setDate(d.getDate() + 1);
        currentDayStr = d.toLocaleDateString("fr-CA");
        buildCalendarGrid(allReservations);
        updateCalLabel();
      }
    });

    // Aujourd'hui
    document.querySelector('[data-cal="today"]')?.addEventListener("click", () => {
      const now = new Date();
      currentDayStr = now.toLocaleDateString("fr-CA");
      currentMonth = currentDayStr.slice(0, 7);
      delete cache[`calendar-${currentMonth}`];
      renderCalendar();
    });

    // Vues Mois / Semaine / Jour
    document.querySelectorAll("[data-cal-view]").forEach(btn => {
      btn.addEventListener("click", () => {
        currentView = btn.dataset.calView;
        setActiveViewBtn(currentView);
        buildCalendarGrid(allReservations);
        updateCalLabel();
      });
    });
  }

  // ─── TABS ────────────────────────────────────────────────────────────────────

  async function loadTab(tab) {
    currentTab = tab;
    showFeedback("");
    setLoading(true);

    try {
      if (tab === "calendar") {
        await renderCalendar();
      } else if (tab === "stock") {
        const data = await apiFetch("stock");
        renderStock(data);
      } else if (tab === "revenue") {
        const data = await apiFetch("revenue");
        renderRevenue(data);
      }
    } catch (err) {
      showFeedback(`Impossible de charger les données : ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────────

  async function init() {
    if (!document.querySelector(".w-tab-link")) return;

    msId = await getMemberId();
    if (!msId) {
      showFeedback("Vous devez être connecté pour accéder à ce tableau de bord.");
      setLoading(false);
      return;
    }

    initModals();
    initCalendarNav();

    // Tabs Webflow natives
    document.querySelectorAll(".w-tab-link").forEach(link => {
      link.addEventListener("click", () => {
        setTimeout(() => {
          const tab = link.dataset.tab;
          if (tab) loadTab(tab);
        }, 50);
      });
    });

    // Vue mois active par défaut
    setActiveViewBtn("month");

    // Charger l'onglet calendrier par défaut
    await loadTab("calendar");
  }

  if (window.$memberstackDom) {
    init();
  } else {
    window.addEventListener("memberstack.ready", init);
    setTimeout(init, 3000);
  }

})();
</script>

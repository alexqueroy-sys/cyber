"use strict";
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = MD.esc;
  const main = $("#main");
  const drawer = $("#drawer");
  const modal = $("#modal");

  const ACTION_INDEX = Object.fromEntries(ACTIONS.map((a, i) => [a.id, i]));
  const ACTION_BY_ID = Object.fromEntries(ACTIONS.map((a) => [a.id, a]));
  const PHASE_BY_ID = Object.fromEntries(PHASES.map((p) => [p.id, p]));

  const STATUS = { todo: "À faire", doing: "En cours", done: "Fait" };
  const NEXT_STATUS = { todo: "doing", doing: "done", done: "todo" };
  const MAX_FILE = 50 * 1024 * 1024;

  /* ───────────── Préférences d'affichage (par navigateur) ───────────── */

  const UI_KEY = "cyberroadmap:ui";
  const UI_DEFAULTS = {
    filters: { q: "", status: "", phase: "", theme: "", priority: "", now: false },
    collapsed: {},
    works: { q: "", category: "", has: "", sort: "recent" },
    bannerHiddenUntil: 0,
  };
  const ui = (() => {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(UI_KEY)) || {}; } catch (e) { /* navigation privée */ }
    return {
      ...UI_DEFAULTS,
      ...saved,
      filters: { ...UI_DEFAULTS.filters, ...(saved.filters || {}) },
      works: { ...UI_DEFAULTS.works, ...(saved.works || {}) },
      collapsed: { ...(saved.collapsed || {}) },
    };
  })();
  const saveUI = () => { try { localStorage.setItem(UI_KEY, JSON.stringify(ui)); } catch (e) { /* ignoré */ } };

  /* ───────────── Icônes ───────────── */

  const PATHS = {
    shield: '<path d="M12 3 4.5 6v6c0 4.4 3.1 7.6 7.5 9 4.4-1.4 7.5-4.6 7.5-9V6z"/><path d="m9 12 2 2 4-4"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    note: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/>',
  };
  const icon = (name, cls = "") =>
    `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${PATHS[name]}</svg>`;

  function statusIcon(s) {
    const inner = {
      todo: '<circle cx="12" cy="12" r="8.5"/>',
      doing: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none"/>',
      done: '<circle cx="12" cy="12" r="9.5" fill="currentColor" stroke="none"/><path class="tick" d="m8 12.4 2.8 2.8L16.2 9.8"/>',
    }[s];
    return `<svg class="ic status-ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  }

  /* ───────────── Dates ───────────── */

  const MFR = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  function parseDate(s) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : parseDate(DEFAULT_START);
  }
  const startDate = () => parseDate(Store.state.settings.startDate);
  const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, d.getDate());
  const monthDate = (n) => addMonths(startDate(), n - 1);
  const fmtM = (d) => `${MFR[d.getMonth()]} ${d.getFullYear()}`;
  const fmtDay = (d) => `${d.getDate()} ${MFR[d.getMonth()]} ${d.getFullYear()}`;
  function fmtRange(a, b) {
    if (a.getFullYear() === b.getFullYear()) {
      return a.getMonth() === b.getMonth() ? fmtM(a) : `${MFR[a.getMonth()]} – ${fmtM(b)}`;
    }
    return `${fmtM(a)} – ${fmtM(b)}`;
  }
  const isoToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  /* Mois du plan en cours (1 = premier mois, 0 = pas encore commencé). */
  function planMonth() {
    const s = startDate();
    const now = new Date();
    if (now < s) return 0;
    let m = (now.getFullYear() - s.getFullYear()) * 12 + now.getMonth() - s.getMonth();
    if (now.getDate() < s.getDate()) m--;
    return m + 1;
  }

  /* La semaine 1 (mois 0) compte comme le mois 1 pour les retards. */
  const span = (a) => (a.months ? [a.months[0], Math.max(a.months[1], 1)] : null);
  const isLate = (a, status, cur) => { const s = span(a); return !!s && status !== "done" && s[1] < cur; };
  const isCurrent = (a, cur) => { const s = span(a); return !!s && s[0] <= cur && cur <= s[1]; };

  function periodLabel(a, withDates = true) {
    if (!a.months) return "En continu";
    const [x, y] = a.months;
    if (x === 0) return withDates ? `Semaine 1 · dès le ${fmtDay(startDate())}` : "Semaine 1";
    const m = x === y ? `Mois ${x}` : `Mois ${x}–${y}`;
    return withDates ? `${m} · ${fmtRange(monthDate(x), monthDate(y))}` : m;
  }

  function phasePeriod(p) {
    const acts = ACTIONS.filter((a) => a.phase === p.id && a.months);
    if (!acts.length) return p.period;
    const x = Math.min(...acts.map((a) => a.months[0]));
    const y = Math.max(...acts.map((a) => a.months[1]));
    if (y === 0) return `${p.period} · dès le ${fmtDay(startDate())}`;
    return `${p.period} · ${fmtRange(monthDate(Math.max(x, 1)), monthDate(y))}`;
  }

  /* ───────────── Données dérivées ───────────── */

  const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const allWorks = () => Object.values(Store.state.works);
  const worksFor = (actionId) => allWorks().filter((w) => (w.actionIds || []).includes(actionId));

  function subCount(a, st) {
    const total = a.subtasks.length + st.custom.length;
    const done = a.subtasks.filter((_, i) => st.sub[i]).length + st.custom.filter((c) => c.done).length;
    return [done, total];
  }

  function sortActions(list) {
    return [...list].sort((a, b) => {
      const sa = span(a), sb = span(b);
      if (sa && sb && sa[0] !== sb[0]) return sa[0] - sb[0];
      const pr = PRIORITIES[a.priority].rank - PRIORITIES[b.priority].rank;
      return pr || ACTION_INDEX[a.id] - ACTION_INDEX[b.id];
    });
  }

  function stats() {
    const cur = planMonth();
    const s = { total: ACTIONS.length, done: 0, doing: 0, todo: 0, late: 0 };
    for (const a of ACTIONS) {
      const st = Store.action(a.id).status;
      s[st]++;
      if (isLate(a, st, cur)) s.late++;
    }
    s.pct = Math.round((s.done / s.total) * 100);
    return s;
  }

  const isNow = (a, st, cur) =>
    !!a.months && st.status !== "done" && (isCurrent(a, cur) || isLate(a, st.status, cur) || st.status === "doing");

  function filteredActions() {
    const f = ui.filters;
    const cur = planMonth();
    const q = norm(f.q.trim());
    return ACTIONS.filter((a) => {
      const st = Store.action(a.id);
      if (f.status && st.status !== f.status) return false;
      if (f.phase && a.phase !== f.phase) return false;
      if (f.theme && a.theme !== f.theme) return false;
      if (f.priority && a.priority !== f.priority) return false;
      if (f.now && !isNow(a, st, cur)) return false;
      if (q) {
        const hay = norm([a.title, a.why, a.theme, ...a.how, ...a.subtasks, st.notes, ...st.custom.map((c) => c.text)].join(" "));
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  /* Prochaines actions : en retard ou du mois en cours d'abord, puis dans l'ordre du plan. */
  function nextActions(n = 3) {
    const cur = planMonth();
    return sortActions(ACTIONS.filter((a) => a.months && Store.action(a.id).status !== "done"))
      .sort((a, b) => {
        const rank = (x) => { const st = Store.action(x.id).status; return st === "doing" ? 0 : isLate(x, st, cur) || isCurrent(x, cur) ? 1 : 2; };
        return rank(a) - rank(b);
      })
      .slice(0, n);
  }

  /* ───────────── Petits composants ───────────── */

  const prioBadge = (p) => `<span class="badge prio-${p}" title="${esc(PRIORITIES[p].hint)}">${PRIORITIES[p].label}</span>`;

  function statusButton(a, st) {
    const next = NEXT_STATUS[st.status];
    return `<button class="status-btn s-${st.status}" data-act="cycle-status" data-id="${a.id}" data-fk="st-${a.id}"
      title="${STATUS[st.status]} · cliquer pour passer à « ${STATUS[next]} »"
      aria-label="Statut : ${STATUS[st.status]}. Passer à ${STATUS[next]}">${statusIcon(st.status)}</button>`;
  }

  const progressBar = (pct, label = "") =>
    `<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"${label ? ` aria-label="${esc(label)}"` : ""}><span style="width:${pct}%"></span></div>`;

  function rowHTML(a, opts = {}) {
    const st = Store.action(a.id);
    const cur = planMonth();
    const [d, t] = subCount(a, st);
    const nWorks = worksFor(a.id).length;
    const late = isLate(a, st.status, cur);
    return `<li class="row s-${st.status}${late ? " is-late" : ""}">
      ${statusButton(a, st)}
      <button class="row-main" data-act="open-action" data-id="${a.id}" data-fk="row-${a.id}">
        <span class="row-title">${esc(a.title)}</span>
        <span class="row-meta">
          ${opts.phase ? `<span>${esc(PHASE_BY_ID[a.phase].name)}</span>` : `<span class="theme-tag">${esc(a.theme)}</span>`}
          <span>${esc(periodLabel(a))}</span>
          ${t ? `<span class="meta-item" title="Sous-tâches">${icon("check")}${d}/${t}</span>` : ""}
          ${st.notes.trim() ? `<span class="meta-item" title="Contient des notes">${icon("note")}</span>` : ""}
          ${nWorks ? `<span class="meta-item" title="Travaux liés">${icon("file")}${nWorks}</span>` : ""}
        </span>
      </button>
      <span class="row-badges">${late ? `<span class="badge badge-late">${icon("clock")}En retard</span>` : ""}${opts.noPrio ? "" : prioBadge(a.priority)}</span>
    </li>`;
  }

  function selectHTML(name, value, options, placeholder, scope = "filter") {
    return `<select data-${scope}="${name}" aria-label="${esc(placeholder)}">
      <option value="">${esc(placeholder)}</option>
      ${options.map(([v, l]) => `<option value="${esc(v)}"${v === value ? " selected" : ""}>${esc(l)}</option>`).join("")}
    </select>`;
  }

  let toastTimer = null;
  function toast(msg, tone = "") {
    const el = $("#toast");
    el.textContent = msg;
    el.className = `toast show ${tone}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.className = "toast"), 3200);
  }

  function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  const fmtSize = (n) =>
    n < 1024 ? `${n} o` : n < 1048576 ? `${(n / 1024).toFixed(0)} Ko` : `${(n / 1048576).toFixed(1).replace(".", ",")} Mo`;

  const safeUrl = (u) => (/^https?:\/\//i.test(u || "") ? u : "");

  /* ───────────── Vue : Feuille de route ───────────── */

  function viewRoadmap(tab) {
    const cur = planMonth();
    const curLabel = cur === 0
      ? `Démarrage le <strong>${fmtDay(startDate())}</strong>`
      : cur > 24
        ? "Les 24 mois sont écoulés"
        : `Mois en cours : <strong>mois ${cur}</strong> (${fmtM(monthDate(cur))})`;

    const head = `
      <section class="page-head">
        <div>
          <h1>Feuille de route</h1>
          <p class="lede">24 mois pour poser les fondamentaux, décrocher une première certification pratique et entrer dans une équipe sécurité. ${curLabel}.</p>
        </div>
        <div class="tabs" role="tablist" aria-label="Affichage">
          <a role="tab" href="#/feuille-de-route" aria-selected="${tab !== "guide"}">Plan d'action</a>
          <a role="tab" href="#/feuille-de-route/guide" aria-selected="${tab === "guide"}">Guide de référence</a>
        </div>
      </section>`;

    if (tab === "guide") return head + viewGuide();

    const s = stats();
    const f = ui.filters;
    const active = f.q || f.status || f.phase || f.theme || f.priority || f.now;
    return `${head}
      <section class="stats" aria-label="Progression">
        <div class="stat stat-main">
          <div class="stat-top"><span class="stat-label">Progression globale</span><span class="stat-value">${s.pct} %</span></div>
          ${progressBar(s.pct, "Progression globale")}
          <span class="stat-sub">${s.done} actions faites sur ${s.total}</span>
        </div>
        <button class="stat stat-btn" data-act="quick-filter" data-status="doing"><span class="stat-label">En cours</span><span class="stat-value tone-doing">${s.doing}</span></button>
        <button class="stat stat-btn" data-act="quick-filter" data-status="todo"><span class="stat-label">À faire</span><span class="stat-value">${s.todo}</span></button>
        <button class="stat stat-btn" data-act="quick-filter" data-now="1"><span class="stat-label">En retard</span><span class="stat-value ${s.late ? "tone-late" : ""}">${s.late}</span></button>
      </section>

      <section class="filters" aria-label="Filtres">
        <label class="search">${icon("search")}<input type="search" data-filter="q" value="${esc(f.q)}" placeholder="Rechercher une action, une note…" aria-label="Rechercher"></label>
        ${selectHTML("status", f.status, Object.entries(STATUS), "Tous les statuts")}
        ${selectHTML("phase", f.phase, PHASES.map((p) => [p.id, p.name]), "Toutes les phases")}
        ${selectHTML("theme", f.theme, THEMES.map((t) => [t, t]), "Tous les thèmes")}
        ${selectHTML("priority", f.priority, Object.entries(PRIORITIES).map(([k, v]) => [k, v.label]), "Toutes les priorités")}
        <label class="toggle" title="Actions du mois en cours, en cours ou en retard">
          <input type="checkbox" data-filter="now"${f.now ? " checked" : ""}> Maintenant
        </label>
        ${active ? `<button class="btn btn-ghost btn-sm" data-act="clear-filters">Effacer les filtres</button>` : ""}
      </section>

      <div id="list">${roadmapList()}</div>`;
  }

  function roadmapList() {
    const list = filteredActions();
    if (!list.length) {
      return `<div class="empty"><p>Aucune action ne correspond à ces filtres.</p><button class="btn" data-act="clear-filters">Effacer les filtres</button></div>`;
    }
    const filtering = list.length !== ACTIONS.length;
    return PHASES.map((p) => {
      const acts = sortActions(list.filter((a) => a.phase === p.id));
      if (!acts.length) return "";
      const all = ACTIONS.filter((a) => a.phase === p.id);
      const done = all.filter((a) => Store.action(a.id).status === "done").length;
      const pct = Math.round((done / all.length) * 100);
      const collapsed = !filtering && ui.collapsed[p.id];
      return `<section class="group${collapsed ? " collapsed" : ""}">
        <header class="group-head">
          <button class="group-toggle" data-act="toggle-phase" data-id="${p.id}" aria-expanded="${!collapsed}" data-fk="ph-${p.id}">
            ${icon("chevron", "chev")}
            <span><span class="group-title">${esc(p.name)}</span><span class="group-period">${esc(phasePeriod(p))}</span></span>
          </button>
          <div class="group-progress"><span>${done}/${all.length}</span>${progressBar(pct, `Progression ${p.name}`)}</div>
        </header>
        ${collapsed ? "" : `<p class="group-desc">${esc(p.desc)}</p><ul class="rows">${acts.map((a) => rowHTML(a)).join("")}</ul>`}
      </section>`;
    }).join("");
  }

  function viewGuide() {
    return `<div class="guide">
      <nav class="toc" aria-label="Sommaire du guide">
        <p class="toc-title">Sommaire</p>
        <ol>${GUIDE.map((s) => `<li><button data-act="goto" data-target="g-${s.id}">${esc(s.title)}</button></li>`).join("")}</ol>
        <p class="toc-foot">Document du ${DOC_DATE}</p>
      </nav>
      <div class="guide-body">
        ${GUIDE.map((s) => `<section class="guide-section prose" id="g-${s.id}"><h2>${esc(s.title)}</h2>${s.html}</section>`).join("")}
      </div>
    </div>`;
  }

  /* ───────────── Vue : Par où commencer ───────────── */

  function viewStart() {
    const cur = planMonth();
    const [first, ...then] = nextActions(3);
    const week = ACTIONS.filter((a) => a.phase === "s0");
    const weekDone = week.filter((a) => Store.action(a.id).status === "done").length;
    const current = sortActions(ACTIONS.filter((a) => a.phase !== "s0" && isCurrent(a, Math.max(cur, 1))));
    const late = sortActions(ACTIONS.filter((a) => a.phase !== "s0" && isLate(a, Store.action(a.id).status, cur)));
    const monthTitle = cur <= 1 ? `Mois 1 · ${fmtM(monthDate(1))}` : `Mois ${cur} · ${fmtM(monthDate(cur))}`;

    const hero = first
      ? `<section class="card hero">
          <p class="eyebrow">Prochaine étape</p>
          <h2>${esc(first.title)}</h2>
          <p class="hero-why">${esc(first.why)}</p>
          <div class="hero-meta">${prioBadge(first.priority)}<span class="theme-tag">${esc(first.theme)}</span><span class="muted">${esc(periodLabel(first))}</span></div>
          <div class="hero-actions">
            <button class="btn btn-primary" data-act="open-action" data-id="${first.id}">Voir comment faire ${icon("arrow")}</button>
            ${Store.action(first.id).status === "todo"
              ? `<button class="btn" data-act="set-status" data-id="${first.id}" data-status="doing">Je commence</button>`
              : `<button class="btn" data-act="set-status" data-id="${first.id}" data-status="done">${icon("check")} C'est fait</button>`}
          </div>
          ${then.length ? `<div class="hero-then"><p class="eyebrow">Ensuite</p><ul class="rows rows-compact">${then.map((a) => rowHTML(a, { phase: true, noPrio: true })).join("")}</ul></div>` : ""}
        </section>`
      : `<section class="card hero"><p class="eyebrow">Bravo</p><h2>Toutes les actions datées sont faites.</h2><p class="hero-why">Continue les habitudes, et prépare la suite : OSCP, poste en équipe sécurité.</p></section>`;

    return `
      <section class="page-head">
        <div>
          <h1>Par où commencer</h1>
          <p class="lede">Les bases avant les outils, une pratique chaque semaine, et ton alternance comme laboratoire défensif encadré. Voici quoi faire maintenant, et dans quel ordre.</p>
        </div>
      </section>

      <div class="grid-2 grid-hero">
        ${hero}
        <section class="card">
          <div class="card-head"><h2>Tes 5 actions de cette semaine</h2><span class="count">${weekDone}/${week.length}</span></div>
          ${progressBar(Math.round((weekDone / week.length) * 100), "Actions de la semaine")}
          <ul class="rows rows-compact">${week.map((a) => rowHTML(a, { noPrio: true })).join("")}</ul>
        </section>
      </div>

      <div class="grid-2">
        <section class="card">
          <div class="card-head"><h2>Ce mois-ci</h2><span class="muted">${esc(monthTitle)}</span></div>
          ${current.length ? `<ul class="rows rows-compact">${current.map((a) => rowHTML(a, { noPrio: true })).join("")}</ul>` : `<p class="muted">Rien de prévu ce mois-ci.</p>`}
        </section>
        <section class="card${late.length ? " card-late" : ""}">
          <div class="card-head"><h2>En retard</h2><span class="count">${late.length}</span></div>
          ${late.length
            ? `<p class="muted small">Pas de panique : moins de temps, c'est un planning qu'on étire, sans sauter d'étape.</p><ul class="rows rows-compact">${late.map((a) => rowHTML(a, { noPrio: true })).join("")}</ul>`
            : `<p class="muted">Aucune action en retard. Continue comme ça.</p>`}
        </section>
      </div>

      <section class="section">
        <div class="section-head">
          <h2>L'ordre des fondamentaux</h2>
          <p class="muted">Chaque brique sert la suivante. Linux et réseau avancent en parallèle, et tu pratiques déjà Windows/AD au travail.</p>
        </div>
        <ol class="steps">
          ${FUNDAMENTALS.map((f) => {
            const st = Store.action(f.action).status;
            return `<li class="step s-${st}">
              <span class="step-n">${f.n}</span>
              <div class="step-body">
                <div class="step-top"><h3>${esc(f.name)}</h3><span class="step-status s-${st}">${statusIcon(st)}${STATUS[st]}</span></div>
                <p class="step-detail">${esc(f.detail)}</p>
                <p><strong>Pourquoi :</strong> ${esc(f.why)}</p>
                <p><strong>Objectif :</strong> ${esc(f.goal)}</p>
                <button class="link-btn" data-act="open-action" data-id="${f.action}">Ouvrir l'action ${icon("arrow")}</button>
              </div>
            </li>`;
          }).join("")}
        </ol>
      </section>

      <div class="grid-2">
        <section class="card">
          <div class="card-head"><h2>Ta semaine type</h2><span class="muted">8 à 10 h</span></div>
          <div class="week">
            ${WEEK.map((w) => `<div class="week-slot"><span class="week-when">${esc(w.when)}</span><span class="week-dur">${esc(w.dur)}</span><span class="week-what">${esc(w.what)}</span></div>`).join("")}
          </div>
          <div class="callout callout-info"><strong>Règle d'or :</strong> 30 % de théorie, 70 % de pratique, et une note écrite avec tes propres mots à la fin de chaque notion.</div>
        </section>
        <section class="card">
          <div class="card-head"><h2>${icon("alert")} Non négociable au travail</h2></div>
          <ul class="rules">${RULES.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
          <p class="muted small">Article 323-1 du Code pénal : accéder ou se maintenir frauduleusement dans un système, c'est jusqu'à 3 ans et 100 000 €, même avec des droits d'accès.</p>
        </section>
      </div>

      <div class="callout callout-warning"><strong>Signal d'alerte :</strong> si au 6e mois tu ne sais pas expliquer un échange DNS ou Kerberos sans notes, ralentis et consolide. Plus de temps : compresse le planning. Moins : étire-le, sans sauter d'étape.</div>`;
  }

  /* ───────────── Vue : Mes travaux ───────────── */

  function filteredWorks() {
    const f = ui.works;
    const q = norm(f.q.trim());
    let list = allWorks().filter((w) => {
      if (f.category && w.category !== f.category) return false;
      if (f.has === "notes" && !(w.content || "").trim()) return false;
      if (f.has === "links" && !(w.links || []).length) return false;
      if (f.has === "files" && !(w.files || []).length) return false;
      if (q) {
        const hay = norm([w.title, w.category, w.content, ...(w.links || []).map((l) => `${l.label} ${l.url}`), ...(w.files || []).map((x) => x.name)].join(" "));
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const key = (w) => w.date || new Date(w.createdAt).toISOString().slice(0, 10);
    if (f.sort === "recent") list.sort((a, b) => key(b).localeCompare(key(a)) || b.updatedAt - a.updatedAt);
    if (f.sort === "old") list.sort((a, b) => key(a).localeCompare(key(b)) || a.createdAt - b.createdAt);
    if (f.sort === "title") list.sort((a, b) => a.title.localeCompare(b.title, "fr"));
    return list;
  }

  function workCard(w) {
    const excerpt = MD.plain(w.content).slice(0, 180);
    const nL = (w.links || []).length, nF = (w.files || []).length, nA = (w.actionIds || []).length;
    return `<button class="work-card" data-act="open-work" data-id="${w.id}" data-fk="w-${w.id}">
      <span class="work-top"><span class="chip">${esc(w.category || "Autre")}</span><span class="muted small">${w.date ? fmtDay(parseDate(w.date)) : ""}</span></span>
      <span class="work-title">${esc(w.title)}</span>
      ${excerpt ? `<span class="work-excerpt">${esc(excerpt)}${MD.plain(w.content).length > 180 ? "…" : ""}</span>` : ""}
      <span class="work-meta">
        ${nL ? `<span>${icon("link")}${nL} lien${nL > 1 ? "s" : ""}</span>` : ""}
        ${nF ? `<span>${icon("file")}${nF} fichier${nF > 1 ? "s" : ""}</span>` : ""}
        ${nA ? `<span>${icon("check")}${nA} action${nA > 1 ? "s" : ""}</span>` : ""}
      </span>
    </button>`;
  }

  function worksBody() {
    const total = allWorks().length;
    const list = filteredWorks();
    return !total
      ? `<div class="empty empty-big">
          <h2>Ton espace de travail est vide</h2>
          <p>Range ici tes notes de cours, write-ups, scripts, documentation de lab, attestations de certification… Chaque travail peut contenir du texte, des liens et des fichiers, et être relié à une action de la feuille de route.</p>
          <button class="btn btn-primary" data-act="new-work">${icon("plus")}Créer mon premier travail</button>
        </div>`
      : list.length
        ? `<div class="works-grid">${list.map(workCard).join("")}</div>`
        : `<div class="empty"><p>Aucun travail ne correspond.</p></div>`;
  }

  function viewWorks() {
    const f = ui.works;
    const total = allWorks().length;
    return `
      <section class="page-head">
        <div>
          <h1>Mes travaux</h1>
          <p class="lede">Tes notes, liens et fichiers, reliés aux actions de la feuille de route. C'est aussi la base de ton futur portfolio.</p>
        </div>
        <button class="btn btn-primary" data-act="new-work">${icon("plus")}Nouveau travail</button>
      </section>
      ${total ? `<section class="filters" aria-label="Filtres des travaux">
        <label class="search">${icon("search")}<input type="search" data-works="q" value="${esc(f.q)}" placeholder="Rechercher dans tes travaux…" aria-label="Rechercher"></label>
        ${selectHTML("category", f.category, WORK_CATEGORIES.map((c) => [c, c]), "Toutes les catégories", "works")}
        ${selectHTML("has", f.has, [["notes", "Avec notes"], ["links", "Avec liens"], ["files", "Avec fichiers"]], "Tout le contenu", "works")}
        <select data-works="sort" aria-label="Trier">
          <option value="recent"${f.sort === "recent" ? " selected" : ""}>Plus récents</option>
          <option value="old"${f.sort === "old" ? " selected" : ""}>Plus anciens</option>
          <option value="title"${f.sort === "title" ? " selected" : ""}>Par titre</option>
        </select>
      </section>` : ""}
      <div id="works-list">${worksBody()}</div>
      <p class="storage-note muted small">${icon("alert")}Tes travaux et fichiers sont enregistrés uniquement dans ce navigateur. <span id="storage-usage"></span> Exporte une sauvegarde régulièrement depuis les <button class="link-btn" data-act="open-settings">réglages</button>.</p>`;
  }

  /* ───────────── Panneau latéral : détail d'une action ───────────── */

  let drawerId = null;

  function openAction(id) {
    if (!ACTION_BY_ID[id]) return;
    drawerId = id;
    renderDrawer();
    if (!drawer.open) drawer.showModal();
    $(".drawer-body", drawer).scrollTop = 0;
  }

  function renderDrawer() {
    const a = ACTION_BY_ID[drawerId];
    if (!a) return;
    const st = Store.action(a.id);
    const cur = planMonth();
    const late = isLate(a, st.status, cur);
    const [d, t] = subCount(a, st);
    const works = worksFor(a.id);
    const others = allWorks().filter((w) => !(w.actionIds || []).includes(a.id)).sort((x, y) => x.title.localeCompare(y.title, "fr"));
    const scroll = $(".drawer-body", drawer)?.scrollTop || 0;

    drawer.innerHTML = `
      <header class="drawer-head">
        <div>
          <p class="eyebrow">${esc(PHASE_BY_ID[a.phase].name)}</p>
          <h2>${esc(a.title)}</h2>
        </div>
        <button class="icon-btn" data-act="close-drawer" aria-label="Fermer">${icon("x")}</button>
      </header>
      <div class="drawer-body">
        <div class="badges">${prioBadge(a.priority)}<span class="theme-tag">${esc(a.theme)}</span><span class="badge badge-soft">${icon("clock")}${esc(periodLabel(a))}</span>${late ? `<span class="badge badge-late">En retard</span>` : ""}</div>

        <div class="segmented" role="group" aria-label="Statut">
          ${Object.entries(STATUS).map(([k, l]) => `<button class="seg s-${k}" data-act="set-status" data-id="${a.id}" data-status="${k}" aria-pressed="${st.status === k}" data-fk="seg-${k}">${statusIcon(k)}${l}</button>`).join("")}
        </div>

        <section class="d-section"><h3>Pourquoi</h3><p>${esc(a.why)}</p></section>
        <section class="d-section"><h3>Comment faire</h3><ol class="how">${a.how.map((h) => `<li>${esc(h)}</li>`).join("")}</ol></section>
        ${a.warn ? `<div class="callout callout-danger">${icon("alert")}<span>${esc(a.warn)}</span></div>` : ""}
        ${a.resources.length ? `<section class="d-section"><h3>Ressources</h3><ul class="res">${a.resources.map((r) => `<li><a href="${r.url}" target="_blank" rel="noopener noreferrer">${esc(r.label)}${icon("external")}</a></li>`).join("")}</ul></section>` : ""}

        <section class="d-section">
          <h3>Sous-tâches ${t ? `<span class="count">${d}/${t}</span>` : ""}</h3>
          <ul class="checklist">
            ${a.subtasks.map((s, i) => `<li><label><input type="checkbox" data-act="toggle-sub" data-i="${i}" data-fk="sub-${i}"${st.sub[i] ? " checked" : ""}><span>${esc(s)}</span></label></li>`).join("")}
            ${st.custom.map((c) => `<li class="custom"><label><input type="checkbox" data-act="toggle-custom" data-cid="${c.id}" data-fk="cs-${c.id}"${c.done ? " checked" : ""}><span>${esc(c.text)}</span></label><button class="icon-btn icon-btn-sm" data-act="del-custom" data-cid="${c.id}" aria-label="Supprimer la sous-tâche">${icon("x")}</button></li>`).join("")}
          </ul>
          <form class="add-row" data-form="add-sub">
            <input type="text" name="text" placeholder="Ajouter une sous-tâche…" aria-label="Nouvelle sous-tâche" maxlength="200" data-fk="add-sub">
            <button class="btn btn-sm" type="submit">${icon("plus")}Ajouter</button>
          </form>
        </section>

        <section class="d-section">
          <h3>Mes notes <span class="saved" id="notes-saved" aria-live="polite"></span></h3>
          <textarea class="notes" data-act="notes" rows="5" placeholder="Ce que tu as appris, tes difficultés, tes idées… (Markdown accepté)">${esc(st.notes)}</textarea>
        </section>

        <section class="d-section">
          <h3>Travaux liés ${works.length ? `<span class="count">${works.length}</span>` : ""}</h3>
          ${works.length ? `<ul class="linked">${works.map((w) => `<li><button class="link-btn" data-act="open-work" data-id="${w.id}">${icon("file")}${esc(w.title)}</button><button class="icon-btn icon-btn-sm" data-act="unlink-work" data-id="${w.id}" aria-label="Délier ce travail">${icon("x")}</button></li>`).join("")}</ul>` : `<p class="muted small">Aucun travail lié pour l'instant.</p>`}
          <div class="add-row">
            ${others.length ? `<select data-act="link-work" aria-label="Lier un travail existant"><option value="">Lier un travail existant…</option>${others.map((w) => `<option value="${w.id}">${esc(w.title)}</option>`).join("")}</select>` : ""}
            <button class="btn btn-sm" data-act="new-work" data-action="${a.id}">${icon("plus")}Nouveau travail lié</button>
          </div>
        </section>
      </div>`;
    $(".drawer-body", drawer).scrollTop = scroll;
  }

  /* ───────────── Fenêtre : travaux (lecture / édition) et réglages ───────────── */

  let modalMode = null;
  let ed = null; // brouillon du travail en cours d'édition

  function openModal(mode, html) {
    modalMode = mode;
    modal.innerHTML = html;
    modal.className = `modal modal-${mode}`;
    if (!modal.open) modal.showModal();
  }

  function closeModal() {
    if (modalMode === "work-edit" && ed && ed.dirty && !confirm("Abandonner les modifications non enregistrées ?")) return;
    modal.close();
  }

  function showWork(id) {
    const w = Store.state.works[id];
    if (!w) return;
    const links = (w.links || []).filter((l) => safeUrl(l.url));
    const acts = (w.actionIds || []).map((x) => ACTION_BY_ID[x]).filter(Boolean);
    openModal("work-view", `
      <header class="modal-head">
        <div>
          <p class="eyebrow">${esc(w.category || "Autre")}${w.date ? ` · ${fmtDay(parseDate(w.date))}` : ""}</p>
          <h2>${esc(w.title)}</h2>
        </div>
        <div class="head-actions">
          <button class="btn btn-sm" data-act="edit-work" data-id="${w.id}">${icon("edit")}Modifier</button>
          <button class="icon-btn" data-act="close-modal" aria-label="Fermer">${icon("x")}</button>
        </div>
      </header>
      <div class="modal-body">
        ${(w.content || "").trim() ? `<div class="prose md">${MD.render(w.content)}</div>` : `<p class="muted">Pas de texte.</p>`}
        ${links.length ? `<section class="d-section"><h3>Liens</h3><ul class="res">${links.map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label || l.url)}${icon("external")}</a></li>`).join("")}</ul></section>` : ""}
        ${(w.files || []).length ? `<section class="d-section"><h3>Fichiers</h3><ul class="files">${w.files.map((f) => `<li><span class="file-name">${icon("file")}${esc(f.name)}</span><span class="muted small">${fmtSize(f.size)}</span><span class="file-actions"><button class="btn btn-sm" data-act="file-open" data-fid="${f.id}">${icon("external")}Ouvrir</button><button class="btn btn-sm" data-act="file-download" data-fid="${f.id}">${icon("download")}Télécharger</button></span></li>`).join("")}</ul></section>` : ""}
        ${acts.length ? `<section class="d-section"><h3>Actions liées</h3><ul class="linked">${acts.map((a) => `<li><button class="link-btn" data-act="open-action" data-id="${a.id}">${statusIcon(Store.action(a.id).status)}${esc(a.title)}</button></li>`).join("")}</ul></section>` : ""}
      </div>`);
  }

  function startEdit(id, linkActionId) {
    const w = id ? Store.state.works[id] : null;
    ed = w
      ? { ...w, links: (w.links || []).map((l) => ({ ...l })), files: [...(w.files || [])], actionIds: [...(w.actionIds || [])], pending: [], removed: [], preview: false, dirty: false }
      : { id: null, title: "", category: WORK_CATEGORIES[0], date: isoToday(), content: "", links: [], files: [], actionIds: linkActionId ? [linkActionId] : [], pending: [], removed: [], preview: false, dirty: false };
    renderEditor();
    $("#w-title", modal)?.focus();
  }

  /* Recopie les champs du formulaire dans le brouillon avant de redessiner. */
  function syncEditor() {
    const form = $("#work-form", modal);
    if (!form || !ed) return;
    ed.title = form.title.value;
    ed.category = form.category.value;
    ed.date = form.date.value;
    const content = $("#w-content", modal);
    if (content) ed.content = content.value;
    ed.links = [...modal.querySelectorAll(".link-row")].map((r) => ({ label: r.querySelector("[name=lbl]").value, url: r.querySelector("[name=url]").value }));
  }

  function renderEditor() {
    const files = [
      ...ed.files.map((f) => ({ ...f, pending: false })),
      ...ed.pending.map((p) => ({ id: p.id, name: p.file.name, size: p.file.size, pending: true })),
    ];
    const acts = ed.actionIds.map((x) => ACTION_BY_ID[x]).filter(Boolean);
    const options = PHASES.map((p) => {
      const opts = ACTIONS.filter((a) => a.phase === p.id && !ed.actionIds.includes(a.id));
      return opts.length ? `<optgroup label="${esc(p.name)}">${opts.map((a) => `<option value="${a.id}">${esc(a.title)}</option>`).join("")}</optgroup>` : "";
    }).join("");

    openModal("work-edit", `
      <form id="work-form" novalidate>
        <header class="modal-head">
          <div><p class="eyebrow">${ed.id ? "Modifier le travail" : "Nouveau travail"}</p><h2>${ed.title ? esc(ed.title) : "Sans titre"}</h2></div>
          <button type="button" class="icon-btn" data-act="close-modal" aria-label="Fermer">${icon("x")}</button>
        </header>
        <div class="modal-body form">
          <label class="field"><span>Titre <span class="req">*</span></span><input id="w-title" name="title" required maxlength="200" value="${esc(ed.title)}" placeholder="Ex. : Write-up Bandit niveaux 0 à 10"></label>
          <div class="field-row">
            <label class="field"><span>Catégorie</span><select name="category">${WORK_CATEGORIES.map((c) => `<option${c === ed.category ? " selected" : ""}>${esc(c)}</option>`).join("")}</select></label>
            <label class="field"><span>Date</span><input type="date" name="date" value="${esc(ed.date || "")}"></label>
          </div>

          <div class="field">
            <div class="field-top">
              <span>Texte</span>
              <div class="mini-tabs" role="tablist">
                <button type="button" role="tab" aria-selected="${!ed.preview}" data-act="ed-preview" data-v="0">Écrire</button>
                <button type="button" role="tab" aria-selected="${ed.preview}" data-act="ed-preview" data-v="1">Aperçu</button>
              </div>
            </div>
            ${ed.preview
              ? `<div class="prose md preview">${ed.content.trim() ? MD.render(ed.content) : '<p class="muted">Rien à afficher.</p>'}</div>`
              : `<textarea id="w-content" rows="10" placeholder="Tes notes, ton write-up, ton analyse…">${esc(ed.content)}</textarea>
                 <p class="hint">Markdown : <code>**gras**</code>, <code>*italique*</code>, <code># Titre</code>, <code>- liste</code>, <code>- [ ] case</code>, <code>[lien](https://…)</code>, <code>\`\`\`code\`\`\`</code></p>`}
          </div>

          <fieldset class="field">
            <legend>Liens</legend>
            <div class="links-edit">
              ${ed.links.map((l, i) => `<div class="link-row">
                <input name="lbl" placeholder="Nom (facultatif)" value="${esc(l.label || "")}" aria-label="Nom du lien">
                <input name="url" type="url" placeholder="https://…" value="${esc(l.url || "")}" aria-label="Adresse du lien">
                <button type="button" class="icon-btn icon-btn-sm" data-act="ed-del-link" data-i="${i}" aria-label="Retirer ce lien">${icon("x")}</button>
              </div>`).join("")}
            </div>
            <button type="button" class="btn btn-sm" data-act="ed-add-link">${icon("plus")}Ajouter un lien</button>
          </fieldset>

          <fieldset class="field">
            <legend>Fichiers</legend>
            ${files.length ? `<ul class="files">${files.map((f) => `<li><span class="file-name">${icon("file")}${esc(f.name)}</span><span class="muted small">${fmtSize(f.size)}${f.pending ? " · à enregistrer" : ""}</span><button type="button" class="icon-btn icon-btn-sm" data-act="ed-del-file" data-fid="${f.id}" aria-label="Retirer ce fichier">${icon("x")}</button></li>`).join("")}</ul>` : ""}
            <label class="btn btn-sm file-pick">${icon("upload")}Ajouter des fichiers<input type="file" multiple data-act="ed-files" hidden></label>
            <p class="hint">PDF, Word, images, scripts… 50 Mo maximum par fichier. Les fichiers restent dans ce navigateur.</p>
          </fieldset>

          <fieldset class="field">
            <legend>Actions liées</legend>
            ${acts.length ? `<div class="chips">${acts.map((a) => `<span class="chip chip-x">${esc(a.title)}<button type="button" data-act="ed-del-action" data-id="${a.id}" aria-label="Délier ${esc(a.title)}">${icon("x")}</button></span>`).join("")}</div>` : ""}
            <select data-act="ed-add-action" aria-label="Lier une action"><option value="">Lier une action de la feuille de route…</option>${options}</select>
          </fieldset>
        </div>
        <footer class="modal-foot">
          ${ed.id ? `<button type="button" class="btn btn-danger" data-act="ed-delete">${icon("trash")}Supprimer</button>` : "<span></span>"}
          <div class="foot-right">
            <button type="button" class="btn" data-act="ed-cancel">Annuler</button>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
          </div>
        </footer>
      </form>`);
  }

  async function saveEditor() {
    syncEditor();
    const title = ed.title.trim();
    if (!title) {
      toast("Donne un titre à ce travail.", "warn");
      $("#w-title", modal)?.focus();
      return;
    }
    const links = ed.links
      .map((l) => {
        let url = (l.url || "").trim();
        if (url && !/^[a-z]+:\/\//i.test(url)) url = `https://${url}`;
        return { label: (l.label || "").trim(), url };
      })
      .filter((l) => safeUrl(l.url));
    try {
      for (const p of ed.pending) {
        await Files.put({ id: p.id, name: p.file.name, type: p.file.type, size: p.file.size, blob: p.file });
      }
      for (const id of ed.removed) await Files.remove(id);
    } catch (e) {
      console.error(e);
      toast("Impossible d'enregistrer les fichiers : l'espace de stockage du navigateur est peut-être plein.", "error");
      return;
    }
    if (ed.pending.length && navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
    const w = Store.saveWork({
      id: ed.id,
      createdAt: ed.createdAt,
      title,
      category: ed.category,
      date: ed.date,
      content: ed.content,
      links,
      files: [...ed.files, ...ed.pending.map((p) => ({ id: p.id, name: p.file.name, type: p.file.type, size: p.file.size }))],
      actionIds: ed.actionIds,
    });
    ed = null;
    toast("Travail enregistré.");
    showWork(w.id);
  }

  function openSettings() {
    const s = Store.state.settings;
    const last = s.lastExport ? fmtDay(new Date(s.lastExport)) : "jamais";
    openModal("settings", `
      <header class="modal-head">
        <div><p class="eyebrow">Réglages</p><h2>Paramètres et sauvegarde</h2></div>
        <button class="icon-btn" data-act="close-modal" aria-label="Fermer">${icon("x")}</button>
      </header>
      <div class="modal-body form">
        <section class="d-section">
          <h3>Date de début</h3>
          <label class="field"><span>Le mois 1 commence à cette date. Elle sert à calculer le mois en cours et les retards.</span>
            <input type="date" data-setting="startDate" value="${esc(s.startDate)}"></label>
        </section>
        <section class="d-section">
          <h3>Thème</h3>
          <div class="segmented" role="group" aria-label="Thème">
            ${[["auto", "Automatique"], ["light", "Clair"], ["dark", "Sombre"]].map(([v, l]) => `<button class="seg" data-act="set-theme" data-v="${v}" aria-pressed="${s.theme === v}">${l}</button>`).join("")}
          </div>
        </section>
        <section class="d-section">
          <h3>Sauvegarde</h3>
          <p>Tes données (statuts, notes, travaux et fichiers) sont enregistrées <strong>uniquement dans ce navigateur, sur cet appareil</strong>. Si tu effaces les données du navigateur, elles disparaissent.</p>
          <p>Exporte-les régulièrement. Le fichier exporté est ta sauvegarde : il te permet de passer sur un autre appareil et, plus tard, de migrer vers Cloudflare.</p>
          <p class="muted small">Dernier export : ${last} · <span id="storage-usage-settings"></span></p>
          <div class="btn-row">
            <button class="btn btn-primary" data-act="export">${icon("download")}Exporter une sauvegarde</button>
            <label class="btn">${icon("upload")}Importer une sauvegarde<input type="file" accept=".json,application/json" data-act="import" hidden></label>
          </div>
        </section>
        <section class="d-section danger-zone">
          <h3>Tout effacer</h3>
          <p class="muted small">Supprime toute ta progression, tes notes, tes travaux et tes fichiers de ce navigateur. Exporte d'abord une sauvegarde.</p>
          <button class="btn btn-danger" data-act="reset">${icon("trash")}Tout effacer</button>
        </section>
      </div>`);
    showStorageUsage("#storage-usage-settings");
  }

  async function showStorageUsage(sel) {
    if (!navigator.storage || !navigator.storage.estimate) return;
    try {
      const { usage } = await navigator.storage.estimate();
      const el = $(sel);
      if (el && usage != null) el.textContent = `Espace utilisé : ${fmtSize(usage)}.`;
    } catch (e) { /* non disponible */ }
  }

  /* ───────────── Rendu général ───────────── */

  function route() {
    const h = location.hash.replace(/^#\/?/, "");
    const [page, sub] = h.split("/");
    if (page === "commencer") return { page: "start" };
    if (page === "travaux") return { page: "works" };
    return { page: "roadmap", tab: sub === "guide" ? "guide" : "plan" };
  }

  function applyTheme() {
    const t = Store.state.settings.theme;
    if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
    else delete document.documentElement.dataset.theme;
  }

  function renderHeader() {
    const r = route();
    document.querySelectorAll(".nav a").forEach((a) => {
      a.setAttribute("aria-current", a.dataset.page === r.page ? "page" : "false");
    });
    const s = stats();
    $("#header-progress").innerHTML = `<span class="hp-label">${s.pct} %</span>${progressBar(s.pct, "Progression globale")}`;
    $("#header-progress").title = `${s.done} actions faites sur ${s.total}`;
  }

  function renderBanner() {
    const st = Store.state;
    // Rappel discret : 2 jours après la première modification, puis chaque semaine sans export.
    const times = [...Object.values(st.actions).map((a) => a.updatedAt), ...Object.values(st.works).map((w) => w.updatedAt)].filter(Boolean);
    const last = st.settings.lastExport || 0;
    const stale = times.length && (last
      ? Math.max(...times) > last && Date.now() - last > 7 * 864e5
      : Date.now() - Math.min(...times) > 2 * 864e5);
    const show = stale && Date.now() > ui.bannerHiddenUntil;
    $("#banner").innerHTML = show
      ? `<div class="banner">${icon("alert")}<span>Tes données ne sont que dans ce navigateur. ${st.settings.lastExport ? "Ta dernière sauvegarde a plus d'une semaine." : "Tu n'as encore jamais exporté de sauvegarde."}</span>
          <button class="btn btn-sm btn-primary" data-act="export">Exporter maintenant</button>
          <button class="icon-btn icon-btn-sm" data-act="hide-banner" aria-label="Masquer pour aujourd'hui">${icon("x")}</button></div>`
      : "";
    if (Store.lastError) {
      $("#banner").innerHTML += `<div class="banner banner-error">${icon("alert")}<span>Impossible d'enregistrer dans ce navigateur (navigation privée ou stockage plein ?). Tes changements risquent d'être perdus.</span></div>`;
    }
  }

  function render() {
    const fk = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.fk : null;
    const r = route();
    renderHeader();
    renderBanner();
    if (r.page === "start") main.innerHTML = viewStart();
    else if (r.page === "works") { main.innerHTML = viewWorks(); showStorageUsage("#storage-usage"); }
    else main.innerHTML = viewRoadmap(r.tab);
    if (drawer.open) renderDrawer();
    if (fk) {
      const el = document.querySelector(`[data-fk="${CSS.escape(fk)}"]`);
      if (el) el.focus({ preventScroll: true });
    }
  }

  function setStatus(id, status) {
    Store.updateAction(id, (a) => { a.status = status; });
    if (status === "done") toast(`« ${ACTION_BY_ID[id].title} » : fait.`);
  }

  /* Cocher une sous-tâche fait passer une action « À faire » en « En cours ». */
  const autoStart = (a) => { if (a.status === "todo") a.status = "doing"; };

  /* ───────────── Événements ───────────── */

  document.addEventListener("click", async (e) => {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const act = el.dataset.act;
    const id = el.dataset.id;

    switch (act) {
      case "cycle-status": setStatus(id, NEXT_STATUS[Store.action(id).status]); break;
      case "set-status": setStatus(id, el.dataset.status); break;
      case "open-action":
        if (modal.open && modalMode !== "work-edit") modal.close();
        openAction(id);
        break;
      case "close-drawer": drawer.close(); break;
      case "toggle-phase":
        ui.collapsed[id] = !ui.collapsed[id];
        saveUI();
        render();
        break;
      case "clear-filters":
        ui.filters = { ...UI_DEFAULTS.filters };
        saveUI();
        render();
        break;
      case "quick-filter":
        ui.filters = { ...UI_DEFAULTS.filters, status: el.dataset.status || "", now: !!el.dataset.now };
        saveUI();
        render();
        break;
      case "goto": {
        const target = document.getElementById(el.dataset.target);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      }
      case "del-custom":
        Store.updateAction(drawerId, (a) => { a.custom = a.custom.filter((c) => c.id !== el.dataset.cid); });
        break;
      case "unlink-work": {
        const w = Store.state.works[id];
        Store.setWorkActions(id, (w.actionIds || []).filter((x) => x !== drawerId));
        break;
      }
      case "new-work":
        startEdit(null, el.dataset.action || null);
        break;
      case "open-work": showWork(id); break;
      case "edit-work": startEdit(id); break;
      case "close-modal": closeModal(); break;
      case "ed-cancel":
        if (ed && ed.dirty && !confirm("Abandonner les modifications non enregistrées ?")) break;
        if (ed && ed.id) { const wid = ed.id; ed = null; showWork(wid); } else { ed = null; modal.close(); }
        break;
      case "ed-preview":
        syncEditor();
        ed.preview = el.dataset.v === "1";
        renderEditor();
        break;
      case "ed-add-link":
        syncEditor();
        ed.links.push({ label: "", url: "" });
        ed.dirty = true;
        renderEditor();
        modal.querySelectorAll(".link-row [name=url]")[ed.links.length - 1]?.focus();
        break;
      case "ed-del-link":
        syncEditor();
        ed.links.splice(+el.dataset.i, 1);
        ed.dirty = true;
        renderEditor();
        break;
      case "ed-del-file": {
        syncEditor();
        const fid = el.dataset.fid;
        if (ed.pending.some((p) => p.id === fid)) ed.pending = ed.pending.filter((p) => p.id !== fid);
        else { ed.files = ed.files.filter((f) => f.id !== fid); ed.removed.push(fid); }
        ed.dirty = true;
        renderEditor();
        break;
      }
      case "ed-del-action":
        syncEditor();
        ed.actionIds = ed.actionIds.filter((x) => x !== id);
        ed.dirty = true;
        renderEditor();
        break;
      case "ed-delete": {
        if (!confirm("Supprimer définitivement ce travail et ses fichiers ?")) break;
        const wid = ed.id;
        ed = null;
        await Store.deleteWork(wid);
        modal.close();
        toast("Travail supprimé.");
        break;
      }
      case "file-open":
      case "file-download": {
        const rec = await Files.get(el.dataset.fid).catch(() => null);
        if (!rec) { toast("Fichier introuvable dans ce navigateur.", "error"); break; }
        if (act === "file-download") downloadBlob(rec.blob, rec.name);
        else {
          const url = URL.createObjectURL(rec.blob);
          window.open(url, "_blank", "noopener");
          setTimeout(() => URL.revokeObjectURL(url), 60000);
        }
        break;
      }
      case "open-settings": openSettings(); break;
      case "set-theme":
        Store.setSetting("theme", el.dataset.v);
        applyTheme();
        openSettings();
        break;
      case "export":
        try {
          const data = await Store.exportAll();
          downloadBlob(new Blob([JSON.stringify(data)], { type: "application/json" }), `feuille-de-route-cyber-${isoToday()}.json`);
          toast("Sauvegarde exportée.");
          if (modalMode === "settings" && modal.open) openSettings();
        } catch (err) {
          console.error(err);
          toast("L'export a échoué.", "error");
        }
        break;
      case "hide-banner":
        ui.bannerHiddenUntil = Date.now() + 864e5;
        saveUI();
        renderBanner();
        break;
      case "reset": {
        const answer = prompt("Toutes tes données vont être effacées de ce navigateur.\nTape EFFACER pour confirmer.");
        if (answer !== "EFFACER") break;
        await Store.reset();
        applyTheme();
        modal.close();
        toast("Toutes les données ont été effacées.");
        break;
      }
    }
  });

  document.addEventListener("change", async (e) => {
    const el = e.target;
    if (el.dataset.filter) {
      ui.filters[el.dataset.filter] = el.type === "checkbox" ? el.checked : el.value;
      saveUI();
      render();
      return;
    }
    if (el.dataset.works && el.dataset.works !== "q") {
      ui.works[el.dataset.works] = el.value;
      saveUI();
      render();
      return;
    }
    if (el.dataset.setting === "startDate") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(el.value)) {
        Store.setSetting("startDate", el.value);
        toast("Date de début mise à jour.");
      }
      return;
    }
    switch (el.dataset.act) {
      case "toggle-sub":
        Store.updateAction(drawerId, (a) => { a.sub = { ...a.sub, [el.dataset.i]: el.checked }; if (el.checked) autoStart(a); });
        break;
      case "toggle-custom":
        Store.updateAction(drawerId, (a) => {
          a.custom = a.custom.map((c) => (c.id === el.dataset.cid ? { ...c, done: el.checked } : c));
          if (el.checked) autoStart(a);
        });
        break;
      case "link-work":
        if (el.value) {
          const w = Store.state.works[el.value];
          Store.setWorkActions(w.id, [...(w.actionIds || []), drawerId]);
        }
        break;
      case "ed-add-action":
        if (el.value) {
          syncEditor();
          ed.actionIds.push(el.value);
          ed.dirty = true;
          renderEditor();
        }
        break;
      case "ed-files": {
        syncEditor();
        const tooBig = [];
        for (const file of el.files) {
          if (file.size > MAX_FILE) tooBig.push(file.name);
          else ed.pending.push({ id: Store.uid(), file });
        }
        if (tooBig.length) toast(`Trop volumineux (50 Mo max) : ${tooBig.join(", ")}`, "warn");
        ed.dirty = true;
        renderEditor();
        break;
      }
      case "import": {
        const file = el.files[0];
        if (!file) break;
        try {
          const data = JSON.parse(await file.text());
          if (!confirm("Importer cette sauvegarde remplacera toutes tes données actuelles dans ce navigateur. Continuer ?")) break;
          await Store.importAll(data);
          applyTheme();
          modal.close();
          toast("Sauvegarde importée.");
        } catch (err) {
          console.error(err);
          toast(err.message && err.message.startsWith("Ce fichier") ? err.message : "Ce fichier n'a pas pu être importé.", "error");
        }
        break;
      }
    }
  });

  let notesTimer = null;
  let searchTimer = null;
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (el.dataset.filter === "q") {
      ui.filters.q = el.value;
      saveUI();
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { $("#list").innerHTML = roadmapList(); }, 120);
      return;
    }
    if (el.dataset.works === "q") {
      ui.works.q = el.value;
      saveUI();
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { $("#works-list").innerHTML = worksBody(); }, 120);
      return;
    }
    if (el.dataset.act === "notes") {
      const id = drawerId;
      const value = el.value;
      clearTimeout(notesTimer);
      $("#notes-saved").textContent = "";
      notesTimer = setTimeout(() => {
        Store.updateAction(id, (a) => { a.notes = value; }, true);
        const tag = $("#notes-saved");
        if (tag) tag.textContent = "Enregistré";
      }, 400);
      return;
    }
    if (modalMode === "work-edit" && ed && el.closest("#work-form")) ed.dirty = true;
  });

  document.addEventListener("submit", (e) => {
    const form = e.target;
    e.preventDefault();
    if (form.dataset.form === "add-sub") {
      const text = form.text.value.trim();
      if (!text) return;
      Store.updateAction(drawerId, (a) => { a.custom = [...a.custom, { id: Store.uid(), text, done: false }]; });
      const input = $("[data-fk=add-sub]", drawer);
      if (input) input.focus();
    } else if (form.id === "work-form") {
      saveEditor();
    }
  });

  // Fermeture des panneaux : clic sur le fond, Échap.
  drawer.addEventListener("click", (e) => { if (e.target === drawer) drawer.close(); });
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  modal.addEventListener("cancel", (e) => {
    if (modalMode === "work-edit" && ed && ed.dirty && !confirm("Abandonner les modifications non enregistrées ?")) e.preventDefault();
  });
  drawer.addEventListener("close", () => {
    // Les notes en attente sont enregistrées tout de suite à la fermeture.
    const ta = $("textarea[data-act=notes]", drawer);
    if (ta && drawerId) {
      clearTimeout(notesTimer);
      const id = drawerId;
      if (Store.action(id).notes !== ta.value) Store.updateAction(id, (a) => { a.notes = ta.value; }, true);
    }
    drawerId = null;
    render();
  });
  modal.addEventListener("close", () => { modalMode = null; ed = null; render(); });

  window.addEventListener("hashchange", () => {
    if (modal.open) closeModal();
    if (drawer.open) drawer.close();
    render();
    window.scrollTo(0, 0);
  });
  window.addEventListener("storage", (e) => { if (e.key === "cyberroadmap:v1") location.reload(); });

  Store.subscribe(render);
  applyTheme();
  render();
})();

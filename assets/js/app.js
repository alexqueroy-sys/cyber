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
  const CERT_BY_ID = Object.fromEntries(CERTS.map((c) => [c.id, c]));

  const STATUS = { todo: "À faire", doing: "En cours", done: "Fait" };
  const MAX_FILE = 50 * 1024 * 1024;

  /* ───────────── Préférences d'affichage (par navigateur) ───────────── */

  const UI_KEY = "cyberroadmap:ui";
  const UI_DEFAULTS = {
    open: {},       // grandes étapes ouvertes ou fermées dans « Par où commencer »
    phaseOpen: {},  // blocs de phase ouverts ou fermés
    works: { q: "", category: "", has: "", sort: "recent" },
    bannerHiddenUntil: 0,
  };
  const ui = (() => {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(UI_KEY)) || {}; } catch (e) { /* navigation privée */ }
    return {
      ...UI_DEFAULTS,
      bannerHiddenUntil: saved.bannerHiddenUntil || 0,
      open: { ...(saved.open || {}) },
      phaseOpen: { ...(saved.phaseOpen || {}) },
      works: { ...UI_DEFAULTS.works, ...(saved.works || {}) },
    };
  })();
  const saveUI = () => { try { localStorage.setItem(UI_KEY, JSON.stringify(ui)); } catch (e) { /* ignoré */ } };

  /* ───────────── Icônes ───────────── */

  const PATHS = {
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
    skip: '<path d="m5 4 10 8-10 8z"/><path d="M19 5v14"/>',
    undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-15-6.7L3 13"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>',
  };
  const icon = (name, cls = "") =>
    `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${PATHS[name]}</svg>`;

  function statusIcon(s) {
    const inner = {
      todo: '<circle cx="12" cy="12" r="8.5"/>',
      doing: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none"/>',
      done: '<circle cx="12" cy="12" r="9.5" fill="currentColor" stroke="none"/><path class="tick" d="m8 12.4 2.8 2.8L16.2 9.8"/>',
    }[s];
    return `<svg class="ic status-ic s-${s}" viewBox="0 0 24 24" aria-label="${STATUS[s]}" role="img" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
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
  const span = (a) => [a.months[0], Math.max(a.months[1], 1)];
  const isLate = (a, status, cur) => status !== "done" && span(a)[1] < cur;

  function periodLabel(a, withDates = true) {
    const [x, y] = a.months;
    if (x === 0) return withDates ? `Semaine 1 · dès le ${fmtDay(startDate())}` : "Semaine 1";
    const m = x === y ? `Mois ${x}` : `Mois ${x}–${y}`;
    return withDates ? `${m} · ${fmtRange(monthDate(x), monthDate(y))}` : m;
  }

  function phaseRange(p) {
    const acts = ACTIONS.filter((a) => a.phase === p.id);
    return [Math.min(...acts.map((a) => a.months[0])), Math.max(...acts.map((a) => a.months[1]))];
  }
  function phasePeriod(p) {
    const [x, y] = phaseRange(p);
    if (y === 0) return `${p.period} · dès le ${fmtDay(startDate())}`;
    return `${p.period} · ${fmtRange(monthDate(Math.max(x, 1)), monthDate(y))}`;
  }

  /* ───────────── Progression : grandes et petites étapes ───────────── */

  function sortActions(list) {
    return [...list].sort((a, b) => {
      if (a.months[0] !== b.months[0]) return a.months[0] - b.months[0];
      const pr = PRIORITIES[a.priority].rank - PRIORITIES[b.priority].rank;
      return pr || ACTION_INDEX[a.id] - ACTION_INDEX[b.id];
    });
  }

  /* Le parcours complet, dans l'ordre où le faire. */
  const PATH = PHASES.flatMap((p) => sortActions(ACTIONS.filter((a) => a.phase === p.id)));
  const phaseActions = (pid) => PATH.filter((a) => a.phase === pid);

  /*
   * Une grande étape est faite quand toutes ses petites étapes (non passées)
   * sont cochées, en cours dès qu'une l'est.
   */
  function progressOf(a) {
    const st = Store.action(a.id);
    const skip = st.skip || {};
    const items = [
      ...a.subtasks.map((text, i) => ({ key: String(i), text, done: !!st.sub[i], skipped: !!skip[i], custom: false })),
      ...st.custom.map((c) => ({ key: `c:${c.id}`, text: c.text, done: !!c.done, skipped: !!skip[`c:${c.id}`], custom: true })),
    ];
    const active = items.filter((x) => !x.skipped);
    const done = active.filter((x) => x.done).length;
    const status = done === active.length ? "done" : done > 0 ? "doing" : "todo";
    return { st, items, active, done, total: active.length, status };
  }

  /* Les prochaines petites étapes, dans l'ordre du parcours (hors étapes facultatives). */
  function nextSteps(n = 3) {
    const out = [];
    for (const a of PATH) {
      if (a.priority === "optionnelle") continue;
      const p = progressOf(a);
      for (const it of p.active) {
        if (!it.done) out.push({ a, it, p, pos: p.active.indexOf(it) + 1 });
        if (out.length >= n) return out;
      }
    }
    return out;
  }

  function globalStats() {
    let done = 0, total = 0;
    for (const a of ACTIONS) {
      if (a.priority === "optionnelle") continue;
      const p = progressOf(a);
      done += p.done;
      total += p.total;
    }
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  const allWorks = () => Object.values(Store.state.works);
  const worksFor = (actionId) => allWorks().filter((w) => (w.actionIds || []).includes(actionId));
  const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  function setItem(actionId, key, done) {
    Store.updateAction(actionId, (s) => {
      if (key.startsWith("c:")) s.custom = s.custom.map((c) => (`c:${c.id}` === key ? { ...c, done } : c));
      else s.sub = { ...s.sub, [key]: done };
    });
  }
  function setSkip(actionId, key, skipped) {
    Store.updateAction(actionId, (s) => { s.skip = { ...(s.skip || {}), [key]: skipped }; });
  }

  /* ───────────── Petits composants ───────────── */

  const prioBadge = (p) =>
    p === "critique" || p === "optionnelle"
      ? `<span class="badge prio-${p}" title="${esc(PRIORITIES[p].hint)}">${PRIORITIES[p].label}</span>`
      : "";

  const progressBar = (pct, label = "") =>
    `<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"${label ? ` aria-label="${esc(label)}"` : ""}><span style="width:${pct}%"></span></div>`;

  function rowMeta(a, p) {
    const nWorks = worksFor(a.id).length;
    return `<span class="row-meta">
      <span class="theme-tag">${esc(a.theme)}</span>
      <span>${esc(periodLabel(a))}</span>
      <span class="meta-item" title="Petites étapes faites">${icon("check")}${p.done}/${p.total}</span>
      ${p.st.notes.trim() ? `<span class="meta-item" title="Contient des notes">${icon("note")}</span>` : ""}
      ${nWorks ? `<span class="meta-item" title="Travaux liés">${icon("file")}${nWorks}</span>` : ""}
    </span>`;
  }

  /* Liste de petites étapes à cocher (accordéon et panneau de détail). */
  function checklistHTML(a, p, nextKey, scope) {
    return `<ul class="checklist">
      ${p.items.map((it) => {
        const isNext = it.key === nextKey;
        const fk = `${scope}-${a.id}-${it.key}`;
        return `<li class="${it.done ? "is-done" : ""}${it.skipped ? " is-skipped" : ""}${isNext ? " is-next" : ""}">
          <label><input type="checkbox" data-act="toggle-item" data-id="${a.id}" data-key="${it.key}" data-fk="${fk}"${it.done ? " checked" : ""}${it.skipped ? " disabled" : ""}><span>${esc(it.text)}</span></label>
          ${isNext ? `<span class="now-tag">${icon("arrow")}maintenant</span>` : ""}
          ${it.skipped ? `<span class="skip-tag">passée</span>` : ""}
          ${it.done ? "" : `<button class="icon-btn icon-btn-sm" data-act="skip-item" data-id="${a.id}" data-key="${it.key}" data-v="${it.skipped ? 0 : 1}" title="${it.skipped ? "Reprendre cette étape" : "Passer cette étape (pas pour moi)"}" aria-label="${it.skipped ? "Reprendre" : "Passer"} : ${esc(it.text)}">${icon(it.skipped ? "undo" : "skip")}</button>`}
          ${it.custom ? `<button class="icon-btn icon-btn-sm" data-act="del-custom" data-id="${a.id}" data-key="${it.key}" aria-label="Supprimer : ${esc(it.text)}">${icon("trash")}</button>` : ""}
        </li>`;
      }).join("")}
    </ul>
    <form class="add-row" data-form="add-sub" data-id="${a.id}">
      <input type="text" name="text" placeholder="Ajouter une petite étape…" aria-label="Nouvelle petite étape" maxlength="200" data-fk="${scope}-add-${a.id}">
      <button class="btn btn-sm" type="submit">${icon("plus")}Ajouter</button>
    </form>`;
  }

  let toastTimer = null;
  let toastUndo = null;
  function toast(msg, tone = "", undo = null) {
    const el = $("#toast");
    toastUndo = undo;
    el.innerHTML = `<span>${esc(msg)}</span>${undo ? `<button class="toast-btn" data-act="toast-undo">Annuler</button>` : ""}`;
    el.className = `toast show ${tone}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.className = "toast"; toastUndo = null; }, undo ? 6000 : 3200);
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
  const ext = (url, label) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}${icon("external")}</a>`;

  function currentMonthLabel() {
    const cur = planMonth();
    if (cur === 0) return `Démarrage le <strong>${fmtDay(startDate())}</strong>`;
    if (cur > 24) return "Les 24 mois sont écoulés";
    return `Mois en cours : <strong>mois ${cur}</strong> (${fmtM(monthDate(cur))})`;
  }

  /* ───────────── Vue : Par où commencer (accueil) ───────────── */

  function viewStart() {
    const steps = nextSteps(3);
    const [first, ...then] = steps;
    const currentId = first ? first.a.id : null;
    const g = globalStats();
    const week = phaseActions("s0");
    const weekDone = week.filter((a) => progressOf(a).status === "done").length;

    const hero = first
      ? `<section class="card hero">
          <p class="eyebrow">Prochaine étape</p>
          <h2>${esc(first.it.text)}</h2>
          <p class="hero-parent">Fait partie de la grande étape <button class="link-btn" data-act="focus-action" data-id="${first.a.id}">${esc(first.a.title)}</button></p>
          <div class="hero-meta">
            <span class="muted">${esc(PHASE_BY_ID[first.a.phase].name)}</span>
            <span class="hero-pos">Petite étape ${first.pos} sur ${first.p.total}</span>
            <span class="hero-bar">${progressBar(Math.round((first.p.done / first.p.total) * 100), "Avancement de la grande étape")}</span>
          </div>
          <details class="hero-how">
            <summary>Comment faire</summary>
            <ol class="how">${first.a.how.map((h) => `<li>${esc(h)}</li>`).join("")}</ol>
            ${first.a.resources.length ? `<ul class="res">${first.a.resources.map((r) => `<li>${ext(r.url, r.label)}</li>`).join("")}</ul>` : ""}
          </details>
          <div class="hero-actions">
            <button class="btn btn-primary" data-act="check-next" data-id="${first.a.id}" data-key="${first.it.key}">${icon("check")}C'est fait</button>
            <button class="btn" data-act="skip-next" data-id="${first.a.id}" data-key="${first.it.key}" title="Pour une étape qui ne te concerne pas">${icon("skip")}Passer</button>
            <button class="btn btn-ghost" data-act="open-action" data-id="${first.a.id}">Notes et détails</button>
          </div>
          ${then.length ? `<div class="hero-then">
            <p class="eyebrow">Ensuite</p>
            <ul class="then">${then.map((s) => `<li><label><input type="checkbox" data-act="toggle-item" data-id="${s.a.id}" data-key="${s.it.key}"><span>${esc(s.it.text)}</span></label><span class="muted small">${esc(s.a.title)}</span></li>`).join("")}</ul>
          </div>` : ""}
        </section>`
      : `<section class="card hero"><p class="eyebrow">Bravo</p><h2>Tout le parcours est fait.</h2><p class="hero-why">Prochaine marche : l'OSCP+, financée par ton employeur, et un poste en équipe sécurité.</p></section>`;

    const weekBox = `<section class="card">
      <div class="card-head"><h2>Tes 5 actions de cette semaine</h2><span class="count">${weekDone}/${week.length}</span></div>
      ${progressBar(Math.round((weekDone / week.length) * 100), "Actions de la semaine")}
      <ul class="mini-rows">${week.map((a) => {
        const p = progressOf(a);
        return `<li><button class="mini-row s-${p.status}" data-act="focus-action" data-id="${a.id}">${statusIcon(p.status)}<span class="mini-title">${esc(a.title)}</span><span class="muted small">${p.done}/${p.total}</span></button></li>`;
      }).join("")}</ul>
    </section>`;

    return `
      <section class="page-head">
        <div>
          <h1>Par où commencer</h1>
          <p class="lede">Ta prochaine étape, puis tout ton parcours, grande étape par grande étape. ${currentMonthLabel()}.</p>
        </div>
      </section>

      <div class="grid-2 grid-hero">${hero}${weekBox}</div>

      <section class="section">
        <div class="section-head section-head-row">
          <div>
            <h2>Ton parcours</h2>
            <p class="muted">Ouvre une grande étape pour voir ses petites étapes. Coche-les au fur et à mesure, ou passe celles qui ne te concernent pas.</p>
          </div>
          <div class="path-progress"><span><strong>${g.done}</strong> / ${g.total} petites étapes</span>${progressBar(g.pct, "Progression du parcours")}</div>
        </div>
        ${PHASES.map((ph) => phaseBlock(ph, currentId, first)).join("")}
      </section>`;
  }

  function phaseBlock(ph, currentId, first) {
    const acts = phaseActions(ph.id);
    const progs = acts.map((a) => progressOf(a));
    const done = progs.filter((p) => p.status === "done").length;
    const pct = Math.round((done / acts.length) * 100);
    const open = ui.phaseOpen[ph.id] ?? (done < acts.length || acts.some((a) => a.id === currentId));
    const cur = planMonth();
    return `<section class="group${open ? "" : " collapsed"}" id="ph-${ph.id}">
      <header class="group-head">
        <button class="group-toggle" data-act="toggle-phase" data-id="${ph.id}" aria-expanded="${open}" data-fk="ph-${ph.id}">
          ${icon("chevron", "chev")}
          <span><span class="group-title">${esc(ph.name)}</span><span class="group-period">${esc(phasePeriod(ph))}</span></span>
        </button>
        <div class="group-progress"><span>${done}/${acts.length}</span>${progressBar(pct, `Progression ${ph.name}`)}</div>
      </header>
      ${open ? `<p class="group-desc">${esc(ph.desc)}</p>
      <ul class="rows acc">${acts.map((a, i) => {
        const p = progs[i];
        const isOpen = ui.open[a.id] ?? a.id === currentId;
        const late = isLate(a, p.status, cur);
        const nextKey = first && first.a.id === a.id ? first.it.key : null;
        return `<li class="acc-item s-${p.status}${isOpen ? " open" : ""}" id="a-${a.id}">
          <button class="acc-head" data-act="toggle-action" data-id="${a.id}" aria-expanded="${isOpen}" data-fk="acc-${a.id}">
            ${statusIcon(p.status)}
            <span class="acc-text"><span class="row-title">${esc(a.title)}</span>${rowMeta(a, p)}</span>
            <span class="row-badges">${a.id === currentId ? `<span class="badge badge-now">Maintenant</span>` : ""}${late ? `<span class="badge badge-late">${icon("clock")}En retard</span>` : ""}${prioBadge(a.priority)}</span>
            ${icon("chevron", "chev")}
          </button>
          ${isOpen ? `<div class="acc-body">
            ${checklistHTML(a, p, nextKey, "acc")}
            <div class="acc-foot"><button class="link-btn" data-act="open-action" data-id="${a.id}">Comment faire, ressources, notes et travaux ${icon("arrow")}</button></div>
          </div>` : ""}
        </li>`;
      }).join("")}</ul>` : ""}
    </section>`;
  }

  function focusAction(id) {
    const a = ACTION_BY_ID[id];
    if (!a) return;
    if (route().page !== "start") {
      pendingFocus = id;
      location.hash = "#/commencer";
      return;
    }
    ui.open[id] = true;
    ui.phaseOpen[a.phase] = true;
    saveUI();
    render();
    const el = document.getElementById(`a-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("flash");
      setTimeout(() => el.classList.remove("flash"), 1200);
    }
  }
  let pendingFocus = null;

  /* ───────────── Vue : Feuille de route (vue générale) ───────────── */

  const ROADMAP_TABS = [
    ["etapes", "Grandes étapes"],
    ["fondamentaux", "Fondamentaux"],
    ["sites", "Sites"],
    ["certifications", "Certifications"],
  ];

  function viewRoadmap(tab) {
    const body = { etapes: viewStages, fondamentaux: viewFundamentals, sites: viewSites, certifications: viewCerts }[tab]();
    return `
      <section class="page-head">
        <div>
          <h1>Feuille de route</h1>
          <p class="lede">La vue d'ensemble de la cyber : les grandes étapes sur 24 mois, les fondamentaux, les meilleurs sites et les certifications.</p>
        </div>
      </section>
      <nav class="tabs tabs-wide" role="tablist" aria-label="Sections de la feuille de route">
        ${ROADMAP_TABS.map(([id, label]) => `<a role="tab" href="#/feuille-de-route/${id}" aria-selected="${tab === id}">${label}</a>`).join("")}
      </nav>
      ${body}`;
  }

  function viewStages() {
    const cur = Math.min(Math.max(planMonth(), 0), 24);
    // Les phases se touchent sans se chevaucher : chacune commence où la précédente finit.
    let prevTo = 0;
    const segs = PHASES.filter((p) => p.id !== "s0").map((p) => {
      const [x, y] = phaseRange(p);
      const acts = phaseActions(p.id);
      const done = acts.filter((a) => progressOf(a).status === "done").length;
      const from = Math.max(Math.max(x, 1) - 1, prevTo);
      prevTo = y;
      return { p, from, to: y, done, n: acts.length };
    });
    const timeline = `<div class="timeline" aria-label="Frise des 24 mois">
      <div class="tl-track">
        ${segs.map((s) => `<div class="tl-seg" style="left:${(s.from / 24) * 100}%;width:${((s.to - s.from) / 24) * 100}%">
          <span class="tl-name" title="${esc(s.p.name)}">${esc(s.p.short)}</span>
          <span class="tl-sub">${esc(s.p.period)} · ${s.done}/${s.n}</span>
        </div>`).join("")}
        <div class="tl-marker" style="left:${(Math.max(cur - 0.5, 0) / 24) * 100}%"><span>Tu es ici</span></div>
      </div>
      <div class="tl-scale"><span>${fmtM(monthDate(1))}</span><span>Mois 6</span><span>Mois 12</span><span>Mois 18</span><span>${fmtM(monthDate(24))}</span></div>
    </div>`;

    return `${timeline}
      ${PHASES.map((ph) => {
        const acts = phaseActions(ph.id);
        const progs = acts.map((a) => progressOf(a));
        const done = progs.filter((p) => p.status === "done").length;
        return `<section class="group">
          <header class="group-head">
            <div class="group-toggle static"><span><span class="group-title">${esc(ph.name)}</span><span class="group-period">${esc(phasePeriod(ph))}</span></span></div>
            <div class="group-progress"><span>${done}/${acts.length}</span>${progressBar(Math.round((done / acts.length) * 100), `Progression ${ph.name}`)}</div>
          </header>
          <p class="group-desc">${esc(ph.desc)}</p>
          <ul class="rows">${acts.map((a, i) => {
            const p = progs[i];
            return `<li class="row s-${p.status}">
              <span class="row-ic">${statusIcon(p.status)}</span>
              <button class="row-main" data-act="open-action" data-id="${a.id}">
                <span class="row-title">${esc(a.title)}</span>
                ${rowMeta(a, p)}
              </button>
              <span class="row-badges">${prioBadge(a.priority)}</span>
            </li>`;
          }).join("")}</ul>
          <p class="group-goal"><strong>Objectif de fin de phase :</strong> ${esc(ph.goal)}</p>
        </section>`;
      }).join("")}`;
  }

  function viewFundamentals() {
    return `<section class="group">
      <header class="group-head">
        <div class="group-toggle static"><span><span class="group-title">Les 9 fondamentaux, dans l'ordre</span><span class="group-period">Chaque brique sert la suivante</span></span></div>
        <div class="group-progress"><span>${FUNDAMENTALS.filter((f) => progressOf(ACTION_BY_ID[f.action]).status === "done").length}/${FUNDAMENTALS.length}</span>${progressBar(Math.round((FUNDAMENTALS.filter((f) => progressOf(ACTION_BY_ID[f.action]).status === "done").length / FUNDAMENTALS.length) * 100))}</div>
      </header>
      <p class="group-desc">Les débutants qui plafonnent ont souvent sauté le réseau ou l'AD pour aller directement aux outils d'attaque. L'ordre n'est pas une file stricte : Linux et réseau avancent en parallèle, et tu pratiques déjà Windows/AD au travail.</p>
      <ul class="rows">${FUNDAMENTALS.map((f) => {
        const p = progressOf(ACTION_BY_ID[f.action]);
        return `<li class="row fund-row s-${p.status}">
          <span class="step-n">${f.n}</span>
          <button class="row-main" data-act="open-action" data-id="${f.action}">
            <span class="row-title">${esc(f.name)} <span class="muted fund-detail">${esc(f.detail)}</span></span>
            <span class="fund-lines"><span><strong>Pourquoi :</strong> ${esc(f.why)}</span><span><strong>Objectif :</strong> ${esc(f.goal)}</span></span>
          </button>
          <span class="row-badges"><span class="step-status s-${p.status}">${statusIcon(p.status)}${STATUS[p.status]}</span></span>
        </li>`;
      }).join("")}</ul>
      <p class="group-goal"><strong>Règle d'or :</strong> 30 % de théorie, 70 % de pratique, et une note écrite avec tes propres mots à la fin de chaque notion. Tu as une base solide quand tu sais expliquer sans notes ce qui se passe quand tu tapes une adresse dans ton navigateur (DNS, TCP, HTTP, TLS).</p>
    </section>`;
  }

  function viewSites() {
    return `<p class="intro muted">Presque tout est gratuit : le seul abonnement à payer la première année est TryHackMe. Les sites marqués « Ajouté » ne viennent pas de ton document.</p>
      ${SITE_GROUPS.map((g) => {
        const list = SITES.filter((s) => s.group === g.id);
        return `<section class="group">
          <header class="group-head"><div class="group-toggle static"><span><span class="group-title">${esc(g.name)}</span><span class="group-period">${esc(g.desc)}</span></span></div><span class="count">${list.length}</span></header>
          <ul class="rows">${list.map((s) => `<li class="row site-row">
            <div class="row-main static">
              <span class="row-title">${ext(s.url, s.name)}${s.doc ? "" : ` <span class="badge badge-soft">Ajouté</span>`}</span>
              <span class="site-what">${esc(s.what)}</span>
              <span class="row-meta"><span class="theme-tag">${esc(s.lang)}</span><span>${esc(s.price)}</span><span>${icon("clock")} ${esc(s.when)}</span></span>
            </div>
          </li>`).join("")}</ul>
        </section>`;
      }).join("")}`;
  }

  function viewCerts() {
    return `<div class="callout callout-info">Paie de ta poche <strong>une seule</strong> certification pratique en 24 mois (eJPT ou BTL1) et fais financer le reste. Clique sur une certification pour voir le prix, où la passer et les modalités. Infos vérifiées le ${CHECKED_ON} : les prix changent souvent, vérifie toujours sur le site officiel avant d'acheter.</div>
      ${CERT_GROUPS.map((g) => {
        const list = CERTS.filter((c) => c.group === g.id);
        return `<section class="group">
          <header class="group-head"><div class="group-toggle static"><span><span class="group-title">${esc(g.name)}</span><span class="group-period">${esc(g.desc)}</span></span></div><span class="count">${list.length}</span></header>
          <ul class="rows">${list.map((c) => `<li class="row cert-row">
            <span class="row-ic cert-ic">${icon("award")}</span>
            <button class="row-main" data-act="open-cert" data-id="${c.id}">
              <span class="row-title">${esc(c.name)} <span class="muted fund-detail">${esc(c.full)}</span></span>
              <span class="site-what">${esc(c.summary)}</span>
              <span class="row-meta"><span class="theme-tag">${esc(c.org)}</span><span><strong>${esc(c.priceShort)}</strong></span><span>${icon("clock")} ${esc(c.when)}</span></span>
            </button>
            <span class="row-badges"><span class="badge cert-tag tag-${norm(c.tag).replace(/[^a-z]+/g, "-")}">${esc(c.tag)}</span>${icon("chevron", "chev-r")}</span>
          </li>`).join("")}</ul>
        </section>`;
      }).join("")}`;
  }

  function openCert(id) {
    const c = CERT_BY_ID[id];
    if (!c) return;
    const linked = c.action ? ACTION_BY_ID[c.action] : null;
    openModal("cert", `
      <header class="modal-head">
        <div>
          <p class="eyebrow">${esc(c.org)} · ${esc(c.level)}</p>
          <h2>${esc(c.name)}</h2>
          <p class="muted small">${esc(c.full)}</p>
        </div>
        <button class="icon-btn" data-act="close-modal" aria-label="Fermer">${icon("x")}</button>
      </header>
      <div class="modal-body">
        <p>${esc(c.summary)}</p>
        <div class="facts">
          <div><span class="fact-label">Prix</span><span class="fact-value">${esc(c.price)}</span></div>
          <div><span class="fact-label">Quand</span><span class="fact-value">${esc(c.when)}</span></div>
          <div><span class="fact-label">Statut</span><span class="fact-value">${esc(c.tag)}</span></div>
        </div>
        <dl class="details">${c.rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        <div class="btn-row">
          ${c.links.map(([label, url]) => `<a class="btn" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}${icon("external")}</a>`).join("")}
          ${linked ? `<button class="btn btn-ghost" data-act="open-action" data-id="${linked.id}">Étape liée : ${esc(linked.title)}</button>` : ""}
        </div>
        <p class="muted small">Infos vérifiées le ${CHECKED_ON}. Les prix et les modalités changent souvent : vérifie toujours sur le site officiel avant d'acheter.</p>
      </div>`);
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
    const text = MD.plain(w.content);
    const nL = (w.links || []).length, nF = (w.files || []).length, nA = (w.actionIds || []).filter((x) => ACTION_BY_ID[x]).length;
    return `<button class="work-card" data-act="open-work" data-id="${w.id}" data-fk="w-${w.id}">
      <span class="work-top"><span class="chip">${esc(w.category || "Autre")}</span><span class="muted small">${w.date ? fmtDay(parseDate(w.date)) : ""}</span></span>
      <span class="work-title">${esc(w.title)}</span>
      ${text ? `<span class="work-excerpt">${esc(text.slice(0, 180))}${text.length > 180 ? "…" : ""}</span>` : ""}
      <span class="work-meta">
        ${nL ? `<span>${icon("link")}${nL} lien${nL > 1 ? "s" : ""}</span>` : ""}
        ${nF ? `<span>${icon("file")}${nF} fichier${nF > 1 ? "s" : ""}</span>` : ""}
        ${nA ? `<span>${icon("check")}${nA} étape${nA > 1 ? "s" : ""}</span>` : ""}
      </span>
    </button>`;
  }

  function selectHTML(name, value, options, placeholder) {
    return `<select data-works="${name}" aria-label="${esc(placeholder)}">
      <option value="">${esc(placeholder)}</option>
      ${options.map(([v, l]) => `<option value="${esc(v)}"${v === value ? " selected" : ""}>${esc(l)}</option>`).join("")}
    </select>`;
  }

  function worksBody() {
    const total = allWorks().length;
    const list = filteredWorks();
    return !total
      ? `<div class="empty empty-big">
          <h2>Ton espace de travail est vide</h2>
          <p>Range ici tes notes de cours, write-ups, scripts, documentation de lab, attestations de certification… Chaque travail peut contenir du texte, des liens et des fichiers, et être relié à une grande étape de ton parcours.</p>
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
          <p class="lede">Tes notes, liens et fichiers, reliés aux étapes de ton parcours. C'est aussi la base de ton futur portfolio.</p>
        </div>
        <button class="btn btn-primary" data-act="new-work">${icon("plus")}Nouveau travail</button>
      </section>
      ${total ? `<section class="filters" aria-label="Filtres des travaux">
        <label class="search">${icon("search")}<input type="search" data-works="q" value="${esc(f.q)}" placeholder="Rechercher dans tes travaux…" aria-label="Rechercher"></label>
        ${selectHTML("category", f.category, WORK_CATEGORIES.map((c) => [c, c]), "Toutes les catégories")}
        ${selectHTML("has", f.has, [["notes", "Avec notes"], ["links", "Avec liens"], ["files", "Avec fichiers"]], "Tout le contenu")}
        <select data-works="sort" aria-label="Trier">
          <option value="recent"${f.sort === "recent" ? " selected" : ""}>Plus récents</option>
          <option value="old"${f.sort === "old" ? " selected" : ""}>Plus anciens</option>
          <option value="title"${f.sort === "title" ? " selected" : ""}>Par titre</option>
        </select>
      </section>` : ""}
      <div id="works-list">${worksBody()}</div>
      <p class="storage-note muted small">${icon("alert")}Tes travaux et fichiers sont enregistrés uniquement dans ce navigateur. <span id="storage-usage"></span> Exporte une sauvegarde régulièrement depuis les <button class="link-btn" data-act="open-settings">réglages</button>.</p>`;
  }

  /* ───────────── Panneau latéral : détail d'une grande étape ───────────── */

  let drawerId = null;

  function openAction(id) {
    if (!ACTION_BY_ID[id]) return;
    if (modal.open && modalMode !== "work-edit") modal.close();
    drawerId = id;
    renderDrawer();
    if (!drawer.open) drawer.showModal();
    $(".drawer-body", drawer).scrollTop = 0;
  }

  function renderDrawer() {
    const a = ACTION_BY_ID[drawerId];
    if (!a) return;
    const p = progressOf(a);
    const late = isLate(a, p.status, planMonth());
    const steps = nextSteps(1);
    const nextKey = steps[0] && steps[0].a.id === a.id ? steps[0].it.key : null;
    const works = worksFor(a.id);
    const others = allWorks().filter((w) => !(w.actionIds || []).includes(a.id)).sort((x, y) => x.title.localeCompare(y.title, "fr"));
    const certs = [a.cert, ...(a.certs || [])].filter(Boolean).map((c) => CERT_BY_ID[c]).filter(Boolean);
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
        <div class="badges">
          <span class="step-status s-${p.status}">${statusIcon(p.status)}${STATUS[p.status]}</span>
          ${prioBadge(a.priority)}<span class="theme-tag">${esc(a.theme)}</span>
          <span class="badge badge-soft">${icon("clock")}${esc(periodLabel(a))}</span>
          ${late ? `<span class="badge badge-late">En retard</span>` : ""}
        </div>

        <section class="d-section">
          <h3>Petites étapes <span class="count">${p.done}/${p.total}</span></h3>
          ${checklistHTML(a, p, nextKey, "drw")}
        </section>

        <section class="d-section"><h3>Pourquoi</h3><p>${esc(a.why)}</p></section>
        <section class="d-section"><h3>Comment faire</h3><ol class="how">${a.how.map((h) => `<li>${esc(h)}</li>`).join("")}</ol></section>
        ${a.resources.length ? `<section class="d-section"><h3>Ressources</h3><ul class="res">${a.resources.map((r) => `<li>${ext(r.url, r.label)}</li>`).join("")}</ul></section>` : ""}
        ${certs.length ? `<section class="d-section"><h3>Certifications</h3><ul class="res">${certs.map((c) => `<li><button class="cert-chip" data-act="open-cert" data-id="${c.id}">${icon("award")}${esc(c.name)} · ${esc(c.priceShort)}</button></li>`).join("")}</ul></section>` : ""}

        <section class="d-section">
          <h3>Mes notes <span class="saved" id="notes-saved" aria-live="polite"></span></h3>
          <textarea class="notes" data-act="notes" rows="5" placeholder="Ce que tu as appris, tes difficultés, tes idées… (Markdown accepté)">${esc(p.st.notes)}</textarea>
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

  /* ───────────── Fenêtre : certifications, travaux, réglages ───────────── */

  let modalMode = null;
  let ed = null; // brouillon du travail en cours d'édition

  function openModal(mode, html) {
    modalMode = mode;
    modal.innerHTML = html;
    modal.className = `modal modal-${mode}`;
    if (!modal.open) modal.showModal();
    const body = $(".modal-body", modal);
    if (body) body.scrollTop = 0;
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
        ${links.length ? `<section class="d-section"><h3>Liens</h3><ul class="res">${links.map((l) => `<li>${ext(l.url, l.label || l.url)}</li>`).join("")}</ul></section>` : ""}
        ${(w.files || []).length ? `<section class="d-section"><h3>Fichiers</h3><ul class="files">${w.files.map((f) => `<li><span class="file-name">${icon("file")}${esc(f.name)}</span><span class="muted small">${fmtSize(f.size)}</span><span class="file-actions"><button class="btn btn-sm" data-act="file-open" data-fid="${f.id}">${icon("external")}Ouvrir</button><button class="btn btn-sm" data-act="file-download" data-fid="${f.id}">${icon("download")}Télécharger</button></span></li>`).join("")}</ul></section>` : ""}
        ${acts.length ? `<section class="d-section"><h3>Étapes liées</h3><ul class="linked">${acts.map((a) => `<li><button class="link-btn" data-act="open-action" data-id="${a.id}">${statusIcon(progressOf(a).status)}${esc(a.title)}</button></li>`).join("")}</ul></section>` : ""}
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
      const opts = phaseActions(p.id).filter((a) => !ed.actionIds.includes(a.id));
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
            <legend>Étapes liées</legend>
            ${acts.length ? `<div class="chips">${acts.map((a) => `<span class="chip chip-x">${esc(a.title)}<button type="button" data-act="ed-del-action" data-id="${a.id}" aria-label="Délier ${esc(a.title)}">${icon("x")}</button></span>`).join("")}</div>` : ""}
            <select data-act="ed-add-action" aria-label="Lier une grande étape"><option value="">Lier une grande étape de ton parcours…</option>${options}</select>
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
          <p>Tes données (étapes cochées, notes, travaux et fichiers) sont enregistrées <strong>uniquement dans ce navigateur, sur cet appareil</strong>. Si tu effaces les données du navigateur, elles disparaissent.</p>
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
    if (page === "feuille-de-route") {
      return { page: "roadmap", tab: ROADMAP_TABS.some(([id]) => id === sub) ? sub : "etapes" };
    }
    if (page === "travaux") return { page: "works" };
    return { page: "start" };
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
    const g = globalStats();
    $("#header-progress").innerHTML = `<span class="hp-label">${g.pct} %</span>${progressBar(g.pct, "Progression du parcours")}`;
    $("#header-progress").title = `${g.done} petites étapes faites sur ${g.total}`;
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
    if (r.page === "roadmap") main.innerHTML = viewRoadmap(r.tab);
    else if (r.page === "works") { main.innerHTML = viewWorks(); showStorageUsage("#storage-usage"); }
    else main.innerHTML = viewStart();
    if (drawer.open) renderDrawer();
    if (fk) {
      const el = document.querySelector(`[data-fk="${CSS.escape(fk)}"]`);
      if (el) el.focus({ preventScroll: true });
    }
  }

  /* Cocher « C'est fait » depuis la prochaine étape, avec annulation possible. */
  function checkWithUndo(id, key) {
    const it = progressOf(ACTION_BY_ID[id]).items.find((x) => x.key === key);
    setItem(id, key, true);
    const p = progressOf(ACTION_BY_ID[id]);
    const msg = p.status === "done" ? `Grande étape terminée : ${ACTION_BY_ID[id].title}` : `Fait : ${it ? it.text : ""}`;
    toast(msg, p.status === "done" ? "success" : "", () => setItem(id, key, false));
  }

  /* ───────────── Événements ───────────── */

  document.addEventListener("click", async (e) => {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const act = el.dataset.act;
    const id = el.dataset.id;

    switch (act) {
      case "check-next": checkWithUndo(id, el.dataset.key); break;
      case "skip-next":
        setSkip(id, el.dataset.key, true);
        toast("Étape passée.", "", () => setSkip(id, el.dataset.key, false));
        break;
      case "skip-item": setSkip(id, el.dataset.key, el.dataset.v === "1"); break;
      case "del-custom": {
        const cid = el.dataset.key.slice(2);
        Store.updateAction(id, (a) => { a.custom = a.custom.filter((c) => c.id !== cid); });
        break;
      }
      case "toast-undo":
        if (toastUndo) toastUndo();
        toastUndo = null;
        $("#toast").className = "toast";
        break;
      case "toggle-action": {
        const isOpen = el.getAttribute("aria-expanded") === "true";
        ui.open[id] = !isOpen;
        saveUI();
        render();
        break;
      }
      case "toggle-phase": {
        const isOpen = el.getAttribute("aria-expanded") === "true";
        ui.phaseOpen[id] = !isOpen;
        saveUI();
        render();
        break;
      }
      case "focus-action": focusAction(id); break;
      case "open-action": openAction(id); break;
      case "open-cert": openCert(id); break;
      case "close-drawer": drawer.close(); break;
      case "unlink-work": {
        const w = Store.state.works[id];
        Store.setWorkActions(id, (w.actionIds || []).filter((x) => x !== drawerId));
        break;
      }
      case "new-work": startEdit(null, el.dataset.action || null); break;
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
      case "toggle-item": {
        const a = ACTION_BY_ID[el.dataset.id];
        setItem(a.id, el.dataset.key, el.checked);
        if (el.checked && progressOf(a).status === "done") toast(`Grande étape terminée : ${a.title}`, "success");
        break;
      }
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
          migrate();
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
      const id = form.dataset.id;
      if (!text) return;
      Store.updateAction(id, (a) => { a.custom = [...a.custom, { id: Store.uid(), text, done: false }]; });
      const scope = drawer.open ? "drw" : "acc";
      const input = document.querySelector(`[data-fk="${scope}-add-${CSS.escape(id)}"]`);
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
    if (pendingFocus) {
      const id = pendingFocus;
      pendingFocus = null;
      focusAction(id);
    } else {
      window.scrollTo(0, 0);
    }
  });
  window.addEventListener("storage", (e) => { if (e.key === "cyberroadmap:v1") location.reload(); });

  /*
   * Version 2 : le statut d'une grande étape se déduit de ses petites étapes.
   * Une étape marquée « Fait » à la main dans la version 1 voit ses petites étapes cochées.
   */
  function migrate() {
    if (Store.state.settings.v2) return;
    for (const a of ACTIONS) {
      const st = Store.state.actions[a.id];
      if (st && st.status === "done" && !Object.values(st.sub || {}).some(Boolean)) {
        Store.updateAction(a.id, (x) => { a.subtasks.forEach((_, i) => { x.sub[i] = true; }); }, true);
      }
    }
    Store.setSetting("v2", true);
  }

  Store.subscribe(render);
  migrate();
  applyTheme();
  render();
})();

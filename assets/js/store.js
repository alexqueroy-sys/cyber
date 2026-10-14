"use strict";
/*
 * Stockage local : l'état (statuts, notes, travaux) dans localStorage,
 * les fichiers dans IndexedDB. Rien ne quitte le navigateur.
 *
 * Pour passer à Cloudflare plus tard, c'est ce fichier qu'on remplacera
 * par des appels à une API : le reste du site n'y touche qu'à travers Store et Files.
 */

const Files = (() => {
  const DB = "cyberroadmap-files";
  const STORE = "files";
  let dbPromise = null;

  function open() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id" });
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    return dbPromise;
  }

  async function run(mode, fn) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const req = fn(tx.objectStore(STORE));
      tx.oncomplete = () => resolve(req ? req.result : undefined);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  return {
    put: (rec) => run("readwrite", (s) => s.put(rec)),
    get: (id) => run("readonly", (s) => s.get(id)),
    remove: (id) => run("readwrite", (s) => s.delete(id)),
    all: () => run("readonly", (s) => s.getAll()),
    clear: () => run("readwrite", (s) => s.clear()),
  };
})();

const Store = (() => {
  const KEY = "cyberroadmap:v1";
  const listeners = new Set();

  const blank = () => ({
    version: 1,
    settings: { startDate: DEFAULT_START, theme: "auto", lastExport: null },
    actions: {},
    works: {},
  });

  function normalize(s) {
    const b = blank();
    return {
      ...b,
      ...s,
      settings: { ...b.settings, ...(s && s.settings) },
      actions: (s && s.actions) || {},
      works: (s && s.works) || {},
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return normalize(JSON.parse(raw));
    } catch (e) {
      console.warn("Lecture de la sauvegarde locale impossible :", e);
    }
    return blank();
  }

  let state = load();
  let lastError = null;

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      lastError = null;
    } catch (e) {
      lastError = e;
      console.warn("Enregistrement impossible :", e);
    }
  }

  /* silent : enregistre sans redessiner la page (saisie de notes). */
  function commit(silent = false) {
    persist();
    if (!silent) listeners.forEach((fn) => fn());
  }

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const defaultAction = () => ({ status: "todo", notes: "", sub: {}, custom: [], updatedAt: null, doneAt: null });

  function action(id) {
    return { ...defaultAction(), ...(state.actions[id] || {}) };
  }

  function updateAction(id, fn, silent = false) {
    const a = action(id);
    const before = a.status;
    fn(a);
    if (a.status !== before) a.doneAt = a.status === "done" ? Date.now() : null;
    a.updatedAt = Date.now();
    state.actions[id] = a;
    commit(silent);
  }

  function saveWork(work) {
    const now = Date.now();
    const w = { ...work, id: work.id || uid(), updatedAt: now, createdAt: work.createdAt || now };
    state.works[w.id] = w;
    commit();
    return w;
  }

  async function deleteWork(id) {
    const w = state.works[id];
    if (!w) return;
    for (const f of w.files || []) {
      try { await Files.remove(f.id); } catch (e) { console.warn(e); }
    }
    delete state.works[id];
    commit();
  }

  function setWorkActions(workId, actionIds) {
    const w = state.works[workId];
    if (!w) return;
    w.actionIds = [...new Set(actionIds)];
    w.updatedAt = Date.now();
    commit();
  }

  function setSetting(key, value) {
    state.settings[key] = value;
    commit();
  }

  /* ───── Sauvegarde : export / import ───── */

  const blobToDataURL = (blob) =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(blob);
    });

  function dataURLToBlob(url) {
    const [head, b64] = url.split(",");
    const type = (head.match(/^data:([^;]+)/) || [])[1] || "application/octet-stream";
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type });
  }

  async function exportAll() {
    const files = [];
    for (const f of await Files.all()) {
      files.push({ id: f.id, name: f.name, type: f.type, size: f.size, data: await blobToDataURL(f.blob) });
    }
    state.settings.lastExport = Date.now();
    commit();
    return {
      app: "feuille-de-route-cyber",
      format: 1,
      exportedAt: new Date().toISOString(),
      state,
      files,
    };
  }

  async function importAll(data) {
    if (!data || data.app !== "feuille-de-route-cyber" || !data.state) {
      throw new Error("Ce fichier n'est pas une sauvegarde de ce site.");
    }
    await Files.clear();
    for (const f of data.files || []) {
      await Files.put({ id: f.id, name: f.name, type: f.type, size: f.size, blob: dataURLToBlob(f.data) });
    }
    state = normalize(data.state);
    commit();
  }

  async function reset() {
    await Files.clear();
    state = blank();
    commit();
  }

  return {
    get state() { return state; },
    get lastError() { return lastError; },
    subscribe: (fn) => listeners.add(fn),
    uid,
    action,
    updateAction,
    saveWork,
    deleteWork,
    setWorkActions,
    setSetting,
    exportAll,
    importAll,
    reset,
  };
})();

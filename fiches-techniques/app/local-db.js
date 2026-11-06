/*
 * local-db.js — remplace le runtime Claude (window.claude.use('db')) par une
 * base locale dans le navigateur (localStorage), pour ouvrir l'appli hors de claude.ai.
 *
 * L'appli n'utilise que ce sous-ensemble d'API (style Firestore) :
 *   db.collection(name).onSnapshot(cb, errCb)   -> cb({docs:[{id, data()}], metadata:{fromCache}})
 *   db.doc('coll/id').set(obj) / .update(partial) / .delete()   -> Promise
 *
 * C'est ce contrat que le backend BalaBala doit reproduire (API REST + temps réel, ou Firestore).
 * Données de départ : window.BALABALA_SEED = { recipes: {id: {...}}, daily: {id: {...}} }
 */
(function () {
  const KEY = 'balabala-local-db-v1';
  const listeners = {};
  let store;
  try { store = JSON.parse(localStorage.getItem(KEY)); } catch (e) { store = null; }
  if (!store) store = JSON.parse(JSON.stringify(window.BALABALA_SEED || { recipes: {}, daily: {} }));
  store.recipes = store.recipes || {};
  store.daily = store.daily || {};

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} };
  const snap = (c) => ({
    docs: Object.entries(store[c] || {}).map(([id, v]) => ({ id, data: () => JSON.parse(JSON.stringify(v)) })),
    metadata: { fromCache: false },
  });
  const emit = (c) => (listeners[c] || []).forEach((cb) => cb(snap(c)));
  const split = (p) => { const [c, id] = p.split('/'); store[c] = store[c] || {}; return [c, id]; };

  const db = {
    collection(c) {
      return {
        onSnapshot(cb) {
          (listeners[c] = listeners[c] || []).push(cb);
          setTimeout(() => cb(snap(c)), 0);
          return () => { listeners[c] = listeners[c].filter((x) => x !== cb); };
        },
      };
    },
    doc(p) {
      const [c, id] = split(p);
      const done = () => { save(); emit(c); return Promise.resolve(); };
      return {
        set(v) { store[c][id] = JSON.parse(JSON.stringify(v)); return done(); },
        update(v) { store[c][id] = Object.assign({}, store[c][id], JSON.parse(JSON.stringify(v))); return done(); },
        delete() { delete store[c][id]; return done(); },
      };
    },
  };

  window.claude = window.claude || {};
  window.claude.use = async (name) => {
    if (name === 'db') return db;
    throw new Error('Capacité "' + name + '" non disponible en local'); // ex. 'assets' (photos)
  };
  window.BALABALA_RESET = () => { localStorage.removeItem(KEY); location.reload(); };
})();

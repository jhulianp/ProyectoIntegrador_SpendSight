/* =====================================================
   storage.js — Capa de datos con localStorage
   ===================================================== */

const KEYS = {
  gastos:     'ss_gastos',
  medios:     'ss_medios',
  categorias: 'ss_cats',
  comercios:  'ss_coms',
  usuarios:   'ss_usuarios',
  config:     'ss_config',
  pass:       'ss_pass',
  session:    'ss_session',
};

const db = {
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(KEYS[key])) || [];
    } catch {
      return [];
    }
  },
  set(key, value) {
    localStorage.setItem(KEYS[key], JSON.stringify(value));
  },
  getOne(key) {
    try {
      return JSON.parse(localStorage.getItem(KEYS[key])) || {};
    } catch {
      return {};
    }
  },
  setOne(key, value) {
    localStorage.setItem(KEYS[key], JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(KEYS[key]);
  },
  nextId(key) {
    const arr = db.get(key);
    if (!arr.length) return 1;
    return Math.max(...arr.map(x => x.id || 0)) + 1;
  },
  clearAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },
};

/* ── Session helpers ── */
const session = {
  get() {
    try { return JSON.parse(localStorage.getItem(KEYS.session)) || null; } catch { return null; }
  },
  set(data) {
    localStorage.setItem(KEYS.session, JSON.stringify(data));
  },
  clear() {
    localStorage.removeItem(KEYS.session);
  },
  isActive() {
    return !!session.get();
  },
};

/* ── Export data helper ── */
function exportData() {
  const data = {};
  Object.keys(KEYS).forEach(k => {
    data[k] = db.get(k);
  });
  data.config = db.getOne('config');
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `spendsight_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
}

/* ── Import data helper ── */
function importData(file, onSuccess) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.gastos)     db.set('gastos',     data.gastos);
      if (data.medios)     db.set('medios',      data.medios);
      if (data.categorias) db.set('categorias',  data.categorias);
      if (data.comercios)  db.set('comercios',   data.comercios);
      if (data.config)     db.setOne('config',   data.config);
      if (onSuccess) onSuccess();
    } catch {
      alert('Archivo invalido');
    }
  };
  reader.readAsText(file);
}

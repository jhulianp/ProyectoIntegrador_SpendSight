/* =====================================================
   utils.js — Helpers globales: formato, toast,
              confirm, modales, navegación
   ===================================================== */

/* ── Constants ── */
const MONTHS      = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const MONTHS_FULL = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const CAT_COLORS_PALETTE = [
  '#7c6aff','#f87171','#34d399','#fbbf24',
  '#60a5fa','#f472b6','#a78bfa','#6ee7b7',
  '#fb923c','#38bdf8','#4ade80','#e879f9',
];

const SWATCHES = [
  '#7c6aff','#f87171','#34d399','#fbbf24',
  '#60a5fa','#f472b6','#fb923c','#38bdf8',
  '#4ade80','#e879f9','#fff','#94a3b8',
];

const ICONS_LIST = [
  'F','C','G','M','R','T','L','E',
  'H','V','A','S','D','N','X','P',
];

const ICONS_LABELS = {
  F:'Comida', C:'Transporte', G:'Entretenimiento', M:'Salud',
  R:'Ropa', T:'Tecnologia', L:'Educacion', E:'Hogar',
  H:'Viajes', V:'Musica', A:'Deporte', S:'Mascotas',
  D:'Naturaleza', N:'Regalos', X:'Trabajo', P:'Otro',
};

const FRANQ_BADGE = {
  Visa:'badge-v', Mastercard:'badge-m', Amex:'badge-g',
  PSE:'badge-y', Nequi:'badge-p', Daviplata:'badge-p',
  Efectivo:'badge-acc', Otro:'badge-acc',
};

const CARD_CLS = {
  Visa:'wc-visa', Mastercard:'wc-mc', Amex:'wc-amex',
  PSE:'wc-gold', Nequi:'wc-gold', Daviplata:'wc-gold',
  Efectivo:'wc-dark', Otro:'wc-dark',
};

/* ── Format helpers ── */
function fmtCOP(n) {
  n = parseFloat(n) || 0;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString('es-CO')}`;
}

function fmtDate(s) {
  if (!s) return '—';
  try {
    return new Date(s + 'T12:00:00').toLocaleDateString('es-CO', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    return s;
  }
}

function fmtDateTime(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('es-CO', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

/* ── DOM helpers ── */
function val(id) {
  return (document.getElementById(id) || {}).value || '';
}

function setVal(id, v) {
  const el = document.getElementById(id);
  if (el) el.value = v ?? '';
}

function el(id) {
  return document.getElementById(id);
}

/* ── Toast ── */
function toast(msg, type = 'success') {
  const container = document.getElementById('toasts');
  if (!container) return;
  const labels = { success: 'OK', error: 'X', info: 'i', warn: '!' };
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `
    <span class="toast-icon">${labels[type] || 'i'}</span>
    <span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; }, 2600);
  setTimeout(() => { t.remove(); }, 3000);
}

/* ── Modal ── */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

// Close modal on backdrop click
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) m.classList.remove('open');
    });
  });
});

/* ── Confirm dialog ── */
let _confirmCb = null;

function confirm2(title, msg, cb) {
  el('confirm-title').textContent = title;
  el('confirm-msg').textContent   = msg;
  _confirmCb = cb;
  el('confirm-overlay').classList.add('open');
}

function closeConfirm() {
  el('confirm-overlay').classList.remove('open');
}

/* Called from HTML: onclick="confirmOk()" */
function confirmOk() {
  if (_confirmCb) _confirmCb();
  closeConfirm();
}

/* ── Detail panel ── */
function openDetail(html) {
  el('detail-panel').innerHTML = html;
  el('detail-overlay').classList.add('open');
}

function closeDetail(e) {
  if (e.target === el('detail-overlay')) {
    el('detail-overlay').classList.remove('open');
  }
}

function closeDetailPanel() {
  el('detail-overlay').classList.remove('open');
}

/* ── Navigation (SPA) ── */
const PAGE_TITLES = {
  dashboard:  'Dashboard',
  gastos:     'Gastos',
  medios:     'Medios de Pago',
  categorias: 'Categorias',
  comercios:  'Comercios',
  config:     'Mi Cuenta',
};

const PAGE_RENDERS = {};

function registerPage(id, renderFn) {
  PAGE_RENDERS[id] = renderFn;
}

function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const pageEl = document.getElementById('page-' + id);
  if (pageEl) pageEl.classList.add('active');
  if (btn) btn.classList.add('active');

  el('topbar-title').textContent = PAGE_TITLES[id] || id;

  if (PAGE_RENDERS[id]) PAGE_RENDERS[id]();
}

/* ── Clear form ── */
function clearForm(type) {
  const maps = {
    gasto: ['g-id','g-desc','g-valor','g-fecha','g-notas'],
    mp:    ['mp-id','mp-nombre','mp-numero','mp-titular'],
    cat:   ['cat-id','cat-nombre'],
    com:   ['com-id','com-nombre','com-nit','com-actividad','com-contacto','com-telefono','com-dir','com-ciudad'],
  };
  (maps[type] || []).forEach(id => setVal(id, ''));

  const titles = {
    gasto: 'Nuevo Gasto',
    mp:    'Nuevo Medio de Pago',
    cat:   'Nueva Categoria',
    com:   'Nuevo Comercio',
  };
  const titleMap = { gasto:'modal-gasto-title', mp:'modal-mp-title', cat:'modal-cat-title', com:'modal-com-title' };
  const titleEl = el(titleMap[type]);
  if (titleEl) titleEl.textContent = titles[type] || 'Nuevo';

  if (type === 'cat') {
    setVal('cat-color', '#7c6aff');
    setVal('cat-icono', 'F');
    if (typeof buildColorPicker === 'function') buildColorPicker();
    if (typeof buildIconPicker  === 'function') buildIconPicker();
  }
  if (type === 'mp') {
    setVal('mp-estado', 'Activo');
  }
  if (type === 'gasto') {
    setVal('g-estado', 'Activo');
    setVal('g-fecha', new Date().toISOString().split('T')[0]);
  }
  if (type === 'com') {
    setVal('com-pais', 'Colombia');
    setVal('com-tipo', 'Comercio');
  }
}

/* ── Seed data ── */
function seed() {
  if (!db.get('categorias').length) {
    db.set('categorias', [
      { id:1, nombre:'Comida',         icono:'F', color:'#f87171', tipo:'Gasto', estado:'Activo' },
      { id:2, nombre:'Transporte',     icono:'C', color:'#60a5fa', tipo:'Gasto', estado:'Activo' },
      { id:3, nombre:'Entretenimiento',icono:'G', color:'#a78bfa', tipo:'Gasto', estado:'Activo' },
      { id:4, nombre:'Salud',          icono:'M', color:'#34d399', tipo:'Gasto', estado:'Activo' },
      { id:5, nombre:'Ropa',           icono:'R', color:'#f472b6', tipo:'Gasto', estado:'Activo' },
      { id:6, nombre:'Tecnologia',     icono:'T', color:'#38bdf8', tipo:'Gasto', estado:'Activo' },
    ]);
  }
  if (!db.get('medios').length) {
    db.set('medios', [
      { id:1, nombre:'Bancolombia Visa',    franquicia:'Visa',       estado:'Activo', numero:'4231', titular:'Usuario SpendSight' },
      { id:2, nombre:'Davivienda Mastercard', franquicia:'Mastercard', estado:'Activo', numero:'8812', titular:'Usuario SpendSight' },
      { id:3, nombre:'Nequi',               franquicia:'Nequi',      estado:'Activo', numero:'****', titular:'Usuario SpendSight' },
    ]);
  }
  if (!db.get('comercios').length) {
    db.set('comercios', [
      { id:1, nombre:'Exito',   nit:'800.176.634-0', actividad:'Supermercado', tipo:'Comercio', ciudad:'Medellin',  pais:'Colombia', contacto:'info@exito.com' },
      { id:2, nombre:'Netflix', nit:'',              actividad:'Streaming',    tipo:'Servicio', ciudad:'Los Gatos', pais:'USA',      contacto:'support@netflix.com' },
      { id:3, nombre:'Uber',    nit:'',              actividad:'Transporte',   tipo:'Servicio', ciudad:'Medellin',  pais:'Colombia', contacto:'' },
    ]);
  }
  if (!db.get('gastos').length) {
    const now = new Date();
    const y   = now.getFullYear();
    const m   = String(now.getMonth() + 1).padStart(2, '0');
    const mp  = String(now.getMonth()).padStart(2, '0');
    db.set('gastos', [
      { id:1, descripcion:'Almuerzo ejecutivo',  fecha:`${y}-${m}-03`, valor:28000,  categoria:'Comida',          medioPago:3, comercio:1, estado:'Activo' },
      { id:2, descripcion:'Uber al trabajo',     fecha:`${y}-${m}-05`, valor:14500,  categoria:'Transporte',      medioPago:3, comercio:3, estado:'Activo' },
      { id:3, descripcion:'Netflix mensual',     fecha:`${y}-${m}-10`, valor:37900,  categoria:'Entretenimiento', medioPago:1, comercio:2, estado:'Activo' },
      { id:4, descripcion:'Mercado semanal',     fecha:`${y}-${m}-12`, valor:185000, categoria:'Comida',          medioPago:2, comercio:1, estado:'Activo' },
      { id:5, descripcion:'Medicamentos',        fecha:`${y}-${m}-15`, valor:32000,  categoria:'Salud',           medioPago:1, comercio:'',estado:'Activo' },
      { id:6, descripcion:'Camiseta',            fecha:`${y}-${m}-18`, valor:89000,  categoria:'Ropa',            medioPago:1, comercio:'',estado:'Activo' },
      { id:7, descripcion:'Cable USB-C',         fecha:`${y}-${m}-20`, valor:45000,  categoria:'Tecnologia',      medioPago:2, comercio:'',estado:'Activo' },
      { id:8, descripcion:'Restaurante familiar',fecha:`${y}-${mp}-25`,valor:120000, categoria:'Comida',          medioPago:1, comercio:1, estado:'Activo' },
    ]);
  }
}

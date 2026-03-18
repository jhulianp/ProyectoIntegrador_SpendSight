/* =====================================================
   dashboard.js — Dashboard: stats, graficos, tx
   ===================================================== */

function initDashFilters() {
  const now = new Date();
  const yEl = el('dash-year-filter');
  const mEl = el('dash-month-filter');

  if (!yEl || !mEl) return;

  if (!yEl.options.length) {
    for (let y = now.getFullYear() - 2; y <= now.getFullYear() + 1; y++) {
      yEl.add(new Option(y, y, y === now.getFullYear(), y === now.getFullYear()));
    }
  }
  if (mEl.options.length === 1) {
    MONTHS_FULL.forEach((m, i) => {
      mEl.add(new Option(m, i, i === now.getMonth(), i === now.getMonth()));
    });
  }
}

function getDashFiltered() {
  const y = parseInt(val('dash-year-filter')) || new Date().getFullYear();
  const m = parseInt(val('dash-month-filter'));

  return db.get('gastos').filter(g => {
    if (!g.fecha) return false;
    const d = new Date(g.fecha + 'T12:00:00');
    if (d.getFullYear() !== y) return false;
    if (m >= 0 && d.getMonth() !== m) return false;
    return true;
  });
}

function renderDashboard() {
  initDashFilters();

  const now      = new Date();
  const dateStr  = now.toLocaleDateString('es-CO', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  if (el('dash-date')) el('dash-date').textContent = dateStr;

  const filtered = getDashFiltered();
  const total    = filtered.reduce((s, g) => s + (parseFloat(g.valor) || 0), 0);
  const medios   = db.get('medios');
  const cats     = db.get('categorias');
  const coms     = db.get('comercios');

  if (el('stat-total'))   el('stat-total').textContent   = fmtCOP(total);
  if (el('stat-txcount')) el('stat-txcount').textContent = `${filtered.length} transacciones`;
  if (el('stat-mp'))      el('stat-mp').textContent      = medios.length;
  if (el('stat-mp-sub'))  el('stat-mp-sub').textContent  = `${medios.filter(m => m.estado === 'Activo').length} activos`;
  if (el('stat-cat'))     el('stat-cat').textContent     = cats.length;
  if (el('stat-com'))     el('stat-com').textContent     = coms.length;

  renderBarChart(filtered);
  renderRingChart(filtered);
  renderRecentTx(filtered);
}

/* ── Bar chart (gasto por mes) ── */
function renderBarChart(filtered) {
  const y = parseInt(val('dash-year-filter')) || new Date().getFullYear();
  if (el('chart-year-lbl')) el('chart-year-lbl').textContent = y;

  const byMonth = Array(12).fill(0);
  db.get('gastos')
    .filter(g => g.fecha && new Date(g.fecha + 'T12:00:00').getFullYear() === y)
    .forEach(g => {
      const m = new Date(g.fecha + 'T12:00:00').getMonth();
      byMonth[m] += parseFloat(g.valor) || 0;
    });

  const max   = Math.max(...byMonth, 1);
  const nowM  = new Date().getMonth();
  const container = el('chart-bars');
  if (!container) return;

  container.innerHTML = byMonth.map((v, i) => {
    const pct   = Math.round((v / max) * 100);
    const isNow = (i === nowM && y === new Date().getFullYear());
    return `<div class="bar-group">
      <div class="bar bar-expense"
        style="height:${Math.max(pct, v > 0 ? 4 : 0)}%;opacity:${isNow ? 1 : .45};${isNow ? 'box-shadow:0 0 10px rgba(248,113,113,.35)' : ''}"
        title="${MONTHS[i]}: ${fmtCOP(v)}">
      </div>
      <div class="bar-label" style="${isNow ? 'color:var(--text2)' : ''}">${MONTHS[i]}</div>
    </div>`;
  }).join('');
}

/* ── Ring chart (por categoria) ── */
function renderRingChart(filtered) {
  const byCat   = {};
  filtered.forEach(g => {
    const c = g.categoria || 'Otro';
    byCat[c] = (byCat[c] || 0) + (parseFloat(g.valor) || 0);
  });

  const entries = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const total   = entries.reduce((s, [, v]) => s + v, 0);

  if (el('ring-total')) el('ring-total').textContent = fmtCOP(total);

  const svg = el('ring-svg');
  if (!svg) return;
  while (svg.children.length > 1) svg.removeChild(svg.lastChild);

  const catSummary = el('cat-summary');

  if (!entries.length) {
    if (catSummary) catSummary.innerHTML = `<div style="color:var(--text3);font-size:12px;text-align:center">Sin datos en este periodo</div>`;
    return;
  }

  const R = 48, C = 60, circ = 2 * Math.PI * R;
  let offset = 0;

  entries.forEach(([cat, v], i) => {
    const pct    = v / total;
    const dash   = pct * circ;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const color  = CAT_COLORS_PALETTE[i % CAT_COLORS_PALETTE.length];

    circle.setAttribute('cx', C);
    circle.setAttribute('cy', C);
    circle.setAttribute('r', R);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', color);
    circle.setAttribute('stroke-width', '13');
    circle.setAttribute('stroke-dasharray', `${dash} ${circ - dash}`);
    circle.setAttribute('stroke-dashoffset', -offset);
    circle.setAttribute('stroke-linecap', 'round');
    svg.appendChild(circle);
    offset += dash;
  });

  const cats = db.get('categorias');
  if (catSummary) {
    catSummary.innerHTML = entries.map(([cat, v], i) => {
      const pct    = Math.round((v / total) * 100);
      const color  = CAT_COLORS_PALETTE[i % CAT_COLORS_PALETTE.length];
      const catObj = cats.find(c => c.nombre === cat) || {};
      const icon   = catObj.icono ? `<span class="cat-icon-letter" style="font-size:11px;margin-right:2px">${catObj.icono}</span>` : '';
      return `<div class="cat-row">
        <div class="cat-dot" style="background:${color}"></div>
        <div class="cat-name">${icon}${cat}</div>
        <div class="cat-bar-wrap"><div class="cat-bar-fill" style="width:${pct}%;background:${color}"></div></div>
        <div class="cat-pct" style="color:${color}">${pct}%</div>
      </div>`;
    }).join('');
  }
}

/* ── Recent transactions ── */
function renderRecentTx(filtered) {
  const medios  = db.get('medios');
  const cats    = db.get('categorias');
  const c       = el('recent-tx');
  const badge   = el('tx-count-badge');

  if (badge) badge.textContent = `${filtered.length} registros`;
  if (!c) return;

  if (!filtered.length) {
    c.innerHTML = `<div class="empty"><div class="empty-text">Sin gastos en este periodo</div></div>`;
    return;
  }

  const sorted  = [...filtered].sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0)).slice(0, 8);
  const catMap  = {};
  cats.forEach(c => { catMap[c.nombre] = { icono: c.icono || '', color: c.color || CAT_COLORS_PALETTE[0] }; });

  c.innerHTML = sorted.map(g => {
    const ci  = catMap[g.categoria] || { icono: '', color: '#7c6aff' };
    const mp  = medios.find(m => m.id == g.medioPago) || {};
    return `<div class="tx-item" onclick="viewGasto(${g.id})">
      <div class="tx-icon" style="background:${ci.color}22;color:${ci.color};font-family:'Syne',sans-serif;font-weight:700;font-size:13px">${ci.icono}</div>
      <div class="tx-info">
        <div class="tx-name">${g.descripcion || 'Sin descripcion'}</div>
        <div class="tx-meta">${g.categoria || '—'} · ${mp.nombre || 'Sin medio'} · ${fmtDate(g.fecha)}</div>
      </div>
      <div class="tx-amount">-${fmtCOP(g.valor)}</div>
    </div>`;
  }).join('');
}

/* ── Register page ── */
registerPage('dashboard', renderDashboard);

/* =====================================================
   categorias.js — CRUD de categorias
   ===================================================== */

function buildColorPicker() {
  const cp  = el('color-picker');
  if (!cp) return;
  const cur = val('cat-color') || '#7c6aff';
  cp.innerHTML = SWATCHES.map(s =>
    `<div class="color-swatch${s === cur ? ' selected' : ''}"
      style="background:${s}"
      onclick="selectColor('${s}')"
      title="${s}">
    </div>`
  ).join('');
}

function selectColor(c) {
  setVal('cat-color', c);
  buildColorPicker();
}

function buildIconPicker() {
  const ip  = el('icon-picker');
  if (!ip) return;
  const cur = val('cat-icono') || 'F';
  ip.innerHTML = ICONS_LIST.map(ic =>
    `<div class="icon-btn${ic === cur ? ' selected' : ''}"
      onclick="selectIcon('${ic}')"
      title="${ICONS_LABELS[ic] || ic}">
      ${ic}
    </div>`
  ).join('');
}

function selectIcon(ic) {
  setVal('cat-icono', ic);
  buildIconPicker();
}

function saveCategoria() {
  const nombre = val('cat-nombre').trim();
  if (!nombre) {
    toast('El nombre es obligatorio', 'error');
    return;
  }

  const id  = val('cat-id');
  let arr   = db.get('categorias');
  const item = {
    id:            id ? parseInt(id) : db.nextId('categorias'),
    nombre,
    tipo:          val('cat-tipo'),
    icono:         val('cat-icono') || 'F',
    color:         val('cat-color') || '#7c6aff',
    estado:        val('cat-estado'),
    fechaCreacion: new Date().toISOString(),
  };

  if (id) {
    const i = arr.findIndex(x => x.id == id);
    if (i > -1) arr[i] = { ...arr[i], ...item };
    toast('Categoria actualizada', 'success');
  } else {
    arr.push(item);
    toast('Categoria creada', 'success');
  }

  db.set('categorias', arr);
  closeModal('modal-cat');
  renderCategorias();
}

function editCategoria(id) {
  const c = db.get('categorias').find(x => x.id == id);
  if (!c) return;

  setVal('cat-id',     c.id);
  setVal('cat-nombre', c.nombre);
  setVal('cat-tipo',   c.tipo || 'Gasto');
  setVal('cat-estado', c.estado || 'Activo');
  setVal('cat-color',  c.color || '#7c6aff');
  setVal('cat-icono',  c.icono || 'F');

  if (el('modal-cat-title')) el('modal-cat-title').textContent = 'Editar Categoria';
  buildColorPicker();
  buildIconPicker();
  openModal('modal-cat');
}

function deleteCategoria(id) {
  confirm2(
    'Eliminar categoria',
    'Los gastos con esta categoria quedaran sin asignar.',
    () => {
      db.set('categorias', db.get('categorias').filter(x => x.id != id));
      toast('Eliminada', 'info');
      renderCategorias();
    }
  );
}

function renderCategorias() {
  buildColorPicker();
  buildIconPicker();

  const q      = val('cat-search').toLowerCase();
  let arr      = db.get('categorias');
  if (q) arr   = arr.filter(c => (c.nombre || '').toLowerCase().includes(q));

  const gastos = db.get('gastos');
  const grid   = el('cat-cards-grid');

  if (grid) {
    grid.innerHTML = arr.map(c => {
      const count = gastos.filter(g => g.categoria === c.nombre).length;
      const total = gastos.filter(g => g.categoria === c.nombre)
                          .reduce((s, g) => s + (parseFloat(g.valor) || 0), 0);
      return `<div class="cat-card" style="border-color:${c.color}28"
                onmouseover="this.style.borderColor='${c.color}66'"
                onmouseout="this.style.borderColor='${c.color}28'"
                onclick="editCategoria(${c.id})">
        <div class="cat-card-icon" style="background:${c.color}22;color:${c.color};font-family:'Syne',sans-serif;font-weight:700;font-size:14px">
          ${c.icono || '?'}
        </div>
        <div class="cat-card-name">${c.nombre}</div>
        <div class="cat-card-type">${c.tipo || 'Gasto'}</div>
        <div class="cat-card-row">
          <div class="cat-card-count">${count} gastos</div>
          <div class="cat-card-total" style="color:${c.color}">${fmtCOP(total)}</div>
        </div>
        <div class="cat-card-bar">
          <div class="cat-card-bar-fill" style="background:${c.color};width:${c.estado === 'Activo' ? '100' : '30'}%"></div>
        </div>
      </div>`;
    }).join('');
  }

  const tbody = el('cat-tbody');
  if (!tbody) return;

  if (!arr.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty"><div class="empty-text">Sin categorias</div></div></td></tr>`;
    return;
  }

  tbody.innerHTML = arr.map((c, i) => {
    const count = gastos.filter(g => g.categoria === c.nombre).length;
    return `<tr>
      <td style="color:var(--text3)">${i + 1}</td>
      <td><strong>${c.nombre}</strong></td>
      <td style="font-family:'Syne',sans-serif;font-weight:700;font-size:14px">${c.icono || '—'}</td>
      <td><div style="width:20px;height:20px;border-radius:6px;background:${c.color};border:1px solid rgba(255,255,255,.1)"></div></td>
      <td><span class="badge badge-acc">${c.tipo || 'Gasto'}</span></td>
      <td><span class="status-dot ${c.estado === 'Activo' ? 'dot-on' : 'dot-off'}"></span>${c.estado || 'Activo'}</td>
      <td style="color:var(--text2)">${count}</td>
      <td>
        <div class="actions">
          <button class="btn btn-ghost btn-icon btn-sm" onclick="editCategoria(${c.id})">ed</button>
          <button class="btn btn-danger btn-icon btn-sm" onclick="deleteCategoria(${c.id})">del</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

registerPage('categorias', renderCategorias);

/* =====================================================
   comercios.js — CRUD de comercios
   ===================================================== */

function saveComercio() {
  const nombre = val('com-nombre').trim();
  if (!nombre) {
    toast('El nombre es obligatorio', 'error');
    return;
  }

  const id  = val('com-id');
  let arr   = db.get('comercios');
  const item = {
    id:            id ? parseInt(id) : db.nextId('comercios'),
    nombre,
    nit:           val('com-nit'),
    actividad:     val('com-actividad'),
    contacto:      val('com-contacto'),
    telefono:      val('com-telefono'),
    direccion:     val('com-dir'),
    ciudad:        val('com-ciudad'),
    pais:          val('com-pais') || 'Colombia',
    tipo:          val('com-tipo'),
    fechaCreacion: new Date().toISOString(),
  };

  if (id) {
    const i = arr.findIndex(x => x.id == id);
    if (i > -1) arr[i] = { ...arr[i], ...item };
    toast('Comercio actualizado', 'success');
  } else {
    arr.push(item);
    toast('Comercio registrado', 'success');
  }

  db.set('comercios', arr);
  closeModal('modal-com');
  renderComercios();
}

function editComercio(id) {
  const c = db.get('comercios').find(x => x.id == id);
  if (!c) return;

  setVal('com-id',        c.id);
  setVal('com-nombre',    c.nombre);
  setVal('com-nit',       c.nit);
  setVal('com-actividad', c.actividad);
  setVal('com-contacto',  c.contacto);
  setVal('com-telefono',  c.telefono);
  setVal('com-dir',       c.direccion);
  setVal('com-ciudad',    c.ciudad);
  setVal('com-pais',      c.pais || 'Colombia');
  setVal('com-tipo',      c.tipo || 'Comercio');

  if (el('modal-com-title')) el('modal-com-title').textContent = 'Editar Comercio';
  openModal('modal-com');
}

function deleteComercio(id) {
  confirm2(
    'Eliminar comercio',
    '¿Seguro que deseas eliminar este comercio?',
    () => {
      db.set('comercios', db.get('comercios').filter(x => x.id != id));
      toast('Eliminado', 'info');
      renderComercios();
    }
  );
}

function viewComercio(id) {
  const c = db.get('comercios').find(x => x.id == id);
  if (!c) return;

  const gastos = db.get('gastos').filter(g => g.comercio == id);
  const total  = gastos.reduce((s, g) => s + (parseFloat(g.valor) || 0), 0);

  openDetail(`
    <div class="detail-header">
      <div class="detail-title">Detalle del Comercio</div>
      <button class="modal-close" onclick="closeDetailPanel()">x</button>
    </div>
    <div style="text-align:center;padding:20px 0;margin-bottom:20px;background:var(--bg3);border-radius:14px">
      <div style="font-family:'Syne',sans-serif;font-size:22px;font-weight:700">${c.nombre}</div>
      <div style="color:var(--text2);font-size:12px;margin-top:4px">${c.actividad || ''} · ${c.tipo || ''}</div>
    </div>
    ${c.nit       ? `<div class="detail-field"><div class="detail-label">NIT</div><div class="detail-value">${c.nit}</div></div>` : ''}
    ${c.contacto  ? `<div class="detail-field"><div class="detail-label">Correo</div><div class="detail-value">${c.contacto}</div></div>` : ''}
    ${c.telefono  ? `<div class="detail-field"><div class="detail-label">Telefono</div><div class="detail-value">${c.telefono}</div></div>` : ''}
    ${c.ciudad    ? `<div class="detail-field"><div class="detail-label">Ciudad</div><div class="detail-value">${c.ciudad}, ${c.pais || 'Colombia'}</div></div>` : ''}
    ${c.direccion ? `<div class="detail-field"><div class="detail-label">Direccion</div><div class="detail-value">${c.direccion}</div></div>` : ''}
    <hr class="detail-divider">
    <div class="detail-field"><div class="detail-label">Total gastos</div><div class="detail-value" style="font-family:'Syne',sans-serif;font-size:20px;color:var(--red)">${fmtCOP(total)}</div></div>
    <div class="detail-field"><div class="detail-label">Transacciones</div><div class="detail-value">${gastos.length}</div></div>
    <hr class="detail-divider">
    <div style="display:flex;gap:8px">
      <button class="btn btn-ghost" style="flex:1" onclick="closeDetailPanel();editComercio(${c.id})">Editar</button>
      <button class="btn btn-danger" style="flex:1" onclick="closeDetailPanel();deleteComercio(${c.id})">Eliminar</button>
    </div>
  `);
}

function renderComercios() {
  const q   = val('com-search').toLowerCase();
  const ft  = val('com-filter-tipo');
  let arr   = db.get('comercios');

  if (q)  arr = arr.filter(c =>
    (c.nombre || '').toLowerCase().includes(q) ||
    (c.actividad || '').toLowerCase().includes(q) ||
    (c.ciudad || '').toLowerCase().includes(q)
  );
  if (ft) arr = arr.filter(c => c.tipo === ft);

  if (el('com-count')) el('com-count').textContent = `${arr.length} registros`;

  const tbody = el('com-tbody');
  if (!tbody) return;

  if (!arr.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty"><div class="empty-text">Sin comercios registrados</div></div></td></tr>`;
    return;
  }

  tbody.innerHTML = arr.map((c, i) => `<tr>
    <td style="color:var(--text3)">${i + 1}</td>
    <td><strong>${c.nombre}</strong></td>
    <td style="color:var(--text2);font-size:12px">${c.nit || '—'}</td>
    <td style="color:var(--text2)">${c.actividad || '—'}</td>
    <td style="color:var(--text2)">${c.ciudad || '—'}</td>
    <td><span class="badge ${c.tipo === 'Servicio' ? 'badge-p' : 'badge-g'}">${c.tipo || 'Comercio'}</span></td>
    <td style="color:var(--text2);font-size:12px">${c.contacto || '—'}</td>
    <td>
      <div class="actions">
        <button class="btn btn-ghost btn-icon btn-sm" onclick="viewComercio(${c.id})">ver</button>
        <button class="btn btn-ghost btn-icon btn-sm" onclick="editComercio(${c.id})">ed</button>
        <button class="btn btn-danger btn-icon btn-sm" onclick="deleteComercio(${c.id})">del</button>
      </div>
    </td>
  </tr>`).join('');
}

registerPage('comercios', renderComercios);

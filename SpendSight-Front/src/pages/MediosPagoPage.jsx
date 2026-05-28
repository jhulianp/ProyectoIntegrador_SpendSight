import { useEffect, useMemo, useState } from 'react';
import { fmtCOP, loadStorage } from '../utils/storage';
import { mediosPagoResource } from '../utils/resources';
import '../Styles/categorias.css';


const COLORS = ['#7c6aff', '#60a5fa', '#34d399', '#f472b6', '#fbbf24', '#fb923c', '#f87171'];

const EMPTY_FORM = {
  id: null,
  nombre: '',
  tipo: 'Efectivo',
  entidad: '',
  ultimosDigitos: '',
  color: '#7c6aff',
  estado: 'Activo',
};

function initials(nombre) {
  return String(nombre || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function MediosPagoPage() {
  const [mediosPago, setMediosPago] = useState([]);
  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [toast, setToast] = useState(null);

  const session = useMemo(() => JSON.parse(localStorage.getItem('ss_session') || 'null'), []);
  const suffix = useMemo(() => (session ? `_${session.email || session.id}` : null), [session]);

  useEffect(() => {
    if (suffix !== null) {
      mediosPagoResource.list().then((list) => {
        setMediosPago(list);
      });
    } else {
      setMediosPago([]);
    }
  }, [suffix]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const gastos = useMemo(() => (suffix !== null ? loadStorage(`ss_gastos${suffix}`, []) : []), [suffix]);
  const tipos = useMemo(() => [...new Set(mediosPago.map((medio) => medio.tipo).filter(Boolean))], [mediosPago]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return mediosPago.filter((medio) => {
      const matchesText = [medio.nombre, medio.tipo, medio.entidad]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term));
      const matchesTipo = filterTipo ? medio.tipo === filterTipo : true;
      return matchesText && matchesTipo;
    });
  }, [filterTipo, mediosPago, search]);

  const selectedDetail = detailId ? mediosPago.find((medio) => medio.id === detailId) : null;
  const detailGastos = selectedDetail ? gastos.filter((gasto) => gasto.medioPago === selectedDetail.nombre) : [];
  const detailTotal = detailGastos.reduce((sum, gasto) => sum + (Number(gasto.valor) || 0), 0);

  const openModal = (medio = null) => {
    setForm(medio || EMPTY_FORM);
    setConfirm({ open: false, id: null });
    setDetailId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) {
      setToast({ message: 'El nombre es obligatorio', variant: 'error' });
      return;
    }

    const saved = await mediosPagoResource.save(form);
    const next = [...mediosPago];
    if (form.id) {
      const index = next.findIndex((item) => item.id === saved.id);
      if (index > -1) next[index] = { ...next[index], ...saved };
      setToast({ message: 'Medio de pago actualizado', variant: 'success' });
    } else {
      next.push(saved);
      setToast({ message: 'Medio de pago creado', variant: 'success' });
    }

    setMediosPago(next);
    closeModal();
  };

  const handleDelete = (id) => {
    setConfirm({ open: true, id });
    setIsModalOpen(false);
    setDetailId(null);
  };

  const confirmDelete = async () => {
    await mediosPagoResource.remove(confirm.id);
    const next = mediosPago.filter((medio) => medio.id !== confirm.id);
    setMediosPago(next);
    setConfirm({ open: false, id: null });
    setToast({ message: 'Medio de pago eliminado', variant: 'info' });
  };

  const openDetail = (id) => {
    setDetailId(id);
    setIsModalOpen(false);
    setConfirm({ open: false, id: null });
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="section-title">Medios de pago</div>
          <div className="section-sub">Administra efectivo, tarjetas y billeteras</div>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>+ Nuevo medio</button>
      </div>

      <div className="cat-cards-grid">
        {filtered.map((medio) => {
          const count = gastos.filter((gasto) => gasto.medioPago === medio.nombre).length;
          const total = gastos
            .filter((gasto) => gasto.medioPago === medio.nombre)
            .reduce((sum, gasto) => sum + (Number(gasto.valor) || 0), 0);

          return (
            <div
              key={medio.id}
              className="cat-card"
              style={{ borderColor: `${medio.color || '#7c6aff'}28` }}
              onClick={() => openDetail(medio.id)}
            >
              <div className="cat-card-icon" style={{ background: `${medio.color || '#7c6aff'}22`, color: medio.color || '#7c6aff' }}>
                {initials(medio.nombre)}
              </div>
              <div className="cat-card-name">{medio.nombre}</div>
              <div className="cat-card-type">{medio.tipo}</div>
              <div className="cat-card-row">
                <div className="cat-card-count">{count} gastos</div>
                <div className="cat-card-total" style={{ color: medio.color || '#7c6aff' }}>{fmtCOP(total)}</div>
              </div>
              <div className="cat-card-bar">
                <div className="cat-card-bar-fill" style={{ background: medio.color || '#7c6aff', width: medio.estado === 'Activo' ? '100%' : '30%' }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="table-wrap">
        <div className="table-head">
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: '14px' }}>{filtered.length} registros</div>
            <select className="form-select" value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
              <option value="">Todos los tipos</option>
              {tipos.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
            </select>
          </div>
          <div className="table-search">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              placeholder="Buscar medio"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Entidad</th>
              <th>Terminacion</th>
              <th>Estado</th>
              <th>Gastos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8"><div className="empty"><div className="empty-text">Sin medios de pago registrados</div></div></td>
              </tr>
            ) : filtered.map((medio, index) => {
              const count = gastos.filter((gasto) => gasto.medioPago === medio.nombre).length;
              return (
                <tr key={medio.id}>
                  <td style={{ color: 'var(--text3)' }}>{index + 1}</td>
                  <td><strong>{medio.nombre}</strong></td>
                  <td><span className="badge badge-acc">{medio.tipo}</span></td>
                  <td style={{ color: 'var(--text2)' }}>{medio.entidad || '-'}</td>
                  <td style={{ color: 'var(--text2)' }}>{medio.ultimosDigitos ? `**** ${medio.ultimosDigitos}` : '-'}</td>
                  <td><span className={`status-dot ${medio.estado === 'Activo' ? 'dot-on' : 'dot-off'}`} />{medio.estado}</td>
                  <td style={{ color: 'var(--text2)' }}>{count}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openDetail(medio.id)}>ver</button>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openModal(medio)}>ed</button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(medio.id)}>del</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay open" onClick={closeModal}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              <span>{form.id ? 'Editar Medio de Pago' : 'Nuevo Medio de Pago'}</span>
              <button className="modal-close" onClick={closeModal}>x</button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input className="form-input" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Nequi, Efectivo, Visa" />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo</label>
                <select className="form-select" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                  <option>Efectivo</option>
                  <option>Tarjeta debito</option>
                  <option>Tarjeta credito</option>
                  <option>Billetera digital</option>
                  <option>Transferencia</option>
                  <option>Otro</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Entidad</label>
                <input className="form-input" value={form.entidad} onChange={(e) => setForm({ ...form, entidad: e.target.value })} placeholder="Ej: Bancolombia" />
              </div>
              <div className="form-group">
                <label className="form-label">Ultimos 4 digitos</label>
                <input className="form-input" maxLength="4" value={form.ultimosDigitos} onChange={(e) => setForm({ ...form, ultimosDigitos: e.target.value.replace(/\D/g, '') })} placeholder="1234" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select className="form-select" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <div className="color-picker-row">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`color-swatch${form.color === color ? ' selected' : ''}`}
                      style={{ background: color }}
                      onClick={() => setForm({ ...form, color })}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {detailId && selectedDetail && (
        <div className="detail-overlay open" onClick={() => setDetailId(null)}>
          <div className="detail-panel" onClick={(event) => event.stopPropagation()}>
            <div className="detail-header">
              <div className="detail-title">Detalle del Medio</div>
              <button className="modal-close" onClick={() => setDetailId(null)}>x</button>
            </div>
            <div style={{ textAlign: 'center', padding: '20px 0', marginBottom: '20px', background: 'var(--bg3)', borderRadius: '14px' }}>
              <div className="cat-card-icon" style={{ background: `${selectedDetail.color || '#7c6aff'}22`, color: selectedDetail.color || '#7c6aff', margin: '0 auto 12px' }}>
                {initials(selectedDetail.nombre)}
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: 700 }}>{selectedDetail.nombre}</div>
              <div style={{ color: 'var(--text2)', fontSize: '12px', marginTop: '4px' }}>{selectedDetail.tipo}</div>
            </div>
            {selectedDetail.entidad && <div className="detail-field"><div className="detail-label">Entidad</div><div className="detail-value">{selectedDetail.entidad}</div></div>}
            {selectedDetail.ultimosDigitos && <div className="detail-field"><div className="detail-label">Terminacion</div><div className="detail-value">**** {selectedDetail.ultimosDigitos}</div></div>}
            <div className="detail-field"><div className="detail-label">Estado</div><div className="detail-value">{selectedDetail.estado}</div></div>
            <hr className="detail-divider" />
            <div className="detail-field"><div className="detail-label">Total gastos</div><div className="detail-value" style={{ fontFamily: "'Syne',sans-serif", fontSize: '20px', color: 'var(--red)' }}>{fmtCOP(detailTotal)}</div></div>
            <div className="detail-field"><div className="detail-label">Transacciones</div><div className="detail-value">{detailGastos.length}</div></div>
            <hr className="detail-divider" />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => { setDetailId(null); openModal(selectedDetail); }}>Editar</button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => { setDetailId(null); handleDelete(selectedDetail.id); }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {confirm.open && (
        <div className="confirm-overlay open" onClick={() => setConfirm({ open: false, id: null })}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">!</div>
            <div className="confirm-title">Eliminar medio de pago</div>
            <div className="confirm-msg">Los gastos con este medio conservaran el nombre registrado.</div>
            <div className="confirm-btns">
              <button className="btn btn-ghost" onClick={() => setConfirm({ open: false, id: null })}>Cancelar</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.variant}`}>{toast.message}</div>
        </div>
      )}
    </>
  );
}

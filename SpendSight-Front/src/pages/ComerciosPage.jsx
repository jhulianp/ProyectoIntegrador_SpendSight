import { useEffect, useMemo, useState } from 'react';
import { fmtCOP, loadStorage, saveStorage } from '../utils/storage';
import '../Styles/categorias.css';

const DEFAULT_COMERCIOS = [
  {
    id: 1,
    nombre: 'Market One',
    nit: '900123456',
    actividad: 'Alimentos',
    contacto: 'contacto@marketone.com',
    telefono: '3111111111',
    direccion: 'Cra 10 #23-45',
    ciudad: 'Bogotá',
    pais: 'Colombia',
    tipo: 'Comercio',
    fechaCreacion: new Date().toISOString(),
  },
  {
    id: 2,
    nombre: 'Servicios al Día',
    nit: '900987654',
    actividad: 'Mantenimiento',
    contacto: 'soporte@serviciosaldia.com',
    telefono: '3122223333',
    direccion: 'Cl 45 #12-34',
    ciudad: 'Medellín',
    pais: 'Colombia',
    tipo: 'Servicio',
    fechaCreacion: new Date().toISOString(),
  },
];

const EMPTY_FORM = {
  id: null,
  nombre: '',
  nit: '',
  actividad: '',
  contacto: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  pais: 'Colombia',
  tipo: 'Comercio',
};

export default function ComerciosPage() {
  const [comercios, setComercios] = useState([]);
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
      const stored = loadStorage(`ss_comercios${suffix}`, []);
      if (stored.length) {
        setComercios(stored);
      } else {
        setComercios([]); // No default comercios for new users, they will add their own
      }
    } else setComercios([]); // Clear if no session
  }, [suffix]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const gastos = useMemo(() => (suffix !== null ? loadStorage(`ss_gastos${suffix}`, []) : []), [suffix]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return comercios.filter((comercio) => {
      const matchesText = [comercio.nombre, comercio.actividad, comercio.ciudad]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term));
      const matchesType = filterTipo ? comercio.tipo === filterTipo : true;
      return matchesText && matchesType;
    });
  }, [comercios, filterTipo, search]);

  const selectedDetail = detailId ? comercios.find((comercio) => comercio.id === detailId) : null;
  const detailGastos = selectedDetail ? gastos.filter((gasto) => gasto.comercioId === selectedDetail.id) : [];
  const detailTotal = detailGastos.reduce((sum, gasto) => sum + (Number(gasto.valor) || 0), 0);

  const openModal = (comercio = null) => {
    setForm(comercio || EMPTY_FORM);
    setConfirm({ open: false, id: null });
    setDetailId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(EMPTY_FORM);
  };

  const handleSave = () => {
    if (!form.nombre.trim()) {
      setToast({ message: 'El nombre es obligatorio', variant: 'error' });
      return;
    }

    const next = [...comercios];
    if (form.id) {
      const index = next.findIndex((item) => item.id === form.id);
      if (index > -1) next[index] = { ...next[index], ...form };
      setToast({ message: 'Comercio actualizado', variant: 'success' });
    } else {
      next.push({ ...form, id: Date.now(), fechaCreacion: new Date().toISOString() });
      setToast({ message: 'Comercio registrado', variant: 'success' });
    }

    setComercios(next);
    saveStorage(`ss_comercios${suffix}`, next);
    closeModal();
  };

  const handleDelete = (id) => {
    setConfirm({ open: true, id });
    setIsModalOpen(false);
    setDetailId(null);
  };

  const confirmDelete = () => {
    const next = comercios.filter((item) => item.id !== confirm.id);
    setComercios(next);
    saveStorage(`ss_comercios${suffix}`, next);
    setConfirm({ open: false, id: null });
    setToast({ message: 'Comercio eliminado', variant: 'info' });
  };

  const openDetail = (id) => {
    setDetailId(id);
    setIsModalOpen(false);
    setConfirm({ open: false, id: null });
  };
  const closeDetail = () => setDetailId(null);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="section-title">Comercios</div>
          <div className="section-sub">Tiendas y proveedores de servicios</div>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>+ Nuevo comercio</button>
      </div>

      <div className="table-wrap">
        <div className="table-head">
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: '14px' }}>{filtered.length} registros</div>
            <select className="form-select" value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
              <option value="">Todos los tipos</option>
              <option value="Comercio">Comercio</option>
              <option value="Servicio">Servicio</option>
            </select>
          </div>
          <div className="table-search">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              placeholder="Buscar comercio"
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
              <th>NIT</th>
              <th>Actividad</th>
              <th>Ciudad</th>
              <th>Tipo</th>
              <th>Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8"><div className="empty"><div className="empty-text">Sin comercios registrados</div></div></td>
              </tr>
            ) : filtered.map((comercio, index) => (
              <tr key={comercio.id}>
                <td style={{ color: 'var(--text3)' }}>{index + 1}</td>
                <td><strong>{comercio.nombre}</strong></td>
                <td style={{ color: 'var(--text2)', fontSize: '12px' }}>{comercio.nit || '—'}</td>
                <td style={{ color: 'var(--text2)' }}>{comercio.actividad || '—'}</td>
                <td style={{ color: 'var(--text2)' }}>{comercio.ciudad || '—'}</td>
                <td><span className={`badge ${comercio.tipo === 'Servicio' ? 'badge-p' : 'badge-g'}`}>{comercio.tipo || 'Comercio'}</span></td>
                <td style={{ color: 'var(--text2)', fontSize: '12px' }}>{comercio.contacto || '—'}</td>
                <td>
                  <div className="actions">
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openDetail(comercio.id)}>ver</button>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openModal(comercio)}>ed</button>
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(comercio.id)}>del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              <span>{form.id ? 'Editar Comercio' : 'Nuevo Comercio'}</span>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input className="form-input" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Tienda Central" />
              </div>
              <div className="form-group">
                <label className="form-label">NIT</label>
                <input className="form-input" value={form.nit} onChange={(e) => setForm({ ...form, nit: e.target.value })} placeholder="900123456" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Actividad</label>
                <input className="form-input" value={form.actividad} onChange={(e) => setForm({ ...form, actividad: e.target.value })} placeholder="Ej: Alimentos" />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo</label>
                <select className="form-select" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                  <option>Comercio</option>
                  <option>Servicio</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Contacto</label>
                <input className="form-input" value={form.contacto} onChange={(e) => setForm({ ...form, contacto: e.target.value })} placeholder="correo@ejemplo.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Telefono</label>
                <input className="form-input" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="311 111 1111" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Ciudad</label>
                <input className="form-input" value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} placeholder="Bogotá" />
              </div>
              <div className="form-group">
                <label className="form-label">Pais</label>
                <input className="form-input" value={form.pais} onChange={(e) => setForm({ ...form, pais: e.target.value })} placeholder="Colombia" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Direccion</label>
              <input className="form-input" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} placeholder="Cra 00 #00-00" />
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {detailId && selectedDetail && (
        <div className="detail-overlay" onClick={closeDetail}>
          <div className="detail-panel" onClick={(event) => event.stopPropagation()}>
            <div className="detail-header">
              <div className="detail-title">Detalle del Comercio</div>
              <button className="modal-close" onClick={closeDetail}>×</button>
            </div>
            <div style={{ textAlign: 'center', padding: '20px 0', marginBottom: '20px', background: 'var(--bg3)', borderRadius: '14px' }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: 700 }}>{selectedDetail.nombre}</div>
              <div style={{ color: 'var(--text2)', fontSize: '12px', marginTop: '4px' }}>{selectedDetail.actividad || ''} · {selectedDetail.tipo || ''}</div>
            </div>
            {selectedDetail.nit && <div className="detail-field"><div className="detail-label">NIT</div><div className="detail-value">{selectedDetail.nit}</div></div>}
            {selectedDetail.contacto && <div className="detail-field"><div className="detail-label">Correo</div><div className="detail-value">{selectedDetail.contacto}</div></div>}
            {selectedDetail.telefono && <div className="detail-field"><div className="detail-label">Telefono</div><div className="detail-value">{selectedDetail.telefono}</div></div>}
            {selectedDetail.ciudad && <div className="detail-field"><div className="detail-label">Ciudad</div><div className="detail-value">{selectedDetail.ciudad}, {selectedDetail.pais || 'Colombia'}</div></div>}
            {selectedDetail.direccion && <div className="detail-field"><div className="detail-label">Direccion</div><div className="detail-value">{selectedDetail.direccion}</div></div>}
            <hr className="detail-divider" />
            <div className="detail-field"><div className="detail-label">Total gastos</div><div className="detail-value" style={{ fontFamily: "'Syne',sans-serif", fontSize: '20px', color: 'var(--red)' }}>{fmtCOP(detailTotal)}</div></div>
            <div className="detail-field"><div className="detail-label">Transacciones</div><div className="detail-value">{detailGastos.length}</div></div>
            <hr className="detail-divider" />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => { closeDetail(); openModal(selectedDetail); }}>Editar</button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => { closeDetail(); handleDelete(selectedDetail.id); }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {confirm.open && (
        <div className="confirm-overlay" onClick={() => setConfirm({ open: false, id: null })}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">!</div>
            <div className="confirm-title">Eliminar comercio</div>
            <div className="confirm-msg">¿Seguro que deseas eliminar este comercio?</div>
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

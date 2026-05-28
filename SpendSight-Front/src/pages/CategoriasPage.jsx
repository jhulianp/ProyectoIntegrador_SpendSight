import { useEffect, useMemo, useState } from 'react';
import { fmtCOP, loadStorage } from '../utils/storage';
import { categoriasResource } from '../utils/resources';
import '../Styles/categorias.css';

const DEFAULT_COLORS = ['#7c6aff', '#f472b6', '#60a5fa', '#34d399', '#fb923c', '#fbbf24', '#f97316'];
const DEFAULT_ICONS = ['F', 'T', 'P', 'M', 'S', 'B', 'C', 'D', 'R', 'L', 'A', 'H'];

const EMPTY_FORM = {
  id: null,
  nombre: '',
  tipo: 'Gasto',
  icono: 'F',
  color: '#7c6aff',
  estado: 'Activo',
};

export default function CategoriasPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  
  const session = useMemo(() => JSON.parse(localStorage.getItem('ss_session') || 'null'), []);
  const suffix = useMemo(() => (session ? `_${session.email || session.id}` : null), [session]);

  useEffect(() => {
    if (suffix !== null) {
      // Cargar desde el back (con fallback a localStorage automático en categoriasResource)
      categoriasResource.list().then((list) => {
        setCategories(list);
      });
    } else setCategories([]); // Clear if no session
  }, [suffix]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const gastos = useMemo(() => (suffix !== null ? loadStorage(`ss_gastos${suffix}`, []) : []), [suffix]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return categories.filter((categoria) => categoria.nombre.toLowerCase().includes(term));
  }, [categories, search]);

  const openModal = (categoria = null) => {
    if (categoria) {
      setForm(categoria);
    } else {
      setForm(EMPTY_FORM);
    }
    setConfirm({ open: false, id: null }); // Ensure confirmation modal is closed
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

    const saved = await categoriasResource.save(form);
    const next = [...categories];
    if (form.id) {
      const index = next.findIndex((item) => item.id === saved.id);
      if (index > -1) next[index] = { ...next[index], ...saved };
      setToast({ message: 'Categoria actualizada', variant: 'success' });
    } else {
      next.push(saved);
      setToast({ message: 'Categoria creada', variant: 'success' });
    }

    setCategories(next);
    closeModal();
  };

  const handleDelete = (id) => {
    setConfirm({ open: true, id });
    setIsModalOpen(false);
  }; 

  const confirmDelete = async () => {
    await categoriasResource.remove(confirm.id);
    const next = categories.filter((categoria) => categoria.id !== confirm.id);
    setCategories(next);
    setConfirm({ open: false, id: null });
    setToast({ message: 'Categoria eliminada', variant: 'info' });
  };

  const totalByCategory = (categoria) => {
    return gastos.filter((gasto) => gasto.categoria === categoria.nombre).reduce((sum, gasto) => sum + (Number(gasto.valor) || 0), 0);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="section-title">Categorias</div>
          <div className="section-sub">Organiza tus gastos por tipo</div>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>+ Nueva categoria</button>
      </div>

      <div className="cat-cards-grid">
        {filtered.map((categoria) => {
          const count = gastos.filter((gasto) => gasto.categoria === categoria.nombre).length;
          const total = totalByCategory(categoria);
          return (
            <div
              key={categoria.id}
              className="cat-card"
              style={{ borderColor: `${categoria.color}28` }}
              onClick={() => openModal(categoria)}
            >
              <div className="cat-card-icon" style={{ background: `${categoria.color}22`, color: categoria.color }}>
                {categoria.icono || '?'}
              </div>
              <div className="cat-card-name">{categoria.nombre}</div>
              <div className="cat-card-type">{categoria.tipo}</div>
              <div className="cat-card-row">
                <div className="cat-card-count">{count} gastos</div>
                <div className="cat-card-total" style={{ color: categoria.color }}>{fmtCOP(total)}</div>
              </div>
              <div className="cat-card-bar">
                <div className="cat-card-bar-fill" style={{ background: categoria.color, width: categoria.estado === 'Activo' ? '100%' : '30%' }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="table-wrap">
        <div className="table-head">
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: '14px' }}>Todas las categorias</div>
          <div className="table-search">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              placeholder="Buscar categoria"
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
              <th>Icono</th>
              <th>Color</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Gastos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8"><div className="empty"><div className="empty-text">Sin categorias</div></div></td>
              </tr>
            ) : filtered.map((categoria, index) => {
              const count = gastos.filter((gasto) => gasto.categoria === categoria.nombre).length;
              return (
                <tr key={categoria.id}>
                  <td style={{ color: 'var(--text3)' }}>{index + 1}</td>
                  <td><strong>{categoria.nombre}</strong></td>
                  <td style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '14px' }}>{categoria.icono || '—'}</td>
                  <td>
                    <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: categoria.color, border: '1px solid rgba(255,255,255,.1)' }} />
                  </td>
                  <td><span className="badge badge-acc">{categoria.tipo}</span></td>
                  <td><span className={`status-dot ${categoria.estado === 'Activo' ? 'dot-on' : 'dot-off'}`} />{categoria.estado}</td>
                  <td style={{ color: 'var(--text2)' }}>{count}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openModal(categoria)}>ed</button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(categoria.id)}>del</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              <span>{form.id ? 'Editar Categoria' : 'Nueva Categoria'}</span>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input className="form-input" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Alimentacion" />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo</label>
                <select className="form-select" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                  <option>Gasto</option>
                  <option>Ingreso</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Icono (letra clave)</label>
              <div className="icon-picker-row">
                {DEFAULT_ICONS.map((icono) => (
                  <button
                    type="button"
                    key={icono}
                    className={`icon-btn${form.icono === icono ? ' selected' : ''}`}
                    onClick={() => setForm({ ...form, icono })}
                    title={icono}
                  >
                    {icono}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Color</label>
              <div className="color-picker-row">
                {DEFAULT_COLORS.map((color) => (
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

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select className="form-select" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Id</label>
                <input className="form-input" value={form.id || ''} disabled placeholder="Automático" />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {confirm.open && (
        <div className="confirm-overlay" onClick={() => setConfirm({ open: false, id: null })}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">!</div>
            <div className="confirm-title">Eliminar categoria</div>
            <div className="confirm-msg">Los gastos con esta categoria quedaran sin asignar.</div>
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

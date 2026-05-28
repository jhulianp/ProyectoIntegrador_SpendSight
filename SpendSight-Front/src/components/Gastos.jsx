import React, { useState, useEffect, useMemo } from 'react';
import { fmtCOP } from '../utils/storage';
import { gastosResource, categoriasResource, mediosPagoResource, comerciosResource } from '../utils/resources';
import '../Styles/gastos.css';

export default function Gastos() {
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mediosPago, setMediosPago] = useState([]);
  const [comercios, setComerciosData] = useState([]);
  
  // Estados del modal
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Nuevo Gasto');
  const [editingId, setEditingId] = useState(null);
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    id: null,
    descripcion: '',
    valor: '',
    fecha: new Date().toISOString().split('T')[0],
    categoria: '',
    medioPago: '',
    comercio: '',
    estado: 'Activo',
    notas: ''
  });
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  
  // Detail panel
  const [showDetail, setShowDetail] = useState(false);
  const [detailGasto, setDetailGasto] = useState(null);
  
  // Confirm dialog
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMsg, setConfirmMsg] = useState('');

  const session = useMemo(() => JSON.parse(localStorage.getItem('ss_session') || 'null'), []);
  const suffix = useMemo(() => (session ? `_${session.email || session.id}` : null), [session]); // Change to null if no session

  useEffect(() => {
    // Forzar limpieza de estados de bloqueo al iniciar
    setShowConfirm(false);
    setShowModal(false);
    setShowDetail(false);
    if (suffix !== null) loadData(); // Load data only if a valid suffix (i.e., session) exists
    else resetData(); // Clear data if no session
  }, [suffix]);

  // Función de emergencia para el usuario
  const handleResetApp = () => {
    if (window.confirm("¿Deseas borrar todos los datos y reiniciar la aplicación? Esto solucionará problemas de bloqueo.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const loadData = async () => {
    // Cargar primero las entidades relacionadas (necesarias para resolver FKs en Gastos)
    const [cats, meds, coms] = await Promise.all([
      categoriasResource.list(),
      mediosPagoResource.list(),
      comerciosResource.list(),
    ]);

    setCategorias(cats);
    setMediosPago(meds);
    setComerciosData(coms);

    // Ahora cargar los gastos usando las entidades como contexto para resolver FKs
    const gastosBack = await gastosResource.list({
      categorias: cats,
      mediosPago: meds,
      comercios: coms,
      session: JSON.parse(localStorage.getItem('ss_session') || 'null'),
    });

    setGastos(gastosBack);
  };

  const resetData = () => {
    setGastos([]);
    setCategorias([]);
    setMediosPago([]);
    setComerciosData([]);
    // Also reset filters if needed
  };

  const handleOpenModal = (gasto = null) => {
    setShowConfirm(false); // Prevenir bloqueos accidentales
    if (gasto) {
      setEditingId(gasto.id);
      setModalTitle('Editar Gasto');
      setFormData(gasto);
    } else {
      setEditingId(null);
      setModalTitle('Nuevo Gasto');
      setFormData({
        id: null,
        descripcion: '',
        valor: '',
        fecha: new Date().toISOString().split('T')[0],
        categoria: '',
        medioPago: '',
        comercio: '',
        estado: 'Activo',
        notas: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSaveGasto = async () => {
    const desc = (formData.descripcion || '').trim();
    const valor = parseFloat(String(formData.valor));
    const fecha = formData.fecha;

    if (!desc || isNaN(valor) || !fecha) {
      alert('Por favor completa los campos obligatorios: Descripción, Valor y Fecha');
      return;
    }

    const currentSession = JSON.parse(localStorage.getItem('ss_session') || 'null');
    if (!currentSession || !currentSession.id) {
      alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
      return;
    }

    // Guardar nuevo comercio si no existe en la lista (antes de guardar el gasto para poder asociarlo)
    let updatedComercios = [...comercios];
    if (formData.comercio && !comercios.some(c => c.nombre.toLowerCase() === formData.comercio.trim().toLowerCase())) {
      const nuevoComercio = await comerciosResource.save({ nombre: formData.comercio.trim(), tipo: 'Comercio' });
      updatedComercios = [...updatedComercios, nuevoComercio];
      setComerciosData(updatedComercios);
    }

    const ctx = {
      categorias,
      mediosPago,
      comercios: updatedComercios,
      session: currentSession,
    };

    // Preparamos el objeto. resources.js se encarga de convertir nombres a objetos con ID para el backend.
    const gastoToSave = {
      ...formData,
      descripcion: desc,
      valor: valor,
      fecha: fecha,
    };

    const saved = await gastosResource.save(gastoToSave, ctx);

    if (editingId) {
      setGastos(gastos.map(g => g.id === editingId ? saved : g));
    } else {
      setGastos([...gastos, saved]);
    }

    setShowModal(false);
    setShowConfirm(false);
  };

  const handleDeleteGasto = (gasto) => {
    if (!gasto) return;
    setConfirmTitle('¿Eliminar gasto?');
    setConfirmMsg(`¿Estás seguro de eliminar "${gasto.descripcion}"? Esta acción no se puede deshacer.`);
    setConfirmAction(() => async () => {
      await gastosResource.remove(gasto.id);
      const filtered = gastos.filter(g => g.id !== gasto.id);
      setGastos(filtered);
      setShowConfirm(false);
      setConfirmAction(null);
    });
    setShowConfirm(true);
  };

  const handleViewDetail = (gasto) => {
    setDetailGasto(gasto);
    setShowDetail(true);
  };

  const filteredGastos = gastos.filter(g => {
    const matchSearch = g.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = !filterCategory || g.categoria === filterCategory;
    const matchPayment = !filterPayment || g.medioPago === filterPayment;
    return matchSearch && matchCategory && matchPayment;
  });

  const totalGastos = filteredGastos.reduce((sum, g) => sum + parseFloat(g.valor || 0), 0);

  return (
    <div className="gastos-container">
      {/* Header */}
      <div className="gastos-header">
        <div>
          <div className="section-title">Gastos</div>
          <div className="section-sub">Registro de todos tus gastos</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost" onClick={handleResetApp} style={{ fontSize: '12px' }}>
            Limpiar Datos
          </button>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Nuevo gasto
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-wrap">
        <div className="table-head">
          <div className="table-filters">
            <div className="table-search">
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Categoria</option>
              {categorias.map((cat, i) => (
                <option key={cat.id || i} value={cat.nombre || cat}>
                  {String(cat.nombre || cat)}
                </option>
              ))}
            </select>
            <select
              className="form-select"
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
            >
              <option value="">Medio de pago</option>
              {mediosPago.map((mp, i) => (
                <option key={mp.id || i} value={mp.nombre || mp}>
                  {String(mp.nombre || mp)}
                </option>
              ))}
            </select>
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '14px', fontWeight: '700', color: 'var(--red)' }}>
            {fmtCOP(totalGastos)}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Descripcion</th>
              <th>Categoria</th>
              <th>Comercio</th>
              <th>Medio de pago</th>
              <th>Fecha</th>
              <th>Valor</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredGastos.length > 0 ? (
              filteredGastos.map((gasto, idx) => (
                <tr key={gasto.id}>
                  <td>{idx + 1}</td>
                  <td className="tx-name">{gasto.descripcion}</td>
                  <td><span className="badge badge-info">{String(gasto.categoria || 'Sin cat.')}</span></td>
                  <td>{String(gasto.comercio || '-')}</td>
                  <td>{String(gasto.medioPago || '-')}</td>
                  <td>{new Date(gasto.fecha).toLocaleDateString('es-CO')}</td>
                  <td style={{ color: 'var(--red)', fontWeight: '600' }}>{fmtCOP(gasto.valor)}</td>
                  <td>
                    <span className={`badge badge-${gasto.estado === 'Activo' ? 'success' : 'danger'}`}>
                      {gasto.estado}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-sm btn-ghost" onClick={() => handleViewDetail(gasto)} title="Ver">
                        Ver
                      </button>
                      <button className="btn btn-sm btn-ghost" onClick={() => handleOpenModal(gasto)} title="Editar">
                        Editar
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteGasto(gasto)} title="Eliminar">
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '30px' }}>
                  No hay gastos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => handleCloseModal()}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">
              <span>{modalTitle}</span>
              <button className="modal-close" onClick={() => handleCloseModal()}>X</button>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Descripcion *</label>
                <input
                  className="form-input"
                  value={formData.descripcion}
                  onChange={(e) => handleFormChange('descripcion', e.target.value)}
                  placeholder="En que gastaste?"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Valor (COP) *</label>
                <input
                  className="form-input"
                  type="number"
                  value={formData.valor}
                  onChange={(e) => handleFormChange('valor', e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha *</label>
                <input
                  className="form-input"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleFormChange('fecha', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Categoria (Opcional)</label>
                <select
                  className="form-select"
                  value={formData.categoria}
                  onChange={(e) => handleFormChange('categoria', e.target.value)}
                >
                  <option value="">Sin categoría</option>
                  {categorias.map((cat, i) => (
                    <option key={cat.id || i} value={cat.nombre || cat}>
                      {String(cat.nombre || cat)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Medio de Pago (Opcional)</label>
                <select
                  className="form-select"
                  value={formData.medioPago}
                  onChange={(e) => handleFormChange('medioPago', e.target.value)}
                >
                  <option value="">Sin medio de pago</option>
                  {mediosPago.map((mp, i) => (
                    <option key={mp.id || i} value={mp.nombre || mp}>
                      {String(mp.nombre || mp)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Comercio (Opcional)</label>
                <input
                  className="form-input"
                  list="comercios-list"
                  value={formData.comercio}
                  onChange={(e) => handleFormChange('comercio', e.target.value)}
                  placeholder="Ej: Éxito, Amazon..."
                />
                <datalist id="comercios-list">
                  {comercios.map((com, i) => (
                    <option key={com.id || i} value={com.nombre || com} />
                  ))}
                </datalist>
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  value={formData.estado}
                  onChange={(e) => handleFormChange('estado', e.target.value)}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notas</label>
              <textarea
                className="form-textarea"
                value={formData.notas}
                onChange={(e) => handleFormChange('notas', e.target.value)}
                placeholder="Observaciones adicionales..."
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => handleCloseModal()}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSaveGasto}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Panel */}
      {showDetail && detailGasto && (
        <div className="detail-overlay" onClick={() => setShowDetail(false)}>
          <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
            <div className="detail-header">
              <h3>{detailGasto.descripcion}</h3>
              <button className="detail-close" onClick={() => setShowDetail(false)}>X</button>
            </div>
            <div className="detail-body">
              <div className="detail-row">
                <span className="detail-label">Valor:</span>
                <span className="detail-value" style={{ color: 'var(--red)', fontWeight: '600' }}>
                  {fmtCOP(detailGasto.valor)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Categoría:</span>
                <span className="detail-value">{String(detailGasto.categoria || '-')}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Medio de pago:</span>
                <span className="detail-value">{detailGasto.medioPago}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Comercio:</span>
                <span className="detail-value">{detailGasto.comercio || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Fecha:</span>
                <span className="detail-value">{new Date(detailGasto.fecha).toLocaleDateString('es-CO')}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Estado:</span>
                <span className="detail-value">{detailGasto.estado}</span>
              </div>
              {detailGasto.notas && (
                <div className="detail-row">
                  <span className="detail-label">Notas:</span>
                  <span className="detail-value">{detailGasto.notas}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="confirm-overlay" onClick={() => {
          setShowConfirm(false);
          setConfirmAction(null);
        }}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">!</div>
            <div className="confirm-title">{confirmTitle}</div>
            <div className="confirm-msg">{confirmMsg}</div>
            <div className="confirm-btns">
              <button 
                className="btn btn-ghost" 
                onClick={() => { 
                  setShowConfirm(false); 
                  setConfirmAction(null); 
                }}
              >
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={confirmAction}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

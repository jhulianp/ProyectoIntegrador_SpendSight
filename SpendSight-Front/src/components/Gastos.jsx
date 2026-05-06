import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Forzar limpieza de estados de bloqueo al iniciar
    setShowConfirm(false);
    setShowModal(false);
    setShowDetail(false);
    loadData();
  }, []);

  // Función de emergencia para el usuario
  const handleResetApp = () => {
    if (window.confirm("¿Deseas borrar todos los datos y reiniciar la aplicación? Esto solucionará problemas de bloqueo.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const loadData = () => {
    const safeLoad = (key, defaultValue) => {
      try {
        const stored = localStorage.getItem(key);
        if (!stored) return defaultValue;
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : defaultValue;
      } catch (e) {
        console.error(`Error cargando ${key}:`, e);
        return defaultValue;
      }
    };

    const rawGastos = safeLoad('ss_gastos', []);

    const sanitizedGastos = rawGastos.map(g => ({
      ...g,
      categoria: typeof g.categoria === 'object' && g.categoria !== null ? (g.categoria.nombre || '') : String(g.categoria || ''),
      medioPago: typeof g.medioPago === 'object' && g.medioPago !== null ? (g.medioPago.nombre || '') : String(g.medioPago || ''),
      comercio: typeof g.comercio === 'object' && g.comercio !== null ? (g.comercio.nombre || '') : String(g.comercio || '')
    }));
    setGastos(sanitizedGastos);

    // Restauramos categorías básicas para que el modal funcione y no esté vacío
    const defaultCats = [
      { id: 'Comida', nombre: 'Comida' },
      { id: 'Transporte', nombre: 'Transporte' },
      { id: 'Entretenimiento', nombre: 'Entretenimiento' },
      { id: 'Servicios', nombre: 'Servicios' },
      { id: 'Otros', nombre: 'Otros' }
    ];
    const loadedCats = safeLoad('ss_categorias', defaultCats);
    setCategorias(loadedCats.length > 0 ? loadedCats : defaultCats);

    const defaultPayments = [
      { id: 'Efectivo', nombre: 'Efectivo' },
      { id: 'Tarjeta Débito', nombre: 'Tarjeta Débito' },
      { id: 'Tarjeta Crédito', nombre: 'Tarjeta Crédito' },
      { id: 'Billetera Digital', nombre: 'Billetera Digital' }
    ];
    const loadedPayments = safeLoad('ss_medios_pago', defaultPayments);
    setMediosPago(loadedPayments.length > 0 ? loadedPayments : defaultPayments);

    setComerciosData(safeLoad('ss_comercios', []));
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
    // Aseguramos que si el valor es un objeto, guardamos solo el nombre/texto
    const safeValue = (typeof value === 'object' && value !== null) ? (value.nombre || value.id || String(value)) : value;
    setFormData({ ...formData, [field]: safeValue });
  };

  const handleSaveGasto = () => {
    if (!formData.descripcion || !formData.valor || !formData.categoria || !formData.medioPago) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    let currentComercios = [...comercios]; // Copia actual de comercios
    
    if (editingId) {
      const updated = gastos.map(g => g.id === editingId ? { ...formData, id: editingId } : g);
      setGastos(updated);
      localStorage.setItem('ss_gastos', JSON.stringify(updated));
    } else {
      const newGasto = { ...formData, id: Date.now() };
      newGasto.valor = parseFloat(newGasto.valor) || 0;
      const updated = [...gastos, newGasto];
      setGastos(updated);
      localStorage.setItem('ss_gastos', JSON.stringify(updated));

      if (newGasto.comercio && typeof newGasto.comercio === 'string' && newGasto.comercio.trim() !== '' && !currentComercios.some(c => (c.nombre || c) === newGasto.comercio)) {
        currentComercios.push({ id: newGasto.comercio, nombre: newGasto.comercio });
        setComerciosData(currentComercios); // Actualizar el estado de comercios
        localStorage.setItem('ss_comercios', JSON.stringify(currentComercios)); // Guardar en localStorage
      }
    }
    
    setShowModal(false);
    setShowConfirm(false); // Asegurarse de que el diálogo de confirmación se cierre después de guardar
  };

  const handleDeleteGasto = (gasto) => {
    if (!gasto) return;
    setConfirmTitle('¿Eliminar gasto?');
    setConfirmMsg(`¿Estás seguro de eliminar "${gasto.descripcion}"? Esta acción no se puede deshacer.`);
    // IMPORTANTE: Para guardar una función en el estado se usa la sintaxis (() => () => { ... })
    setConfirmAction(() => () => {
      const filtered = gastos.filter(g => g.id !== gasto.id);
      setGastos(filtered);
      localStorage.setItem('ss_gastos', JSON.stringify(filtered));
      setShowConfirm(false); // Cerrar el diálogo de confirmación después de la acción
      setConfirmAction(null); // Limpiar la acción
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
            ⚠ Limpiar Datos
          </button>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Nuevo gasto
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-wrap">
        <div className="table-head">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
            ${totalGastos.toLocaleString('es-CO')}
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
                  <td style={{ color: 'var(--red)', fontWeight: '600' }}>${parseFloat(gasto.valor).toLocaleString('es-CO')}</td>
                  <td>
                    <span className={`badge badge-${gasto.estado === 'Activo' ? 'success' : 'danger'}`}>
                      {gasto.estado}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-sm btn-ghost" onClick={() => handleViewDetail(gasto)} title="Ver">
                        👁️
                      </button>
                      <button className="btn btn-sm btn-ghost" onClick={() => handleOpenModal(gasto)} title="Editar">
                        ✎
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteGasto(gasto)} title="Eliminar">
                        🗑️
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
              <button className="modal-close" onClick={() => handleCloseModal()}>✕</button>
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
                <label className="form-label">Categoria *</label>
                <select
                  className="form-select"
                  value={formData.categoria}
                  onChange={(e) => handleFormChange('categoria', e.target.value)}
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((cat, i) => (
                    <option key={cat.id || i} value={cat.nombre || cat}>
                      {String(cat.nombre || cat)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Medio de Pago *</label>
                <select
                  className="form-select"
                  value={formData.medioPago}
                  onChange={(e) => handleFormChange('medioPago', e.target.value)}
                >
                  <option value="">Selecciona un medio de pago</option>
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
                <label className="form-label">Comercio</label>
                <input
                  list="comercios-list"
                  className="form-input"
                  value={formData.comercio}
                  onChange={(e) => handleFormChange('comercio', e.target.value)}
                  placeholder="Escribe o selecciona un comercio"
                />
                <datalist id="comercios-list">
                  {comercios.map((com, i) => (
                    <option key={com.id || i} value={String(com.nombre || com)} />
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
              <button className="detail-close" onClick={() => setShowDetail(false)}>✕</button>
            </div>
            <div className="detail-body">
              <div className="detail-row">
                <span className="detail-label">Valor:</span>
                <span className="detail-value" style={{ color: 'var(--red)', fontWeight: '600' }}>
                  ${parseFloat(detailGasto.valor).toLocaleString('es-CO')}
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
          console.log('Confirm overlay clickeado, showConfirm establecido a false.'); // Debugging
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

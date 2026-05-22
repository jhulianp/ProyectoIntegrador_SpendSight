import { useEffect, useMemo, useState } from 'react';
import { fmtCOP, loadStorage, saveStorage } from '../utils/storage';
import '../Styles/categorias.css';

const DEFAULT_CONFIG = {
  nombres: 'Usuario Demo',
  apellidos: '',
  correo: 'demo@spendsight.com',
  tipoDoc: 'CC',
  documento: '',
  fechaNacimiento: '',
  telefono: '',
  edad: '',
  ciudad: '',
  pais: 'Colombia',
  direccion: '',
  moneda: 'COP',
  semana: 'lunes',
  presupuesto: '',
  notif: false,
  dashInicio: true,
};

export default function ConfigPage() {
  const session = useMemo(
    () => JSON.parse(window.localStorage.getItem('ss_session') || 'null'),
    []
  );
  const configKey = useMemo(
    () => (session ? `ss_config_${session.email || session.id}` : 'ss_config'),
    [session]
  );
  const suffix = useMemo(() => (session ? `_${session.email || session.id}` : null), [session]);
  const passKey = useMemo(
    () => (session ? `ss_pass_${session.email || session.id}` : 'ss_pass'),
    [session]
  );

  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [password, setPassword] = useState({ actual: '', nueva: '', confirmar: '' });
  const [passwordStrength, setPasswordStrength] = useState({ width: '0%', color: 'var(--red)', label: 'Muy débil' });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const stored = loadStorage(configKey, {});
    const initial = { ...DEFAULT_CONFIG, ...stored };
    if (session) {
      // Cargar todos los campos del perfil desde la sesión si no están en la config guardada
      if (session.nombres)        initial.nombres        = stored.nombres        ?? session.nombres;
      if (session.apellidos)      initial.apellidos      = stored.apellidos      ?? session.apellidos;
      if (session.email)          initial.correo         = stored.correo         ?? session.email;
      if (session.fechaNacimiento) initial.fechaNacimiento = stored.fechaNacimiento ?? session.fechaNacimiento;
      if (session.telefono)       initial.telefono       = stored.telefono       ?? session.telefono;
      if (session.direccion)      initial.direccion      = stored.direccion      ?? session.direccion;
      if (session.ciudad)         initial.ciudad         = stored.ciudad         ?? session.ciudad;
      if (session.pais)           initial.pais           = stored.pais           ?? session.pais;
    }
    
    setConfig(initial);
  }, [configKey, session]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const gastos = useMemo(() => (suffix !== null ? loadStorage(`ss_gastos${suffix}`, []) : []), [suffix]);
  const totalGastos = gastos.reduce((sum, gasto) => sum + (Number(gasto.valor) || 0), 0);
  const comercios = useMemo(() => (suffix !== null ? loadStorage(`ss_comercios${suffix}`, []) : []), [suffix]);
  const categorias = useMemo(() => (suffix !== null ? loadStorage(`ss_categorias${suffix}`, []) : []), [suffix]);

  const updateField = (key, value) => setConfig((prev) => ({ ...prev, [key]: value }));

  const saveProfile = () => {
    if (!config.nombres.trim() || !config.correo.trim()) {
      setToast({ message: 'Nombre y correo son obligatorios.', variant: 'error' });
      return;
    }
    saveStorage(configKey, config);

    // Actualizar también la sesión con los nuevos datos del perfil
    if (session) {
      const updatedSession = {
        ...session,
        nombres: config.nombres,
        apellidos: config.apellidos,
        email: config.correo,
        fechaNacimiento: config.fechaNacimiento,
        telefono: config.telefono,
        direccion: config.direccion,
        ciudad: config.ciudad,
        pais: config.pais,
      };
      window.localStorage.setItem('ss_session', JSON.stringify(updatedSession));
    }

    setToast({ message: 'Perfil actualizado', variant: 'success' });
  };

  const savePreferences = () => {
    saveStorage(configKey, config);
    setToast({ message: 'Preferencias guardadas', variant: 'info' });
  };

  const clearPassword = () => setPassword({ actual: '', nueva: '', confirmar: '' });

  const checkPasswordStrength = (value) => {
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;

    const levels = [
      { width: '20%', color: 'var(--red)', label: 'Muy débil' },
      { width: '40%', color: 'var(--orange)', label: 'Débil' },
      { width: '65%', color: 'var(--yellow)', label: 'Regular' },
      { width: '100%', color: 'var(--green)', label: 'Fuerte' },
    ];
    setPasswordStrength(levels[Math.min(score, 3)]);
  };

  const savePassword = () => {
    if (!password.nueva) {
      setToast({ message: 'Ingresa una nueva contraseña.', variant: 'error' });
      return;
    }
    if (password.nueva.length < 6) {
      setToast({ message: 'La contraseña debe tener al menos 6 caracteres.', variant: 'error' });
      return;
    }
    if (password.nueva !== password.confirmar) {
      setToast({ message: 'Las contraseñas no coinciden.', variant: 'error' });
      return;
    }

    const storedPass = window.localStorage.getItem(passKey) || '';
    if (storedPass && storedPass !== btoa(password.actual)) {
      setToast({ message: 'La contraseña actual es incorrecta.', variant: 'error' });
      return;
    }

    window.localStorage.setItem(passKey, btoa(password.nueva));
    clearPassword();
    setPasswordStrength({ width: '0%', color: 'var(--red)', label: 'Muy débil' });
    setToast({ message: 'Contraseña actualizada', variant: 'success' });
  };

  const clearAllData = () => {
    if (suffix !== null) {
      window.localStorage.removeItem(`ss_gastos${suffix}`);
      window.localStorage.removeItem(`ss_categorias${suffix}`);
      window.localStorage.removeItem(`ss_comercios${suffix}`);
      window.localStorage.removeItem(configKey);
      window.localStorage.removeItem(passKey);
    }
    setConfig(DEFAULT_CONFIG);
    setToast({ message: 'Todos los datos eliminados', variant: 'info' });
  };

  // Calcular edad a partir de fecha de nacimiento
  const calcularEdad = (fecha) => {
    if (!fecha) return '—';
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return `${edad} años`;
  };

  const initials = `${config.nombres?.[0] || ''}${config.apellidos?.[0] || ''}`.toUpperCase() || 'SS';

  return (
    <div className="config-grid">
      {/* Sidebar */}
      <div className="config-sidebar">
        <div className="profile-card">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-name">{`${config.nombres || ''} ${config.apellidos || ''}`.trim() || 'Usuario'}</div>
          <div className="profile-email">{config.correo || '—'}</div>
          <div className="profile-city">
            {config.ciudad ? `${config.ciudad}, ${config.pais}` : config.pais || '—'}
          </div>
          <div className="profile-stats">
            <div className="profile-stat"><span>Fecha nacimiento</span><span>{config.fechaNacimiento ? new Date(config.fechaNacimiento).toLocaleDateString('es-CO') : '—'}</span></div>
            <div className="profile-stat"><span>Edad</span><span>{calcularEdad(config.fechaNacimiento)}</span></div>
            <div className="profile-stat"><span>Teléfono</span><span>{config.telefono || '—'}</span></div>
            <div className="profile-stat"><span>Gastos registrados</span><span>{fmtCOP(totalGastos)}</span></div>
            <div className="profile-stat"><span>Comercios</span><span>{comercios.length}</span></div>
            <div className="profile-stat"><span>Categorías</span><span>{categorias.length}</span></div>
          </div>
        </div>

        <div className="danger-card">
          <div className="danger-title">Zona de peligro</div>
          <p style={{ color: 'var(--text2)', fontSize: '13px', lineHeight: 1.6, marginBottom: '14px' }}>
            Eliminar todos los datos restablecerá la app a su estado inicial.
          </p>
          <button className="btn btn-danger" onClick={clearAllData}>Eliminar datos</button>
        </div>
      </div>

      {/* Main content */}
      <div className="config-main">

        {/* Perfil personal */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="card-title">Perfil personal</div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombres *</label>
              <input className="form-input" value={config.nombres} onChange={(e) => updateField('nombres', e.target.value)} placeholder="Juan" />
            </div>
            <div className="form-group">
              <label className="form-label">Apellidos</label>
              <input className="form-input" value={config.apellidos || ''} onChange={(e) => updateField('apellidos', e.target.value)} placeholder="Pérez" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico *</label>
            <input className="form-input" type="email" value={config.correo} onChange={(e) => updateField('correo', e.target.value)} placeholder="tu@email.com" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fecha de nacimiento</label>
              <input
                className="form-input"
                type="date"
                value={config.fechaNacimiento || ''}
                onChange={(e) => updateField('fechaNacimiento', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input
                className="form-input"
                type="tel"
                value={config.telefono || ''}
                onChange={(e) => updateField('telefono', e.target.value)}
                placeholder="311 111 1111"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Dirección</label>
            <input
              className="form-input"
              value={config.direccion || ''}
              onChange={(e) => updateField('direccion', e.target.value)}
              placeholder="Cra 10 #23-45"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ciudad</label>
              <input
                className="form-input"
                value={config.ciudad || ''}
                onChange={(e) => updateField('ciudad', e.target.value)}
                placeholder="Bogotá"
              />
            </div>
            <div className="form-group">
              <label className="form-label">País</label>
              <input
                className="form-input"
                value={config.pais || ''}
                onChange={(e) => updateField('pais', e.target.value)}
                placeholder="Colombia"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tipo de documento</label>
              <select className="form-select" value={config.tipoDoc || 'CC'} onChange={(e) => updateField('tipoDoc', e.target.value)}>
                <option value="CC">Cédula de ciudadanía</option>
                <option value="CE">Cédula extranjería</option>
                <option value="PP">Pasaporte</option>
                <option value="NIT">NIT</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Número de documento</label>
              <input
                className="form-input"
                value={config.documento || ''}
                onChange={(e) => updateField('documento', e.target.value)}
                placeholder="123456789"
              />
            </div>
          </div>

          <button className="btn btn-primary" onClick={saveProfile}>Guardar perfil</button>
        </div>

        {/* Preferencias */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="card-title">Preferencias</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Moneda</label>
              <select className="form-select" value={config.moneda} onChange={(e) => updateField('moneda', e.target.value)}>
                <option value="COP">COP</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Inicio de semana</label>
              <select className="form-select" value={config.semana} onChange={(e) => updateField('semana', e.target.value)}>
                <option value="lunes">Lunes</option>
                <option value="domingo">Domingo</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Presupuesto mensual</label>
            <input className="form-input" type="number" value={config.presupuesto} onChange={(e) => updateField('presupuesto', e.target.value)} placeholder="0" />
          </div>
          <div className="form-row" style={{ alignItems: 'center' }}>
            <label className="toggle-switch">
              <input type="checkbox" checked={config.notif} onChange={(e) => updateField('notif', e.target.checked)} />
              <span className="toggle-track"><span className="toggle-thumb" /></span>
            </label>
            <div>
              <div className="form-label" style={{ marginBottom: 0 }}>Notificaciones</div>
              <div className="form-sub">Recibir alertas y recordatorios.</div>
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: '8px' }} onClick={savePreferences}>Guardar preferencias</button>
        </div>

        {/* Seguridad */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="card-title">Seguridad</div>
          <div className="form-group">
            <label className="form-label">Contraseña actual</label>
            <input className="form-input" type="password" value={password.actual} onChange={(e) => setPassword({ ...password, actual: e.target.value })} placeholder="Tu contraseña actual" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nueva contraseña</label>
              <input
                className="form-input"
                type="password"
                value={password.nueva}
                onChange={(e) => {
                  setPassword({ ...password, nueva: e.target.value });
                  checkPasswordStrength(e.target.value);
                }}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar contraseña</label>
              <input className="form-input" type="password" value={password.confirmar} onChange={(e) => setPassword({ ...password, confirmar: e.target.value })} placeholder="Repite la contraseña" />
            </div>
          </div>
          <div className="pass-strength-track">
            <div className="pass-strength-bar" style={{ width: passwordStrength.width, background: passwordStrength.color }} />
          </div>
          <div className="pass-strength-label" style={{ color: passwordStrength.color, marginBottom: '16px' }}>{passwordStrength.label}</div>
          <button className="btn btn-primary" onClick={savePassword}>Actualizar contraseña</button>
        </div>
      </div>

      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.variant}`}>{toast.message}</div>
        </div>
      )}
    </div>
  );
}
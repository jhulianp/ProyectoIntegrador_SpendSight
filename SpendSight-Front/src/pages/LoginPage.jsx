import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/auth.css';
import '../Styles/Inicio.css';
import Footer from '../components/Footer.jsx';
import { apiCall, ENDPOINTS } from '../utils/api';
import { notify } from '../utils/toastBus';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: '',
    password: '',
    nombres: '',
    apellidos: '',
    confirmPassword: '',
    avatar: 'A',
    fechaNacimiento: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: 'Colombia',
  });
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const switchTab = (tab) => {
    setIsLogin(tab === 'login');
    setAlert(null);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { email, password } = form;
    if (!email || !password) {
      setAlert({ type: 'error', message: 'Ingresa tu correo y contraseña.' });
      return;
    }

    // 1) Intentar contra el back
    const resp = await apiCall(ENDPOINTS.auth.login, {
      method: 'POST',
      body: { correo: email, password },
      silent: true,
    });

    if (resp.ok && resp.data) {
      const session = {
        ...resp.data,
        email: resp.data.correo,
        avatar: (resp.data.nombres || 'U')[0].toUpperCase(),
      };
      localStorage.removeItem('ss_session');
      localStorage.setItem('ss_session', JSON.stringify(session));
      notify({ message: 'Inicio de sesión exitoso', variant: 'success' });
      window.location.href = '/dashboard';
      return;
    }

    // 2) Si el back respondió con 401/400, son credenciales incorrectas
    if (!resp.offline) {
      setAlert({ type: 'error', message: resp.error || 'Credenciales incorrectas.' });
      return;
    }

    // 3) Fallback offline: validar contra localStorage
    notify({ message: '⚠ Backend no disponible — validando con datos locales', variant: 'warning' });
    const users = JSON.parse(localStorage.getItem('ss_usuarios') || '[]');
    const user = users.find(u => u.email === email && u.pass === btoa(password));

    if (user) {
      localStorage.removeItem('ss_session');
      const session = { ...user };
      delete session.pass;
      localStorage.setItem('ss_session', JSON.stringify(session));
      window.location.href = '/dashboard';
    } else {
      setAlert({ type: 'error', message: 'Credenciales incorrectas.' });
    }
  };

  const handleRegister = async () => {
    const { nombres, apellidos, email, password, confirmPassword, fechaNacimiento, telefono, direccion, ciudad, pais } = form;
    if (!nombres || !email || !password) {
      setAlert({ type: 'error', message: 'Completa los campos obligatorios.' });
      return;
    }
    if (password.length < 6) {
      setAlert({ type: 'error', message: 'La contraseña es muy corta (min 6).' });
      return;
    }
    if (password !== confirmPassword) {
      setAlert({ type: 'error', message: 'Las contraseñas no coinciden.' });
      return;
    }

    // Construimos el payload con los campos esperados por el back (Usuario)
    const edad = (() => {
      if (!fechaNacimiento) return 18;
      const d = new Date(fechaNacimiento);
      const diff = Date.now() - d.getTime();
      return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
    })();

    const payload = {
      nombres: `${nombres} ${apellidos || ''}`.trim(),
      correo: email,
      password,
      edad,
      telefono: telefono || '',
      direccion: direccion || '',
      ciudad: ciudad || '',
      pais: pais || 'Colombia',
      tipoDocumento: 'cedula',
      estado: 'Activo',
    };

    const resp = await apiCall(ENDPOINTS.auth.register, {
      method: 'POST',
      body: payload,
      silent: true,
    });

    if (resp.ok && resp.data) {
      const session = {
        ...resp.data,
        email: resp.data.correo,
        nombres,
        apellidos,
        fechaNacimiento,
        avatar: (nombres || 'U')[0].toUpperCase(),
      };
      localStorage.removeItem('ss_session');
      localStorage.setItem('ss_session', JSON.stringify(session));
      notify({ message: 'Cuenta creada exitosamente', variant: 'success' });
      window.location.href = '/dashboard';
      return;
    }

    // Si el back respondió con error de negocio (409 conflicto, etc.)
    if (!resp.offline) {
      setAlert({ type: 'error', message: resp.error || 'No se pudo registrar.' });
      return;
    }

    // Fallback offline: registrar en localStorage como antes
    notify({ message: '⚠ Backend no disponible — registrando localmente', variant: 'warning' });
    const users = JSON.parse(localStorage.getItem('ss_usuarios') || '[]');
    if (users.some(u => u.email === email)) {
      setAlert({ type: 'error', message: 'Este correo ya está registrado.' });
      return;
    }

    const newUser = {
      id: Date.now(),
      nombres,
      apellidos,
      email,
      pass: btoa(password),
      avatar: form.avatar,
      fechaNacimiento,
      telefono,
      direccion,
      ciudad,
      pais,
      fechaRegistro: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('ss_usuarios', JSON.stringify(users));

    localStorage.removeItem('ss_session');
    const session = { ...newUser };
    delete session.pass;
    localStorage.setItem('ss_session', JSON.stringify(session));
    window.location.href = '/dashboard';
  };

  const loginDemo = () => {
    localStorage.removeItem('ss_session');
    const demoUser = {
      id: 9999,
      nombres: 'Usuario Demo',
      apellidos: '',
      email: 'demo@spendsight.com',
      avatar: 'D',
      fechaNacimiento: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      pais: 'Colombia',
    };
    localStorage.setItem('ss_session', JSON.stringify(demoUser));
    window.location.href = '/dashboard';
  };

  return (
    <div className="auth-body" style={{ flexDirection: 'column', justifyContent: 'flex-start', paddingTop: 0 }}>
      <div className="auth-wrap" style={{ marginTop: 'auto', marginBottom: '40px', paddingTop: '60px' }}>
        <div className="auth-card">
          <div
            className="auth-logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', userSelect: 'none' }}
            title="Volver al inicio"
          >
            <div className="auth-logo-icon">SS</div>
            <span className="auth-logo-text">SpendSight</span>
          </div>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => switchTab('login')}
            >
              Iniciar Sesión
            </button>
            <button
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => switchTab('register')}
            >
              Registrarse
            </button>
          </div>

          {isLogin ? (
            <div className="auth-form active">
              <div className="auth-form-title">Bienvenido de vuelta</div>
              <div className="auth-form-sub">Ingresa tus credenciales para continuar</div>

              <div className="form-group">
                <label className="form-label">Correo electrónico</label>
                <input
                  className="form-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input
                  className="form-input"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleInputChange}
                  placeholder="Tu contraseña"
                />
              </div>

              <button className="btn-auth" onClick={handleLogin}>
                Iniciar Sesión
              </button>

              <div className="auth-divider">
                <span>o</span>
              </div>

              <button className="btn-auth btn-auth-ghost" onClick={loginDemo}>
                Acceso Demo
              </button>
            </div>
          ) : (
            <div className="auth-form active">
              <div className="auth-form-title">Crear cuenta</div>
              <div className="auth-form-sub">Únete a SpendSight — todos los campos con * son obligatorios</div>

              {/* Nombres y Apellidos */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nombres *</label>
                  <input
                    className="form-input"
                    name="nombres"
                    value={form.nombres}
                    onChange={handleInputChange}
                    placeholder="Juan"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Apellidos</label>
                  <input
                    className="form-input"
                    name="apellidos"
                    value={form.apellidos}
                    onChange={handleInputChange}
                    placeholder="Pérez"
                  />
                </div>
              </div>

              {/* Correo */}
              <div className="form-group">
                <label className="form-label">Correo electrónico *</label>
                <input
                  className="form-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                />
              </div>

              {/* Fecha de nacimiento y Teléfono */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Fecha de nacimiento</label>
                  <input
                    className="form-input"
                    type="date"
                    name="fechaNacimiento"
                    value={form.fechaNacimiento}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input
                    className="form-input"
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleInputChange}
                    placeholder="311 111 1111"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className="form-group">
                <label className="form-label">Dirección</label>
                <input
                  className="form-input"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleInputChange}
                  placeholder="Cra 10 #23-45"
                />
              </div>

              {/* Ciudad y País */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Ciudad</label>
                  <input
                    className="form-input"
                    name="ciudad"
                    value={form.ciudad}
                    onChange={handleInputChange}
                    placeholder="Bogotá"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">País</label>
                  <input
                    className="form-input"
                    name="pais"
                    value={form.pais}
                    onChange={handleInputChange}
                    placeholder="Colombia"
                  />
                </div>
              </div>

              {/* Contraseñas */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Contraseña *</label>
                  <input
                    className="form-input"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirmar contraseña</label>
                  <input
                    className="form-input"
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Repite tu contraseña"
                  />
                </div>
              </div>

              <button className="btn-auth" onClick={handleRegister}>
                Registrarse
              </button>
            </div>
          )}

          {alert && (
            <div className={`form-alert form-alert-${alert.type} show`}>
              {alert.message}
            </div>
          )}
        </div>
      </div>

      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <div className="noise-overlay"></div>

      {/* Footer */}
      <div className="auth-footer-wrap" style={{ width: '100%', marginTop: 'auto' }}>
        <Footer />
      </div>
    </div>
  );
}
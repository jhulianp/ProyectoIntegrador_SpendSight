import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/auth.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: '',
    password: '',
    nombres: '',
    apellidos: '',
    confirmPassword: '',
    avatar: 'A'
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

  const handleLogin = () => {
    const { email, password } = form;
    if (!email || !password) {
      setAlert({ type: 'error', message: 'Ingresa tu correo y contraseña.' });
      return;
    }

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

  const handleRegister = () => {
    const { nombres, apellidos, email, password, confirmPassword } = form;
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
      fechaRegistro: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('ss_usuarios', JSON.stringify(users));

    // Auto-login
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
      email: 'demo@spendsight.com',
      avatar: 'D'
    };
    localStorage.setItem('ss_session', JSON.stringify(demoUser));
    window.location.href = '/dashboard';
  };

  return (
    <div className="auth-body">
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-logo">
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
              <div className="auth-form-sub">Únete a SpendSight</div>

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
    </div>
  );
}

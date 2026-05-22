import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="land-footer">
      <div className="land-footer-inner">

        {/* Columna marca */}
        <div className="land-footer-brand">
          <div
            className="land-footer-logo"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
            title="Volver al inicio"
          >
            <div className="land-nav-logo-icon" style={{ width: 30, height: 30, fontSize: 11, borderRadius: 9 }}>SS</div>
            <span className="land-footer-logo-text">SpendSight</span>
          </div>
          <p className="land-footer-tagline">
            Control financiero personal.<br />Gratis, privado y sin complicaciones.
          </p>
          <div className="land-footer-copy">
            © {new Date().getFullYear()} SpendSight
          </div>
        </div>

        {/* Columna producto */}
        <div className="land-footer-col">
          <div className="land-footer-col-title">Producto</div>
          <ul className="land-footer-links">
            <li><a href="/#features">Funcionalidades</a></li>
            <li><a href="/#how">Cómo funciona</a></li>
            <li onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
              <span>Iniciar sesión</span>
            </li>
            <li onClick={() => navigate('/login?tab=register')} style={{ cursor: 'pointer' }}>
              <span>Registrarse</span>
            </li>
          </ul>
        </div>

        {/* Columna contáctenos */}
        <div className="land-footer-col">
          <div className="land-footer-col-title">Contáctenos</div>
          <ul className="land-footer-links land-footer-contact">
            <li>
              <span className="land-footer-contact-icon">✉</span>
              <a href="mailto:contactoSS@spendsight.co">contactoSS@spendsight.co</a>
            </li>
            <li>
              <span className="land-footer-contact-icon">📞</span>
              <a href="tel:+573022753289">+57 302 275 3289</a>
            </li>
            <li>
              <span className="land-footer-contact-icon">📍</span>
              <span>Medellin, Colombia</span>
            </li>
            <li>
              <span className="land-footer-contact-icon">🕐</span>
              <span>Lun – Vie, 9am – 6pm</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="land-footer-bottom">
        <span>Hecho en Colombia</span>
        <div className="land-footer-bottom-links">
          <span>Privacidad</span>
          <span>Términos</span>
          <span>Soporte</span>
        </div>
      </div>
    </footer>
  );
}
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Inicio.css';
import Footer from '../components/footer.jsx';

const features = [
  {
    icon: '📊',
    color: 'rgba(124,106,255,.15)',
    title: 'Dashboard en tiempo real',
    desc: 'Visualiza tus gastos con gráficas interactivas. Barras mensuales, distribución por categoría y tendencias al instante.',
  },
  {
    icon: '🏷️',
    color: 'rgba(248,113,113,.12)',
    title: 'Categorías personalizadas',
    desc: 'Organiza tus gastos con categorías de colores e íconos propios. Filtra, agrupa y entiende en qué va tu dinero.',
  },
  {
    icon: '🏪',
    color: 'rgba(52,211,153,.12)',
    title: 'Gestión de comercios',
    desc: 'Registra tiendas y proveedores. Consulta cuánto has gastado en cada comercio a lo largo del tiempo.',
  },
  {
    icon: '💳',
    color: 'rgba(96,165,250,.12)',
    title: 'Múltiples medios de pago',
    desc: 'Lleva el control por tarjeta, efectivo o billetera digital. Sabe exactamente cómo se distribuyen tus pagos.',
  },
  {
    icon: '🎯',
    color: 'rgba(251,191,36,.12)',
    title: 'Presupuesto mensual',
    desc: 'Establece un límite y monitorea tu saldo disponible en todo momento. Recibe alertas antes de excederte.',
  },
  {
    icon: '🔒',
    color: 'rgba(244,114,182,.12)',
    title: 'Privacidad total',
    desc: 'Tus datos se almacenan localmente en tu dispositivo. Sin servidores externos, sin rastreo, sin sorpresas.',
  },
];

const barHeights = [30, 55, 40, 70, 60, 85, 45, 90, 65, 78, 50, 95];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goToLogin = () => navigate('/login');
  const goToRegister = () => navigate('/login?tab=register');

  return (
    <div className="landing-root">
      {/* Background layers */}
      <div className="land-noise" />
      <div className="land-grid-bg" />
      <div className="land-orb land-orb-1" />
      <div className="land-orb land-orb-2" />
      <div className="land-orb land-orb-3" />

      <div className="land-content">

        {/* ── Navbar ── */}
        <nav className={`land-nav${scrolled ? ' scrolled' : ''}`}>
          <div className="land-nav-logo">
            <div className="land-nav-logo-icon">SS</div>
            <span className="land-nav-logo-text">SpendSight</span>
          </div>
          <ul className="land-nav-links">
            <li><a href="#features">Funciones</a></li>
            <li><a href="#how">Cómo funciona</a></li>
          </ul>
          <div className="land-nav-cta">
            <button className="land-btn-ghost" onClick={goToLogin}>Iniciar sesión</button>
            <button className="land-btn-primary" onClick={goToRegister}>
              Crear cuenta <span style={{ fontSize: '16px', lineHeight: 1 }}>→</span>
            </button>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="land-hero" ref={heroRef}>
          <div className="land-hero-badge">
            <span className="land-hero-badge-dot" />
            Control financiero personal — gratuito y privado
          </div>

          <h1 className="land-hero-title">
            Tu dinero,
            <span className="accent">perfectamente visible.</span>
          </h1>

          <p className="land-hero-sub">
            SpendSight te da el control total de tus finanzas personales.
            Registra gastos, visualiza patrones y toma mejores decisiones — sin complicaciones.
          </p>

          <div className="land-hero-actions">
            <button className="land-hero-btn-primary" onClick={goToRegister}>
              <span>Comenzar gratis</span>
              <span style={{ fontSize: '18px', lineHeight: 1 }}>→</span>
            </button>
            <button className="land-hero-btn-ghost" onClick={goToLogin}>
              <span style={{ fontSize: '16px' }}>▶</span>
              Acceso demo
            </button>
          </div>

          {/* Dashboard preview */}
          <div className="land-hero-mockup">
            <div className="land-mockup-glow" />
            <div className="land-mockup-frame">
              <div className="land-mockup-bar">
                <div className="land-mockup-dot" />
                <div className="land-mockup-dot" />
                <div className="land-mockup-dot" />
                <div className="land-mockup-url">app.spendsight.co / dashboard</div>
              </div>
              <div className="land-mockup-inner">
                <div className="land-mock-stat">
                  <div className="land-mock-stat-label">Gastos del mes</div>
                  <div className="land-mock-stat-value" style={{ color: '#f87171' }}>$2.4M</div>
                  <div className="land-mock-stat-sub">↑ 12% vs mes anterior</div>
                </div>
                <div className="land-mock-stat">
                  <div className="land-mock-stat-label">Presupuesto</div>
                  <div className="land-mock-stat-value" style={{ color: '#60a5fa' }}>$3.0M</div>
                  <div className="land-mock-stat-sub">establecido</div>
                </div>
                <div className="land-mock-stat">
                  <div className="land-mock-stat-label">Saldo disponible</div>
                  <div className="land-mock-stat-value" style={{ color: '#34d399' }}>$600K</div>
                  <div className="land-mock-stat-sub">20% restante</div>
                </div>
                <div className="land-mock-stat">
                  <div className="land-mock-stat-label">Transacciones</div>
                  <div className="land-mock-stat-value" style={{ color: '#c4b5fd' }}>48</div>
                  <div className="land-mock-stat-sub">este periodo</div>
                </div>
                <div className="land-mock-chart">
                  <div className="land-mock-chart-title">Gastos por mes — 2025</div>
                  <div className="land-mock-bars">
                    {barHeights.map((h, i) => (
                      <div
                        key={i}
                        className={`land-mock-bar${i === 11 ? ' highlight' : ''}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="land-mock-chart">
                  <div className="land-mock-chart-title">Por categoría</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { label: 'Alimentación', pct: 42, color: '#7c6aff' },
                      { label: 'Transporte', pct: 28, color: '#60a5fa' },
                      { label: 'Entretenimiento', pct: 18, color: '#f472b6' },
                      { label: 'Otros', pct: 12, color: '#34d399' },
                    ].map((c) => (
                      <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                        <span style={{ color: 'rgba(255,255,255,.4)', flex: 1 }}>{c.label}</span>
                        <div style={{ flex: 1.5, height: '3px', background: 'rgba(255,255,255,.07)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${c.pct}%`, height: '100%', background: c.color, borderRadius: '2px' }} />
                        </div>
                        <span style={{ color: 'rgba(255,255,255,.5)', minWidth: '28px', textAlign: 'right' }}>{c.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticker stats */}
          <div className="land-ticker">
            <div className="land-ticker-item">
              <div className="land-ticker-num">100%</div>
              <div className="land-ticker-label">Gratis</div>
            </div>
            <div className="land-ticker-sep" />
            <div className="land-ticker-item">
              <div className="land-ticker-num">0</div>
              <div className="land-ticker-label">Servidores externos</div>
            </div>
            <div className="land-ticker-sep" />
            <div className="land-ticker-item">
              <div className="land-ticker-num">∞</div>
              <div className="land-ticker-label">Gastos registrables</div>
            </div>
            <div className="land-ticker-sep" />
            <div className="land-ticker-item">
              <div className="land-ticker-num">5</div>
              <div className="land-ticker-label">Módulos integrados</div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(124,106,255,.15), transparent)', maxWidth: '1160px', margin: '0 auto' }} />

        {/* ── Features ── */}
        <section className="land-section" id="features">
          <div className="land-section-tag">Funcionalidades</div>
          <h2 className="land-section-title">Todo lo que necesitas para controlar tus gastos</h2>
          <p className="land-section-sub">
            Sin suscripciones, sin cuentas en la nube. Todo funciona directo en tu navegador.
          </p>
          <div className="land-features-grid">
            {features.map((f) => (
              <div className="land-feat-card" key={f.title}>
                <div className="land-feat-icon" style={{ background: f.color }}>
                  {f.icon}
                </div>
                <div className="land-feat-title">{f.title}</div>
                <div className="land-feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(124,106,255,.15), transparent)', maxWidth: '1160px', margin: '0 auto' }} />

        {/* ── How it works ── */}
        <section className="land-section" id="how">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="land-section-tag">Cómo funciona</div>
            <h2 className="land-section-title" style={{ maxWidth: '100%', textAlign: 'center', margin: '0 auto 18px' }}>
              En tres pasos, listo
            </h2>
            <p className="land-section-sub" style={{ maxWidth: '460px', margin: '0 auto', textAlign: 'center' }}>
              Sin configuraciones complicadas. Empieza a registrar en menos de un minuto.
            </p>
          </div>
          <div className="land-steps">
            <div className="land-step">
              <div className="land-step-num">1</div>
              <div className="land-step-title">Crea tu cuenta</div>
              <div className="land-step-desc">
                Regístrate en segundos. Solo tu nombre, correo y contraseña. Sin tarjeta de crédito.
              </div>
            </div>
            <div className="land-step">
              <div className="land-step-num">2</div>
              <div className="land-step-title">Registra tus gastos</div>
              <div className="land-step-desc">
                Agrega categorías, medios de pago y comercios. Registra cada transacción con todos sus detalles.
              </div>
            </div>
            <div className="land-step">
              <div className="land-step-num">3</div>
              <div className="land-step-title">Analiza y mejora</div>
              <div className="land-step-desc">
                Usa el dashboard para entender tus patrones de gasto y tomar decisiones financieras más inteligentes.
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA final ── */}
        <section className="land-cta-section">
          <div className="land-cta-card">
            <h2 className="land-cta-title">
              Empieza a ver<br />tu dinero diferente
            </h2>
            <p className="land-cta-sub">
              Únete ahora. Es gratis, es privado y está listo para usarse desde hoy.
            </p>
            <div className="land-cta-actions">
              <button className="land-hero-btn-primary" onClick={goToRegister}>
                Crear cuenta gratis <span style={{ fontSize: '18px' }}>→</span>
              </button>
              <button className="land-hero-btn-ghost" onClick={goToLogin}>
                Ya tengo cuenta
              </button>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <Footer />

      </div>
    </div>
  );
}
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../Styles/layout.css';
import '../Styles/components.css';
import '../Styles/categorias.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z' },
  { path: '/categorias', label: 'Categorias', icon: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01' },
  { path: '/comercios', label: 'Comercios', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22v-10h6v10' },
  { path: '/config', label: 'Mi Cuenta', icon: 'M12 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 12c0-4 3.6-7 8-7s8 3 8 7' },
];

const titleMap = {
  '/dashboard': 'Dashboard',
  '/categorias': 'Categorias',
  '/comercios': 'Comercios',
  '/config': 'Mi Cuenta',
};

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = titleMap[location.pathname] || 'SpendSight';
  const session = JSON.parse(localStorage.getItem('ss_session') || 'null');
  const userName = session?.nombres || session?.email || 'Usuario Demo';

  return (
    <>
      <aside className="sidebar">
        <div className="logo-wrap">
          <div className="logo-icon">SS</div>
          <span className="logo-text">SpendSight</span>
        </div>

        {navItems.slice(0, 3).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <span className="nav-icon">
              <svg viewBox="0 0 24 24">
                <path d={item.icon} />
              </svg>
            </span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}

        <NavLink
          to="/config"
          className={({ isActive }) => (isActive ? 'nav-item active sidebar-bottom' : 'nav-item sidebar-bottom')}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 12c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </span>
          <span className="nav-label">Mi Cuenta</span>
        </NavLink>
      </aside>

      <div className="main">
        <div className="topbar">
          <div className="topbar-title">{title}</div>
          <div className="topbar-right">
            <span className="chip">
              <span className="chip-dot"></span>
              En linea
            </span>
            <span className="topbar-username">{userName}</span>
            <NavLink className="avatar" to="/config" title="Mi cuenta">
              SS
            </NavLink>
            <button className="btn btn-ghost btn-sm" onClick={() => {
              localStorage.removeItem('ss_session');
              window.location.href = '/';
            }}>Salir</button>
          </div>
        </div>

        <div className="page active">
          <Outlet />
        </div>
      </div>
    </>
  );
}

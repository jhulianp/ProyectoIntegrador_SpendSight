import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import GastosPage from './pages/GastosPage';
import CategoriasPage from './pages/CategoriasPage';
import ComerciosPage from './pages/ComerciosPage';
import MediosPagoPage from './pages/MediosPagoPage';
import ConfigPage from './pages/ConfigPage';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/Iniciopage';

export default function App() {
  const session = localStorage.getItem('ss_session');

  return (
    <Routes>
      {/* Página de inicio pública */}
      <Route path="/" element={session ? <Navigate replace to="/dashboard" /> : <LandingPage />} />

      {/* Login / Registro */}
      <Route path="/login" element={session ? <Navigate replace to="/dashboard" /> : <LoginPage />} />

      {/* Rutas protegidas */}
      {session && (
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/gastos" element={<GastosPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/comercios" element={<ComerciosPage />} />
          <Route path="/medios-pago" element={<MediosPagoPage />} />
          <Route path="/config" element={<ConfigPage />} />
        </Route>
      )}

      {/* Fallback */}
      <Route path="*" element={<Navigate replace to={session ? "/dashboard" : "/"} />} />
    </Routes>
  );
}

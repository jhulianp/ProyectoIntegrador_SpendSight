import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import GastosPage from './pages/GastosPage';
import CategoriasPage from './pages/CategoriasPage';
import ComerciosPage from './pages/ComerciosPage';
import ConfigPage from './pages/ConfigPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const session = localStorage.getItem('ss_session');

  return (
    <Routes>
      <Route path="/" element={<Navigate replace to={session ? "/dashboard" : "/login"} />} />
      <Route path="/login" element={<LoginPage />} />
      {session && (
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/gastos" element={<GastosPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/comercios" element={<ComerciosPage />} />
          <Route path="/config" element={<ConfigPage />} />
        </Route>
      )}
      <Route path="*" element={<Navigate replace to={session ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}
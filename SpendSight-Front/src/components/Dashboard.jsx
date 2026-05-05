import React, { useState, useEffect } from 'react';
import '../Styles/dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalExpenses: 0,
    transactionCount: 0,
    paymentMethods: 0,
    categories: 0,
    stores: 0
  });
  const [currentDate, setCurrentDate] = useState('');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [monthFilter, setMonthFilter] = useState(-1);

  useEffect(() => {
    initializeDashboard();
  }, [yearFilter, monthFilter]);

  const initializeDashboard = () => {
    setCurrentDate(new Date().toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    // Aquí irá la lógica para cargar datos del backend/localStorage
  };

  return (
    <div className="dashboard-container">
      {/* Header con fecha y filtros */}
      <div className="dashboard-header">
        <div>
          <div className="section-title">Resumen General</div>
          <div className="section-sub">{currentDate}</div>
        </div>
        <div className="filter-group">
          <select 
            className="form-select" 
            value={yearFilter}
            onChange={(e) => setYearFilter(Number(e.target.value))}
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
          </select>
          <select 
            className="form-select" 
            value={monthFilter}
            onChange={(e) => setMonthFilter(Number(e.target.value))}
          >
            <option value={-1}>Todo el año</option>
            <option value={0}>Enero</option>
            <option value={1}>Febrero</option>
            <option value={2}>Marzo</option>
            <option value={3}>Abril</option>
            <option value={4}>Mayo</option>
            <option value={5}>Junio</option>
            <option value={6}>Julio</option>
            <option value={7}>Agosto</option>
            <option value={8}>Septiembre</option>
            <option value={9}>Octubre</option>
            <option value={10}>Noviembre</option>
            <option value={11}>Diciembre</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap">
            <svg viewBox="0 0 24 24">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="stat-label">Gastos del periodo</div>
          <div className="stat-value" style={{ color: 'var(--red)' }}>
            ${stats.totalExpenses}
          </div>
          <div className="stat-change">{stats.transactionCount} transacciones</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap">
            <svg viewBox="0 0 24 24">
              <rect x="1" y="4" width="22" height="16" rx="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <div className="stat-label">Medios de Pago</div>
          <div className="stat-value" style={{ color: 'var(--accent3)' }}>
            {stats.paymentMethods}
          </div>
          <div className="stat-change">activos</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap">
            <svg viewBox="0 0 24 24">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          </div>
          <div className="stat-label">Categorias</div>
          <div className="stat-value" style={{ color: 'var(--yellow)' }}>
            {stats.categories}
          </div>
          <div className="stat-change">registradas</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap">
            <svg viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className="stat-label">Comercios</div>
          <div className="stat-value" style={{ color: 'var(--green)' }}>
            {stats.stores}
          </div>
          <div className="stat-change">registrados</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Bar Chart */}
        <div className="card">
          <div className="card-title">
            Gastos por Mes <span className="card-badge">{yearFilter}</span>
          </div>
          <div className="chart-wrap" id="chart-bars"></div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--red)' }}></div>
              Gastos
            </div>
          </div>
        </div>

        {/* Ring Chart */}
        <div className="card">
          <div className="card-title">
            Por Categoria <span className="card-badge">Periodo</span>
          </div>
          <div className="ring-wrap">
            <div className="ring-chart">
              <svg width="120" height="120" viewBox="0 0 120 120" id="ring-svg">
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--bg3)" strokeWidth="13" />
              </svg>
              <div className="ring-center">
                <div className="ring-center-val" id="ring-total">$0</div>
                <div className="ring-center-label">total</div>
              </div>
            </div>
            <div className="cat-list" id="cat-summary"></div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="card-title">
          Ultimas Transacciones <span className="card-badge" id="tx-count-badge">0</span>
        </div>
        <div className="tx-list" id="recent-tx"></div>
      </div>
    </div>
  );
}

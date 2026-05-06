import React, { useState, useEffect, useMemo } from 'react';
import { fmtCOP, loadStorage } from '../utils/storage';
import '../Styles/dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalExpenses: 0,
    transactionCount: 0,
    paymentMethods: 0,
    categories: 0,
    stores: 0,
    budget: 0 // Añadido el presupuesto al estado
  });
  const [currentDate, setCurrentDate] = useState('');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [monthFilter, setMonthFilter] = useState(-1);

  // Identificar la sesión actual para usar las claves de almacenamiento correctas
  const currentSession = useMemo(() => JSON.parse(localStorage.getItem('ss_session') || 'null'), []);
  const suffix = useMemo(() => (currentSession ? `_${currentSession.email || currentSession.id}` : null), [currentSession]);
  const configKey = useMemo(() => (currentSession ? `ss_config_${currentSession.email || currentSession.id}` : 'ss_config'), [currentSession]);

  // Recuperar datos base desde el almacenamiento
  const gastos = useMemo(() => (suffix !== null ? loadStorage(`ss_gastos${suffix}`, []) : []), [suffix]);
  const categorias = useMemo(() => (suffix !== null ? loadStorage(`ss_categorias${suffix}`, []) : []), [suffix]);
  const comercios = useMemo(() => (suffix !== null ? loadStorage(`ss_comercios${suffix}`, []) : []), [suffix]);
  const mediosPago = useMemo(() => (suffix !== null ? loadStorage(`ss_medios_pago${suffix}`, []) : []), [suffix]);

  // Filtrar gastos por el periodo seleccionado
  const filteredGastos = useMemo(() => {
    return gastos.filter(g => {
      const d = new Date(g.fecha);
      const matchYear = d.getFullYear() === yearFilter;
      const matchMonth = monthFilter === -1 || d.getMonth() === monthFilter;
      return matchYear && matchMonth;
    });
  }, [gastos, yearFilter, monthFilter]);

  // Procesar datos para la gráfica de barras (mensual)
  const monthlyData = useMemo(() => {
    const data = Array(12).fill(0);
    gastos.forEach(g => {
      const d = new Date(g.fecha);
      if (d.getFullYear() === yearFilter) {
        data[d.getMonth()] += (Number(g.valor) || 0);
      }
    });
    return data;
  }, [gastos, yearFilter]);

  const maxMonthly = Math.max(...monthlyData, 1);

  // Procesar distribución por categorías
  const catDistribution = useMemo(() => {
    const dist = {};
    filteredGastos.forEach(g => {
      const cat = g.categoria || 'Sin categoría';
      dist[cat] = (dist[cat] || 0) + (Number(g.valor) || 0);
    });
    return Object.entries(dist).sort((a, b) => b[1] - a[1]);
  }, [filteredGastos]);

  // Obtener las últimas 5 transacciones del periodo
  const recentTransactions = useMemo(() => {
    return [...filteredGastos]
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 5);
  }, [filteredGastos]);

  // Constante para la circunferencia del anillo (radio 48)
  const circumference = 2 * Math.PI * 48;

  // Calcular segmentos para el gráfico de anillo
  const ringSegments = useMemo(() => {
    if (stats.totalExpenses === 0) return [];

    let cumulativeOffset = 0;
    const segments = catDistribution.map(([name, val]) => {
      const catInfo = categorias.find(c => c.nombre === name);
      const color = catInfo?.color || 'var(--accent)';
      const percentage = (val / stats.totalExpenses) * 100;
      const segmentLength = (percentage / 100) * circumference;

      const segment = { color, percentage, segmentLength, offset: cumulativeOffset };
      cumulativeOffset += segmentLength;
      return segment;
    });
    // Ordenar los segmentos para que el más grande esté al final y se dibuje encima de los más pequeños si hay superposición mínima
    return segments.sort((a, b) => a.offset - b.offset);
  }, [catDistribution, stats.totalExpenses, categorias, circumference]);

  useEffect(() => {
    if (currentSession) initializeDashboard(); // Solo inicializar si hay una sesión activa
    else resetDashboard(); // Limpiar el dashboard si no hay sesión
  }, [yearFilter, monthFilter, gastos, suffix, currentSession]); 

  const initializeDashboard = () => {
    const userConfig = loadStorage(configKey, {});
    setCurrentDate(new Date().toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    
    setStats({
      totalExpenses: filteredGastos.reduce((sum, g) => sum + (Number(g.valor) || 0), 0),
      transactionCount: filteredGastos.length,
      paymentMethods: mediosPago.length || 4,
      categories: categorias.length || 5,
      stores: comercios.length,
      // Si el filtro es "Todo el año" (-1), multiplicamos el presupuesto mensual por 12
      budget: monthFilter === -1 ? (Number(userConfig.presupuesto || 0) * 12) : Number(userConfig.presupuesto || 0)
    });
  };

  const resetDashboard = () => {
    setCurrentDate(new Date().toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    setStats({
      totalExpenses: 0, transactionCount: 0, paymentMethods: 0, categories: 0, stores: 0, budget: 0
    });
    // También podrías limpiar los datos de gastos, categorías, etc. si fueran estados locales
    // setGastos([]); setCategorias([]); etc.
  };

  const monthsLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  return (
    <div className="dashboard-container" style={{ color: 'white' }}>
      <h1>Dashboard</h1>
      <p>Fecha: {currentDate}</p>
      
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
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
            {fmtCOP(stats.totalExpenses)}
          </div>
          <div className="stat-change">{stats.transactionCount} transacciones</div>
        </div>

        {/* Nueva Tarjeta de Estadísticas para el Presupuesto */}
        <div className="stat-card">
          <div className="stat-icon-wrap">
            <svg viewBox="0 0 24 24">
              <path d="M12 2c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-1-10h2v6h-2z" />
            </svg>
          </div>
          <div className="stat-label">Presupuesto {monthFilter === -1 ? 'Anual' : 'Mensual'}</div>
          <div className="stat-value" style={{ color: 'var(--blue)' }}>
            {fmtCOP(stats.budget)}
          </div>
          <div className="stat-change">establecido</div>
        </div>

        {/* Nueva Tarjeta de Saldo Disponible (Presupuesto - Gastos) */}
        <div className="stat-card">
          <div className="stat-icon-wrap">
            <svg viewBox="0 0 24 24">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="stat-label">Saldo Disponible</div>
          <div className="stat-value" style={{ color: (stats.budget - stats.totalExpenses) >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {fmtCOP(stats.budget - stats.totalExpenses)}
          </div>
          <div className="stat-change">
            {stats.budget > 0 
              ? `${Math.max(0, ((1 - stats.totalExpenses / stats.budget) * 100)).toFixed(1)}% restante` 
              : 'Sin presupuesto'}
          </div>
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
          <div className="chart-wrap" id="chart-bars">
            {monthsLabels.map((month, idx) => (
              <div key={month} className="bar-group">
                <div 
                  className="bar" 
                  style={{ height: `${(monthlyData[idx] / maxMonthly) * 100}%` }}
                  title={`${month}: ${fmtCOP(monthlyData[idx])}`}
                ></div>
                <div className="bar-label">{month}</div>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--red)' }}></div>
              Gastos
            </div>
          </div>
        </div>

        {/* Ring Chart */}
        <div className="card" style={{ flex: '1 1 400px' }}>
          <div className="card-title">
            Por Categoria <span className="card-badge">Periodo</span>
          </div>
          <div className="ring-wrap" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div className="ring-chart">
              <svg width="120" height="120" viewBox="0 0 120 120" id="ring-svg">
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--bg3)" strokeWidth="13" />
                {/* Segmentos del anillo */}
                {ringSegments.map((segment, index) => (
                  <circle
                    key={index}
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="13"
                    strokeDasharray={`${segment.segmentLength} ${circumference}`}
                    strokeDashoffset={-segment.offset}
                    transform="rotate(-90 60 60)" /* Inicia el dibujo desde la parte superior */
                  />
                ))}
              </svg>
              <div className="ring-center">
                <div className="ring-center-val" id="ring-total">{fmtCOP(stats.totalExpenses)}</div>
                <div className="ring-center-label">total</div>
              </div>
            </div>
            <div className="cat-list" id="cat-summary">
              {catDistribution.slice(0, 4).map(([name, val]) => {
                const catInfo = categorias.find(c => c.nombre === name);
                const color = catInfo?.color || 'var(--accent)';
                const pct = stats.totalExpenses > 0 ? (val / stats.totalExpenses) * 100 : 0;
                return (
                  <div key={name} className="cat-row">
                    <div className="cat-dot" style={{ background: color }}></div>
                    <div className="cat-name">{name}</div>
                    <div className="cat-bar-wrap">
                      <div className="cat-bar-fill" style={{ background: color, width: `${pct}%` }}></div>
                    </div>
                    <div className="cat-pct">{pct.toFixed(0)}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="card-title">
          Últimas Transacciones <span className="card-badge" id="tx-count-badge">{stats.transactionCount}</span>
        </div>
        <div className="tx-list" id="recent-tx">
          {recentTransactions.length > 0 ? (
            recentTransactions.map(tx => (
              <div key={tx.id} className="tx-item">
                <div className="tx-icon">💸</div>
                <div className="tx-info">
                  <div className="tx-name">{tx.descripcion}</div>
                  <div className="tx-meta">{tx.fecha} • {tx.categoria}</div>
                </div>
                <div className="tx-amount">-{fmtCOP(tx.valor)}</div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)' }}>
              No hay transacciones registradas en este periodo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

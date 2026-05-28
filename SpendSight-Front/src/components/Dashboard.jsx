import React, { useState, useEffect, useMemo } from 'react';
import { fmtCOP, loadStorage } from '../utils/storage';
import { gastosResource, categoriasResource, mediosPagoResource, comerciosResource } from '../utils/resources';
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

  // Estados para Inteligencia Artificial y Limpieza en Python
  const [pythonAnalysis, setPythonAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  // Estados para datos del backend
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [comercios, setComercios] = useState([]);
  const [mediosPago, setMediosPago] = useState([]);

  // Identificación de sesión y configuración
  const session = useMemo(() => JSON.parse(localStorage.getItem('ss_session') || 'null'), []);
  const suffix = useMemo(() => (session ? `_${session.email || session.id}` : null), [session]);
  const configKey = useMemo(() => (session ? `ss_config_${session.email || session.id}` : 'ss_config'), [session]);

  useEffect(() => {
    if (session) {
      loadAllData();
    } else {
      resetDashboard();
    }
  }, [yearFilter, monthFilter, suffix, session]);

  const loadAllData = async () => {
    try {
      const [g, c, m, co] = await Promise.all([
        gastosResource.list(),
        categoriasResource.list(),
        mediosPagoResource.list(),
        comerciosResource.list()
      ]);
      
      setGastos(g);
      setCategorias(c);
      setMediosPago(m);
      setComercios(co);
      
      initializeDashboard(g, c, m, co);
      runPythonAnalysis(g);
    } catch (err) {
      console.error("Error cargando el dashboard", err);
    }
  };

  const initializeDashboard = (dataGastos, dataCats, dataMeds, dataComs) => {
    const userConfig = loadStorage(configKey, {});
    const filtered = dataGastos.filter(g => {
      const d = new Date(g.fecha);
      return d.getFullYear() === yearFilter && (monthFilter === -1 || d.getMonth() === monthFilter);
    });

    setCurrentDate(new Date().toLocaleDateString('es-ES', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    }));
    
    setStats({
      totalExpenses: filtered.reduce((sum, g) => sum + (Number(g.valor) || 0), 0),
      transactionCount: filtered.length,
      paymentMethods: dataMeds.length,
      categories: dataCats.length,
      stores: dataComs.length,
      budget: monthFilter === -1 ? (Number(userConfig.presupuesto || 0) * 12) : Number(userConfig.presupuesto || 0)
    });
  };

  const resetDashboard = () => {
    setCurrentDate(new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    setStats({ totalExpenses: 0, transactionCount: 0, paymentMethods: 0, categories: 0, stores: 0, budget: 0 });
  };

  const runPythonAnalysis = async (dataToAnalyze = gastos) => {
    // Filtramos los datos por el periodo seleccionado (año y mes) antes de enviarlos
    const filtered = dataToAnalyze.filter(g => {
      const d = new Date(g.fecha);
      return d.getFullYear() === yearFilter && (monthFilter === -1 || d.getMonth() === monthFilter);
    });

    if (!filtered.length) {
      setPythonAnalysis(null);
      return;
    }

    setLoadingAnalysis(true);
    setAnalysisError(null);
    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filtered),
      });
      const result = await response.json();
      if (result.ok) setPythonAnalysis(result);
      else throw new Error(result.error);
    } catch (err) {
      setAnalysisError(err.message || 'Error conectando con el motor Python');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const monthsLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  return (
    <div className="dashboard-container" style={{ color: 'white' }}>
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div className="section-title">Resumen General</div>
          <div className="section-sub">{currentDate}</div>
        </div>
        <div className="filter-group" style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => runPythonAnalysis()} disabled={loadingAnalysis}>
            {loadingAnalysis ? 'Sincronizando...' : 'Recalcular'}
          </button>
          <select className="form-select" value={yearFilter} onChange={(e) => setYearFilter(Number(e.target.value))}>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select 
            className="form-select" 
            value={monthFilter} 
            onChange={(e) => setMonthFilter(Number(e.target.value))}
          >
            <option value={-1}>Todo el año</option>
            {monthsLabels.map((name, idx) => (
              <option key={idx} value={idx}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap">
            <svg viewBox="0 0 24 24">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="stat-label">Gastos del periodo</div>
          <div className="stat-value" style={{ color: 'var(--red)' }}>
            {pythonAnalysis ? fmtCOP(pythonAnalysis.charts.total) : '...'}
          </div>
          <div className="stat-change">{pythonAnalysis ? pythonAnalysis.charts.count : '...'} transacciones</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap">
            <svg viewBox="0 0 24 24">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <div className="stat-label">Proyección Próximo Mes</div>
          <div className="stat-value" style={{ color: 'var(--blue)' }}>
            {pythonAnalysis ? fmtCOP(pythonAnalysis.projection.nextMonthProjected) : '...'}
          </div>
          <div className="stat-change" style={{ color: pythonAnalysis?.projection.trend.includes('alza') ? 'var(--red)' : 'var(--green)' }}>
            {pythonAnalysis?.projection.trend || 'Analizando...'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
          </div>
          <div className="stat-label">Saldo Disponible</div>
          <div className="stat-value" style={{ color: (stats.budget - (pythonAnalysis?.charts.total || 0)) >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {fmtCOP(stats.budget - (pythonAnalysis?.charts.total || 0))}
          </div>
          <div className="stat-change">De {fmtCOP(stats.budget)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap">
            <svg viewBox="0 0 24 24">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          </div>
          <div className="stat-label">Categorías</div>
          <div className="stat-value" style={{ color: 'var(--yellow)' }}>
            {stats.categories}
          </div>
          <div className="stat-change">Categorías registradas</div>
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
          <div className="stat-change">Comercios registrados</div>
        </div>

      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="card-title">
            Gastos por Mes <span className="card-badge">{yearFilter}</span>
          </div>
          <div className="chart-wrap" id="chart-bars">
            {pythonAnalysis ? pythonAnalysis.charts.monthly.map((val, idx) => (
              <div key={idx} className="bar-group">
                <div 
                  className="bar" 
                  style={{ height: `${(val / Math.max(...pythonAnalysis.charts.monthly, 1)) * 100}%` }}
                  title={`${monthsLabels[idx]}: ${fmtCOP(val)}`}
                ></div>
                <div className="bar-label">{monthsLabels[idx]}</div>
              </div>
            )) : <div className="loading-text">Cargando análisis de datos...</div>}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--red)' }}></div>
              Gastos
            </div>
          </div>
        </div>

        <div className="card" style={{ flex: '1 1 400px' }}>
          <div className="card-title">
            Por Categoria <span className="card-badge">Periodo</span>
          </div>
          <div className="ring-wrap" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div className="ring-chart">
              <svg width="120" height="120" viewBox="0 0 120 120" id="ring-svg">
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--bg3)" strokeWidth="13" />
                {pythonAnalysis && pythonAnalysis.charts.categories.reduce((acc, cat, i) => {
                  const circumference = 2 * Math.PI * 48;
                  const pct = (cat.value / pythonAnalysis.charts.total) * 100;
                  const len = (pct / 100) * circumference;
                  const catInfo = categorias.find(c => c.nombre === cat.name);
                  const color = catInfo?.color || 'var(--accent)';
                  acc.elements.push(
                    <circle key={i} cx="60" cy="60" r="48" fill="none" stroke={color} strokeWidth="13"
                      strokeDasharray={`${len} ${circumference}`} strokeDashoffset={-acc.offset} transform="rotate(-90 60 60)" />
                  );
                  acc.offset += len;
                  return acc;
                }, { elements: [], offset: 0 }).elements}
              </svg>
              <div className="ring-center">
                <div className="ring-center-val">{fmtCOP(pythonAnalysis?.charts.total || 0)}</div>
                <div className="ring-center-label">total</div>
              </div>
            </div>
            <div className="cat-list" id="cat-summary">
              {pythonAnalysis && pythonAnalysis.charts.categories.slice(0, 4).map((cat) => {
                const catInfo = categorias.find(c => c.nombre === cat.name);
                const color = catInfo?.color || 'var(--accent)';
                const pct = (cat.value / pythonAnalysis.charts.total) * 100;
                return (
                  <div key={cat.name} className="cat-row">
                    <div className="cat-dot" style={{ background: color }}></div>
                    <div className="cat-name">{cat.name}</div>
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

      <div className="charts-grid" style={{ marginTop: '2rem' }}>
        {pythonAnalysis ? (
          <>
            <div className="card">
              <div className="card-title">Insights de Ahorro (Python)</div>
              <div className="recommendations-list">
                {pythonAnalysis.recommendations.map((rec, i) => (
                  <div key={i} className="recommendation-item" dangerouslySetInnerHTML={{ __html: rec.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Anomalías Detectadas</div>
              <div className="anomalies-list">
                {pythonAnalysis.anomalies.length > 0 ? (
                  pythonAnalysis.anomalies.map((anom, i) => (
                    <div key={i} className="anomaly-item">
                      <div className="anomaly-info">
                        <div className="anomaly-desc">{anom.descripcion}</div>
                        <div className="anomaly-meta">{anom.fecha}</div>
                      </div>
                      <div className="anomaly-value">{fmtCOP(anom.valor)}</div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state-text">No se detectaron gastos inusuales en este periodo.</div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="loading-text">{loadingAnalysis ? 'Analizando con Python...' : 'Esperando ejecución del motor...'}</div>
        )}
      </div>

      <div className="card">
        <div className="card-title">
          Últimas Transacciones <span className="card-badge" id="tx-count-badge">{stats.transactionCount}</span>
        </div>
        <div className="tx-list" id="recent-tx">
          {pythonAnalysis && pythonAnalysis.charts.recent.length > 0 ? (
            pythonAnalysis.charts.recent.map((tx, idx) => (
              <div key={tx.id || idx} className="tx-item">
                <div className="tx-icon">$</div>
                <div className="tx-info">
                  <div className="tx-name">{tx.descripcion}</div>
                  <div className="tx-meta">{tx.fecha} • {tx.categoria}</div>
                </div>
                <div className="tx-amount">-{fmtCOP(tx.valor)}</div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)' }}>
              No se encontraron transacciones para el periodo seleccionado.
            </div>
          )}
        </div>
      </div>

      {analysisError && (
        <div className="python-error-box" style={{ marginTop: '20px', padding: '15px', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid #dc2626', borderRadius: '8px', color: 'white' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Motor de Análisis no disponible</div>
          <div style={{ fontSize: '13px' }}>{analysisError}</div>
          <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '8px' }}>Asegúrate de ejecutar <code>python main.py</code> en la carpeta <code>Python/</code>.</div>
        </div>
      )}
    </div>
  );
}

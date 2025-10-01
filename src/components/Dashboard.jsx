import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../styles/Dashboard.css';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Iconos personalizados por estado
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="map-marker" style="background-color: ${color};"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  });
};

const stateIcons = {
  nuevo: createCustomIcon('#FC8181'),
  en_revision: createCustomIcon('#5A67D8'),
  atendido: createCustomIcon('#48BB78')
};

// Registro de elementos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const STATE_COLORS = {
  nuevo: { bg: 'rgba(252, 129, 129, 0.8)', border: 'rgba(252, 129, 129, 1)' },
  en_revision: { bg: 'rgba(90, 103, 216, 0.8)', border: 'rgba(90, 103, 216, 1)' },
  atendido: { bg: 'rgba(72, 187, 120, 0.8)', border: 'rgba(72, 187, 120, 1)' }
};

const CATEGORY_PALETTE = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { success, error: showError, info } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('overview'); // overview, list, map, stats
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Filtros
  const [filterState, setFilterState] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch de reportes
  useEffect(() => {
    setLoading(true);
    const fetchReports = async () => {
      try {
        const res = await fetch('http://localhost:3001/reportes');
        if (!res.ok) throw new Error(`Error fetching reports: ${res.status}`);
        const data = await res.json();
        setReports(data);
      } catch (err) {
        setError(err.message);
        const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
        setReports(storedReports);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
    
    // Auto-refresh cada 30 segundos
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, []);

  // Reportes filtrados
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Filtro por estado
      if (filterState !== 'all' && report.state !== filterState) return false;
      
      // Filtro por categoría
      if (filterCategory !== 'all' && report.category !== filterCategory) return false;
      
      // Filtro por fecha desde
      if (filterDateFrom && new Date(report.timestamp) < new Date(filterDateFrom)) return false;
      
      // Filtro por fecha hasta
      if (filterDateTo && new Date(report.timestamp) > new Date(filterDateTo)) return false;
      
      // Búsqueda por texto
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          report.title?.toLowerCase().includes(search) ||
          report.description?.toLowerCase().includes(search)
        );
      }
      
      return true;
    });
  }, [reports, filterState, filterCategory, filterDateFrom, filterDateTo, searchTerm]);

  // Estadísticas
  const statsByState = useMemo(() => filteredReports.reduce((acc, report) => {
    acc[report.state] = (acc[report.state] || 0) + 1;
    return acc;
  }, {}), [filteredReports]);

  const statsByCategory = useMemo(() => filteredReports.reduce((acc, report) => {
    const cat = (report.category || 'Sin Categoría').replace(/_/g, ' ');
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {}), [filteredReports]);

  const categories = useMemo(() => {
    const cats = new Set(reports.map(r => r.category));
    return Array.from(cats);
  }, [reports]);

  // Datos para gráficos
  const stateData = useMemo(() => ({
    labels: ['Nuevos', 'En Revisión', 'Atendidos'],
    datasets: [{
      label: 'Número de Reportes',
      data: [
        statsByState.nuevo || 0,
        statsByState.en_revision || 0,
        statsByState.atendido || 0
      ],
      backgroundColor: [
        STATE_COLORS.nuevo.bg,
        STATE_COLORS.en_revision.bg,
        STATE_COLORS.atendido.bg
      ],
      borderColor: [
        STATE_COLORS.nuevo.border,
        STATE_COLORS.en_revision.border,
        STATE_COLORS.atendido.border
      ],
      borderWidth: 1
    }]
  }), [statsByState]);

  const categoryData = useMemo(() => ({
    labels: Object.keys(statsByCategory),
    datasets: [{
      label: 'Reportes por Categoría',
      data: Object.values(statsByCategory),
      backgroundColor: CATEGORY_PALETTE.slice(0, Object.keys(statsByCategory).length),
      hoverBackgroundColor: CATEGORY_PALETTE.slice(0, Object.keys(statsByCategory).length)
    }]
  }), [statsByCategory]);

  // Gráfico de tendencia temporal
  const timelineData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const counts = last7Days.map(date => {
      return filteredReports.filter(r => 
        r.timestamp && r.timestamp.split('T')[0] === date
      ).length;
    });

    return {
      labels: last7Days.map(d => new Date(d).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Reportes por Día',
        data: counts,
        borderColor: 'rgb(90, 103, 216)',
        backgroundColor: 'rgba(90, 103, 216, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }, [filteredReports]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    }
  };

  // Funciones de gestión
  const handleDeleteReport = useCallback(async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este reporte?')) return;
    
    try {
      const res = await fetch(`http://localhost:3001/reportes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Error deleting report: ${res.status}`);
      setReports(reports.filter(report => String(report.id) !== String(id)));
      success('Reporte eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting report:', error);
      showError('Error al eliminar el reporte');
    }
  }, [reports, success, showError]);

  const handleUpdateState = useCallback(async (id, newState) => {
    try {
      const res = await fetch(`http://localhost:3001/reportes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: newState })
      });
      if (!res.ok) throw new Error(`Error updating report: ${res.status}`);
      
      const updatedReport = await res.json();
      setReports(reports.map(report => 
        String(report.id) === String(id) ? updatedReport : report
      ));
      success('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error updating report state:', error);
      showError('Error al actualizar el estado');
    }
  }, [reports, success, showError]);

  // Exportar a CSV
  const exportToCSV = useCallback(() => {
    try {
      const headers = ['ID', 'Título', 'Descripción', 'Estado', 'Categoría', 'Latitud', 'Longitud', 'Fecha'];
      const rows = filteredReports.map(r => [
        r.id,
        r.title || '',
        r.description || '',
        r.state || '',
        r.category || '',
        r.lat || '',
        r.lng || '',
        r.timestamp ? new Date(r.timestamp).toLocaleString('es-ES') : ''
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `reportes_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      success('Archivo CSV descargado exitosamente');
    } catch (error) {
      showError('Error al exportar el archivo CSV');
    }
  }, [filteredReports, success, showError]);

  const clearFilters = () => {
    setFilterState('all');
    setFilterCategory('all');
    setFilterDateFrom('');
    setFilterDateTo('');
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          {sidebarOpen && <h2>Dashboard</h2>}
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
        
        {sidebarOpen && (
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeView === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveView('overview')}
            >
              📊 Resumen General
            </button>
            <button 
              className={`nav-item ${activeView === 'list' ? 'active' : ''}`}
              onClick={() => setActiveView('list')}
            >
              📋 Lista de Reportes
            </button>
            <button 
              className={`nav-item ${activeView === 'map' ? 'active' : ''}`}
              onClick={() => setActiveView('map')}
            >
              🗺️ Mapa Interactivo
            </button>
            <button 
              className={`nav-item ${activeView === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveView('stats')}
            >
              📈 Estadísticas Detalladas
            </button>
            
            <div className="sidebar-divider"></div>
            
            <button className="nav-item export-btn" onClick={exportToCSV}>
              💾 Exportar CSV
            </button>
          </nav>
        )}
      </aside>

      {/* Main Content */}
      <main className={`dashboard-main ${sidebarOpen ? '' : 'full-width'}`}>
        {/* Header con filtros */}
        <div className="dashboard-header">
          <div className="header-top">
            <div>
              <h1 className="dashboard-title">Panel de Control</h1>
              <p className="dashboard-subtitle">
                Mostrando {filteredReports.length} de {reports.length} reportes
                <span className="live-indicator">● En vivo</span>
              </p>
            </div>
          </div>

          {/* Filtros */}
          <div className="filters-container">
            <input
              type="text"
              placeholder="🔍 Buscar por título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            
            <select value={filterState} onChange={(e) => setFilterState(e.target.value)} className="filter-select">
              <option value="all">Todos los estados</option>
              <option value="nuevo">Nuevos</option>
              <option value="en_revision">En Revisión</option>
              <option value="atendido">Atendidos</option>
            </select>

            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
              <option value="all">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
              ))}
            </select>

            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="filter-date"
              placeholder="Desde"
            />

            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="filter-date"
              placeholder="Hasta"
            />

            <button onClick={clearFilters} className="clear-filters-btn">
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Vista Resumen General */}
        {activeView === 'overview' && (
          <div className="overview-content">
            {/* Tarjetas de estadísticas */}
            <div className="dashboard-stats">
              <div className="stat-card total">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>Total de Reportes</h3>
                  <p className="stat-number">{filteredReports.length}</p>
                </div>
              </div>
              <div className="stat-card nuevo">
                <div className="stat-icon">🆕</div>
                <div className="stat-info">
                  <h3>Nuevos</h3>
                  <p className="stat-number">{statsByState.nuevo || 0}</p>
                </div>
              </div>
              <div className="stat-card revision">
                <div className="stat-icon">🔍</div>
                <div className="stat-info">
                  <h3>En Revisión</h3>
                  <p className="stat-number">{statsByState.en_revision || 0}</p>
                </div>
              </div>
              <div className="stat-card atendido">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>Atendidos</h3>
                  <p className="stat-number">{statsByState.atendido || 0}</p>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="dashboard-charts">
              <div className="chart-container">
                <h2>Tendencia de Reportes (Últimos 7 días)</h2>
                <div className="chart-wrapper">
                  <Line data={timelineData} options={chartOptions} />
                </div>
              </div>
              <div className="chart-container">
                <h2>Distribución por Estado</h2>
                <div className="chart-wrapper">
                  <Bar data={stateData} options={chartOptions} />
                </div>
              </div>
            </div>

            <div className="dashboard-charts">
              <div className="chart-container">
                <h2>Reportes por Categoría</h2>
                <div className="chart-wrapper">
                  <Pie data={categoryData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vista Lista de Reportes */}
        {activeView === 'list' && (
          <div className="list-content">
            <div className="reports-table-container">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Categoría</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map(report => (
                    <tr key={report.id}>
                      <td>{report.id}</td>
                      <td>
                        <button 
                          onClick={() => navigate(`/report/${report.id}`)}
                          className="report-title-link"
                          title="Ver detalles"
                        >
                          {report.title}
                        </button>
                      </td>
                      <td className="description-cell">{report.description}</td>
                      <td>
                        <span className={`status-badge ${report.state}`}>
                          {report.state?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td>{report.category?.replace(/_/g, ' ')}</td>
                      <td>{report.timestamp ? new Date(report.timestamp).toLocaleDateString('es-ES') : '-'}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => navigate(`/report/${report.id}`)}
                            className="view-btn-small"
                            title="Ver detalles"
                          >
                            👁️
                          </button>
                          <select 
                            value={report.state} 
                            onChange={(e) => handleUpdateState(report.id, e.target.value)}
                            className="state-select"
                          >
                            <option value="nuevo">Nuevo</option>
                            <option value="en_revision">En Revisión</option>
                            <option value="atendido">Atendido</option>
                          </select>
                          <button 
                            onClick={() => handleDeleteReport(report.id)}
                            className="delete-btn-small"
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredReports.length === 0 && (
                <div className="no-results">
                  <p>No se encontraron reportes con los filtros aplicados</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vista Mapa */}
        {activeView === 'map' && (
          <div className="map-content">
            <div className="map-legend">
              <h3>Leyenda</h3>
              <div className="legend-item">
                <span className="legend-marker nuevo"></span>
                <span>Nuevos ({statsByState.nuevo || 0})</span>
              </div>
              <div className="legend-item">
                <span className="legend-marker revision"></span>
                <span>En Revisión ({statsByState.en_revision || 0})</span>
              </div>
              <div className="legend-item">
                <span className="legend-marker atendido"></span>
                <span>Atendidos ({statsByState.atendido || 0})</span>
              </div>
            </div>
            
            <div className="map-container-wrapper">
              <MapContainer
                center={[9.9281, -84.0907]}
                zoom={10}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredReports.map(report => (
                  report.lat && report.lng && (
                    <Marker
                      key={report.id}
                      position={[report.lat, report.lng]}
                      icon={stateIcons[report.state] || stateIcons.nuevo}
                    >
                      <Popup>
                        <div className="map-popup">
                          <h4>{report.title}</h4>
                          <p><strong>Estado:</strong> {report.state?.replace(/_/g, ' ')}</p>
                          <p><strong>Categoría:</strong> {report.category?.replace(/_/g, ' ')}</p>
                          <p>{report.description}</p>
                          <p><small>{report.timestamp ? new Date(report.timestamp).toLocaleString('es-ES') : ''}</small></p>
                          <button 
                            onClick={() => navigate(`/report/${report.id}`)}
                            className="popup-view-btn"
                          >
                            Ver detalles →
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  )
                ))}
              </MapContainer>
            </div>
          </div>
        )}

        {/* Vista Estadísticas Detalladas */}
        {activeView === 'stats' && (
          <div className="stats-content">
            <div className="stats-grid">
              <div className="stat-detail-card">
                <h3>Métricas Generales</h3>
                <div className="metric-row">
                  <span>Total de Reportes:</span>
                  <strong>{reports.length}</strong>
                </div>
                <div className="metric-row">
                  <span>Reportes Filtrados:</span>
                  <strong>{filteredReports.length}</strong>
                </div>
                <div className="metric-row">
                  <span>Tasa de Atención:</span>
                  <strong>
                    {reports.length > 0 
                      ? ((statsByState.atendido || 0) / reports.length * 100).toFixed(1) 
                      : 0}%
                  </strong>
                </div>
                <div className="metric-row">
                  <span>Pendientes:</span>
                  <strong>{(statsByState.nuevo || 0) + (statsByState.en_revision || 0)}</strong>
                </div>
              </div>

              <div className="stat-detail-card">
                <h3>Por Estado</h3>
                <div className="metric-row">
                  <span>🆕 Nuevos:</span>
                  <strong className="orange">{statsByState.nuevo || 0}</strong>
                </div>
                <div className="metric-row">
                  <span>🔍 En Revisión:</span>
                  <strong className="blue">{statsByState.en_revision || 0}</strong>
                </div>
                <div className="metric-row">
                  <span>✅ Atendidos:</span>
                  <strong className="green">{statsByState.atendido || 0}</strong>
                </div>
              </div>

              <div className="stat-detail-card">
                <h3>Por Categoría</h3>
                {Object.entries(statsByCategory).map(([cat, count]) => (
                  <div key={cat} className="metric-row">
                    <span>{cat}:</span>
                    <strong>{count}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-charts">
              <div className="chart-container">
                <h2>Reportes por Estado</h2>
                <div className="chart-wrapper">
                  <Bar data={stateData} options={chartOptions} />
                </div>
              </div>
              <div className="chart-container">
                <h2>Reportes por Categoría</h2>
                <div className="chart-wrapper">
                  <Pie data={categoryData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import '../styles/Dashboard.css';

// Registro de elementos de Chart.js necesarios para el dashboard
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Constantes de color para los gráficos, mejorando la mantenibilidad
const STATE_COLORS = {
  nuevo: { bg: 'rgba(255, 159, 64, 0.8)', border: 'rgba(255, 159, 64, 1)' },
  en_revision: { bg: 'rgba(54, 162, 235, 0.8)', border: 'rgba(54, 162, 235, 1)' },
  atendido: { bg: 'rgba(75, 192, 192, 0.8)', border: 'rgba(75, 192, 192, 1)' }
};

const CATEGORY_PALETTE = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false); // Cambiado a false ya que el fetch inicia en useEffect
  const [error, setError] = useState('');

  // useEffect para la carga inicial de datos
  useEffect(() => {
    setLoading(true); // Iniciar carga al montar
    const fetchReports = async () => {
      try {
        const res = await fetch('http://localhost:3001/reportes');
        if (!res.ok) {
          throw new Error(`Error fetching reports: ${res.status}`);
        }
        const data = await res.json();
        setReports(data);
      } catch (err) {
        setError(err.message);
        // Respaldo a localStorage si la API falla
        const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
        setReports(storedReports);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // useMemo para memorizar el cálculo de estadísticas (optimización de rendimiento)
  const statsByState = useMemo(() => reports.reduce((acc, report) => {
    acc[report.state] = (acc[report.state] || 0) + 1;
    return acc;
  }, {}), [reports]);

  const statsByCategory = useMemo(() => reports.reduce((acc, report) => {
    const cat = (report.category || 'Sin Categoría').replace(/_/g, ' ');
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {}), [reports]);

  // useMemo para los datos del gráfico de estados
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

  // useMemo para los datos del gráfico de categorías
  const categoryData = useMemo(() => ({
    labels: Object.keys(statsByCategory),
    datasets: [{
      label: 'Reportes por Categoría',
      data: Object.values(statsByCategory),
      // Usar slice para no exceder la paleta si hay más categorías
      backgroundColor: CATEGORY_PALETTE.slice(0, Object.keys(statsByCategory).length),
      hoverBackgroundColor: CATEGORY_PALETTE.slice(0, Object.keys(statsByCategory).length)
    }]
  }), [statsByCategory]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Estadísticas de Reportes' }
    }
  };

  // useCallback para funciones de interacción (eliminar reporte)
  const handleDeleteReport = useCallback(async (id) => {
    // BUENA PRÁCTICA: Pedir confirmación antes de eliminar
    if (!window.confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
        return;
    }
    try {
      const res = await fetch(`http://localhost:3001/reportes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Error deleting report: ${res.status}`);
      const updatedReports = reports.filter(report => String(report.id) !== String(id));
      setReports(updatedReports);
    } catch (error) {
      console.error('Error deleting report:', error);
      // Respaldo a localStorage si la API falla
      const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
      const updatedReports = storedReports.filter(report => String(report.id) !== String(id));
      localStorage.setItem('reports', JSON.stringify(updatedReports));
      setReports(updatedReports);
    }
  }, [reports]);

  // useCallback para funcion de interaccion (actualizar estado)
  const handleUpdateState = useCallback(async (id, newState) => {
    try {
      const res = await fetch(`http://localhost:3001/reportes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: newState })
      });
      if (!res.ok) throw new Error(`Error updating report: ${res.status}`);
      
      // Obtener el reporte actualizado del servidor
      const updatedReport = await res.json();
      const updatedReports = reports.map(report => 
        String(report.id) === String(id) ? updatedReport : report
      );
      setReports(updatedReports);
    } catch (error) {
      console.error('Error updating report state:', error);
      // Respaldo a localStorage si la API falla
      const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
      const updatedReports = storedReports.map(report => 
        String(report.id) === String(id) ? { ...report, state: newState } : report
      );
      localStorage.setItem('reports', JSON.stringify(updatedReports));
      setReports(updatedReports);
    }
  }, [reports]);

  // Estado de carga
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Cargando dashboard...</div>
      </div>
    );
  }

  // Estado de error (solo se muestra si no hay reportes de respaldo)
  if (error && reports.length === 0) {
    return (
      <div className="dashboard-container">
        <div className="error-message">Error crítico: {error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard de Reportes</h1>
        <p className="dashboard-subtitle">Estadísticas y métricas de los reportes ciudadanos</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total de Reportes</h3>
          <p className="stat-number">{reports.length}</p>
        </div>
        <div className="stat-card">
          <h3>Nuevos</h3>
          <p className="stat-number orange">{statsByState.nuevo || 0}</p>
        </div>
        <div className="stat-card">
          <h3>En Revisión</h3>
          <p className="stat-number blue">{statsByState.en_revision || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Atendidos</h3>
          <p className="stat-number green">{statsByState.atendido || 0}</p>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-container">
          <h2>Reportes por Estado</h2>
          <Bar data={stateData} options={options} />
        </div>
        <div className="chart-container">
          <h2>Reportes por Categoría</h2>
          <Pie data={categoryData} options={options} />
        </div>
      </div>

      <div className="recent-reports">
        <h2>Reportes Recientes</h2>
        <div className="reports-list">
          {reports.slice(0, 5).map(report => (
            <div key={report.id} className="report-item">
              <h4>{report.title}</h4>
              <p>{(report.description || '').substring(0, 100)}...</p>
              <p><strong>Estado:</strong> {(report.state || 'desconocido').replace(/_/g, ' ')}</p>
              <p>
                {/* Manejo de timestamp nulo para evitar fallos */}
                <strong>Fecha:</strong> {report.timestamp ? new Date(report.timestamp).toLocaleDateString() : 'Fecha Desconocida'}
              </p>
              <div className="state-buttons">
                <button 
                  onClick={() => handleUpdateState(report.id, 'nuevo')} 
                  className={`state-button nuevo ${report.state === 'nuevo' ? 'active' : ''}`}
                >
                  Nuevo
                </button>
                <button 
                  onClick={() => handleUpdateState(report.id, 'en_revision')} 
                  className={`state-button revision ${report.state === 'en_revision' ? 'active' : ''}`}
                >
                  En Revisión
                </button>
                <button 
                  onClick={() => handleUpdateState(report.id, 'atendido')} 
                  className={`state-button atendido ${report.state === 'atendido' ? 'active' : ''}`}
                >
                  Atendido
                </button>
              </div>
              <button 
                onClick={() => handleDeleteReport(report.id)} 
                className="delete-button"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
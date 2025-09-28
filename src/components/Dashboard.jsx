import React, { useState, useEffect } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
        // Fallback to localStorage if API fails
        const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
        setReports(storedReports);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Stats calculation
  const statsByState = reports.reduce((acc, report) => {
    acc[report.state] = (acc[report.state] || 0) + 1;
    return acc;
  }, {});

  const statsByCategory = reports.reduce((acc, report) => {
    const cat = report.category.replace(/_/g, ' ');
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  // Chart data for states (Bar chart)
  const stateData = {
    labels: ['Nuevos', 'En Revisión', 'Atendidos'],
    datasets: [
      {
        label: 'Número de Reportes',
        data: [
          statsByState.nuevo || 0,
          statsByState.en_revision || 0,
          statsByState.atendido || 0
        ],
        backgroundColor: [
          'rgba(255, 159, 64, 0.8)', // Orange for new
          'rgba(54, 162, 235, 0.8)', // Blue for in review
          'rgba(75, 192, 192, 0.8)'  // Green for attended
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Chart data for categories (Pie chart)
  const categoryData = {
    labels: Object.keys(statsByCategory),
    datasets: [
      {
        label: 'Reportes por Categoría',
        data: Object.values(statsByCategory),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Estadísticas de Reportes'
      }
    }
  };

const handleDeleteReport = async (id) => {
  try {
    const res = await fetch(`http://localhost:3001/reportes/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Error deleting report: ${res.status}`);
    const updatedReports = reports.filter(report => report.id !== id);
    setReports(updatedReports);
  } catch (error) {
    console.error('Error deleting report:', error);
    // Fallback to localStorage
    const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
    const updatedReports = storedReports.filter(report => report.id !== id);
    localStorage.setItem('reports', JSON.stringify(updatedReports));
    setReports(updatedReports);
  }
};

const handleUpdateState = async (id, newState) => {
  try {
    const res = await fetch(`http://localhost:3001/reportes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: newState })
    });
    if (!res.ok) throw new Error(`Error updating report: ${res.status}`);
    const updatedReports = reports.map(report => 
      report.id === id ? { ...report, state: newState } : report
    );
    setReports(updatedReports);
  } catch (error) {
    console.error('Error updating report state:', error);
    // Fallback to localStorage
    const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
    const updatedReports = storedReports.map(report => 
      report.id === id ? { ...report, state: newState } : report
    );
    localStorage.setItem('reports', JSON.stringify(updatedReports));
    setReports(updatedReports);
  }
};

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Cargando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">Error: {error}</div>
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
              <p>{report.description.substring(0, 100)}...</p>
              <p><strong>Estado:</strong> {report.state.replace(/_/g, ' ')}</p>
              <p><strong>Fecha:</strong> {new Date(report.timestamp).toLocaleDateString()}</p>
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
              <button onClick={() => handleDeleteReport(report.id)} className="delete-button">Eliminar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

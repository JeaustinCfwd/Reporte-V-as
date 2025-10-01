import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/ReportDetail.css';

// Fix para iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const STATE_CONFIG = {
  nuevo: { 
    label: 'Nuevo', 
    color: '#FC8181', 
    icon: '🆕',
    description: 'Reporte recién creado, pendiente de revisión'
  },
  en_revision: { 
    label: 'En Revisión', 
    color: '#5A67D8', 
    icon: '🔍',
    description: 'El reporte está siendo evaluado por las autoridades'
  },
  atendido: { 
    label: 'Atendido', 
    color: '#48BB78', 
    icon: '✅',
    description: 'El problema ha sido resuelto'
  }
};

const CATEGORY_CONFIG = {
  baches: { label: 'Baches', icon: '🕳️' },
  senalizacion: { label: 'Señalización', icon: '🚧' },
  iluminacion: { label: 'Iluminación', icon: '💡' },
  limpieza: { label: 'Limpieza', icon: '🧹' },
  vegetacion: { label: 'Vegetación', icon: '🌿' },
  drenaje: { label: 'Drenaje', icon: '💧' },
  otro: { label: 'Otro', icon: '📋' }
};

const ReportDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [stateHistory, setStateHistory] = useState([]);

  useEffect(() => {
    fetchReportDetail();
  }, [id]);

  const fetchReportDetail = async () => {
    try {
      const res = await fetch(`http://localhost:3001/reportes/${id}`);
      if (!res.ok) throw new Error('Reporte no encontrado');
      const data = await res.json();
      setReport(data);
      
      // Generar historial de estados (simulado)
      generateStateHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateStateHistory = (reportData) => {
    const history = [];
    const createdDate = new Date(reportData.timestamp);
    
    history.push({
      state: 'nuevo',
      date: createdDate,
      description: 'Reporte creado por el ciudadano'
    });

    if (reportData.state === 'en_revision' || reportData.state === 'atendido') {
      const revisionDate = new Date(createdDate);
      revisionDate.setHours(revisionDate.getHours() + 24);
      history.push({
        state: 'en_revision',
        date: revisionDate,
        description: 'Reporte en proceso de evaluación'
      });
    }

    if (reportData.state === 'atendido') {
      const resolvedDate = new Date(createdDate);
      resolvedDate.setDate(resolvedDate.getDate() + 7);
      history.push({
        state: 'atendido',
        date: resolvedDate,
        description: 'Problema resuelto satisfactoriamente'
      });
    }

    setStateHistory(history);
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    if (report.photos && currentImageIndex < report.photos.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="spinner"></div>
        <p>Cargando detalles del reporte...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="detail-error">
        <div className="error-icon">⚠️</div>
        <h2>Reporte no encontrado</h2>
        <p>{error || 'El reporte que buscas no existe o ha sido eliminado.'}</p>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          Volver al Dashboard
        </button>
      </div>
    );
  }

  const stateConfig = STATE_CONFIG[report.state] || STATE_CONFIG.nuevo;
  const categoryConfig = CATEGORY_CONFIG[report.category] || CATEGORY_CONFIG.otro;

  return (
    <div className="report-detail-container">
      {/* Header */}
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="btn-back-small">
          ← Volver
        </button>
        <div className="detail-header-info">
          <span className="report-id">Reporte #{report.id}</span>
          <span className={`state-badge-large ${report.state}`}>
            {stateConfig.icon} {stateConfig.label}
          </span>
        </div>
      </div>

      <div className="detail-content">
        {/* Columna Izquierda */}
        <div className="detail-left">
          {/* Información Principal */}
          <div className="detail-card">
            <div className="card-header">
              <h1 className="report-title">{report.title}</h1>
              <span className="category-badge">
                {categoryConfig.icon} {categoryConfig.label}
              </span>
            </div>

            <div className="report-meta">
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <div>
                  <span className="meta-label">Fecha de reporte</span>
                  <span className="meta-value">
                    {new Date(report.timestamp).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              
              {report.rating && (
                <div className="meta-item">
                  <span className="meta-icon">⭐</span>
                  <div>
                    <span className="meta-label">Severidad</span>
                    <span className="meta-value">
                      {report.rating}/5 - {report.rating >= 4 ? 'Alta' : report.rating >= 3 ? 'Media' : 'Baja'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="report-description">
              <h3>Descripción</h3>
              <p>{report.description || 'Sin descripción proporcionada.'}</p>
            </div>

            {report.contact && (
              <div className="report-contact">
                <h3>Información de contacto</h3>
                <p>📧 {report.contact}</p>
              </div>
            )}
          </div>

          {/* Galería de Imágenes */}
          {report.photos && report.photos.length > 0 && (
            <div className="detail-card">
              <h3>Galería de imágenes ({report.photos.length})</h3>
              <div className="image-gallery">
                {report.photos.map((photo, index) => (
                  <div 
                    key={index} 
                    className="gallery-item"
                    onClick={() => openLightbox(index)}
                  >
                    <img src={photo} alt={`Foto ${index + 1}`} />
                    <div className="gallery-overlay">
                      <span>🔍 Ver</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mapa de Ubicación */}
          {report.lat && report.lng && (
            <div className="detail-card">
              <h3>📍 Ubicación del reporte</h3>
              <div className="detail-map">
                <MapContainer
                  center={[report.lat, report.lng]}
                  zoom={15}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker position={[report.lat, report.lng]}>
                    <Popup>
                      <strong>{report.title}</strong>
                      <br />
                      {report.category}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              <div className="coordinates">
                <span>Lat: {report.lat.toFixed(6)}</span>
                <span>Lng: {report.lng.toFixed(6)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha */}
        <div className="detail-right">
          {/* Estado Actual */}
          <div className="detail-card state-card">
            <h3>Estado actual</h3>
            <div className="current-state" style={{ borderColor: stateConfig.color }}>
              <div className="state-icon" style={{ background: stateConfig.color }}>
                {stateConfig.icon}
              </div>
              <div className="state-info">
                <h4>{stateConfig.label}</h4>
                <p>{stateConfig.description}</p>
              </div>
            </div>
          </div>

          {/* Historial de Estados */}
          <div className="detail-card">
            <h3>📋 Historial de cambios</h3>
            <div className="timeline">
              {stateHistory.map((item, index) => {
                const config = STATE_CONFIG[item.state];
                return (
                  <div key={index} className="timeline-item">
                    <div 
                      className="timeline-marker"
                      style={{ background: config.color }}
                    >
                      {config.icon}
                    </div>
                    <div className="timeline-content">
                      <h4>{config.label}</h4>
                      <p className="timeline-description">{item.description}</p>
                      <span className="timeline-date">
                        {item.date.toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Acciones */}
          <div className="detail-card">
            <h3>Acciones</h3>
            <div className="action-buttons-vertical">
              <button 
                className="btn-action primary"
                onClick={() => navigate('/dashboard')}
              >
                📊 Ver todos los reportes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox para imágenes */}
      {lightboxOpen && report.photos && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              ✕
            </button>
            
            {report.photos.length > 1 && (
              <>
                <button 
                  className="lightbox-nav prev" 
                  onClick={prevImage}
                  disabled={currentImageIndex === 0}
                >
                  ‹
                </button>
                <button 
                  className="lightbox-nav next" 
                  onClick={nextImage}
                  disabled={currentImageIndex === report.photos.length - 1}
                >
                  ›
                </button>
              </>
            )}
            
            <img 
              src={report.photos[currentImageIndex]} 
              alt={`Imagen ${currentImageIndex + 1}`}
              className="lightbox-image"
            />
            
            <div className="lightbox-counter">
              {currentImageIndex + 1} / {report.photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDetailView;

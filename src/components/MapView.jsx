import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/MapView.css';

const MapView = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
    setReports(storedReports);
  }, []);
  const center = [9.7489, -83.7534]; // Costa Rica center

  return (
    <div className="mapa-container">
      <MapContainer center={center} zoom={8} style={{ height: '600px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {reports.length > 0 && reports.map(report => {
          const fillColor = report.state === 'nuevo' ? '#ff6b35' : // Orange
                           report.state === 'en_revision' ? '#3b82f6' : // Blue
                           '#10b981'; // Green for atendido
          return (
            <CircleMarker
              key={report.id}
              center={[report.lat, report.lng]}
              radius={8}
              fillColor={fillColor}
              color="#fff"
              weight={2}
              opacity={1}
              fillOpacity={0.8}
            >
              <Popup>
                <div>
                  <h3>{report.title}</h3>
                  <p><strong>Categoría:</strong> {report.category.replace(/_/g, ' ')}</p>
                  <p><strong>Estado:</strong> {report.state.replace(/_/g, ' ')}</p>
                  <p>{report.description}</p>
                  {report.timestamp && <p><strong>Fecha:</strong> {new Date(report.timestamp).toLocaleDateString()}</p>}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      {reports.length === 0 && (
        <div className="no-reports-overlay">
          <p className="no-reports-message">No hay reportes para mostrar en el mapa.</p>
        </div>
      )}
    </div>
  );
};

export default MapView;

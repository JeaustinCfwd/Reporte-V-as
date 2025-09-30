import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/MapView.css';

const MapView = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('http://localhost:3001/reportes');
        if (!res.ok) throw new Error('Error al cargar reportes');
        const data = await res.json();
        // Filtrar solo reportes con coordenadas válidas
        const validReports = data.filter(r => r.lat && r.lng);
        setReports(validReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
        // Respaldo a localStorage si falla el API
        const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
        setReports(storedReports);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const center = [9.7489, -83.7534]; // Centro de Costa Rica
  
  // Límites geográficos de Costa Rica
  const costaRicaBounds = [
    [8.0, -86.0],  // Suroeste (lat, lng)
    [11.5, -82.5]  // Noreste (lat, lng)
  ];

  return (
    <div className="map-view-wrapper">
      <div className="map-header">
        <h1>Mapa de Reportes</h1>
      </div>
      <div className="map-wrapper">
        {loading ? (
          <div className="loading-map">Cargando mapa...</div>
        ) : (
          <MapContainer 
            center={center} 
            zoom={8} 
            minZoom={7}
            maxZoom={18}
            maxBounds={costaRicaBounds}
            maxBoundsViscosity={1.0}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          {reports.length > 0 && reports.map(report => {
            const fillColor = report.state === 'nuevo' ? '#ff6b35' : // Naranja
                             report.state === 'en_revision' ? '#3b82f6' : // Azul
                             '#10b981'; // Verde para atendido
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
        )}
      </div>
    </div>
  );
};

export default MapView;

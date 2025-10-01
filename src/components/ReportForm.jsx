import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Camera, MapPin, Send } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import '../styles/ReportForm.css';

// Componente para actualizar el centro del mapa
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Componente para manejar clics en el mapa
function MapClickHandler({ onLocationChange }) {
  const map = useMap();
  
  useEffect(() => {
    const handleClick = (e) => {
      const { lat, lng } = e.latlng;
      onLocationChange({ lat, lng });
    };
    
    map.on('click', handleClick);
    
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onLocationChange]);
  
  return null;
}

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ReportForm = () => {
  const { success, error: showError, warning } = useToast();
  const [formData, setFormData] = useState({
    photos: [],
    description: '',
    category: '',
    location: { lat: 9.7489, lng: -83.7534 }, // Centro predeterminado de Costa Rica
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [addressSearch, setAddressSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
    setSelectedFiles(files);
    setFormData(prev => ({ ...prev, photos: files }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [name]: parseFloat(value) || prev.location[name] }
    }));
  };

  const handleAddressSearch = async () => {
    if (!addressSearch.trim()) {
      setSearchError('Por favor ingresa una dirección');
      return;
    }

    setIsSearching(true);
    setSearchError('');

    try {
      // API de Nominatim de OpenStreetMap para geocodificación
      const query = encodeURIComponent(`${addressSearch}, Costa Rica`);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=cr&limit=5`,
        {
          headers: {
            'User-Agent': 'ReporteViasCR/1.0' // Requerido por Nominatim
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al buscar la dirección');
      }

      const data = await response.json();

      if (data.length === 0) {
        setSearchError('No se encontró la dirección. Intenta buscar: "Desamparados", "La Capri" o el cantón/distrito más cercano. Luego haz clic en el mapa para ubicar el punto exacto.');
        return;
      }

      const { lat, lon } = data[0];
      setFormData(prev => ({
        ...prev,
        location: { lat: parseFloat(lat), lng: parseFloat(lon) }
      }));
      setSearchError('');
      setSubmitSuccess(false);
    } catch (error) {
      setSearchError(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSearchError('Tu navegador no soporta geolocalización');
      return;
    }

    setIsGettingLocation(true);
    setSearchError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          location: { lat: latitude, lng: longitude }
        }));
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setSearchError('Permiso de ubicación denegado. Permite el acceso a tu ubicación en el navegador.');
            break;
          case error.POSITION_UNAVAILABLE:
            setSearchError('Ubicación no disponible. Verifica tu GPS.');
            break;
          case error.TIMEOUT:
            setSearchError('Tiempo de espera agotado. Intenta de nuevo.');
            break;
          default:
            setSearchError('Error al obtener ubicación.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    // Validate lat and lng
    if (
      typeof formData.location.lat !== 'number' || isNaN(formData.location.lat) ||
      typeof formData.location.lng !== 'number' || isNaN(formData.location.lng)
    ) {
      setSubmitError('Por favor, ingresa una ubicación válida con latitud y longitud.');
      showError('Por favor, selecciona una ubicación válida en el mapa');
      return;
    }
    
    if (!formData.category) {
      showError('Por favor, selecciona una categoría');
      return;
    }
    
    if (!formData.description.trim()) {
      showError('Por favor, agrega una descripción del problema');
      return;
    }

    setIsSubmitting(true);

    const report = {
      id: String(Date.now()),
      title: formData.category.charAt(0).toUpperCase() + formData.category.slice(1).replace(/_/g, ' '),
      description: formData.description,
      lat: formData.location.lat,
      lng: formData.location.lng,
      state: 'nuevo',
      category: formData.category,
      // photos: formData.photos, // Omitido por ahora, json-server no maneja archivos
      timestamp: new Date().toISOString()
    };

    try {
      const res = await fetch('http://localhost:3001/reportes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });

      if (!res.ok) {
        throw new Error(`Error al enviar reporte: ${res.status}`);
      }

      setSubmitSuccess(true);
      success('¡Reporte enviado exitosamente! Gracias por tu colaboración.');
      
      // Restablecer formulario
      setFormData({
        photos: [],
        description: '',
        category: '',
        location: { lat: 9.7489, lng: -83.7534 }
      });
      setSelectedFiles([]);
    } catch (error) {
      setSubmitError(error.message);
      showError('Error al enviar el reporte. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'bache', label: 'Bache' },
    { value: 'semaforo_danado', label: 'Semáforo dañado' },
    { value: 'senalizacion_deficiente', label: 'Señalización deficiente' },
    { value: 'alcantarilla_danada', label: 'Alcantarilla dañada' },
    { value: 'iluminacion_deficiente', label: 'Iluminación deficiente' },
    { value: 'otro', label: 'Otro' },
  ];

  return (
    <div className="report-form-container">
      <h1 className="report-title">Reportar Problema Vial</h1>
      <p className="report-subtitle">Ayúdanos a mejorar la infraestructura de tu ciudad</p>

      <form onSubmit={handleSubmit} className="report-form">
        {/* Fotos del Problema */}
        <section className="form-section">
          <h2 className="section-title">
            <Camera className="section-icon" />
            Fotos del Problema
          </h2>
          <div className="file-upload">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
              id="photos"
            />
            <label htmlFor="photos" className="file-label">
              Haz clic para subir fotos o arrastra aquí
            </label>
            {selectedFiles.length > 0 && (
              <p className="file-count">{selectedFiles.length} foto(s) seleccionada(s)</p>
            )}
          </div>
        </section>

        {/* Descripción del Problema */}
        <section className="form-section">
          <h2 className="section-title">
            Descripción del Problema
          </h2>
          <textarea
            name="description"
            placeholder="Describe detalladamente el problema vial que observaste. Incluye información sobre la gravedad, ubicación específica y cualquier detalle relevante..."
            value={formData.description}
            onChange={handleInputChange}
            className="textarea-input"
            rows={4}
            required
          ></textarea>
        </section>

        {/* Categoría */}
        <section className="form-section">
          <h2 className="section-title">Categoría</h2>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="select-input"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </section>

        {/* Ubicación */}
        <section className="form-section">
          <h2 className="section-title">
            <MapPin className="section-icon" />
            Ubicación
          </h2>
          
          {/* Búsqueda por dirección */}
          <div className="address-search-container">
            <label htmlFor="address-search" className="address-label">
              📍 Opciones para ubicar el reporte:
            </label>
            
            {/* Botón GPS */}
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isGettingLocation}
              className="gps-button"
            >
              📱 {isGettingLocation ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual (GPS)'}
            </button>

            <div className="divider-text">O busca por lugar:</div>

            <div className="address-search-input-group">
              <input
                type="text"
                id="address-search"
                placeholder="Ej: La Capri, Desamparados"
                value={addressSearch}
                onChange={(e) => setAddressSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddressSearch())}
                className="address-search-input"
              />
              <button
                type="button"
                onClick={handleAddressSearch}
                disabled={isSearching}
                className="address-search-button"
              >
                {isSearching ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            {searchError && <p className="search-error">{searchError}</p>}
            <p className="address-hint">
              💡 <strong>Instrucciones:</strong><br/>
              1. Busca el distrito/cantón más cercano (ej: "La Capri" o "Desamparados")<br/>
              2. Luego <strong>haz clic en el mapa</strong> para marcar el punto exacto<br/>
              3. O arrastra el marcador rojo a la ubicación precisa
            </p>
          </div>

          <div className="map-container">
            <MapContainer
              center={[formData.location.lat, formData.location.lng]}
              zoom={8}
              minZoom={7}
              maxZoom={18}
              maxBounds={[[8.0, -86.0], [11.5, -82.5]]}
              maxBoundsViscosity={1.0}
              style={{ height: '300px', width: '100%' }}
              className="leaflet-map"
            >
              <ChangeMapView center={[formData.location.lat, formData.location.lng]} zoom={14} />
              <MapClickHandler onLocationChange={(loc) => setFormData(prev => ({ ...prev, location: loc }))} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[formData.location.lat, formData.location.lng]}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const newPos = e.target.getLatLng();
                    setFormData(prev => ({ ...prev, location: newPos }));
                  }
                }}
              />
            </MapContainer>
          </div>
          
          <div className="coordinates-display">
            <strong>📌 Coordenadas actuales:</strong> 
            <span className="coord-value">Lat: {formData.location.lat.toFixed(6)}</span>
            <span className="coord-value">Lng: {formData.location.lng.toFixed(6)}</span>
          </div>

          <div className="location-inputs">
            <input
              type="number"
              name="lat"
              placeholder="Latitud"
              value={formData.location.lat}
              onChange={handleLocationChange}
              className="location-input"
              step="any"
            />
            <input
              type="number"
              name="lng"
              placeholder="Longitud"
              value={formData.location.lng}
              onChange={handleLocationChange}
              className="location-input"
              step="any"
            />
          </div>
        </section>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          <Send className="submit-icon" />
          {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
        </button>
      </form>

      {submitSuccess && (
        <div className="success-message">
          Reporte enviado exitosamente!
        </div>
      )}

      {submitError && (
        <div className="error-message">
          Error: {submitError}
        </div>
      )}
    </div>
  );
};

export default ReportForm;

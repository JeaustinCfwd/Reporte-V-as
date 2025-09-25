import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Camera, MapPin, Send } from 'lucide-react';
import '../styles/ReportForm.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ReportForm = () => {
  const [formData, setFormData] = useState({
    photos: [],
    description: '',
    category: '',
    location: { lat: 9.7489, lng: -83.7534 }, // Default to Costa Rica center
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    const report = {
      id: Date.now(),
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
      // Reset form
      setFormData({
        photos: [],
        description: '',
        category: '',
        location: { lat: 9.7489, lng: -83.7534 }
      });
      setSelectedFiles([]);
    } catch (error) {
      setSubmitError(error.message);
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
          <div className="map-container">
            <MapContainer
              center={[formData.location.lat, formData.location.lng]}
              zoom={8}
              style={{ height: '300px', width: '100%' }}
              className="leaflet-map"
            >
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

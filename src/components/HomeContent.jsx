import React from 'react';
import { Link } from 'react-router-dom';
import ThreeDCarousel from './ThreeDCarousel';
import '../styles/Home.css';

// Datos para el carousel
const carouselItems = [
  {
    id: 1,
    title: "Reporta Fácilmente",
    brand: "PASO 1",
    description: "Toma fotos, describe el problema y marca la ubicación. Todo en menos de 2 minutos desde tu móvil.",
    tags: ["Móvil", "Fotos", "2 minutos"],
    imageUrl: "/images/paso1-mobile.jpg",
    link: "#"
  },
  {
    id: 2,
    title: "Seguimiento en Tiempo Real",
    brand: "PASO 2", 
    description: "Recibe notificaciones sobre el progreso de tu reporte: nuevo, en revisión y atendido.",
    tags: ["Notificaciones", "Progreso", "Estados"],
    imageUrl: "/images/paso2-seguimiento.jpg",
    link: "#"
  },
  {
    id: 3,
    title: "Impacto Medible",
    brand: "PASO 3",
    description: "Ve cómo tus reportes contribuyen al mejoramiento real de la infraestructura urbana.",
    tags: ["Mejoras", "Infraestructura", "Impacto"],
    imageUrl: "/images/paso3-impacto.jpg", 
    link: "#"
  }
];

function HomeContent() {
  return (
    <div className="contenedor-inicio">
      <div className="seccion-hero">
        <h2 className="titulo-principal">Transforma tu ciudad con cada reporte</h2>
        <p className="descripcion-inicio">
          ReportaVías CR conecta a la comunidad con las autoridades para crear ciudades más seguras y funcionales. Tu voz importa, tu reporte cuenta.
        </p>
       
        <div className="grupo-botones">
          <Link to="/reportCreate" className="boton-inicio">Reportar un problema</Link>
          <Link to="/mapview" className="boton-inicio boton-secundario">Ver Mapa</Link>
        </div>
      </div>

      {/* Sección del Carousel 3D */}
      <div className="seccion-carousel">
        <ThreeDCarousel 
          items={carouselItems}
          autoRotate={true}
          rotateInterval={5000}
          cardHeight={450}
          title="¿Cómo Funciona?"
          subtitle="Tres simples pasos para hacer la diferencia en tu comunidad"
          tagline="Reportar problemas nunca fue tan fácil. Conoce el proceso que está transformando nuestras ciudades."
        />
      </div>

      {/* Sección de estadísticas o información adicional */}
      <div className="seccion-info">
        <div className="contenedor-estadisticas">
          <div className="estadistica">
            <h3>1,247</h3>
            <p>Reportes Resueltos</p>
          </div>
          <div className="estadistica">
            <h3>24/7</h3>
            <p>Disponibilidad</p>
          </div>
          <div className="estadistica">
            <h3>Rápido</h3>
            <p>Tiempo de Respuesta</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeContent;

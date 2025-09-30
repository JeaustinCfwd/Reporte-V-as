import React from 'react';
import { Link } from 'react-router-dom';
import ThreeDCarousel from './ThreeDCarousel';
import CategoryCarousel from './CategoryCarousel';
import GlareHover from './GlareHover';
import RatingBox from './RatingBox';
import '../styles/Home.css';

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

const categoryCarouselItems = [
  {
    id: 1,
    title: "Baches y Pavimento",
    description: "Reporta baches, grietas o daños en el pavimento de calles y carreteras.",
    spotlightColor: "rgba(0, 229, 255, 0.2)"
  },
  {
    id: 2,
    title: "Señalización",
    description: "Problemas con señales de tráfico, semáforos o marcas viales.",
    spotlightColor: "rgba(255, 193, 7, 0.2)"
  },
  {
    id: 3,
    title: "Iluminación",
    description: "Luces de calle apagadas, dañadas o con problemas de funcionamiento.",
    spotlightColor: "rgba(220, 53, 69, 0.2)"
  },
  {
    id: 4,
    title: "Limpieza",
    description: "Basura, escombros o problemas de mantenimiento en vías públicas.",
    spotlightColor: "rgba(40, 167, 69, 0.2)"
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

      <CategoryCarousel
        items={categoryCarouselItems}
        autoRotate={true}
        rotateInterval={4000}
        cardHeight={300}
      />

      <div className="seccion-plataforma">
        <div className="contenedor-plataforma">
          <div className="encabezado-plataforma">
            <GlareHover
              width="1000px"
              height="400px"
              background="#111"
              borderRadius="20px"
              borderColor="#333"
              glareColor="#ffffff"
              glareOpacity={0.3}
              glareAngle={-30}
              glareSize={300}
              transitionDuration={800}
              playOnce={false}
            >
              <div className="dashboard-info-content"> 
                <h2 className="titulo-dashboard">
                  Dashboard Administrativo
                </h2>
                <ul className="lista-caracteristicas">
                  <li className="item-caracteristica">✓ Vista de todos los reportes en tiempo real</li>
                  <li className="item-caracteristica">✓ Filtros por estado, categoría y fecha</li>
                  <li className="item-caracteristica">✓ Mapa interactivo con marcadores</li>
                  <li className="item-caracteristica">✓ Estadísticas y métricas detalladas</li>
                  <li className="item-caracteristica">✓ Gestión de estados de reportes</li>
                </ul>
              </div>
            </GlareHover>
          </div>
        </div>
      </div>

      <div className="seccion-ratingbox">
        <RatingBox />
      </div>
    </div>
  );
}

export default HomeContent;
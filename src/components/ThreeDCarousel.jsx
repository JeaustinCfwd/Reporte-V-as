import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Camera, Bell, TrendingUp } from "lucide-react";
import "../styles/ThreeDCarousel.css";

// Hook personalizado para detectar mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

// Función para obtener el ícono según el paso
const getStepIcon = (stepNumber) => {
  switch(stepNumber) {
    case 1: return <Camera size={48} color="white" />;
    case 2: return <Bell size={48} color="white" />;
    case 3: return <TrendingUp size={48} color="white" />;
    default: return <Camera size={48} color="white" />;
  }
};

const ThreeDCarousel = ({
  items = [],
  autoRotate = true,
  rotateInterval = 4000,
  cardHeight = 500,
  title = "¿Cómo Funciona?",
  subtitle = "Tres simples pasos",
  tagline = "Reportar problemas nunca fue tan fácil. Conoce el proceso que está transformando nuestras ciudades.",
  isMobileSwipe = true,
}) => {
  const [active, setActive] = useState(0);
  const carouselRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const isMobile = useIsMobile();
  const minSwipeDistance = 50;

  useEffect(() => {
    if (autoRotate && isInView && !isHovering && items.length > 0) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % items.length);
      }, rotateInterval);
      return () => clearInterval(interval);
    }
  }, [isInView, isHovering, autoRotate, rotateInterval, items.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    
    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const onTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setActive((prev) => (prev + 1) % items.length);
    } else if (distance < -minSwipeDistance) {
      setActive((prev) => (prev - 1 + items.length) % items.length);
    }
  };

  const getCardAnimationClass = (index) => {
    if (index === active) return "carousel-card-active";
    if (index === (active + 1) % items.length)
      return "carousel-card-next";
    if (index === (active - 1 + items.length) % items.length)
      return "carousel-card-prev";
    return "carousel-card-hidden";
  };

  if (!items || items.length === 0) {
    return (
      <div className="carousel-empty">
        <p>No hay elementos para mostrar en el carousel</p>
      </div>
    );
  }

  return (
    <section id="ThreeDCarousel" className="carousel-section">
      <div className="carousel-header">
        <h2 className="carousel-title">{title}</h2>
        <h3 className="carousel-subtitle">{subtitle}</h3>
        <p className="carousel-tagline">{tagline}</p>
      </div>

      <div className="carousel-container">
        <div
          className="carousel-wrapper"
          style={{ height: `${cardHeight + 50}px` }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={isMobileSwipe ? onTouchStart : undefined}
          onTouchMove={isMobileSwipe ? onTouchMove : undefined}
          onTouchEnd={isMobileSwipe ? onTouchEnd : undefined}
          ref={carouselRef}
        >
          <div className="carousel-track">
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className={`carousel-card ${getCardAnimationClass(index)}`}
              >
                <div className="card-container" style={{ height: `${cardHeight}px` }}>
                  <div
                    className="card-image"
                    style={{
                      backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    <div className="card-image-overlay" />
                    <div className="card-image-content">
                      <div className="step-icon-container">
                        {getStepIcon(item.id)}
                      </div>
                      <h3 className="card-brand">
                        {item.brand?.toUpperCase() || `PASO ${item.id}`}
                      </h3>
                      <div className="card-divider" />
                      <p className="card-image-title">{item.title}</p>
                    </div>
                  </div>

                  <div className="card-content">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-brand-text">{item.brand}</p>
                    <p className="card-description">{item.description}</p>

                    <div className="card-footer">
                      <div className="card-tags">
                        {item.tags && item.tags.map((tag, idx) => (
                          <span key={idx} className="card-tag">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <a
                        href={item.link}
                        className="card-link"
                        onClick={() => {
                          if (item.link && item.link.startsWith("/")) {
                            window.scrollTo(0, 0);
                          }
                        }}
                      >
                        <span className="card-link-text">Saber más</span>
                        <ArrowRight className="card-link-icon" />
                        <span className="card-link-underline"></span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isMobile && (
            <>
              <button
                className="carousel-btn carousel-btn-prev"
                onClick={() =>
                  setActive((prev) => (prev - 1 + items.length) % items.length)
                }
                aria-label="Anterior"
              >
                <ChevronLeft className="carousel-btn-icon" />
              </button>
              <button
                className="carousel-btn carousel-btn-next"
                onClick={() => setActive((prev) => (prev + 1) % items.length)}
                aria-label="Siguiente"
              >
                <ChevronRight className="carousel-btn-icon" />
              </button>
            </>
          )}

          <div className="carousel-dots">
            {items.map((_, idx) => (
              <button
                key={idx}
                className={`carousel-dot ${active === idx ? 'carousel-dot-active' : ''}`}
                onClick={() => setActive(idx)}
                aria-label={`Ir al paso ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreeDCarousel;
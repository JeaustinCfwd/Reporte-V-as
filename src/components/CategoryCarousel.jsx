import React, { useRef, useEffect, useState, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "../styles/CategoryCarousel.css";

// Función utilitaria para aplicar 'throttle' (limitación de llamadas)
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Hook personalizado para detectar mobile (Optimizado)
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const newIsMobile = window.innerWidth < 768;
      // Solo actualiza si el valor ha cambiado
      setIsMobile(prevIsMobile => (prevIsMobile !== newIsMobile ? newIsMobile : prevIsMobile));
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

const CategoryCarousel = ({
  items = [],
  autoRotate = true,
  rotateInterval = 4000,
  cardHeight = 300,
  title = "Categorías de Problemas",
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

  // Lógica de Auto-rotación y Intersection Observer
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

  // Handlers Táctiles (Swipe)
  const onTouchStart = useCallback((e) => {
    if (!isMobileSwipe) return;
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  }, [isMobileSwipe]);

  const onTouchMove = useCallback((e) => {
    if (!isMobileSwipe) return;
    setTouchEnd(e.targetTouches[0].clientX);
  }, [isMobileSwipe]);

  const onTouchEnd = useCallback(() => {
    if (!isMobileSwipe || !touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;

    if (distance > minSwipeDistance) {
      setActive((prev) => (prev + 1) % items.length);
    } else if (distance < -minSwipeDistance) {
      setActive((prev) => (prev - 1 + items.length) % items.length);
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [isMobileSwipe, touchStart, touchEnd, minSwipeDistance, items.length]);

  // Clase de Animación
  const getCardAnimationClass = (index) => {
    if (index === active) return "category-carousel-card-active";
    if (index === (active + 1) % items.length)
      return "category-carousel-card-next";
    if (index === (active - 1 + items.length) % items.length)
      return "category-carousel-card-prev";
    return "category-carousel-card-hidden";
  };

  // Manejo del Movimiento del Ratón (Throttle para rendimiento)
  const updateSpotlightEffect = useCallback((e) => {
    const activeCard = carouselRef.current.querySelector('.category-carousel-card-active');
    if (!activeCard) return;
    const container = activeCard.querySelector('.category-card-container');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    container.style.setProperty('--mouse-x', `${x}px`);
    container.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  const throttledMouseMove = useRef(throttle(updateSpotlightEffect, 100)).current;

  if (!items || items.length === 0) {
    return (
      <div className="category-carousel-empty">
        <p>No hay categorías para mostrar</p>
      </div>
    );
  }

  return (
    <section className="category-carousel-section" aria-label={title}>
      <div className="category-carousel-header">
        <h2 className="category-carousel-title">{title}</h2>
      </div>

      <div className="category-carousel-container">
        <div
          className="category-carousel-wrapper"
          style={{ height: `${cardHeight + 50}px` }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={throttledMouseMove}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          ref={carouselRef}
        >
          <div className="category-carousel-track" role="list">
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className={`category-carousel-card ${getCardAnimationClass(index)}`}
                role="listitem"
              >
                <div 
                  className="category-card-container" 
                  style={{ 
                    height: `${cardHeight}px`,
                    '--spotlight-color': item.spotlightColor
                  }}
                >
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {!isMobile && (
            <>
              <button
                className="category-carousel-btn category-carousel-btn-prev"
                onClick={() =>
                  setActive((prev) => (prev - 1 + items.length) % items.length)
                }
                aria-label="Anterior"
              >
                <ArrowLeft className="category-carousel-btn-icon" />
              </button>
              <button
                className="category-carousel-btn category-carousel-btn-next"
                onClick={() => setActive((prev) => (prev + 1) % items.length)}
                aria-label="Siguiente"
              >
                <ArrowRight className="category-carousel-btn-icon" />
              </button>
            </>
          )}

          <div className="category-carousel-dots" role="tablist">
            {items.map((_, idx) => (
              <button
                key={idx}
                className={`category-carousel-dot ${active === idx ? 'category-carousel-dot-active' : ''}`}
                onClick={() => setActive(idx)}
                aria-label={`Ir a categoría ${idx + 1}`}
                role="tab"
                aria-selected={active === idx}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
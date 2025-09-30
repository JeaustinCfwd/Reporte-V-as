import React, { useMemo } from 'react';
import '../styles/GlareHover.css';

// Función auxiliar para convertir hex/rgb a rgba de forma robusta
const hexToRgba = (hex, opacity) => {
    // Manejar colores que ya son RGBA/RGB o nombres
    if (hex.startsWith('rgb')) return hex.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
    if (!hex.startsWith('#')) hex = `#${hex}`;

    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    
    // Devolver rgba o un fallback seguro si el color no es un hex válido
    return result ? 
      `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})` :
      `rgba(255, 255, 255, ${opacity})`;
};


const GlareHover = ({
  width = '500px',
  height = '500px',
  background = '#000',
  borderRadius = '10px',
  borderColor = '#333',
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.5,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false,
  className = '',
  style = {}
}) => {
  
  // useMemo para memorizar la conversión de color y la creación de variables CSS (Optimización)
  const vars = useMemo(() => {
    // Conversión de color para compatibilidad con CSS (rgba)
    const rgba = hexToRgba(glareColor, glareOpacity);

    // Definición de variables CSS para inyección en el estilo del componente
    return {
      '--gh-width': width,
      '--gh-height': height,
      '--gh-bg': background,
      '--gh-br': borderRadius,
      '--gh-angle': `${glareAngle}deg`,
      '--gh-duration': `${transitionDuration}ms`,
      '--gh-size': `${glareSize}%`,
      '--gh-rgba': rgba,
      '--gh-border': borderColor
    };
  }, [
    glareColor,
    glareOpacity,
    width,
    height,
    background,
    borderRadius,
    glareAngle,
    transitionDuration,
    glareSize,
    borderColor
  ]);


  return (
    <div
      className={`glare-hover ${playOnce ? 'glare-hover--play-once' : ''} ${className}`}
      // Inyección de variables CSS memorizadas y estilos personalizados
      style={{ ...vars, ...style }}
    >
      {children}
    </div>
  );
};

export default GlareHover;
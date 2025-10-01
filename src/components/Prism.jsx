import { useEffect, useRef } from 'react';
import '../styles/Prism.css';

const Prism = ({ 
  animationType = 'rotate',
  timeScale = 0.5,
  height = 3.5,
  baseWidth = 5.5,
  scale = 3.6,
  hueShift = 0,
  colorFrequency = 1,
  noise = 0.5,
  glow = 1,
  className = '' 
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    setTimeout(resize, 0);
    window.addEventListener('resize', resize);

    const drawPrism = () => {
      const w = canvas.width;
      const h = canvas.height;
      
      if (w === 0 || h === 0) {
        animationRef.current = requestAnimationFrame(drawPrism);
        return;
      }
      
      // Fondo oscuro base
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, w, h);
      
      // Crear múltiples orbes de luz con blur
      const orbs = [
        { x: 0.3, y: 0.4, size: 0.4, hue: 200, saturation: 80, lightness: 50 },
        { x: 0.7, y: 0.3, size: 0.35, hue: 280, saturation: 70, lightness: 45 },
        { x: 0.5, y: 0.7, size: 0.45, hue: 180, saturation: 75, lightness: 48 }
      ];
      
      orbs.forEach((orb, i) => {
        const offsetAngle = (time * timeScale * 0.3 + i * 120) * Math.PI / 180;
        const offsetX = Math.cos(offsetAngle) * 50;
        const offsetY = Math.sin(offsetAngle) * 30;
        
        const x = w * orb.x + offsetX;
        const y = h * orb.y + offsetY;
        const radius = Math.min(w, h) * orb.size;
        
        // Múltiples capas de gradiente para efecto de blur
        for (let layer = 0; layer < 3; layer++) {
          const layerRadius = radius * (1 + layer * 0.3);
          const layerOpacity = (0.4 - layer * 0.1) * glow;
          
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, layerRadius);
          
          const hue = (orb.hue + time * 0.5 + hueShift) % 360;
          
          gradient.addColorStop(0, `hsla(${hue}, ${orb.saturation}%, ${orb.lightness}%, ${layerOpacity})`);
          gradient.addColorStop(0.3, `hsla(${hue + 20}, ${orb.saturation - 10}%, ${orb.lightness - 5}%, ${layerOpacity * 0.6})`);
          gradient.addColorStop(0.6, `hsla(${hue + 40}, ${orb.saturation - 20}%, ${orb.lightness - 10}%, ${layerOpacity * 0.3})`);
          gradient.addColorStop(1, `hsla(${hue + 60}, ${orb.saturation - 30}%, ${orb.lightness - 15}%, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, layerRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Overlay de viñeta oscura
      const vignette = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h) * 0.7);
      vignette.addColorStop(0, 'rgba(10, 10, 10, 0)');
      vignette.addColorStop(0.7, 'rgba(10, 10, 10, 0.3)');
      vignette.addColorStop(1, 'rgba(10, 10, 10, 0.8)');
      
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);
      
      time += 1;
      animationRef.current = requestAnimationFrame(drawPrism);
    };

    drawPrism();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animationType, timeScale, height, baseWidth, scale, hueShift, colorFrequency, noise, glow]);

  return (
    <div className={`prism-container ${className}`}>
      <canvas ref={canvasRef} className="prism-canvas" />
    </div>
  );
};

export default Prism;

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

    // Initial resize
    setTimeout(resize, 0);
    window.addEventListener('resize', resize);

    const drawPrism = () => {
      const w = canvas.width;
      const h = canvas.height;
      
      if (w === 0 || h === 0) {
        animationRef.current = requestAnimationFrame(drawPrism);
        return;
      }
      
      ctx.clearRect(0, 0, w, h);
      
      // Create gradient background
      const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h) * 0.8);
      
      const hue1 = (time * 2 + hueShift) % 360;
      const hue2 = (time * 2 + hueShift + 60) % 360;
      const hue3 = (time * 2 + hueShift + 120) % 360;
      
      gradient.addColorStop(0, `hsla(${hue1}, 80%, 60%, 0.4)`);
      gradient.addColorStop(0.5, `hsla(${hue2}, 80%, 55%, 0.3)`);
      gradient.addColorStop(1, `hsla(${hue3}, 80%, 50%, 0.2)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
      
      // Draw prism shapes
      const centerX = w / 2;
      const centerY = h / 2;
      
      for (let i = 0; i < 3; i++) {
        const angle = (time * timeScale * 0.5 + i * 120) * Math.PI / 180;
        const distance = Math.min(w, h) * 0.15 * scale;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        const radius = Math.min(w, h) * 0.3 * scale;
        const prismGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        const hue = (time * 3 + i * 120 + hueShift) % 360;
        
        prismGradient.addColorStop(0, `hsla(${hue}, 90%, 70%, ${0.5 * glow})`);
        prismGradient.addColorStop(0.4, `hsla(${hue + 30}, 85%, 60%, ${0.3 * glow})`);
        prismGradient.addColorStop(1, `hsla(${hue + 60}, 80%, 50%, 0)`);
        
        ctx.fillStyle = prismGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
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

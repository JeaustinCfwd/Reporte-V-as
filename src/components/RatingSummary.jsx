import React from 'react';
import { Star } from 'lucide-react';
import '../styles/RatingBox.css';

const getBarColor = (stars) => {
  const colors = {
    5: '#00C853', // Verde Éxito
    4: '#C5E1A5', // Verde Intermedio
    3: '#FFBB33', // Naranja Advertencia
    2: '#FFBB33', // Naranja Advertencia
    1: '#FF4444'  // Rojo Peligro
  };
  return colors[stars] || '#E0E0E0';
};

const RatingSummary = ({ ratings, total }) => {
  // Crear array de 5 a 1 estrellas
  const starLevels = [5, 4, 3, 2, 1];
  
  return (
    <div className="rating-summary-container">
      {starLevels.map((stars) => {
        const count = ratings[stars] || 0;
        const percent = total > 0 ? (count / total) * 100 : 0;
        const barColor = getBarColor(stars);
        
        return (
          <div key={stars} className="rating-bar-row">
            <div className="rating-bar-label">
              <span className="star-count">{stars}</span>
              <Star size={16} fill={barColor} stroke={barColor} />
            </div>
            <div className="rating-bar-container">
              <div 
                className="rating-bar-fill" 
                style={{ 
                  width: `${percent}%`,
                  backgroundColor: barColor
                }} 
              />
            </div>
            <div className="rating-bar-count">{count}</div>
          </div>
        );
      })}
    </div>
  );
};

export default RatingSummary;

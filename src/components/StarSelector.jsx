import React from 'react';
import '../styles/RatingBox.css';

const StarSelector = ({ rating, onRate }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={rating >= star ? 'star checked' : 'star'}
        onClick={() => onRate(star)}
      >
        ★
      </span>
    ))}
  </div>
);

export default StarSelector;

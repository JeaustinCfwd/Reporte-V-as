import React, { useState, useEffect } from 'react';
import StarSelector from './StarSelector';
import RatingSummary from './RatingSummary';
import '../styles/RatingBox.css';

const RatingBox = () => {
  const [userRating, setUserRating] = useState(0);
  const [allRatings, setAllRatings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const storedRatings = localStorage.getItem('userRatings');
    if (storedRatings) {
      setAllRatings(JSON.parse(storedRatings));
    }
  }, []);

  const handleRate = (rating) => {
    setUserRating(rating);
  };

  const submitRating = () => {
    if (userRating > 0 && comment.trim() !== '') {
      const newRating = { rating: userRating, comment: comment.trim(), id: Date.now() };
      const newRatings = [...allRatings, newRating];
      setAllRatings(newRatings);
      localStorage.setItem('userRatings', JSON.stringify(newRatings));
      setUserRating(0);
      setComment('');
      setShowForm(false);
    }
  };

  const deleteComment = (id) => {
    const filteredRatings = allRatings.filter(r => r.id !== id);
    setAllRatings(filteredRatings);
    localStorage.setItem('userRatings', JSON.stringify(filteredRatings));
  };

  const ratings = allRatings.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1;
    return acc;
  }, {});

  const total = allRatings.length;
  const average = total > 0 ? allRatings.reduce((sum, r) => sum + r.rating, 0) / total : 0;

  return (
    <div className="container">
      <h2 className="heading">Califica Nuestro Sitio Web</h2>
      <p>{average.toFixed(1)} promedio basado en {total} reseñas.</p>
      <button className="rate-button" onClick={() => setShowForm(true)}>Calificar Ahora</button>
      {showForm && (
        <div className="rating-form">
          <h3>Califica ReportaVías CR</h3>
          <StarSelector rating={userRating} onRate={handleRate} />
          <textarea
            placeholder="Deja un comentario (opcional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
          />
          <div className="form-buttons">
            <button onClick={submitRating} disabled={userRating === 0 || comment.trim() === ''}>Enviar</button>
            <button onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </div>
      )}
      <hr className="separator" />
      <RatingSummary ratings={ratings} total={total} />
      <div className="comments-section">
        <h3>Comentarios</h3>
        {allRatings.length === 0 && <p>No hay comentarios aún.</p>}
        {allRatings.map(({ id, rating, comment }) => (
          <div key={id.toString()} className="comment">
            <div className="comment-header">
              <span>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
              <button className="delete-button" onClick={() => deleteComment(id)}>Eliminar</button>
            </div>
            <p>{comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingBox;

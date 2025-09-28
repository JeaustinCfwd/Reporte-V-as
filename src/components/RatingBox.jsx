import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarSelector from './StarSelector';
import RatingSummary from './RatingSummary';
import { getReviews, postReview } from '../services/fetch.js';
import '../styles/RatingBox.css';

const RatingBox = () => {
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(storedUser);

    const fetchReviews = async () => {
      try {
        const fetchedReviews = await getReviews();
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleRate = (rating) => {
    setUserRating(rating);
  };

  const submitRating = async () => {
    if (userRating > 0 && comment.trim() !== '' && user) {
      const newReview = {
        userId: user.id,
        userName: user.name,
        rating: userRating,
        comment: comment.trim(),
        timestamp: new Date().toISOString()
      };
      try {
        const review = await postReview(newReview);
        setReviews([...reviews, review]);
        setUserRating(0);
        setComment('');
        setShowForm(false);
        alert('Reseña enviada exitosamente');
      } catch (error) {
        alert('Error al enviar reseña: ' + error.message);
      }
    }
  };

  const deleteComment = async (id) => {
    if (!user) return;
    const review = reviews.find(r => r.id === id);
    if (review && review.userId === user.id) {
      // For simplicity, filter out (in real app, DELETE /reviews/:id)
      const filteredReviews = reviews.filter(r => r.id !== id);
      setReviews(filteredReviews);
      // Update backend if needed
    }
  };

  const ratings = reviews.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1;
    return acc;
  }, {});

  const total = reviews.length;
  const average = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;

  if (loading) return <div>Cargando reseñas...</div>;

  return (
    <div className="container">
      <h2 className="heading">Califica Nuestro Sitio Web</h2>
      <p>{average.toFixed(1)} promedio basado en {total} reseñas.</p>
      {user ? (
        <button className="rate-button" onClick={() => setShowForm(true)}>Calificar Ahora</button>
      ) : (
        <button className="rate-button" onClick={() => navigate('/login')}>
          Inicia sesión para calificar
        </button>
      )}
      {showForm && user && (
        <div className="rating-form">
          <h3>Califica ReportaVías CR</h3>
          <StarSelector rating={userRating} onRate={handleRate} />
          <textarea
            placeholder="Deja un comentario"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            required
          />
          <div className="form-buttons">
            <button onClick={submitRating} disabled={userRating === 0 || comment.trim() === ''}>
              Enviar
            </button>
            <button onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </div>
      )}
      <hr className="separator" />
      <RatingSummary ratings={ratings} total={total} />
      <div className="comments-section">
        <h3>Comentarios</h3>
        {reviews.length === 0 && <p>No hay comentarios aún.</p>}
        {reviews.map((review) => (
          <div key={review.id.toString()} className="comment">
            <div className="comment-header">
              <span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
              <strong>{review.userName}</strong>
              {user && review.userId === user.id && (
                <button className="delete-button" onClick={() => deleteComment(review.id)}>
                  Eliminar
                </button>
              )}
            </div>
            <p>{review.comment}</p>
            <small>{new Date(review.timestamp).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingBox;

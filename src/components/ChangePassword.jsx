import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { updateUser } from '../services/fetch.js';
import "../styles/Profile.css";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (formData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      setError('Usuario no encontrado');
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await updateUser(user.id, { password: formData.newPassword });
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setSuccess('Contraseña actualizada exitosamente');
        setFormData({ newPassword: '', confirmPassword: '' });
      } else {
        setError('Error al actualizar la contraseña');
      }
    } catch (error) {
      setError('Error al actualizar: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="profile-content">
      <h1 className="profile-title">Cambiar Contraseña</h1>
      <p className="profile-subtitle">Actualiza tu contraseña para mantener tu cuenta segura</p>

      <form onSubmit={handleSubmit} className="profile-form">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Nueva Contraseña */}
        <div className="form-row">
          <label htmlFor="newPassword" className="form-label">
            <Lock size={18} />
            Nueva Contraseña
          </label>
          <div className="form-field">
            <div className="password-input-wrapper">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                placeholder="Ingresa tu nueva contraseña"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="form-input"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="password-toggle-btn"
                aria-label={showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <small className="form-hint">Mínimo 6 caracteres</small>
          </div>
        </div>

        {/* Confirmar Contraseña */}
        <div className="form-row">
          <label htmlFor="confirmPassword" className="form-label">
            <Lock size={18} />
            Confirmar Nueva Contraseña
          </label>
          <div className="form-field">
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirma tu nueva contraseña"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle-btn"
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Botón de Acción */}
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;

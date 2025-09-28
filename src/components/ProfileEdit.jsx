import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Image, Trash2, Home, Camera } from 'lucide-react';
import { updateUser, deleteUser } from '../services/fetch.js';
import "../styles/Forms.css";
import "../styles/Profile.css";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        name: storedUser.name || '',
        email: storedUser.email || '',
        password: '',
        confirmPassword: ''
      });
      setPhotoPreview(storedUser.photo || '');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    if (!user) return;

    setLoading(true);
    const updateData = {
      name: formData.name,
      email: formData.email,
      ...(formData.password && { password: formData.password }),
      photo: photoPreview
    };

    try {
      const updatedUser = await updateUser(user.id, updateData);
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert('Perfil actualizado exitosamente');
      } else {
        alert('Error al actualizar perfil');
      }
    } catch (error) {
      alert('Error al actualizar: ' + error.message);
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!user || !window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esto es permanente.')) return;

    setLoading(true);
    try {
      await deleteUser(user.id);
      localStorage.removeItem('user');
      alert('Cuenta eliminada exitosamente');
      navigate('/login');
    } catch (error) {
      alert('Error al eliminar cuenta: ' + error.message);
    }
    setLoading(false);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <div className="fondo-registro">
      <div className="contenedor-login">
        <div className="formulario-usuario">
          <h1 className="titulo-login">Editar Perfil</h1>

          {photoPreview && (
            <div className="grupo-entrada">
              <label className="etiqueta-entrada">Foto Actual</label>
              <img src={photoPreview} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grupo-entrada">
              <label htmlFor="name" className="etiqueta-entrada">Nombre</label>
              <div className="campo-entrada">
                <User className="icono-entrada" size={20} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="elemento-entrada"
                  required
                />
              </div>
            </div>

            <div className="grupo-entrada">
              <label htmlFor="email" className="etiqueta-entrada">Email</label>
              <div className="campo-entrada">
                <Mail className="icono-entrada" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Tu email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="elemento-entrada"
                  required
                />
              </div>
            </div>

            <div className="grupo-entrada">
              <label htmlFor="photo" className="etiqueta-entrada">Foto de Perfil</label>
              <div className="campo-entrada">
                <Camera className="icono-entrada" size={20} />
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="elemento-entrada"
                />
                {photoPreview && <img src={photoPreview} alt="Preview" style={{ width: '50px', height: '50px', marginTop: '10px' }} />}
              </div>
            </div>

            <div className="grupo-entrada">
              <label htmlFor="password" className="etiqueta-entrada">Nueva Contraseña (opcional)</label>
              <div className="campo-entrada">
                <Lock className="icono-entrada" size={20} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Nueva contraseña"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="elemento-entrada"
                />
              </div>
            </div>

            <div className="grupo-entrada">
              <label htmlFor="confirmPassword" className="etiqueta-entrada">Confirmar Nueva Contraseña</label>
              <div className="campo-entrada">
                <Lock className="icono-entrada" size={20} />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirma nueva contraseña"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="elemento-entrada"
                />
              </div>
            </div>

            <button type="submit" className="boton-login" disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar Perfil'}
            </button>
          </form>

          <div className="separador"></div>

          <button 
            type="button" 
            onClick={handleDeleteAccount}
            className="boton-login"
            style={{ backgroundColor: '#dc3545' }}
            disabled={loading}
          >
            <Trash2 size={20} className="inline mr-2" /> Eliminar Cuenta
          </button>

          <div className="navegacion-inferior">
            <button 
              type="button" 
              onClick={handleBackToHome}
              className="boton-login"
              style={{ backgroundColor: '#007bff' }}
            >
              <Home size={20} className="inline mr-2" /> Volver a Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;

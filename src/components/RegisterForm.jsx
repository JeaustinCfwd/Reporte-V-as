import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/fetch.js';
import "../styles/Forms.css";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: ''
  });
  const [mostrarClave, setMostrarClave] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setMostrarClave(!mostrarClave);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmarPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    const userData = {
      name: formData.nombre,
      email: formData.email,
      password: formData.password,
      photo: ''
    };
    try {
      const user = await registerUser(userData);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard');
      } else {
        alert('Error al registrar usuario');
      }
    } catch (error) {
      alert('Error al registrar: ' + error.message);
    }
    // Clear form
    setFormData({ nombre: '', email: '', password: '', confirmarPassword: '' });
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="fondo-registro">
      <div className="contenedor-login">
        <div className="formulario-usuario">
          <h1 className="titulo-login">Crear cuenta</h1>

          <form onSubmit={handleSubmit}>
            <div className="grupo-entrada">
              <label htmlFor="nombre" className="etiqueta-entrada">Nombre completo</label>
              <div className="campo-entrada">
                <User className="icono-entrada" size={20} />
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Ingresa tu nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="elemento-entrada"
                  required
                />
              </div>
            </div>

            <div className="grupo-entrada">
              <label htmlFor="email" className="etiqueta-entrada">Correo electrónico</label>
              <div className="campo-entrada">
                <Mail className="icono-entrada" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Ingresa tu correo"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="elemento-entrada"
                  required
                />
              </div>
            </div>

            <div className="grupo-entrada">
              <label htmlFor="password" className="etiqueta-entrada">Contraseña</label>
              <div className="campo-entrada">
                <Lock className="icono-entrada" size={20} />
                <input
                  type={mostrarClave ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Crea una contraseña"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="elemento-entrada"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="toggle-clave"
                >
                  {mostrarClave ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="grupo-entrada">
              <label htmlFor="confirmarPassword" className="etiqueta-entrada">Confirmar contraseña</label>
              <div className="campo-entrada">
                <Lock className="icono-entrada" size={20} />
                <input
                  type={mostrarClave ? 'text' : 'password'}
                  id="confirmarPassword"
                  name="confirmarPassword"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmarPassword}
                  onChange={handleInputChange}
                  className="elemento-entrada"
                  required
                />
              </div>
            </div>

            <button type="submit" className="boton-login">
              Registrarse
            </button>
          </form>

          <div className="separador"></div>

          <div className="navegacion-inferior">
            <span className="texto-inferior">¿Ya tienes cuenta?</span>
            <button 
              type="button" 
              onClick={handleNavigateToLogin}
              className="enlace-registro"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
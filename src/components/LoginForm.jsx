import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/fetch.js';
import "../styles/Forms.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    recordar: false
  });
  const [mostrarClave, setMostrarClave] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(formData.email, formData.password);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard');
      } else {
        alert('Credenciales inválidas');
      }
    } catch (error) {
      alert('Error al iniciar sesión: ' + error.message);
    }
    // Limpiar formulario
    setFormData({ email: '', password: '', recordar: false });
  };

  const togglePasswordVisibility = () => {
    setMostrarClave(!mostrarClave);
  };

  const handleNavigateToRegister = () => {
    navigate('/register');
  };



  return (
    <div className="fondo-login">
      <div className="contenedor-login">
        <div className="formulario-usuario">
          <h1 className="titulo-login">Iniciar sesión</h1>
          
          <form onSubmit={handleSubmit}>
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
                  placeholder="Ingresa tu contraseña"
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

            <div className="grupo-checkbox">
              <div className="envoltorio-checkbox">
                <input
                  type="checkbox"
                  id="recordar"
                  name="recordar"
                  checked={formData.recordar}
                  onChange={handleInputChange}
                  className="input-checkbox"
                />
                <label htmlFor="recordar" className="etiqueta-checkbox">
                  Recordarme
                </label>
              </div>
            </div>

            <button type="submit" className="boton-login">
              Iniciar sesión
            </button>
          </form>

          <div className="separador"></div>

          <div className="navegacion-inferior">
            <span className="texto-inferior">¿No tienes una cuenta?</span>
            <button 
              type="button" 
              onClick={handleNavigateToRegister}
              className="enlace-registro"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Regístrate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
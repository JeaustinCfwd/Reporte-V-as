import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sendResetEmail } from '../services/fetch.js';
import "../styles/Forms.css";

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');

  // Validación adicional para email vacío o inválido
  if (!email || !email.includes('@')) {
    setMessage('Por favor, ingresa un correo electrónico válido.');
    setLoading(false);
    return;
  }

  try {
    const success = await sendResetEmail(email);
    if (success) {
      setMessage('Se ha enviado un email con instrucciones para resetear tu contraseña. Revisa tu bandeja de entrada.');
    } else {
      setMessage('Error al enviar el email. Intenta nuevamente.');
    }
  } catch (error) {
    setMessage('Error al enviar el email: ' + error.message);
  }
  setLoading(false);
};

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="fondo-login">
      <div className="contenedor-login">
        <div className="formulario-usuario">
          <h1 className="titulo-login">Resetear Contraseña</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="grupo-entrada">
              <label htmlFor="email" className="etiqueta-entrada">Correo electrónico</label>
              <div className="campo-entrada">
                <Mail className="icono-entrada" size={20} />
                <input
                  type="email"
                  id="email"
                  placeholder="Ingresa tu correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="elemento-entrada"
                  required
                />
              </div>
            </div>

            <button type="submit" className="boton-login" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Email de Reset'}
            </button>
          </form>

          {message && (
            <div className="grupo-entrada" style={{ marginTop: '20px' }}>
              <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>
            </div>
          )}

          <div className="separador"></div>

          <div className="navegacion-inferior">
            <span className="texto-inferior">¿Recordaste tu contraseña?</span>
            <button 
              type="button" 
              onClick={handleBackToLogin}
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

export default ResetPasswordForm;

import React, { useState } from 'react';
import { Menu, X, MapPin, User, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleMenuMovil = () => setMenuMovilAbierto(!menuMovilAbierto);

  const enlaces = [
    { id: 'inicio', nombre: 'Inicio', ruta: '/' },
    { id: 'reportar', nombre: 'Reportar', ruta: '/reportCreate', icono: <MapPin size={16} /> },
    { id: 'mapa', nombre: 'Mapa', ruta: '/mapview' },
    { id: 'dashboard', nombre: 'Dashboard', ruta: '/dashboard' },
  ];

  return (
    <header className="encabezado-sitio">
      <div className="contenedor-navbar">
        <div className="identidad-sitio">
          <NavLink to="/" className="logo-link" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 style={{ cursor: 'pointer' }}>ReporteVías CR</h1>
          </NavLink>
        </div>

        {/* Menú Desktop */}
        <nav className="navegacion-desktop">
          <ul className="nav-lista">
            {enlaces.map(enlace => (
              <li key={enlace.id}>
                <NavLink
                  to={enlace.ruta}
                  className={({ isActive }) => `enlace-nav ${isActive ? 'activo' : ''}`}
                >
                  {enlace.icono && <span className="icono-enlace">{enlace.icono}</span>}
                  {enlace.nombre}
                </NavLink>
              </li>
            ))}

            {user ? (
              <>
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => `enlace-nav ${isActive ? 'activo' : ''}`}
                  >
                    <User size={16} className="inline mr-1" />
                    Perfil
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="enlace-nav"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <LogOut size={16} className="inline mr-1" />
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => `enlace-nav ${isActive ? 'activo' : ''}`}
                >
                  Iniciar Sesión
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* Botón menú móvil */}
        <button onClick={toggleMenuMovil} className="boton-menu-movil">
          {menuMovilAbierto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú móvil */}
      {menuMovilAbierto && (
        <div className="menu-movil">
          <nav className="navegacion-movil">
            {enlaces.map(enlace => (
              <NavLink
                key={enlace.id}
                to={enlace.ruta}
                className="enlace-movil"
                onClick={() => setMenuMovilAbierto(false)}
              >
                {enlace.icono && <span className="icono-enlace">{enlace.icono}</span>}
                {enlace.nombre}
              </NavLink>
            ))}
            <hr className="separador-movil" />
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className="enlace-movil"
                  onClick={() => setMenuMovilAbierto(false)}
                >
                  <User size={16} className="inline mr-2" />
                  Perfil
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="enlace-movil boton-login-movil"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
                >
                  <LogOut size={16} className="inline mr-2" />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="enlace-movil boton-login-movil"
                onClick={() => setMenuMovilAbierto(false)}
              >
                Iniciar Sesión
              </NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

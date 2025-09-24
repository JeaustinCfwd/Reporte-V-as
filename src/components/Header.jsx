import React, { useState } from 'react';
import { Menu, X, MapPin } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  const toggleMenuMovil = () => setMenuMovilAbierto(!menuMovilAbierto);

  const enlaces = [
    { id: 'inicio', nombre: 'Inicio', ruta: '/' },
    { id: 'reportar', nombre: 'Reportar', ruta: '/reportar', icono: <MapPin size={16} /> },
    { id: 'mapa', nombre: 'Mapa', ruta: '/mapa' },
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

            <li>
              <NavLink
                to="/login"
                className={({ isActive }) => `enlace-nav ${isActive ? 'activo' : ''}`}
              >
                Iniciar Sesión
              </NavLink>
            </li>
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
            <NavLink
              to="/login"
              className="enlace-movil boton-login-movil"
              onClick={() => setMenuMovilAbierto(false)}
            >
              Iniciar Sesión
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

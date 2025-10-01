import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, MapPin, User, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import ShinyText from './ShinyText';

const enlaces = [
  { id: 'inicio', nombre: 'Inicio', ruta: '/' },
  { id: 'reportar', nombre: 'Reportar', ruta: '/reportCreate', icono: <MapPin size={16} />, protected: true },
  { id: 'mapa', nombre: 'Mapa', ruta: '/mapview', protected: true },
  { id: 'dashboard', nombre: 'Dashboard', ruta: '/dashboard', protected: true },
];

const Header = () => {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handleUserChange = () => {
      try {
        setUser(JSON.parse(localStorage.getItem('user') || 'null'));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
        setUser(null);
      }
    };

    window.addEventListener('userChange', handleUserChange);
    window.addEventListener('storage', handleUserChange);

    return () => {
      window.removeEventListener('userChange', handleUserChange);
      window.removeEventListener('storage', handleUserChange);
    };
  }, []);

  // useCallback para funciones que se pasan a otros componentes (Cierre de Sesión)
  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    // Forzar recarga o actualizar el estado global si existiera un contexto de usuario
    window.location.reload(); 
  }, []);

  // Función de redirección para rutas protegidas
  const handleProtectedClick = () => {
    // 4. Mejor UX: Redirigir a login en lugar de usar alert()
    navigate('/login', { state: { from: window.location.pathname, message: 'Debes iniciar sesión para acceder a esta función.' } });
    setMenuMovilAbierto(false);
  };
  
  // 5. Función de toggle simplificada
  const toggleMenuMovil = () => setMenuMovilAbierto(p => !p);
  return (
    <header className="encabezado-sitio">
      <div className="contenedor-navbar">
        <div className="logo-sitio">
          {/* 2. Eliminar estilos en línea simples del NavLink del logo */}
          <NavLink to="/" className="logo-link"> 
            <h1 style={{ margin: 0 }}>
              <ShinyText text="ReporteVías CR" speed={3} />
            </h1>
          </NavLink>
        </div>

        {/* Menú de escritorio */}
        <nav className="navegacion-desktop">
          <ul className="nav-lista">
            {enlaces.map(enlace => (
              <li key={enlace.id}>
                {enlace.protected && !user ? (
                  <button
                    onClick={handleProtectedClick}
                    className="enlace-nav btn-reset" // 2. Usar clase utilitaria .btn-reset
                  >
                    {enlace.icono && <span className="icono-enlace">{enlace.icono}</span>}
                    {enlace.nombre}
                  </button>
                ) : (
                  <NavLink
                    to={enlace.ruta}
                    className={({ isActive }) => `enlace-nav ${isActive ? 'activo' : ''}`}
                  >
                    {enlace.icono && <span className="icono-enlace">{enlace.icono}</span>}
                    {enlace.nombre}
                  </NavLink>
                )}
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
                    className="enlace-nav btn-reset"
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
                  className={({ isActive }) => `enlace-nav boton-login ${isActive ? 'activo' : ''}`}
                >
                  Iniciar Sesión
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* Botón menú móvil */}
        <button onClick={toggleMenuMovil} className="boton-menu-movil" aria-expanded={menuMovilAbierto} aria-controls="menu-movil-container">
          {menuMovilAbierto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú móvil */}
      {menuMovilAbierto && (
        <div className="menu-movil" id="menu-movil-container">
          <nav className="navegacion-movil">
            {/* Lógica duplicada: idealmente se extrae en un componente */}
            {enlaces.map(enlace => (
              enlace.protected && !user ? (
                <button
                  key={enlace.id}
                  onClick={() => { handleProtectedClick(); }} // handleProtectedClick ya cierra el menú
                  className="enlace-movil btn-reset mobile-full-width"
                >
                  {enlace.icono && <span className="icono-enlace">{enlace.icono}</span>}
                  {enlace.nombre}
                </button>
              ) : (
                <NavLink
                  key={enlace.id}
                  to={enlace.ruta}
                  className="enlace-movil"
                  onClick={() => setMenuMovilAbierto(false)}
                >
                  {enlace.icono && <span className="icono-enlace">{enlace.icono}</span>}
                  {enlace.nombre}
                </NavLink>
              )
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
                  className="enlace-movil boton-login-movil btn-reset mobile-full-width"
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
import React, { useState } from 'react';
import { User, Lock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileEdit from './ProfileEdit';
import ChangePassword from './ChangePassword';

const ProfileLayout = () => {
  const [activeSection, setActiveSection] = useState('edit');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="profile-container">
      {/* Sidebar de Navegación */}
      <aside className="profile-sidebar">
        <div className="sidebar-section">
          <h3 className="sidebar-category">TU CUENTA</h3>
          <nav className="sidebar-nav">
            <button
              onClick={() => setActiveSection('edit')}
              className={`sidebar-link ${activeSection === 'edit' ? 'active' : ''}`}
            >
              <User size={18} />
              Editar Perfil
            </button>
            <button
              onClick={() => setActiveSection('password')}
              className={`sidebar-link ${activeSection === 'password' ? 'active' : ''}`}
            >
              <Lock size={18} />
              Cambiar Contraseña
            </button>
          </nav>
        </div>
        
        <div className="sidebar-section">
          <button onClick={handleLogout} className="sidebar-link sidebar-logout">
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="profile-main">
        {activeSection === 'edit' && <ProfileEdit />}
        {activeSection === 'password' && <ChangePassword />}
      </main>
    </div>
  );
};

export default ProfileLayout;

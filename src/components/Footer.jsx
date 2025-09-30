import React from 'react';
import { Facebook, Twitter, Instagram, Mail, MapPin } from 'lucide-react';
import '../styles/Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-main">
        <div className="footer-grid">
          {/* Logo y Slogan */}
          <div className="footer-column">
            <h2 className="footer-logo">REPORTAVÍAS CR</h2>
            <p className="footer-slogan">Plataforma Ciudadana</p>
          </div>

          {/* Servicios */}
          <div className="footer-column">
            <h3 className="footer-heading">SERVICIOS</h3>
            <ul className="footer-links">
              <li><a href="/reportCreate">Crear Reporte</a></li>
              <li><a href="/mapview">Ver Mapa</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
            </ul>
          </div>

          {/* Recursos */}
          <div className="footer-column">
            <h3 className="footer-heading">RECURSOS</h3>
            <ul className="footer-links">
              <li><a href="/">Inicio</a></li>
              <li><a href="/profile">Mi Perfil</a></li>
              <li><a href="/">Ayuda</a></li>
            </ul>
          </div>

          {/* Acerca de */}
          <div className="footer-column">
            <h3 className="footer-heading">ACERCA DE</h3>
            <ul className="footer-links">
              <li><a href="/">Nosotros</a></li>
              <li><a href="/">Contacto</a></li>
              <li><a href="/">Afiliados</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="footer-column">
            <h3 className="footer-heading">CONTACTO</h3>
            <ul className="footer-links">
              <li><MapPin size={14} className="inline" /> San José, CR</li>
              <li><Mail size={14} className="inline" /> info@reportavias.cr</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="footer-divider"></div>

      {/* Social y Copyright */}
      <div className="footer-bottom">
        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon">
            <Facebook size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-icon">
            <Twitter size={20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon">
            <Instagram size={20} />
          </a>
        </div>
        <p className="footer-copyright">
          &copy; {CURRENT_YEAR} ReporteVías CR. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
import React from 'react';
import '../styles/Footer.css';

// 2. Definir el año como constante fuera del componente (optimización)
const CURRENT_YEAR = new Date().getFullYear();

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <h2>ReporteVías CR</h2>
        <p>Plataforma ciudadana para el mejoramiento de la infraestructura vial urbana a través de la participación activa de la comunidad.</p>

        <div className="footer-contact">
          <h3>Contacto</h3>
          {/* 3. Usar <ul>/<li> para la semántica correcta de lista de enlaces */}
          <ul className="social-logos">
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                Facebook
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                Instagram
              </a>
            </li>
          </ul>
        </div>
        
        <div className="footer-objective">
          <h3>Objetivo Ciudadano</h3>
          <p>Empoderar a los ciudadanos para que contribuyan activamente al mejoramiento de su ciudad, creando un canal directo de comunicación con las autoridades.</p>
        </div>
      </div>
      <div className="footer-copyright">
        {/* Usar la constante precalculada */}
        &copy; {CURRENT_YEAR} ReporteVías CR. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;
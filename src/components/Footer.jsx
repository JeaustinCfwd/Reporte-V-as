import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <h2>ReporteVías CR</h2>
        <p>Plataforma ciudadana para el mejoramiento de la infraestructura vial urbana a través de la participación activa de la comunidad.</p>
        <div className="footer-contact">
          <h3>Contacto</h3>
          {/* Add social media logos here */}
          <div className="social-logos">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <img src="/images/facebook-logo.png" alt="Facebook" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <img src="/images/twitter-logo.png" alt="Twitter" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src="/images/instagram-logo.png" alt="Instagram" />
            </a>
          </div>
        </div>
        <div className="footer-objective">
          <h3>Objetivo Ciudadano</h3>
          <p>Empoderar a los ciudadanos para que contribuyan activamente al mejoramiento de su ciudad, creando un canal directo de comunicación con las autoridades.</p>
        </div>
      </div>
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} ReporteVías CR. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;

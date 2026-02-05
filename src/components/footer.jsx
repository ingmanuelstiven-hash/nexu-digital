// src/components/Footer.jsx
import React from "react";
import "../styles/he-foo.css";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-grid">
        <div className="footer-section">
          <h3>Sobre Nosotros</h3>
          <p className="brand-name">Nexus Digital</p>
          <p>Tu refugio literario en el corazón de Bogotá. Desde 1998 conectamos lectores con historias que transforman vidas. Ahora en formato digital para llegar a más corazones.</p>
        </div>

        <div className="footer-section">
          <h3>Contacto</h3>
          <p>📍 Calle 93 # 13-45, Chapinero</p>
          <p>Bogotá D.C., Colombia</p>
          <p>📞 +57 601 745 2389</p>
          <p>✉️ contacto@nexusdigital.com.co</p>
          <p>🕒 Lun - Sáb: 9:00 AM - 8:00 PM</p>
          <p>Dom: 10:00 AM - 6:00 PM</p>
        </div>

        <div className="footer-section">
          <h3>Síguenos</h3>
          <div className="social-links">
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">X</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Nexus Digital - Todos los derechos reservados</p>
      </div>
    </footer>
  );
}
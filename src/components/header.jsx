// src/components/Header.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "../styles/he-foo.css";
import logo from "../assets/Logo nexus.webp";

export default function Header() {
  const { logout } = useContext(AuthContext);
  const { totalCount } = useCart(); // contador del carrito
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Nexus Logo" className="header-logo" />
          <span className="logo-text">Nexus Digital</span>
        </Link>

        <nav className="header-nav">
          <Link to="/">Inicio</Link>
          <Link to="/libreria">Librería</Link>
          <Link to="/compras">Mis libros</Link>
          <Link to="/coworking">Coworking</Link>
        

          {/* Icono carrito con badge */}
          <Link to="/carrito" className="cart-link" aria-label={`Carrito, ${totalCount} artículos`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="#333" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="10.5" cy="19.5" r="1.2" fill="#333"/>
              <circle cx="17.5" cy="19.5" r="1.2" fill="#333"/>
            </svg>

            {totalCount > 0 && (
              <span className="cart-badge" aria-hidden>
                {totalCount}
              </span>
            )}
          </Link>

          {/* Cerrar sesión reducido a icono */}
          <button
            className="logout-icon-btn"
            onClick={handleLogout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M16 17l5-5-5-5" stroke="#333" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="#333" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 19H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7" stroke="#333" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}
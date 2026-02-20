// src/components/Header.jsx
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "../styles/he-foo.css";
import logo from "../assets/Logo nexus.webp";

export default function Header() {
  const { logout } = useContext(AuthContext);
  const { totalCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

        {/* Menú normal (solo en escritorio) */}
        <nav className="header-nav">
          <Link to="/">Inicio</Link>
          <Link to="/libreria">Librería</Link>
          <Link to="/compras">Mis libros</Link>
          <Link to="/coworking">Coworking</Link>

          <Link to="/carrito" className="cart-link" aria-label={`Carrito, ${totalCount} artículos`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="#333" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="10.5" cy="19.5" r="1.2" fill="#333"/>
              <circle cx="17.5" cy="19.5" r="1.2" fill="#333"/>
            </svg>
            {totalCount > 0 && <span className="cart-badge" aria-hidden>{totalCount}</span>}
          </Link>

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

        {/* Botón hamburguesa (solo en móvil) */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 12h18M3 6h18M3 18h18" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Menú móvil desplegable */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <div className="mobile-menu-header">
            <Link to="/" className="logo-link" onClick={() => setMenuOpen(false)}>
              <img src={logo} alt="Nexus Logo" className="header-logo" />
              <span className="logo-text">Nexus Digital</span>
            </Link>
            <button
              className="close-menu-btn"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              &times;
            </button>
          </div>
          <nav className="mobile-nav">
            <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
            <Link to="/libreria" onClick={() => setMenuOpen(false)}>Librería</Link>
            <Link to="/compras" onClick={() => setMenuOpen(false)}>Mis libros</Link>
            <Link to="/coworking" onClick={() => setMenuOpen(false)}>Coworking</Link>
          </nav>
          <div className="mobile-cart-logout">
            <Link
              to="/carrito"
              className="mobile-cart-link"
              onClick={() => setMenuOpen(false)}
              aria-label={`Carrito, ${totalCount} artículos`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="#333" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="10.5" cy="19.5" r="1.2" fill="#333"/>
                <circle cx="17.5" cy="19.5" r="1.2" fill="#333"/>
              </svg>
              {totalCount > 0 && <span className="mobile-cart-badge" aria-hidden>{totalCount}</span>}
            </Link>
            <button
              className="mobile-logout-btn"
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M16 17l5-5-5-5" stroke="#333" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H9" stroke="#333" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 19H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7" stroke="#333" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/login.css";
import Logo from "../assets/Logo nexus.webp";


export default function LoginPage() {
  const { login, authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("stiven@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleShowPassword = () => setShowPassword((s) => !s);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/"); 
    } catch (err) {
      setError(err.message || "Error al autenticar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">     
        <div className="logo-container">


         
          <img 
            src={Logo}  
            alt="Nexus Logo" 
            className="login-logo" 
          />
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="label">Email</label>
          <div className="input-group">
            <input
              type="email"
              placeholder="Ingresar Correo Eletronico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="input-icon-static">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </span>
          </div>

          <label className="label mt-3">Contraseña</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Ingresar Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="icon-btn-toggle" onClick={toggleShowPassword}>
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              )}
            </button>
          </div>

       

          {error && <div className="error-msg">{error}</div>}

          <button className="btn-submit" type="submit" disabled={loading || authLoading}>
            {loading || authLoading ? "Cargando..." : "Inicio de Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
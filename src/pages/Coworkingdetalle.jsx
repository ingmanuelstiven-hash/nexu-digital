
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { useCart } from "../contexts/CartContext.jsx";
import "../styles/coworkingde.css";

const API_SPACES = "https://mock.apidog.com/m1/1193165-1187983-default/coworkingnew/spaces";

const imagesMap = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,svg}', { eager: true, as: 'url' });
function resolveImageUrl(imagenField) {
  if (!imagenField) return "/assets/no-cover.png";
  const filename = typeof imagenField === 'string' ? imagenField.split('/').pop() : "";
  const key = `../assets/${filename}`;
  return imagesMap[key] || imagenField || "/assets/no-cover.png";
}

export default function CoworkingDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_SPACES)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.data || []);
        const found = list.find(s => String(s.id) === String(id));
        setSpace(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loader">Cargando detalles del espacio...</div>;
  if (!space) return <div className="container"><h3>Espacio no encontrado</h3><button onClick={() => navigate("/coworking")}>Volver</button></div>;

  const isLibre = space.estado.toLowerCase() === "libre";

  return (
    <div className="coworking-detail-page">
      <Header />
      
      <main className="container detail-container">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Volver a espacios
        </button>

        <div className="detail-grid">

          <div className="detail-media">
            <div className="main-image-wrapper">
              <img src={resolveImageUrl(space.imagen)} alt={space.nombre} />
              <span className={`detail-status-badge ${isLibre ? 'libre' : 'ocupado'}`}>
                {space.estado.toUpperCase()}
              </span>
            </div>
          </div>

          
          <div className="detail-info">
            <p className="detail-type">{space.tipo}</p>
            <h1 className="detail-title">{space.nombre}</h1>
            
            <div className="detail-price-box">
              <span className="price-label">Precio por jornada</span>
              <h2 className="price-value">{space.precio}</h2>
            </div>

            <div className="detail-stats">
              <div className="stat-item">
                <span className="stat-icon">👤</span>
                <div className="stat-text">
                  <p className="stat-label">Capacidad</p>
                  <p className="stat-val">{space.capacidad} Persona(s)</p>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🛡️</span>
                <div className="stat-text">
                  <p className="stat-label">Seguridad</p>
                  <p className="stat-val">Acceso controlado</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Equipamiento incluido</h3>
              <ul className="equip-list">
                {space.equipamiento?.map((item, index) => (
                  <li key={index}>✅ {item}</li>
                ))}
              </ul>
            </div>

            {!isLibre && (
              <div className="detail-occupied-box">
                <p className="occ-title">OCUPADO ACTUALMENTE</p>
                <p className="occ-user">Por: <strong>{space.ocupadoPor}</strong></p>
                <p className="occ-time">Horario: {space.desde} - {space.hasta}</p>
              </div>
            )}

            <div className="detail-actions">
              {isLibre ? (
                <button className="btn-reserve-large" onClick={() => addToCart(space)}>
                  Reservar este espacio ahora
                </button>
              ) : (
                <button className="btn-disabled" disabled>
                  No disponible para reserva
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
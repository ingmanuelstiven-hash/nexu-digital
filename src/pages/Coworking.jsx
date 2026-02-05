
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/coworking.css";
import { useCart } from "../contexts/CartContext.jsx";

const API_COWORKING = "https://mock.apidog.com/m1/1193165-1187983-default/coworkingnew/spaces";

const imagesMap = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,svg}', { eager: true, as: 'url' });
function resolveImageUrl(imagenField) {
  if (!imagenField) return "/assets/no-cover.png";
  const filename = typeof imagenField === 'string' ? imagenField.split('/').pop() : "";
  const key = `../assets/${filename}`;
  return imagesMap[key] || imagenField || "/assets/no-cover.png";
}

export default function Coworking() {
  const [spaces, setSpaces] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEstado, setFilterEstado] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(API_COWORKING)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.data || []);
        setSpaces(list);
        setFiltered(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let res = spaces.filter(s => {
      const matchEstado = !filterEstado || s.estado.toLowerCase() === filterEstado.toLowerCase();
      const matchTipo = !filterTipo || s.tipo === filterTipo;
      return matchEstado && matchTipo;
    });

   res.sort((a, b) => {
    const estadoA = a.estado.toLowerCase();
    const estadoB = b.estado.toLowerCase();

    if (estadoA === "libre" && estadoB !== "libre") return -1; // 'a' va primero
    if (estadoA !== "libre" && estadoB === "libre") return 1;  // 'b' va primero
    return 0; // mantienen su orden original entre ellos
  });

  setFiltered(res);
}, [filterEstado, filterTipo, spaces]);

  const handleCardClick = (id) => {
    navigate(`/coworking/${id}`);
  };

  if (loading) return <div className="loader">Cargando espacios...</div>;

  return (
    <div className="coworking-page">
      <Header />
      <main className="container">
        <div className="filter-bar">
          <div className="filter-group">
            <label>Estado</label>
            <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
              <option value="">Todos</option>
              <option value="libre">Libre</option>
              <option value="ocupado">Ocupado</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Tipo</label>
            <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
              <option value="">Todos los tipos</option>
              {[...new Set(spaces.map(s => s.tipo))].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button className="btn-clear-filters" onClick={() => {setFilterEstado(""); setFilterTipo("");}}>
             Limpiar filtros
          </button>
        </div>

        <div className="spaces-grid">
          {filtered.map(space => {
            const isLibre = space.estado.toLowerCase() === "libre";
            return (
              <div 
                key={space.id} 
                className="space-card clickable" 
                onClick={() => handleCardClick(space.id)}
              >
                <div className="card-image-container">
                  <img src={resolveImageUrl(space.imagen)} alt={space.nombre} />
                </div>
                
                <div className="card-content">
                  <div className="card-header-row">
                    <h3 className="space-name">{space.nombre}</h3>
                    <span className={`status-badge ${isLibre ? 'libre' : 'ocupado'}`}>
                      {space.estado.toUpperCase()}
                    </span>
                  </div>
                  <p className="space-type-text">{space.tipo}</p>
                  
                  <div className="space-meta">
                    <span>👤 {space.capacidad}</span>
                    <span>💵 {space.precio}</span>
                  </div>

                  {!isLibre && (
                    <div className="current-user-box">
                      <p className="label">USUARIO ACTUAL</p>
                      <p className="user-name">{space.ocupadoPor}</p>
                      <p className="user-time">{space.desde} - {space.hasta}</p>
                    </div>
                  )}

                  {isLibre && (
                    <div className="card-actions">
                      <button 
                        className="btn-reserve-blue" 
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que el clic navegue al detalle
                          addToCart(space);
                        }}
                      >
                        Reservar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
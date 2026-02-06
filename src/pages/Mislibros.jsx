import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/mislibros.css";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch"; 

const API_COMPRAS = "https://mock.apidog.com/m1/1193165-1187983-default/compras?id_usuario=10";

const imagesMap = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,svg}', { eager: true, as: 'url' });
function resolveImageUrl(imagenField) {
  if (!imagenField) return "/assets/no-cover.png";
  if (typeof imagenField === 'string' && (imagenField.startsWith('http') || imagenField.startsWith('/'))) {
    return imagenField;
  }
  const filename = imagenField.split('/').pop();
  const key = `../assets/${filename}`;
  if (imagesMap[key]) return imagesMap[key];
  return `/assets/${filename}`;
}

export default function MisLibros() {
  // CUSTOM HOOK 
  const { data, loading, error } = useFetch(API_COMPRAS);
  const navigate = useNavigate();

  
  const compras = Array.isArray(data) ? data : (data?.data || []);

  const handleCardClick = (compra) => {
    const bookId = compra.id_libro || compra.libro_id || compra.id;
    if (!bookId) {
      console.warn("No se encontró id de libro en la compra:", compra);
      return;
    }
    navigate(`/libro/${bookId}`, { state: { book: compra } });
  };

  const handleKeyPress = (e, compra) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick(compra);
    }
  };

  if (loading) return <p style={{ textAlign: "center", padding: "50px" }}>Cargando tus adquisiciones...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red", padding: "50px" }}>Error: {error}</p>;

  return (
    <div className="page-wrapper mislibros-page">
      <Header />

      <main className="mislibros-main">
        <div className="mislibros-header">
          <h1>Mis libros adquiridos</h1>
          <p className="subtitle">Historial de compras del Usuario #10</p>
        </div>

        {compras.length === 0 ? (
          <div className="no-purchases">
            <p>Aún no tienes libros en tu biblioteca personal.</p>
          </div>
        ) : (
          <div className="compras-grid">
            {compras.map((compra) => {
              const imageUrl = resolveImageUrl(compra.imagen);
              const fechaCompra = compra.fecha_compra
                ? new Date(compra.fecha_compra).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : "Fecha no disponible";

              const precioMostrado = compra.precio ?? compra.valor ?? 0;

              return (
                <article
                  key={compra.id ?? Math.random()}
                  className="compra-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCardClick(compra)}
                  onKeyDown={(e) => handleKeyPress(e, compra)}
                  aria-label={`Ver detalles de ${compra.titulo}`}
                >
                  <div className="compra-cover">
                    <img src={imageUrl} alt={compra.titulo} draggable="false" />
                  </div>
                  <div className="compra-info">
                    <h3 className="compra-title">{compra.titulo}</h3>
                    <div className="compra-meta">
                      <p className="compra-fecha"><strong>Comprado el:</strong> {fechaCompra}</p>
                      <p className="compra-valor"><strong>Precio:</strong> ${Number(precioMostrado).toLocaleString()}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
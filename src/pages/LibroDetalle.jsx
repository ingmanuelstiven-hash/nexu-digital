import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/librodetalle.css";
import { useCart } from "../contexts/CartContext";
import Loader from "../components/Loader.jsx";

const imagesMap = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,svg}', { eager: true, as: 'url' });

function resolveImageUrl(imagenField) {
  if (!imagenField) return '';
  if (typeof imagenField === 'string' && (imagenField.startsWith('http') || imagenField.startsWith('/'))) {
    return imagenField;
  }
  const filename = imagenField.split('/').pop();
  const key = `../assets/${filename}`;
  return imagesMap[key] || ''; 
}

export default function LibroDetalle() {
  const { addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAllReviews] = useState(false);

  // Fetch Libro
  const {
    data: libro,
    loading: loadingLibro,
    error: errorLibro,
  } = useFetch(`https://mock.apidog.com/m1/1193165-1187983-default/itemslib/${id}`);

  // Fetch Reseñas
  const {
    data: reviewsRaw,
    loading: loadingReviews,
    error: errorReviews,
  } = useFetch(`https://mock.apidog.com/m1/1193165-1187983-default/itemslib/reviews/${id}`);

  // Mostrar loader mientras cualquiera de las dos llamadas esté en progreso
  if (loadingLibro || loadingReviews) {
    return <Loader message="Cargando detalles y reseñas..." />;
  }

  if (errorLibro) return <div className="error">Error: {errorLibro}</div>;
  if (errorReviews) return <div className="error">Error al cargar reseñas: {errorReviews}</div>;
  if (!libro || Object.keys(libro).length === 0) return <div className="error">Libro no encontrado</div>;

  const reviewsList = Array.isArray(reviewsRaw) ? reviewsRaw : (reviewsRaw?.data || []);
  const sortedReviews = [...reviewsList].sort((a, b) => (b.puntuacion || 0) - (a.puntuacion || 0));

  const renderStars = (rating) => {
    const num = Number(rating) || 0;
    return (
      <div className="stars-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= num ? "star filled" : "star empty"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="page-container">
      <Header />
      <main className="detail-main">
        <h1 className="main-title">Detalle del libro</h1>
        <div className="book-container">
          <div className="book-image-section">
            <img src={resolveImageUrl(libro.imagen)} alt={libro.titulo} className="book-cover-detail" />
          </div>

          <div className="book-info-card">
            <h2 className="book-title-detail">{libro.titulo}</h2>

            <div className="book-specs">
              <p><strong>Autor:</strong> {libro.autor}</p>
              <p><strong>Editorial:</strong> {libro.editorial}</p>
              <p><strong>Año:</strong> {libro.año}</p>
              <p><strong>Categoría:</strong> {libro.categoria}</p>
              <p className="price-tag"><strong>Precio:</strong> ${libro.precio}</p>
            </div>

            <p className="book-description">{libro.sinopsis}</p>

            <div className="action-buttons">
              <button
                className="btn-buy"
                onClick={() => addToCart({
                  id: libro.id || libro._id || libro.codigo || id,
                  titulo: libro.titulo,
                  precio: Number(libro.precio || 0),
                  imagen: libro.imagen
                })}
              >
                Comprar
              </button>
            </div>

            <div className="pickup-info">
              <h3>Recogida en Nexus Digital</h3>
              <p>Puedes recoger tu pedido en la librería Nexus en un plazo aproximado de 24/48 horas.</p>
            </div>
          </div>
        </div>

        <section className="reviews-section-compact">
          <div className="reviews-header-inline">
            <h3>Opiniones de lectores</h3>
            <span className="reviews-count">{sortedReviews.length} reseñas</span>
          </div>

          <div className="reviews-grid">
            {sortedReviews.map((r) => (
              <div key={r.id || Math.random()} className="review-card-mini">
                <div className="review-top">
                  {renderStars(r.puntuacion)}
                  <span className="rating-tag">{r.puntuacion}/5</span>
                </div>
                <p className="comment-mini">{r.comentario}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
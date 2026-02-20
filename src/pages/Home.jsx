import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/inicio.css";
import { Link, useNavigate } from "react-router-dom";
import coworkingImg from "../assets/coworking.png";
import { useCart } from "../contexts/CartContext";
import Loader from "../components/Loader.jsx";

const API_BASE = "https://mock.apidog.com/m1/1193165-1187983-default/itemslib";

const imagesMap = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,svg}', { eager: true, as: 'url' });
function resolveImageUrl(imagenField) { 
  if (typeof imagenField === 'string' && (imagenField.startsWith('http') || imagenField.startsWith('/'))) {
    return imagenField;
  }  
  const filename = imagenField.split('/').pop();
  const key = `../assets/${filename}`;
  if (imagesMap[key]) return imagesMap[key];  
  return `/assets/${filename}`;
}

export default function Landing() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = Array.isArray(json) ? json : (json.data || []);

        // Ordenar por vendidos descendente y tomar 10 primeros
        const top10 = list
          .filter(book => typeof book.vendidos === "number")
          .sort((a, b) => b.vendidos - a.vendidos)
          .slice(0, 10);

        setBooks(top10);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los libros");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

if (loading) {
  return <Loader message="Buscando los mejores libros para ti..." />;
}
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <div className="page-wrapper">
      <Header />

      <main className="landing-main">
        <section className="hero-banner">
          <h1>Bienvenido a Nexus Digital</h1>
          <p>Tu refugio literario digital y CoWorking</p>
        </section>

        <section className="nexus-description">
          <h2>Descubre Nexus Digital</h2>
          <p>En Nexus puedes explorar un catálogo de libros para todos los gustos: novela, fantasía, misterio, romance, ciencia ficción… Descubre novedades, recomendaciones por género y reseñas que te ayudan a elegir mejor antes de comprar. Además, puedes reservar lanzamientos anticipados y conseguir tus lecturas al instante en PDF y EPUB, listas para leer en móvil, tablet o e-reader.</p>
        </section>

        <section className="nexus-description">
          <h2>Los 10 más vendidos</h2>
          <p>Explora los libros que más han conquistado a nuestros lectores.</p>
        </section>

        <section className="featured-grid-horizontal">
          {books.map((book) => {
            const imageUrl = resolveImageUrl(book.imagen);
            return (
              <div key={book.id} className="book-item-horizontal">
                <img
                  src={imageUrl}
                  alt={book.titulo}
                  className="book-image-horizontal"
                />
                <h3 className="book-title-horizontal">{book.titulo}</h3>
              
                <div className="book-buttons">
                  <button
                    className="btn-detail"
                    onClick={() => navigate(`/libro/${book.id}`, { state: { book } })}
                  >
                    Ver detalle
                  </button>
                  <button
                    className="btn-add-cart"
                    onClick={() => addToCart({
                      id: book.id,
                      titulo: book.titulo,
                      precio: Number(book.precio || 0),
                      imagen: book.imagen
                    })}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        <section className="nexus-coworking">
          <div className="coworking-text">
            <h2>Coworking</h2>
            <p>
              Descubre un lugar diseñado para potenciar tu productividad, creatividad y conexiones. Nuestro coworking ofrece un ambiente moderno, flexible y colaborativo, ideal para freelancers, startups y equipos que buscan crecer juntos. Más que un espacio, es una comunidad que impulsa tu éxito.
            </p>
          </div>
          <div className="coworking-image">
            <Link to="/coworking" className="nexus-coworking-link"><img src={coworkingImg} alt="Coworking" /></Link> 
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
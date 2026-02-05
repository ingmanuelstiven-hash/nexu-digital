
import React, { useState, useEffect, useMemo } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/biblioteca.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";

const API_BASE = "https://mock.apidog.com/m1/1193165-1187983-default/itemslib";

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

export default function Biblioteca() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Filtros (selección inmediata)
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedEditorials, setSelectedEditorials] = useState([]);
  const [minYear, setMinYear] = useState("");
  const [maxPriceFilter, setMaxPriceFilter] = useState(null); // si null -> usar max del dataset
  const [onlyBestSellers, setOnlyBestSellers] = useState(false);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Fetch datos
  useEffect(() => {
    let mounted = true;
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = Array.isArray(json) ? json : (json.data || []);
        if (mounted) {
          setBooks(list);
          setFilteredBooks(list);
          // set default price filter to dataset max
          const maxPrecio = Math.max(...list.map(b => Number(b.precio || 0)), 0);
          setMaxPriceFilter(maxPrecio || 100000);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError("No se pudieron cargar los libros");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBooks();
    return () => { mounted = false; };
  }, []);

  // Derivar opciones únicas (memo para performance)
  const categories = useMemo(() => {
    const s = new Set();
    books.forEach(b => {
      if (b.categoria) s.add(b.categoria);
    });
    return Array.from(s).sort();
  }, [books]);

  const types = useMemo(() => {
  const s = new Set();
  books.forEach(b => {
    if (b.tipo) {
      // Convertimos a minúsculas para evitar duplicados por mayúsculas
      const normalizado = b.tipo.toLowerCase();
      // Capitalizamos la primera letra para la interfaz (opcional)
      const capitalizado = normalizado.charAt(0).toUpperCase() + normalizado.slice(1);
      s.add(capitalizado);
    }
  });
  
  // Si la lista está vacía, aseguramos que existan por defecto
  if (s.size === 0) {
    return ["Libros", "Revistas"];
  }
  
  return Array.from(s).sort();
}, [books]);

  const editorials = useMemo(() => {
    const s = new Set();
    books.forEach(b => {
      if (b.editorial) s.add(b.editorial);
    });
    return Array.from(s).sort();
  }, [books]);

  const years = useMemo(() => {
    const s = new Set();
    books.forEach(b => {
      if (b.anio) s.add(Number(b.anio));
    });
    return Array.from(s).filter(Boolean).sort((a,b) => b - a); // descendiente
  }, [books]);

  const priceMaxFromData = useMemo(() => {
    if (!books.length) return 100000;
    return Math.max(...books.map(b => Number(b.precio || 0)), 0);
  }, [books]);

  // Si el filtro de precio está en null (aún no inicializado), inicializar con el max del dataset
  useEffect(() => {
    if (maxPriceFilter === null && priceMaxFromData !== null && priceMaxFromData !== 0) {
      setMaxPriceFilter(priceMaxFromData);
    }
  }, [priceMaxFromData, maxPriceFilter]);

  // Aplicar filtros automáticamente al cambiar cualquiera de los estados de filtro
  useEffect(() => {
    const apply = () => {
      let res = [...books];
      if (selectedCategories.length > 0) {
        res = res.filter(b => selectedCategories.includes(b.categoria));
      }
    if (selectedTypes.length > 0) {
  res = res.filter(b => {
    if (!b.tipo) return false;
    // Normalizamos el tipo del libro actual para comparar
    const tipoLibro = b.tipo.charAt(0).toUpperCase() + b.tipo.slice(1).toLowerCase();
    return selectedTypes.includes(tipoLibro);
  });
}
      if (selectedEditorials.length > 0) {
        res = res.filter(b => selectedEditorials.includes(b.editorial));
      }
      if (minYear) {
        res = res.filter(b => Number(b.anio || 0) >= Number(minYear));
      }
      if (maxPriceFilter !== null) {
        res = res.filter(b => Number(b.precio || 0) <= Number(maxPriceFilter));
      }
      if (onlyBestSellers) {
        // criterio simple: vendidos > median o > 100 (ajusta según dataset)
        const medianSold = (() => {
          const arr = books.map(b => Number(b.vendidos || 0)).sort((a,b)=>a-b);
          if (!arr.length) return 0;
          return arr[Math.floor(arr.length/2)];
        })();
        res = res.filter(b => Number(b.vendidos || 0) >= Math.max(100, medianSold));
      }
      setFilteredBooks(res);
    
    };

    apply();


  }, [
    books,
    selectedCategories,
    selectedTypes,
    selectedEditorials,
    minYear,
    maxPriceFilter,
    onlyBestSellers
  ]);

  // Handlers
  const toggleSelection = (value, setter) => {
    setter(prev => (prev.includes(value) ? prev.filter(x => x !== value) : [...prev, value]));
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSelectedEditorials([]);
    setMinYear("");
    setOnlyBestSellers(false);
    setMaxPriceFilter(priceMaxFromData);
  };

  if (loading) return <p style={{ textAlign: "center" }}>Cargando libros...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <div className="page-wrapper biblioteca-page">
      <Header />

      <main className={`biblioteca-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <aside className={`filters-sidebar ${sidebarOpen ? "open" : "closed"}`} aria-hidden={!sidebarOpen}>
          <div className="filters-top">
  <button
    className="sidebar-toggle"
    onClick={() => setSidebarOpen(o => !o)}
    aria-pressed={sidebarOpen}
    aria-label={sidebarOpen ? "Ocultar filtros" : "Mostrar filtros"}
    title={sidebarOpen ? "Ocultar filtros" : "Mostrar filtros"}
  >
    {/* Icono: menú / cerrar según estado */}
    {sidebarOpen ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M6 12h12" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M6 6h12" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M6 18h12" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M9 6l6 6-6 6" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )}
  </button>

  <h3 className="filters-title">Filtros</h3>
</div>

          <div className="filter-section">
            <h4>Categoría</h4>
            {categories.length === 0 ? <div className="small-muted">No disponible</div> : categories.map(cat => (
              <label key={cat} className="filter-label">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleSelection(cat, setSelectedCategories)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h4>Tipo</h4>
            {types.map(t => (
              <label key={t} className="filter-label">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(t)}
                  onChange={() => toggleSelection(t, setSelectedTypes)}
                />
                <span>{t}</span>
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h4>Editorial</h4>
            {editorials.length === 0 ? <div className="small-muted">No disponible</div> : editorials.map(ed => (
              <label key={ed} className="filter-label">
                <input
                  type="checkbox"
                  checked={selectedEditorials.includes(ed)}
                  onChange={() => toggleSelection(ed, setSelectedEditorials)}
                />
                <span>{ed}</span>
              </label>
            ))}
          </div>

          

          <div className="filter-section">
            <h4>Precio máximo</h4>
            <div className="price-row">
              <input
                type="range"
                min="0"
                max={priceMaxFromData || 100000}
                step="1000"
                value={maxPriceFilter || 0}
                onChange={e => setMaxPriceFilter(Number(e.target.value))}
              />
              <div className="price-value">${Number(maxPriceFilter || 0).toLocaleString()}</div>
            </div>
          </div>

          

          <div className="filter-actions">
            <button className="btn-clear" onClick={clearFilters}>Limpiar</button>
          </div>
        </aside>

        <section className="books-grid-section">
          <div className="books-grid-header">
            <div>{filteredBooks.length} resultados</div>
            <div>
              <button className="btn-toggle-sidebar" onClick={() => setSidebarOpen(s => !s)}>
                {sidebarOpen ? "Ocultar filtros" : "Mostrar filtros"}
              </button>
            </div>
          </div>

          <div className="books-grid">
            {filteredBooks.length === 0 ? (
              <div className="no-results">No se encontraron libros con esos filtros.</div>
            ) : (
              filteredBooks.map(book => {
                const imageUrl = resolveImageUrl(book.imagen);
                return (
                  <article key={book.id} className="book-card">
                    <div className="card-cover">
                      <img src={imageUrl} alt={book.titulo} />
                    </div>
                    <div className="card-body">
                      <h3 className="book-title">{book.titulo}</h3>
                      <p className="book-author">{book.autor || book.autores || "Autor desconocido"}</p>
                      <p className="book-price">${Number(book.precio || 0).toLocaleString()}</p>
                      <div className="card-actions">
                        <button className="btn-detail" onClick={() => navigate(`/libro/${book.id}`, { state: { book } })}>Ver detalles</button>
                        <button className="btn-add" onClick={() => addToCart({
                          id: book.id,
                          titulo: book.titulo,
                          precio: Number(book.precio || 0),
                          imagen: book.imagen
                        })}>Agregar al carrito</button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
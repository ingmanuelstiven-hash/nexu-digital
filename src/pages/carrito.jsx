
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/carrito.css";

function parsePriceString(precio) {
  if (precio == null) return 0;
  if (typeof precio === "number" && Number.isFinite(precio)) return precio;
  const cleaned = String(precio).replace(/\s/g, "").replace(/[,]/g, "").replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export default function Carrito() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="carrito-page-container">
      <Header />
      
      <main className="carrito-main">
        <div className="carrito-content">
          <h1 className="carrito-title">Tu carrito</h1>

          {cartItems.length === 0 ? (
            <div className="carrito-empty">
              <p>No hay artículos en el carrito.</p>
              <button onClick={() => navigate("/libreria")} className="btn-buy">
                Ir al catálogo
              </button>
            </div>
          ) : (
            <div className="carrito-grid">
              {/* Lista de items */}
              <div className="carrito-items-list">
                {cartItems.map((item) => {
                  const precioNum = Number(item.precioNumber) || parsePriceString(item.precio);
                  const cantidad = Number(item.cantidad || 1);
                  const subtotalFila = precioNum * cantidad;
                  const precioDisplay = item.precio ? String(item.precio) : `$${precioNum.toLocaleString('es-CO')}`;

                  return (
                    <div key={String(item.id)} className="carrito-item-card">
                      <div className="item-info">
                        <div className="item-title">{item.titulo}</div>
                        <div className="item-price">Precio: {precioDisplay}</div>
                      </div>

                      <div className="item-controls">
                        <button
                          className="btn-quantity"
                          onClick={() => updateQuantity(item.id, Math.max(1, cantidad - 1))}
                          aria-label={`Disminuir cantidad de ${item.titulo}`}
                        >
                          -
                        </button>

                        <div className="item-quantity">{cantidad}</div>

                        <button
                          className="btn-quantity"
                          onClick={() => updateQuantity(item.id, cantidad + 1)}
                          aria-label={`Aumentar cantidad de ${item.titulo}`}
                        >
                          +
                        </button>

                        <div className="item-subtotal">
                          ${subtotalFila.toLocaleString('es-CO')}
                        </div>

                        <button
                          className="btn-remove"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Resumen lateral */}
              <aside className="carrito-summary">
                <div className="summary-card">
                  <h3 className="summary-title">Resumen</h3>
                  
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <strong>${Number(totalPrice || 0).toLocaleString('es-CO')}</strong>
                  </div>

                  <button
                    className="btn-buy"
                    onClick={() => alert("Simulación de pago (no funcional).")}
                  >
                    Pagar
                  </button>

                  <button
                    className="btn-clear"
                    onClick={() => { clearCart(); }}
                  >
                    Vaciar carrito
                  </button>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
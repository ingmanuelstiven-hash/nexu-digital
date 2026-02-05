// src/contexts/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (ctx === undefined) {
    throw new Error("useCart must be used within <CartProvider>");
  }
  return ctx;
}

/* convierte numero con simbolo a solo numero*/
function parsePrice(precio) {
  if (precio == null) return 0;
  if (typeof precio === "number" && Number.isFinite(precio)) return precio;
  const cleaned = String(precio)
    .replace(/\s/g, "")    
    .replace(/[,]/g, "")   
    .replace(/[^\d.-]/g, ""); 
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem("nexus_cart_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    title: "",
    action: null,
  });

  useEffect(() => {
    try {
      localStorage.setItem("nexus_cart_v1", JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  const showToast = ({ title = "", message = "", action = null, duration = 3000 }) => {
    setToast({ visible: true, title, message, action });
    if (duration > 0) {
      setTimeout(() => {
        setToast((t) => ({ ...t, visible: false }));
      }, duration);
    }
  };

  const addToCart = (product) => {
    const id = String(product.id ?? product.espacioId ?? `${product.tipo}-${Date.now()}`);
    const precioNumber = parsePrice(product.precioNumber ?? product.precio ?? product.price ?? product.valor);
    const titulo = product.titulo ?? product.nombre ?? product.title ?? "Artículo";
    const cantidadToAdd = Number(product.quantity ?? 1);

    setCartItems((prev) => {
      const idx = prev.findIndex((p) => String(p.id) === id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], cantidad: (next[idx].cantidad || 1) + cantidadToAdd };
        return next;
      }
      const newItem = {
        id,
        titulo,
        precio: product.precio ?? String(precioNumber), 
        precioNumber,
        cantidad: cantidadToAdd,
        imagen: product.imagen || null,
        metadata: product.metadata || {},
      };
      return [...prev, newItem];
    });

    showToast({
      title: "Añadido al carrito",
      message: titulo,
      action: { label: "Ver carrito", onClick: () => {  } },
      duration: 3500,
    });
  };

  const removeFromCart = (id) => setCartItems((prev) => prev.filter((p) => String(p.id) !== String(id)));
  const updateQuantity = (id, cantidad) =>
    setCartItems((prev) => prev.map((p) => (String(p.id) === String(id) ? { ...p, cantidad: Math.max(1, cantidad) } : p)));
  const clearCart = () => setCartItems([]);

  const totalCount = cartItems.reduce((s, it) => s + Number(it.cantidad || 0), 0);

  const totalPrice = cartItems.reduce((s, it) => s + Number(it.precioNumber || 0) * Number(it.cantidad || 0), 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalCount,
    totalPrice,
    toast,
    setToast,
  };

function parsePrice(precio) {
  if (precio == null) return 0;
  if (typeof precio === "number") return precio; 
  const cleaned = String(precio).replace(/[^\d.-]/g, ""); 
  return Number(cleaned) || 0;
}

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
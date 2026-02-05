// src/components/Toast.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function Toast() {
  const { toast, setToast } = useCart();
  const navigate = useNavigate();

  // Si no es visible, no renderiza nada
  if (!toast?.visible) return null;

  const handleClose = () => {
    setToast((t) => ({ ...t, visible: false }));
  };

  const handleAction = () => {
    handleClose(); // Cerramos el popup
    navigate("/carrito"); // Redirigimos a la página del carrito
  };

  return (
    <div className="nexus-toast">
      <div className="nexus-toast-inner">
        <div className="nexus-toast-left">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="nexus-toast-body">
          <div className="nexus-toast-title">{toast.title}</div>
          <div className="nexus-toast-msg">{toast.message}</div>
        </div>

        <div className="nexus-toast-actions">
          <button className="toast-btn-action" onClick={handleAction}>
            Ver carrito
          </button>
          <button className="toast-btn-close" onClick={handleClose}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import LibroDetalle from "./pages/LibroDetalle";
import Biblioteca from "./pages/Biblioteca";
import Coworking from "./pages/Coworking";
import Home from "./pages/Home";
import Carrito from "./pages/carrito"; 
import Toast from "./components/Toast"; 
import Compras from './pages/Mislibros';
import Coworkingdetalle from "./pages/Coworkingdetalle";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/libreria" element={<ProtectedRoute><Biblioteca /></ProtectedRoute>} />
            <Route path="/libro/:id" element={<ProtectedRoute><LibroDetalle /></ProtectedRoute>} />
            <Route path="/coworking" element={<ProtectedRoute><Coworking /></ProtectedRoute>} />
            <Route path="/carrito" element={<ProtectedRoute><Carrito /></ProtectedRoute>} />
            <Route path="/compras" element={<ProtectedRoute><Compras /></ProtectedRoute>} />
            <Route path="/coworking/:id" element={<ProtectedRoute><Coworkingdetalle /></ProtectedRoute>} />
          </Routes>
          <Toast />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
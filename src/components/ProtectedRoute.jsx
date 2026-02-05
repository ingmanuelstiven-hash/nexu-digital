import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useContext(AuthContext);

  // animacion de carga
  if (authLoading) {
    return <div style={{padding:20, textAlign:'center'}}>Cargando...</div>;
  }

  // Si no esta autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // llevar a ladning
  return children;
}
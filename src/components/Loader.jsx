import React from 'react';
import '../styles/loader.css'; // Añade esta línea arriba de todo

const Loader = ({ message = "Cargando datos..." }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="spinner"></div>
        <p className="loader-text">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
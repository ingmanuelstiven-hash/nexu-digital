import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import MisLibros from '../pages/MisLibros';

//Que los libros comprados se muestren correctamente en la página de MisLibros, utilizando datos mockeados para simular la respuesta de la API.

describe('MisLibros', () => {
  const mockCompras = [
    {
      id: "1",
      titulo: "Libro Test 1",
      imagen: "libro1.jpg",
      fecha_compra: "2023-01-01T00:00:00Z",
      precio: 25000
    },
    {
      id: "2",
      titulo: "Libro Test 2",
      imagen: "libro2.jpg",
      fecha_compra: "2023-02-15T00:00:00Z",
      precio: 30000
    }
  ];

  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCompras),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('muestra los libros adquiridos cargados desde la API mock', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <MisLibros />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );

   
    const libro1 = await screen.findByText(/Libro Test 1/i);
    const libro2 = await screen.findByText(/Libro Test 2/i);

    expect(libro1).toBeInTheDocument();
    expect(libro2).toBeInTheDocument();


  });
});
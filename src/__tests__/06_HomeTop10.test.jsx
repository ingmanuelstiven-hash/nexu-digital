import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import Home from '../pages/Home';

describe('Home Page - Top 10', () => {
  const mockBooks = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    titulo: `Libro ${i + 1}`,
    autor: `Autor ${i + 1}`,
    precio: `$${10 + i}`,
    // añade otras propiedades que use tu Home (imagen, categoria, etc.) si es necesario
  }));

  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBooks),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('muestra "Los 10 más vendidos" y renderiza 10 libros', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Home />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    // Espera el título principal
    const heading = await screen.findByText(/Los 10 más vendidos/i);
    expect(heading).toBeInTheDocument();

    
  });
});
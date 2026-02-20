import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from '../contexts/CartContext';
import { AuthProvider } from '../contexts/AuthContext';
import LibroDetalle from '../pages/LibroDetalle';

describe('LibroDetalle - reseñas', () => {
  const mockReviews = [
    { id: "r1", puntuacion: 5, comentario: "Excelente libro" },
  ];

  beforeEach(() => {
    global.fetch = vi.fn((url) => {
      if (url.includes('/reviews')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockReviews),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('muestra al menos una reseña traída de la API', async () => {
    render(
      <MemoryRouter initialEntries={['/libro/1']}>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/libro/:id" element={<LibroDetalle />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const review = await screen.findByText(/Excelente libro/i);
    expect(review).toBeInTheDocument();
  });
});
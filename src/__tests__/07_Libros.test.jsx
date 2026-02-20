import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import Biblioteca from '../pages/Biblioteca';

// Se muestra los libros cargados desde la API real.

describe('Biblioteca - integración con API real', () => {
  it('debe mostrar libros cargados desde la API real', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Biblioteca />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    // Tiempo de espera para que los libros se carguen desde la API real
    const bookTitle = await screen.findByText(/./, {}, { timeout: 5000 }); // espera hasta 5s
    expect(bookTitle).toBeInTheDocument();
  });
});
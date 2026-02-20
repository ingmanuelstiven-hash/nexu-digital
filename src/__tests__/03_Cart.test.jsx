import { render, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CartProvider, useCart } from '../contexts/CartContext';

const TestComponent = () => {
  const { cartItems, addToCart } = useCart();

  return (
    <div>
      <span data-testid="cart-count">{cartItems ? cartItems.length : 0}</span>
      <button onClick={() => addToCart({ id: 1, titulo: 'Libro Test' })}>Add</button>
    </div>
  );
};

// Agegar un producto al carrito y verificar que se actualice el conteo de items en el carrito.

describe('Cart Context', () => {
  it('debe iniciar con el carrito vacío y permitir agregar productos', () => {
    const { getByTestId, getByText } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(getByTestId('cart-count').textContent).toBe('0');

    act(() => {
      getByText('Add').click();
    });

    expect(getByTestId('cart-count').textContent).toBe('1');
  });
});
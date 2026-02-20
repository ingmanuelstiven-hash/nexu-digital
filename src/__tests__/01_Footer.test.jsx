import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '../components/footer';


// Busca el texto de copyright completo en el componente Footer y verifica que esté presente 

describe('Footer Component', () => {
  it('debe renderizar el texto de copyright completo', () => {
    render(<Footer />);
    
    const copyrightText = screen.getByText(/Todos los derechos reservados/i);
    expect(copyrightText).toBeInTheDocument();
  });

  it('debe mostrar la dirección de contacto', () => {
    render(<Footer />);
    const address = screen.getByText(/Calle 93 # 13-45/i);
    expect(address).toBeInTheDocument();
  });
});
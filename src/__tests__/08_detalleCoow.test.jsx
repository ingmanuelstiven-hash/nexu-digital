import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from '../contexts/CartContext';
import { AuthProvider } from '../contexts/AuthContext';
import CoworkingDetalle from '../pages/Coworkingdetalle';


//Muestra los detalles del espacio cargado desde la API mock

describe('CoworkingDetalle', () => {
  const mockSpace = {
    id: "1",
    nombre: "Sala de Juntas Alpha",
    tipo: "Sala de Juntas",
    estado: "Libre",
    capacidad: 10,
    precio: "$50.000/h",
    imagen: "sala1.jpg",
    equipamiento: ["WiFi", "Proyector"],
    ocupadoPor: "",
    desde: "",
    hasta: ""
  };

  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockSpace]),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('muestra los detalles del espacio cargado desde la API mock', async () => {
    render(
      <MemoryRouter initialEntries={['/coworking/1']}>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/coworking/:id" element={<CoworkingDetalle />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // Espera a que el nombre del espacio aparezca
    const spaceName = await screen.findByText(/Sala de Juntas Alpha/i);
    expect(spaceName).toBeInTheDocument();

  
  });
});
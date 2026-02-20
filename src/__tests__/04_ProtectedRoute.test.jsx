import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';


//Valida que si no hay un usuario autenticado.

describe('ProtectedRoute', () => {
  it('redirige a /login si no hay usuario', () => {
    render(
      <MemoryRouter initialEntries={['/private']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/private" element={
              <ProtectedRoute>
                <div>Private Content</div>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
    expect(screen.queryByText(/Private Content/i)).not.toBeInTheDocument();
  });
});
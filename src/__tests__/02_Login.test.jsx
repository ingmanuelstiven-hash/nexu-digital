import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Login from '../pages/Login'; 

// Este test verifica que el formulario de inicio de sesión se renderice correctamente.

describe('Login Page', () => {
  
it('debe renderizar el formulario de acceso correctamente', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );

  expect(screen.getByText(/Inicio de Sesión/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/correo/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /inicio de sesión/i })).toBeInTheDocument();
});


  it('debe permitir escribir en los campos de texto', () => {
    // 1. ARRANGE
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/correo/i);
    const passwordInput = screen.getByPlaceholderText(/contraseña/i);

    // simula eue el usuario escribe
    fireEvent.change(emailInput, { target: { value: 'stiven@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    // Verificar que el valor cambió
    expect(emailInput.value).toBe('stiven@gmail.com');
    expect(passwordInput.value).toBe('123456');
  });

 
});
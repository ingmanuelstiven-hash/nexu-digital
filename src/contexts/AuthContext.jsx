
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); }
    catch { return null; }
  });
  const [authLoading, setAuthLoading] = useState(false);

  const login = async (correo, contraseña) => {
    setAuthLoading(true);
    try {
      const base = 'https://mock.apidog.com/m1/1193165-1187983-default/login';
      const params = new URLSearchParams();
      params.append('correo', correo);
      
      params.append('contrasena', contraseña);

      const url = `${base}?${params.toString()}`;

      const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' }});
      const json = await res.json().catch(() => null);
      console.debug('Login response', { status: res.status, ok: res.ok, body: json });

      if (!res.ok) {
        const msg = (json && json.message) ? json.message : `HTTP ${res.status}`;
        throw new Error(msg);
      }

      // Si mock devuelve success:false
      if (json && json.success === false) {
        throw new Error(json.message || 'Autenticación fallida');
      }

      // Si devuelve usuario en root y tiene campo contrasena
      if (json && json.contrasena) {
        if (json.contrasena !== contraseña) throw new Error('Contraseña incorrecta');
        localStorage.setItem('user', JSON.stringify(json));
        setUser(json);
        return json;
      }

      // Si devuelve usuario en data
      if (json && json.data && (json.data.id || json.data.correo)) {
        const usuario = json.data;
        if (usuario.contrasena && usuario.contrasena !== contraseña) throw new Error('Contraseña incorrecta');
        localStorage.setItem('user', JSON.stringify(usuario));
        setUser(usuario);
        return usuario;
      }

      throw new Error('Respuesta del servidor no contiene usuario válido');
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    try {
      if (user) localStorage.setItem('user', JSON.stringify(user));
      else localStorage.removeItem('user');
    } catch (e) { console.error(e); }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
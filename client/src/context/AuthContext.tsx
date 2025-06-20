// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  token: string | null;
  isAdmin: boolean;
  login: (token: string) => string; // Now returns redirect path
  logout: () => void;
}

interface DecodedToken {
  role?: string;
  exp?: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAdmin(false);
    delete api.defaults.headers.common['Authorization'];
  }, []);

  const initializeAuth = useCallback((token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      setIsAdmin(decoded.role === 'admin');
      setToken(token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Token invalid:', error);
      logout();
    }
  }, [logout]);

  // ✅ Modified login to just set token and return redirect path
  const login = (newToken: string): string => {
    localStorage.setItem('token', newToken);
    const decoded: DecodedToken = jwtDecode(newToken);
    setIsAdmin(decoded.role === 'admin');
    setToken(newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

    return decoded.role === 'admin' ? '/dashboard' : '/';
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      initializeAuth(storedToken);
    }
  }, [initializeAuth]);

  return (
    <AuthContext.Provider value={{ token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

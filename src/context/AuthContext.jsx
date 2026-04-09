import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('talentco_token');
    const storedUser = localStorage.getItem('talentco_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('talentco_token', jwtToken);
    localStorage.setItem('talentco_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('talentco_token');
    localStorage.removeItem('talentco_user');
  };

  const isAdmin = () => user?.role === 'ADMIN';
  const isProfessional = () => user?.role === 'PROFESSIONAL';
  const isClient = () => user?.role === 'CLIENT';
  const isSupport = () => user?.role === 'SUPPORT';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isProfessional, isClient, isSupport }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

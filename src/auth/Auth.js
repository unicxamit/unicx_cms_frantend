// src/auth/AuthContext.js
import React, { createContext, useContext, useMemo, useState } from 'react';
import { logoutUser as logoutUserApi } from '../adminApi';
import { safeGetItem, safeRemoveItem, safeSetItem } from '../utils/safeStorage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = safeGetItem('user');
      const storedToken = safeGetItem('adminToken');
      if (!storedUser || !storedToken) {
        return null;
      }
      return JSON.parse(storedUser);
    } catch (error) {
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
    safeSetItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await logoutUserApi();
    } catch (error) {
      // local logout should always continue even if API logout fails
    }
    setUser(null);
    safeRemoveItem('user');
    safeRemoveItem('adminToken');
  };

  const isAuthenticated = !!user && !!safeGetItem('adminToken');
  const value = useMemo(() => ({ user, isAuthenticated, login, logout }), [user, isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

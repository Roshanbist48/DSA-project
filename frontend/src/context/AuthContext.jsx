import React, { createContext, useState } from 'react';
import apiClient from '../services/api';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'authUser';

const loadInitialUser = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadInitialUser());

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const login = async (username, password) => {
    const response = await apiClient.post('/auth/login', {
      username: username.trim().toLowerCase(),
      password,
    });
    saveUser({ username: response.data.username, provider: 'local' });
    return response.data;
  };

  const signup = async (username, password) => {
    const response = await apiClient.post('/auth/signup', {
      username: username.trim().toLowerCase(),
      password,
      provider: 'local',
    });
    return response.data;
  };

  const socialLogin = async (provider, providerId, email) => {
    const response = await apiClient.post('/auth/social', {
      provider: provider.toLowerCase(),
      provider_id: providerId,
      email,
    });
    saveUser({ username: response.data.username, provider: response.data.provider });
    return response.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, socialLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

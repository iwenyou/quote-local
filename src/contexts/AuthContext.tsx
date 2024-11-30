import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types/user';
import { verifyToken } from '../services/authService';

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  setUser: (user: Omit<User, 'password'> | null) => void;
  updateUserProfile: (updates: Partial<Omit<User, 'password'>>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);

  const updateUserProfile = (updates: Partial<Omit<User, 'password'>>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = verifyToken(token);
        const users = getAllUsers();
        const userData = users.find(u => u.id === decoded.userId);
        if (userData) {
          const { password, ...userWithoutPassword } = userData;
          setUser(userWithoutPassword);
        }
      } catch (error) {
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updateUserProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
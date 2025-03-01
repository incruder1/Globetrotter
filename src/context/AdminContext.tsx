import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';

interface AdminContextType {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchUsers: () => Promise<any[]>;
  fetchStats: () => Promise<any>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'http://localhost:3001/api';

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/admin/login`, { username, password });
      if (response.data.success) {
        setIsAuthenticated(true);
        return true;
      } else {
        setError('Invalid credentials');
        return false;
      }
    } catch (err) {
      setError('Login failed');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const fetchUsers = async (): Promise<any[]> => {
    if (!isAuthenticated) return [];
    
    try {
      const response = await axios.get(`${API_URL}/admin/users`);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch users:', err);
      return [];
    }
  };

  const fetchStats = async (): Promise<any> => {
    if (!isAuthenticated) return {};
    
    try {
      const response = await axios.get(`${API_URL}/admin/stats`);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      return {};
    }
  };

  return (
    <AdminContext.Provider value={{ 
      isAuthenticated, 
      loading, 
      error, 
      login, 
      logout,
      fetchUsers,
      fetchStats
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
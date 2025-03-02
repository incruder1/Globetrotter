import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  score: {
    correct: number;
    incorrect: number;
  };
  highScore?: number;
  gamesPlayed?: number;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  registerUser: (username: string) => Promise<void>;
  updateScore: (correct: boolean, gameCompleted?: boolean) => Promise<void>;
  fetchUserById: (userId: string) => Promise<User | null>;
  resetGame: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'http://localhost:3001/api';

  const registerUser = async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      localStorage.removeItem('username');
      const response = await axios.post(`${API_URL}/user`, { username });
      console.log('User registered:', response.data);
      setUser({
        id: response.data._id,
        username: response.data.username,
        score: { correct: 0, incorrect: 0 },
        highScore: 0,
        gamesPlayed: 0
      });
      localStorage.setItem('username', response.data.username);
    } catch (err) {
      setError('Failed to register user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateScore = async (correct: boolean, gameCompleted = false) => {
    if (!user) return;    
    try {
      const response = await axios.put(`${API_URL}/user/${user.id}/score`, { correct, gameCompleted });
      console.log(user);
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          score: response.data
        };
      });
    } catch (err) {
      console.error('Failed to update score:', err);
    }
  };

  const fetchUserById = async (userId: string): Promise<User | null> => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch user:', err);
      return null;
    }
  };

  const resetGame = () => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        score: { correct: 0, incorrect: 0 }
      };
    });
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      error, 
      registerUser, 
      updateScore,
      fetchUserById,
      resetGame
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Simple hash function for password (for demo purposes)
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for logged in user
    const loggedInUser = localStorage.getItem('f1_current_user');
    if (loggedInUser) {
      setCurrentUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);

  const register = (username, password, championDriver, championConstructor) => {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('f1_users') || '[]');
    
    // Check if username exists
    if (users.find(u => u.username === username)) {
      throw new Error('Username already exists');
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      password: simpleHash(password),
      championDriver,
      championConstructor,
      createdAt: new Date().toISOString(),
      predictions: {},
      totalPoints: 0
    };

    // Save user
    users.push(newUser);
    localStorage.setItem('f1_users', JSON.stringify(users));

    // Log in user
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('f1_current_user', JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  };

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('f1_users') || '[]');
    const user = users.find(u => u.username === username && u.password === simpleHash(password));

    if (!user) {
      throw new Error('Invalid username or password');
    }

    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('f1_current_user', JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('f1_current_user');
  };

  const updateUser = (updates) => {
    const users = JSON.parse(localStorage.getItem('f1_users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('f1_users', JSON.stringify(users));
      
      const updatedUser = { ...users[userIndex] };
      delete updatedUser.password;
      setCurrentUser(updatedUser);
      localStorage.setItem('f1_current_user', JSON.stringify(updatedUser));
    }
  };

  const isChampionSelectionLocked = () => {
    const firstRaceDate = new Date('2026-03-15');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    firstRaceDate.setHours(0, 0, 0, 0);
    
    return today >= firstRaceDate;
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!currentUser,
    isChampionSelectionLocked
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { INITIAL_USERS } from '../utils/seedData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Load users from storage or initialize with seed demo users
  const [users, setUsers] = useState(() => {
    const saved = storage.get('users');
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    storage.set('users', INITIAL_USERS);
    return INITIAL_USERS;
  });

  // Current logged in user (defaults to Tushar for instant preview)
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = storage.get('current_user');
    if (savedUser) return savedUser;
    // Default to first demo user (Tushar)
    const defaultUser = INITIAL_USERS[0];
    storage.set('current_user', defaultUser);
    return defaultUser;
  });

  // Sync users list to storage
  useEffect(() => {
    storage.set('users', users);
  }, [users]);

  // Sync current user to storage
  useEffect(() => {
    if (currentUser) {
      storage.set('current_user', currentUser);
    } else {
      storage.remove('current_user');
    }
  }, [currentUser]);

  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid email or password.' };
  };

  const register = (userData) => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password,
      city: userData.city ? userData.city.trim() : 'India',
      bio: userData.bio ? userData.bio.trim() : 'Book lover & community reader.',
      avatar: userData.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80`,
      joinedDate: new Date().toISOString().split('T')[0],
      rating: 5.0,
      donatedCount: 0,
      soldCount: 0,
      badge: 'New Reader'
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchAccount = (userId) => {
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser) {
      setCurrentUser(targetUser);
      return targetUser;
    }
    return null;
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedFields };
    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        switchAccount,
        updateProfile,
        isAuthenticated: !!currentUser
      }}
    >
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


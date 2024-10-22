// context/AuthContext.tsx
import { router } from 'expo-router';
import React, { createContext, useState } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const login = () => {
    // Implement actual login logic and state management here
    console.log('Logged in');
    setIsLoggedIn(true);

    router.replace('/');
  };

  const logout = () => {
    // Implement actual logout logic and state management here
    console.log('Logged out');
    setIsLoggedIn(false);

    router.replace('/login');
};

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
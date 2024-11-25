import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthNavigator />
    </AuthProvider>
  );
}

function AuthNavigator() {
  const { isLoggedIn } = useContext(AuthContext);

  console.log('isLoggedIn:', isLoggedIn);
  console.log('Current navigation state:', isLoggedIn ? '(tabs)' : '(auth)');

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
    </Stack>

  );
}
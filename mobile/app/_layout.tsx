// app/_layout.tsx
import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import { Redirect, Stack } from 'expo-router';

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

  if (!isLoggedIn) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
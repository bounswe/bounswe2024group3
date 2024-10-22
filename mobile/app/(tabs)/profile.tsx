// app/profile.tsx
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

export default function Profile() {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to your profile!</Text>
      <Button title="Logout" onPress={handleLogout} color="#ff5c5c" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
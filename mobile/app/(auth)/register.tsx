// app/register.tsx
import React, { useContext, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'expo-router';

export default function Register() {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Implement registration logic here, using the captured name, surname, email, and password
    console.log('Registering with:', { name, surname, email, password });
    login(); // Assuming successful registration, log in the user
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        autoCapitalize="words"
      />
      
      <TextInput
        placeholder="Surname"
        value={surname}
        onChangeText={setSurname}
        style={styles.input}
        autoCapitalize="words"
      />
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      
      <Button title="Register" onPress={handleRegister} />
      
      <Link href="/login" style={styles.link}>
        Already have an account? Login
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  link: {
    marginTop: 10,
    color: '#007bff',
    textAlign: 'center',
    fontSize: 16,
  },
});
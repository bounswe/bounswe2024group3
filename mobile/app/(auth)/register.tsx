import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { req } from '../../utils/client';
import { router } from 'expo-router';

export default function Register() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState({
    artist: false,
    hobbyist: false,
    listener: false,
    organizer: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    setIsLoading(true);

    const selectedRoles = Object.keys(roles).filter((role) => roles[role]);

    try {
      await req('register', 'post', {
        name,
        surname,
        email,
        username,
        password,
        labels: selectedRoles,
      });

      alert('Registration successful! You can now log in.');
      // Navigate to the login page after successful registration
      router.replace('/login');
    } catch (err: any) {
      console.log('Registration error:', err);
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRole = (role: string) => {
    setRoles((prevRoles) => ({ ...prevRoles, [role]: !prevRoles[role] }));
  };

  const renderCheckbox = (role: string, label: string) => (
    <TouchableOpacity onPress={() => toggleRole(role)} style={styles.checkboxRow}>
      <Text style={styles.checkbox}>{roles[role] ? '☑️' : '⬜️'}</Text>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

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
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
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

      <Text style={styles.roleLabel}>Select Roles</Text>
      <View style={styles.checkboxContainer}>
        {renderCheckbox('artist', 'Artist')}
        {renderCheckbox('hobbyist', 'Hobbyist')}
        {renderCheckbox('listener', 'Listener')}
        {renderCheckbox('organizer', 'Organizer')}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Register" onPress={handleRegister} />
      )}

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
  roleLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkboxContainer: {
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  checkbox: {
    fontSize: 24,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  link: {
    marginTop: 10,
    color: '#007bff',
    textAlign: 'center',
    fontSize: 16,
  },
});
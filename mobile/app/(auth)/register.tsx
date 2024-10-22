// app/register.tsx
import React, { useContext, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'expo-router';

export default function Register() {
  const { login } = useContext(AuthContext);
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

  const handleRegister = () => {
    const selectedRoles = Object.keys(roles).filter(role => roles[role]);
    console.log('Registering with:', { name, surname, username, email, password, selectedRoles });
    login();
  };

  const toggleRole = (role: string) => {
    setRoles({ ...roles, [role]: !roles[role] });
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
  link: {
    marginTop: 10,
    color: '#007bff',
    textAlign: 'center',
    fontSize: 16,
  },
});
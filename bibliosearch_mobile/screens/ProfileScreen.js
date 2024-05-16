import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);

  const handleUpdate = async () => {
    // Here you would typically update the user's details in your database
    console.log('Updated details:', { name, surname, username, email });

    const endpoint = 'http://207.154.246.225/api/'; // Your API endpoint

    try {
      // Fetch the CSRF token
      const csrfTokenResponse = await axios.get(endpoint + 'getToken/');
      const csrfToken = csrfTokenResponse.data.csrf_token;
      console.log('CSRF Token:', csrfToken);
      
      // Proceed with registration
      const response = await axios.post(endpoint + 'update_user_profile/', {
        name: name,
        surname: surname,
        username: username,
        email: email,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
        xsrfHeaderName: 'X-CSRFToken',
      });

      if (response.data.message === 'Profile updated successfully') {
        setIsUpdated(true);
        console.log('Profile updated successfully');
      } else {
        console.log(response.data.message || 'Failed to update');
        throw new Error(response.data.message || 'Failed to update');
      }

    } catch (error) {
      console.error('Update Error:', error);
      Alert.alert('Update Error', error.message || 'An error occurred during update');
    }
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Update Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Surname"
        value={surname}
        onChangeText={setSurname}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleUpdate}
      >
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eb2727',
  },
  text: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    width: '80%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
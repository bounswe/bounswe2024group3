import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Landing from './Landing';

const {width} = Dimensions.get('window'); // Get the width of the screen

const RegistrationScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegistration = async () => {
    const registrationEndpoint = 'https://api.yourdomain.com/register'; // Replace with your actual registration API endpoint

    try {
      const response = await fetch(registrationEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullname,
          username: username,
          email: email,
          password: password
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setIsRegistered(true);
      } else {
        throw new Error(data.error || 'Failed to register');
      }
    } catch (error) {
      Alert.alert('Registration Error', error.toString());
    }
  };

  if (isRegistered) {
    return <Landing />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Bibliosearch</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name:</Text>
        <TextInput
          value={fullname}
          onChangeText={setFullname}
          placeholder="Enter your full name"
          style={styles.input}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          style={styles.input}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          style={styles.input}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password:</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          style={styles.input}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegistration}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 80,
    marginBottom: 80,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    width: width,
  },
  headerText: {
    marginLeft: 20,
    fontSize: width * 0.15, // Larger text for the app name
    fontWeight: 'bold',
    color: 'white',
  },
  container: {
    flex: 1,
    padding: 16,
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#eb2727',
  },
  inputContainer: {
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom: 15,
    width: width * 0.9,
  },
  label: {
    fontSize: 20,
    marginBottom: 6,
    textAlign: 'left',
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'white',
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    width: width * 0.9 * 0.95, // Set the width to 75% of the screen width
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    width: 300, // Match the input fields
    alignItems: 'center', // Center text horizontally
    alignSelf: 'center', // Center the button horizontally
    justifyContent: 'center', // Center text vertically
    marginTop: 50,
  },
  buttonText: {
    color: 'red', // White text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegistrationScreen;

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import RegistrationScreen from './RegistrationScreen';
import MainPage from './MainPage';

const {width} = Dimensions.get('window'); // Get the width of the screen

const Landing = () => {
  const [emailorusername, setEmailorusername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogged, setIsLogged] = useState(false); //will be implemented
  const [registrationRequested, setRegReq] = useState(false); //will be implemented

  const handleLogin = () => {
    // Here you would usually send the email and password to your backend service
    console.log('Logging in:', emailorusername, password);
    // Remember to handle validation, error messages, and security best practices
    setIsLogged(true);
  };

  const handleRegistrationRequest = () => {
    setRegReq(true);
  };

  if (registrationRequested) {
    return <RegistrationScreen />;
  }

  if (isLogged) {
    return <MainPage />;
  }

  // Calculate font sizes based on screen width
  const headerTextSize = width * 0.15;
  const welcomeTextSize = width * 0.07;
  const numberoneTextSize = width * 0.04;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.welcome}>
        <Text style={[styles.welcomeText, {fontSize: welcomeTextSize}]}>
          Welcome to
        </Text>
      </View>
      <View style={styles.header}>
        <Text style={[styles.headerText, {fontSize: headerTextSize}]}>
          Bibliosearch
        </Text>
      </View>
      <View style={styles.numberone}>
        <Text style={[styles.numberoneText, {fontSize: numberoneTextSize}]}>
          #1 Semantic Book Browsing App
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          value={emailorusername}
          onChangeText={setEmailorusername}
          placeholder="Enter your email or username"
          style={styles.input}
          autoCapitalize="none"
        />
        <Text style={styles.label}>Password:</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.numberone}>
        <Text style={[styles.numberoneText, {fontSize: numberoneTextSize}]}>
          Or don't have an account yet?
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegistrationRequest}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#eb2727',
  },
  inputContainer: {
    marginTop: 120,
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom: 45,
    width: width * 0.9,
  },
  label: {
    fontSize: 20,
    marginTop: 6,
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
  header: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    width: width,
  },
  headerText: {
    marginLeft: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  welcome: {
    marginTop: 80,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    width: width,
  },
  welcomeText: {
    marginLeft: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  numberone: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    width: width,
  },
  numberoneText: {
    marginLeft: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  button: {
    backgroundColor: 'white', // Example blue background color
    padding: 10,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    width: 300, // Match the input fields
    alignItems: 'center', // Center text horizontally
    alignSelf: 'center', // Center the button horizontally
    justifyContent: 'center', // Center text vertically
    marginTop: 10,
  },
  buttonText: {
    color: '#eb2727', // White text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Landing;

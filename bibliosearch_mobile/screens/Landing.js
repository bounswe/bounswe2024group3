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
import axios from 'axios';
import RegistrationScreen from './RegistrationScreen';
import MainPage from './MainPage';

const {width} = Dimensions.get('window'); // Get the width of the screen

const Landing = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [registrationRequested, setRegReq] = useState(false);

  const handleLogin = async () => {
    const loginEndpoint = 'http://207.154.246.225/api/'; // Your API endpoint

    try {
      const csrfToken = (await axios.get(loginEndpoint + 'getToken/')).data
        .csrf_token;
      console.log('CSRF Token:', csrfToken);

      const response = await axios.post(
        loginEndpoint + 'login/',
        {
          username: emailOrUsername,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          // Note: WithCredentials and xsrfHeaderName might be needed depending on your backend setup
          withCredentials: true,
          xsrfHeaderName: 'X-CSRFToken',
        },
      );
      console.log('Login successful');
      setIsLogged(true);
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Login Error',
        error.message || 'An error occurred during login',
      );
    }
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
  const headerTextSize = 54;
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
          value={emailOrUsername}
          onChangeText={setEmailOrUsername}
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
          Don't have an account yet?
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

const colors = {
  primary: '#F8F4E1',
  secondary: '#AF8F6F',
  third: '#74512D',
  fourth: '#543310',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primary,
  },
  inputContainer: {
    marginTop: 60,
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom: 30,
    width: width * 0.9,
  },
  label: {
    fontSize: 20,
    fontFamily: 'times new roman',
    marginTop: 6,
    marginBottom: 6,
    textAlign: 'left',
    color: colors.third,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'white',
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.fourth,
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
    color: colors.third,
    fontFamily: 'times new roman',
    fontSize: 10,
    textShadowColor: colors.secondary,
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3,
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
    color: colors.secondary,
    fontFamily: 'times new roman',
  },
  numberone: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    width: width,
  },
  numberoneText: {
    marginLeft: 20,
    fontWeight: 'bold',
    color: colors.secondary,
    fontFamily: 'times new roman',
  },
  button: {
    backgroundColor: colors.third, // Example blue background color
    padding: 10,
    borderRadius: 10,
    borderColor: colors.fourth,
    borderWidth: 1,
    width: 300, // Match the input fields
    alignItems: 'center', // Center text horizontally
    alignSelf: 'center', // Center the button horizontally
    justifyContent: 'center', // Center text vertically
    marginTop: 10,
  },
  buttonText: {
    color: colors.primary, // White text color
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'times new roman',
  },
});

export default Landing;

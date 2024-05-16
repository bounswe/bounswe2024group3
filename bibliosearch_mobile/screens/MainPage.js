import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  ActivityIndicator,
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
import BookPage from './BookPage';
import FeedPage from './FeedPage';
import ProfileScreen from './ProfileScreen';


const {width} = Dimensions.get('window'); // Get the width of the screen

const Tab = createBottomTabNavigator();

const MainPage = () => {
  const [query, setQuery] = useState('');
  const [queryResults, setQueryResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuery = async () => {
    setIsLoading(true);
    const searchEndpoint = 'http://207.154.246.225/api/'; 

    try {
      // Fetch the CSRF token
      const csrfTokenResponse = await axios.get(searchEndpoint + 'getToken/');
      const csrfToken = csrfTokenResponse.data.csrf_token;
      console.log('CSRF Token:', csrfToken);
      
      // Proceed with registration
      const response = await axios.get(`${searchEndpoint}book/search/?keyword=${encodeURIComponent(query)}`);
      
      if (response.data.message === 'successfully fetched data') {
        console.log('search successful');
        console.log(response.data.data);
        setQueryResults(response.data.data);
      } else {
        console.log(response.data.message || 'Failed to search');
        throw new Error(response.data.message || 'Failed to search');
      }
    } catch (error) {
      console.error('search Error:', error);
      Alert.alert('search Error', error.message || 'An error occurred during search');
    }
    setIsLoading(false);
  };

  if (queryResults) {
    return <BookPage query={query} results={queryResults} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.welcome}>
        <Text style={styles.welcomeText}>
          Welcome! What would you like to read today?
        </Text>
      </View>
      <View style={styles.inputButtonRow}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Browse Books"
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleQuery} disabled={isLoading}>
          <Text style={styles.buttonText}>Browse!</Text>
        </TouchableOpacity>
      </View>
      {isLoading && (
        <ActivityIndicator size="large" color="black" style={styles.activityIndicator} />
      )}
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIconStyle: { display: "none" },
          tabBarActiveTintColor: 'black',
          tabBarLabelPosition: "beside-icon",
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: 'bold',
          },
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: 'black',
            display: 'flex',
          },
        })}
      >
        <Tab.Screen name="Search" component={MainPage} options={{ headerShown: false }} />
        <Tab.Screen name="Main" component={FeedPage} options={{ headerShown: false }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#eb2727',
    width: width,
  },
  header: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    width: width,
  },
  headerText: {
    marginLeft: 20,
    fontSize: 35, // Larger text for the app name
    fontWeight: 'bold',
    color: 'white',
  },
  welcome: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    width: width,
  },
  welcomeText: {
    marginLeft: 20,
    fontSize: 18, // Larger text for the app name
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
    fontSize: 10, // Larger text for the app name
    fontWeight: 'bold',
    color: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    width: width * 0.9 * 0.95, // Set the width to 75% of the screen width
    alignSelf: 'center',
    marginTop: 10,
  },
  inputButtonRow: {
    flexDirection: 'row', // Aligns children in a horizontal row
    alignItems: 'center', // Aligns children vertically
    width: width * 0.95, // Match the input fields
    alignSelf: 'center', // Center the button horizontally
    justifyContent: 'center', // Center text vertically
    marginTop: 10,
  },
  button: {
    backgroundColor: 'white', // Example blue background color
    padding: 10,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    alignItems: 'center', // Center text horizontally
    alignSelf: 'center', // Center the button horizontally
    justifyContent: 'center', // Center text vertically
    marginTop: 10,
  },
  buttonText: {
    color: '#eb2727', // White text color
    fontSize: 16,
    fontWeight: 'bold',
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 10,
  },
});
export default App;

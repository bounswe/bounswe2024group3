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
import UserSearchPage from './UserSearchPage';


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
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIconStyle: { display: "none" },
          tabBarActiveTintColor: colors.primary,
          tabBarLabelPosition: "beside-icon",
          tabBarInactiveTintColor: colors.fourth,
          tabBarLabelStyle: {
            fontSize: 19,
            fontWeight: 'bold',
            textShadowColor: colors.fourth,
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 1,
            fontFamily: 'times new roman',
            letterSpacing: 1,
            marginLeft: 0,
          },
          tabBarStyle: {
            backgroundColor: colors.secondary,
            borderTopWidth: 1,
            borderTopColor: colors.fourth,
            display: 'flex',
          },
        })}
      >
        <Tab.Screen name="Books" component={MainPage} options={{ headerShown: false }} />
        <Tab.Screen name="Users" component={UserSearchPage} options={{ headerShown: false }} />
        <Tab.Screen name="Feed" component={FeedPage} options={{ headerShown: false }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
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
    backgroundColor: colors.third,
    width: width,
  },
  welcome: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    width: width,
  },
  welcomeText: {
    fontSize: 18, 
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: 'times new roman',
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.primary,
    height: 40,
    borderWidth: 1,
    borderColor: colors.fourth,
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
    backgroundColor: colors.primary, // Example blue background color
    padding: 10,
    borderRadius: 10,
    borderColor: colors.fourth,
    borderWidth: 1,
    alignItems: 'center', // Center text horizontally
    alignSelf: 'center', // Center the button horizontally
    justifyContent: 'center', // Center text vertically
    marginTop: 10,
    marginLeft: 5,
  },
  buttonText: {
    color: colors.third, // White text color
    fontSize: 16,
    fontFamily: 'times new roman',
    fontWeight: 'bold',
    textShadowColor: colors.secondary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
export default App;

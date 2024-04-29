import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';

const {width} = Dimensions.get('window');

const BookPage = ({query: initialQuery, results: initialResults}) => {
  const [query, setQuery] = useState(initialQuery);
  const [input, setInput] = useState('');
  const [results, setResults] = useState(initialResults); // State to manage results
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
      const response = await axios.get(`${searchEndpoint}book/search/?keyword=${encodeURIComponent(input)}`);
      
      if (response.data.message === 'successfully fetched data') {
        console.log('search successful');
        console.log(response.data.data);
        setResults(response.data.data); // Update results using setState
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

  const renderBooks = () => {
    return results.map((book, index) => (
      <View key={index} style={styles.bookContainer}>
        <Text style={styles.bookTitle}>{book.title?.value || 'Title not available'}</Text>
        <Text style={styles.bookAuthor}>{book.authors?.value || 'Author not available'}</Text>
        <Text style={styles.bookDescription}>{book.description?.value || 'Description not available'}</Text>
        <Text style={styles.bookPublicationYear}>Publication Year: {book.publicationYear?.value || 'Year not available'}</Text>
        <Text style={styles.bookISBN}>ISBN: {book.ISBN13?.value || 'ISBN not available'}</Text>
      </View>
    ));
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputButtonRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Browse Books"
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleQuery}>
          <Text style={styles.buttonText}>Browse!</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <ScrollView style={styles.resultsContainer}>
          {results.length > 0 ? renderBooks() : <Text>No books found. Try a different search!</Text>}
        </ScrollView>
      )}
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
    width: width,
  },
  bookContainer: {
    padding: 16,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  header: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    width: width,
    backgroundColor: 'black',
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 10,
  },
  headerText: {
    marginLeft: 20,
    fontSize: 25, // Larger text for the app name
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
    marginBottom: 10,
    marginTop: 10,
    fontSize: 18, // Larger text for the app name
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
  },
});
export default BookPage;

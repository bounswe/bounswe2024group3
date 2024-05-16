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
        <Text style={styles.bookInfo}>{book.title?.value || 'Title not available'}</Text>
        <View style={styles.line}></View>
        <Text style={styles.bookInfo}>{book.authors?.value || 'Author not available'}</Text>
        <View style={styles.line}></View>
        <Text style={styles.bookInfo}>{book.description?.value || 'Description not available'}</Text>
        <View style={styles.line}></View>
        <Text style={styles.bookInfo}>Publication Year: {book.publicationYear?.value || 'Year not available'}</Text>
        <View style={styles.line}></View>
        <Text style={styles.bookInfo}>ISBN: {book.ISBN13?.value || 'ISBN not available'}</Text>
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
  bookContainer: {
    padding: 16,
    margin: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
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
    marginBottom: 10,
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
  bookInfo: {
    fontSize: 16,
    color: colors.fourth,
    fontFamily: 'courier new',
    fontWeight: 'bold',
  },
  line: {
    height: 2,
    backgroundColor: colors.fourth,
    marginVertical: 5,
  },
  resultsContainer: {
    flex: 1,
  },
});
export default BookPage;

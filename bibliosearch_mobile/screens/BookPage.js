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

const {width} = Dimensions.get('window');

const BookPage = ({query: initialQuery}) => {
  const [query, setQuery] = useState(initialQuery);
  const [input, setInput] = useState('');
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuery = async () => {
    setIsLoading(true);
    const searchEndpoint = 'https://api.yourdomain.com/search'; // Replace with your actual search API endpoint

    try {
      const response = await fetch(`${searchEndpoint}?keyword=${encodeURIComponent(input)}`, {
        method: 'GET',
      });
      const data = await response.json();
      
      if (response.ok) {
        setBooks(data.data); // Assuming 'data.data' contains the books data
        setQuery(input);
      } else {
        throw new Error(data.message || 'Failed to fetch results');
      }
    } catch (error) {
      Alert.alert('Search Error', error.toString());
    }
    setIsLoading(false);
  };

  const renderBooks = () => {
    return books.map((book, index) => (
      <View key={index} style={styles.bookContainer}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookAuthor}>{book.author}</Text>
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
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={styles.resultsContainer}>
          {books.length > 0 ? renderBooks() : <Text>No books found. Try a different search!</Text>}
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

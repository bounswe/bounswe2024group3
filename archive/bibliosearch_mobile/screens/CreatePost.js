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
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import FeedPage from './FeedPage';

const {width} = Dimensions.get('window'); // Get the width of the screen

const CreatePost = () => {
  const [createdPost, setCreatedPost] = useState(false);
  const [bookISBN13, setBookISBN13] = useState('');
  const [bookReview, setBookReview] = useState(''); // Content of the post
  const [isLoading, setIsLoading] = useState(false);

  //     {
  //         "book_data" : {
  //           "book": {
  //           "type": "uri",
  //           "value": "http://www.wikidata.org/entity/Q108896140"
  //         },
  //         "title": {
  //           "xml:lang": "en",
  //           "type": "literal",
  //           "value": "Humane: How the United States Abandoned Peace and Reinvented War"
  //         },
  //         "description": {
  //           "xml:lang": "en",
  //           "type": "literal",
  //           "value": "book by Samuel Moyn"
  //         },
  //         "authors": {
  //           "type": "literal",
  //           "value": "Samuel Moyn"
  //         },
  //         "genres": {
  //           "type": "literal",
  //           "value": ""
  //         },
  //         "publicationYear": {
  //           "datatype": "http://www.w3.org/2001/XMLSchema#integer",
  //           "type": "literal",
  //           "value": "2021"
  //         },
  //         "subjects": {
  //           "type": "literal",
  //           "value": ""
  //         },
  //         "ISBN13": {
  //           "type": "literal",
  //           "value": "978-0-484-71992-0"
  //         } },
  //         "content" : "zortin1234gen"
  //   }

  const goToFeed = () => {
    setCreatedPost(true);
  };

  if (createdPost) {
    return <FeedPage />;
  }

  const getBook = async () => {
    const baseEndpoint = 'http://207.154.246.225/api/';

    const response = await axios.get(`${baseEndpoint}get_book/?isbn=${encodeURIComponent(bookISBN13)}`,
    );
    console.log(response.data);
    const bookData = response.data.data;
    return bookData;
  };

  const submitReview = async () => {
    setIsLoading(true);
    const baseEndpoint = 'http://207.154.246.225/api/';

    try {
      const csrfToken = (await axios.get(baseEndpoint + 'getToken/')).data
        .csrf_token;
      console.log('CSRF Token:', csrfToken);

      const bookData = await getBook();

      const response = await axios.post(baseEndpoint + 'create_post/',
        {
          book_data: bookData,
          content: bookReview,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
          xsrfHeaderName: 'X-CSRFToken',
        },
      );
      console.log('Post created successfully');
      setCreatedPost(true);
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Post Creation Error',
        error.message || 'An error occurred while creating the post',
      );
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Create Post</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Book ISBN13:</Text>
        <TextInput
          value={bookISBN13}
          onChangeText={setBookISBN13}
          placeholder="Enter book isbn13 number"
          style={styles.input}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.reviewContainer}>
        <Text style={styles.label}>Review:</Text>
        <TextInput
          value={bookReview}
          onChangeText={setBookReview}
          placeholder="Write your review here"
          style={styles.input}
          autoCapitalize="none"
        />
      </View>
        {isLoading ? (
            <ActivityIndicator size="large" color='black' />
        ) : null}
      <TouchableOpacity style={styles.button} onPress={submitReview}>
        <Text style={styles.buttonText}>Submit Review</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={goToFeed}>
        <Text style={styles.buttonText}>Go Back</Text>
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
  header: {
    marginTop: 8,
    marginBottom: 60,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    marginLeft: 30,
    width: width,
  },
  headerText: {
    marginLeft: 20,
    fontSize: 54,
    fontWeight: 'bold',
    color: colors.third,
    fontFamily: 'times new roman',
    textShadowColor: colors.secondary,
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3,
  },
  container: {
    flex: 1,
    padding: 16,
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primary,
  },
  inputContainer: {
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom: 15,
    width: width * 0.9,
  },
  label: {
    fontSize: 20,
    fontFamily: 'times new roman',
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
    borderColor: 'gray',
    borderRadius: 10,
    width: width * 0.9 * 0.95, // Set the width to 75% of the screen width
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
  reviewContainer: {
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom: 15,
    width: width * 0.9,
  },
});

export default CreatePost;

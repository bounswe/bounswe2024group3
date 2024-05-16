import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);
  const [favAuthors, setFavAuthors] = useState([]);
  const [favGenres, setFavGenres] = useState([]);
  const [booklists, setBooklists] = useState([]);

  

  // this is for updating the user's profile
  const handleUpdate = async () => {

    const endpoint = 'http://207.154.246.225/api/'; // Your API endpoint

    // Here you update the user's details in your database
    console.log('Updated details:', { name, surname, username, email });

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

  // Lets view the user's profile
  useEffect(() => {
    const fetchData = async () => {
      const endpoint = 'http://207.154.246.225/api/'; // Your API endpoint
      try {
        // const response = await axios.get(endpoint + 'get_user_profile/?user_id=1');
        // const { name, surname, fav_authors, fav_genres, booklists } = response.data;
        // lets create dummy values for the user's profile
        const name = 'John';
        const surname = 'Doe';
        const fav_authors = [{ author_id: 1, author_name: 'Author 1' }, { author_id: 2, author_name: 'Author 2' }];
        const fav_genres = [{ genre_id: 1, genre_name: 'Genre 1' }, { genre_id: 2, genre_name: 'Genre 2' }];
        const booklists = [{ booklist_id: 1, booklist_name: 'Booklist 1' }, { booklist_id: 2, booklist_name: 'Booklist 2' }];
        setName(name);
        setSurname(surname);
        setFavAuthors(fav_authors);
        setFavGenres(fav_genres);
        setBooklists(booklists);
      } catch (error) {
        console.error('Fetch Error:', error);
      }
    };
    fetchData();
  }, []);


  return (
    <ScrollView style={{backgroundColor:colors.third}}>
      <View style={styles.profileContainer}>
        <Text style={styles.profileText}>Profile</Text>
        <View style={styles.line}></View>
        <Text style={styles.regularText}> Name: {name}</Text>
        <Text style={styles.regularText}> Surname: {surname}</Text>
        <View style={styles.line}></View>
        <Text style={styles.regularText}> Favourite Authors:</Text>
        {favAuthors.map((author) => (
          <Text style={styles.subText} key={author.author_id}>{author.author_name}</Text>
        ))}
        <View style={styles.line}></View>
        <Text style={styles.regularText}> Favourite Genres:</Text>
        {favGenres.map((genre) => (
          <Text style={styles.subText} key={genre.genre_id}>{genre.genre_name}</Text>
        ))}
        <View style={styles.line}></View>
        <Text style={styles.regularText}> Booklists:</Text>
        {booklists.map((booklist) => (
          <Text style={styles.subText} key={booklist.booklist_id}>{booklist.booklist_name}</Text>
        ))}
      </View>
      <View style={{ height: 20, backgroundColor: colors.third }}></View> 
    <View style={styles.container}>
      <Text style={styles.text}>Update Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        // value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Surname"
        // value={surname}
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
    </ScrollView>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.third,
  },
  text: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: 'times new roman',
    textShadowColor: colors.fourth,
    textShadowOffset: { width: 10, height: 10 },
    textShadowRadius: 10,
  },
  input: {
    height: 40,
    borderColor: colors.secondary,
    borderWidth: 1,
    marginTop: 10,
    width: '80%',
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.fourth, 
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'times new roman',
    textShadowColor: colors.secondary,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  regularText: {
    color: colors.third,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'courier new',
    alignSelf: 'flex-start',
    marginVertical: 5,
    marginLeft: 10,
  },
  subText: {
    color: colors.third,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'courier new',
    alignSelf: 'flex-end',
    marginTop: 5,
    marginRight: 10,
  },
  profileContainer: {
    padding: 16,
    marginTop: 16,
    marginHorizontal: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  line: {
    height: 3,
    backgroundColor: colors.secondary,
    marginVertical: 5,
  },
  profileText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.third,
    fontFamily: 'times new roman',
    marginLeft: 10,
    marginBottom: 10,
  },
});

export default ProfileScreen;
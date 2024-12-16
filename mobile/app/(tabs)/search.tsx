import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchCard from '../../components/SearchCard';
import axios from 'axios';

export default function SearchScreen() {
  const [query, setQuery] = useState(''); // To capture search input
  const [posts, setPosts] = useState([]); // To store search results
  const [isLoading, setIsLoading] = useState(false); // To track loading state
  const [error, setError] = useState(''); // To display error messages
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Dark theme toggle

  const toggleTheme = () => {
    setIsDarkTheme((prevState) => !prevState);
  };

  useEffect(() => {
    if (query.trim() === '') {
      setPosts([]); // Clear results when the search bar is empty
      return;
    }

    const fetchPosts = async () => {
      setIsLoading(true);
      setError('');
      try {
        const searchQuery = `search/?search=${query}`;
        console.log('Search query:', searchQuery);
        console.log('Backend URL:', process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL);
        const response = await axios.get(`${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}${searchQuery}`);
        const fetchedPosts = response.data.contents || [];
        if (fetchedPosts.length === 0) {
          setError('No posts found');
        }
        setPosts(fetchedPosts);
        console.log('Fetched posts:', fetchedPosts);
      } catch (err) {
        console.error('Search failed:', err);
        setError('Failed to fetch posts');
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchPosts(); // Debounced search
    }, 500);

    return () => clearTimeout(delayDebounce); // Cleanup on unmount or query change
  }, [query]);

  const renderPost = ({ item }) => {
    const {
      ai_description = "No description available",
      album_name = "Unknown album",
      artist_names = [],
      content_type = "Unknown",
      genres = [],
      id,
      link,
      song_name = "Untitled",
    } = item;
  
    const spotifyId = link.split("/").pop();
  
    return (
      <SearchCard
        post={{
          id,
          title: song_name, // Use song_name as the title
          content: `Album: ${album_name}`, // Use album_name as content
          username: artist_names.join(", ") || "Unknown Artist", // Join artist names
          spotifyId, // Extract Spotify ID
          genres, // Include genres
          type: content_type, // Pass content type for SpotifyEmbed
        }}
        isDarkTheme={isDarkTheme}
      />
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? '#121212' : '#f5f5f5' },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
          <Ionicons
            name={isDarkTheme ? 'sunny-outline' : 'moon-outline'}
            size={24}
            color={isDarkTheme ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : error ? (
        <Text style={[styles.error, { color: isDarkTheme ? '#fff' : '#000' }]}>{error}</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  iconButton: {
    marginLeft: 16,
    padding: 8,
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  error: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
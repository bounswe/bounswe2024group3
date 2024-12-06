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
import PostCard from '../../components/PostCard';
// import { REACT_APP_BACKEND_URL } from '@env';
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
    // Extract image URL using regex to handle the description string
    let imageUrl = '';
    const imageMatch = item.description.match(/'images': \[{'url': '([^']+)'/);
  
    if (imageMatch) {
      imageUrl = imageMatch[1]; // Extracted URL from description
    } else {
      imageUrl = ''; // Fallback to an empty string if no image is found
    }
  
    // Extract release date from the description
    let releaseDate = 'Unknown';
    const releaseDateMatch = item.description.match(/'release_date': '([^']+)'/);
  
    if (releaseDateMatch) {
      releaseDate = `${releaseDateMatch[1]}`; // Format as "release date: {date}"
    } else {
      releaseDate = 'Unknown'; // Fallback if release date is not found
    }
  
    // Extract likes from the description
    const likesMatch = item.description.match(/'likes': (\d+)/);
    const likes = likesMatch ? parseInt(likesMatch[1], 10) : 0; // Default to 0 if not found
  
    // Extract dislikes from the description
    const dislikesMatch = item.description.match(/'dislikes': (\d+)/);
    const dislikes = dislikesMatch ? parseInt(dislikesMatch[1], 10) : 0; // Default to 0 if not found
  
    // Extract created_at from the description
    const createdAtMatch = item.description.match(/'created_at': '([^']+)'/);
    console.log('createdAtMatch:', createdAtMatch);
    console.log('release:', releaseDate);
    const createdAt = createdAtMatch
      ? new Date(createdAtMatch[1]).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
      : releaseDate; // Extract date or fallback to 'Unknown'

      let content = 'Unknown album';
  const albumNameMatch = item.description.match(/'name': '([^']+)'/);

  if (albumNameMatch) {
    content = `Artist: ${albumNameMatch[1]}`; // Use album name as content
  }

    // Capitalize content_type
    const contentType = item.content_type
    ? item.content_type.charAt(0).toUpperCase() + item.content_type.slice(1)
    : 'Unknown';
  
    return (
      <PostCard
        post={{
          id: item.id,
          title: item.comment || 'Untitled', // Use comment as title or default to "Untitled"
          content: content || 'Unknown release date', // Use release date as content
          username: item.content_type || 'Unknown User', // Use content_type or fallback
          imageUrl: imageUrl, // Use extracted image URL
          type: item.content_type || 'unknown', // Extract type from content_type
          spotifyId: item.link.split('/').pop(), // Extract Spotify ID from the link
          likes: likes, // Extracted number of likes
          dislikes: dislikes, // Extracted number of dislikes
          userAction: null, // No user action initially
          created_at: createdAt, // Extracted and formatted created_at timestamp
        }}
        isFeed={true}
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
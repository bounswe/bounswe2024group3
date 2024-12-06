import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
// import { REACT_APP_BACKEND_URL } from '@env';
import PostCard from '../../components/PostCard';

export default function CombinedPosts() {
  const [randomPosts, setRandomPosts] = useState([]);
  const [error, setError] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme((prevState) => !prevState);
  };

  const fetchRandomPosts = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}get-posts/`);
      const posts = response.data.posts;
      console.log('Fetched posts:', posts);

      if (Array.isArray(posts)) {
        const shuffledPosts = [...posts].sort(() => 0.5 - Math.random());
        setRandomPosts(shuffledPosts.slice(0, 3));
        setError(''); // Clear previous errors if fetch is successful
      } else {
        setError('Posts data is not an array.');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts.');
    }
  };

  useEffect(() => {
    fetchRandomPosts();
  }, []);

  const renderPost = ({ item }) => {
    // Extract image URL using regex to handle the description string
    let imageUrl = '';
    const imageMatch = item.content.description.match(/'images': \[{'url': '([^']+)'/);
  
    if (imageMatch) {
      imageUrl = imageMatch[1]; // The URL is captured in the first capturing group
    } else {
      imageUrl = item.image || ''; // Fallback to `item.image` if no match
    }
  
    return (
      <PostCard
        post={{
          id: item.id,
          title: item.comment || 'Untitled', // Use comment as title or default to "Untitled"
          content: item.comment || 'No content available', // Fallback if no comment
          username: item.username,
          imageUrl: imageUrl, // Use extracted image URL
          type: item.content.content_type || 'unknown', // Extract type from content
          spotifyId: item.content.link.split('/').pop(), // Extract Spotify ID from the link
          likes: item.total_likes || 0, // Fallback to 0 if no likes field
          dislikes: item.total_dislikes || 0, // Fallback to 0 if no dislikes field
          userAction: null, // No user action initially
          created_at: new Date(item.created_at), // Parse created_at timestamp
        }}
        isFeed={true}
        isDarkTheme={isDarkTheme}
      />
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: isDarkTheme ? '#121212' : '#f5f5f5' }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
          <Ionicons
            name={isDarkTheme ? 'sunny-outline' : 'moon-outline'}
            size={24}
            color={isDarkTheme ? '#fff' : '#000'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={fetchRandomPosts} style={styles.iconButton}>
          <Ionicons
            name="refresh-outline"
            size={24}
            color={isDarkTheme ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: isDarkTheme ? '#fff' : '#000' }]}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={randomPosts}
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
    backgroundColor: 'transparent',
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
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8, // Adjusted for better spacing
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
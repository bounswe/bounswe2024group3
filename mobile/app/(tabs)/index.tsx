import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PostCard from '../../components/PostCard';
import { Ionicons } from '@expo/vector-icons';
// import { REACT_APP_BACKEND_URL } from '@env';
import axios from 'axios';

interface Post {
  id: number;
  title: string;
  username: string;
  type: string;
  spotifyId: string;
  likes: number;
  dislikes: number;
  userAction: any;
  created_at: Date;
}

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [posts, setPosts] = useState([]);

  const toggleTheme = () => {
    setIsDarkTheme((prevState) => !prevState);
  };

  const fetchPosts = async () => {
    try {
      console.log('URL:', `${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}get-posts/`);
      const response = await axios.get(`${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}get-posts/`);
      const posts = response.data.posts.map((item: any) => ({
        id: item.id,
        title: item.comment || 'Untitled', // Use comment as title or default to "Untitled"
        // content: item.comment || 'No content available', // Fallback if no comment
        username: item.username,
        // imageUrl: imageUrl, // Use extracted image URL
        type: item.content.content_type || 'unknown', // Extract type from content
        spotifyId: item.content.link.split('/').pop(), // Extract Spotify ID from the link
        likes: item.total_likes || 0, // Fallback to 0 if no likes field
        dislikes: item.total_dislikes || 0, // Fallback to 0 if no dislikes field
        userAction: null, // No user action initially
        created_at: new Date(item.created_at), // Parse created_at timestamp
      }));
      setPosts(posts);
      console.log('Fetched posts:', posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard isFeed={true} post={item} isDarkTheme={isDarkTheme} />
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? '#121212' : '#f2f2f2' },
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
      <View style={{ flex: 1 }}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'flex-end',
    padding: 16,
  },
  iconButton: {
    padding: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});

export default App;
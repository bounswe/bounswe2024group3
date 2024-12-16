// app/(tabs)/index.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Text,
} from 'react-native';
import PostCard from '../../components/PostCard';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import FloatingButton from '../../components/FloatingButton';
import CreatePostModal from '../../components/CreatePostModal';

interface Post {
  id: number;
  content: string;
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Toggles between light & dark theme
  const toggleTheme = () => {
    setIsDarkTheme((prevState) => !prevState);
  };

  // Fetch all posts (default behavior)
  const fetchAllPosts = async () => {
    try {
      console.log('URL:', `${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}get-posts/`);
      const response = await axios.get(`${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}get-posts/`);
      const fetchedPosts = response.data.posts.map((item: any) => ({
        id: item.id,
        content: item.comment || 'Untitled',
        username: item.username,
        type: item.content.content_type || 'unknown',
        spotifyId: item.content.link.split('/').pop(),
        likes: item.total_likes || 0,
        dislikes: item.total_dislikes || 0,
        userAction: null,
        created_at: new Date(item.created_at),
      }));
      setPosts(fetchedPosts);
      console.log('Fetched ALL posts:', fetchedPosts);
    } catch (error) {
      console.error('Error fetching ALL posts:', error);
      Alert.alert('Error', 'Failed to fetch posts. Please try again later.');
    }
  };

  // Fetch following posts
  const fetchFollowingPosts = async () => {
    try {
      console.log('URL:', `${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}get-following-posts/`);
      const response = await axios.get(`${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}get-following-posts/`);
      const fetchedPosts = response.data.posts.map((item: any) => ({
        id: item.id,
        content: item.comment || 'Untitled',
        username: item.username,
        type: item.content.content_type || 'unknown',
        spotifyId: item.content.link.split('/').pop(),
        likes: item.total_likes || 0,
        dislikes: item.total_dislikes || 0,
        userAction: null,
        created_at: new Date(item.created_at),
      }));
      setPosts(fetchedPosts);
      console.log('Fetched FOLLOWING posts:', fetchedPosts);
    } catch (error) {
      console.error('Error fetching FOLLOWING posts:', error);
      Alert.alert('Error', 'Failed to fetch following posts. Please try again later.');
    }
  };

  // On mount, fetch all posts by default
  useEffect(() => {
    fetchAllPosts();
  }, []);

  // Renders individual post
  const renderPost = ({ item }: { item: Post }) => (
    <PostCard isFeed={true} post={item} isDarkTheme={isDarkTheme} />
  );

  // Handlers for the create-post modal
  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  // After creating a post, we refresh the current feed
  const handlePostCreated = useCallback(() => {
    // If you want to always refresh ALL posts, call fetchAllPosts()
    // Or if you want to preserve the user's choice, store the chosen endpoint in a state
    fetchAllPosts();
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? '#121212' : '#f2f2f2' },
      ]}
    >
      {/* Header - includes theme toggle, plus two buttons for ALL vs FOLLOWING */}
      <View style={styles.header}>
        {/* Theme Toggle */}
        <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
          <Ionicons
            name={isDarkTheme ? 'sunny-outline' : 'moon-outline'}
            size={24}
            color={isDarkTheme ? '#fff' : '#000'}
          />
        </TouchableOpacity>

        {/* Buttons to fetch different post sets */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button} onPress={fetchAllPosts}>
            <Text style={styles.buttonText}>All Posts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={fetchFollowingPosts}>
            <Text style={styles.buttonText}>Following</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Posts List */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Floating "+" Button */}
      <FloatingButton onPress={openModal} />

      {/* Create Post Modal */}
      <CreatePostModal
        isVisible={isModalVisible}
        onClose={closeModal}
        onPostCreated={handlePostCreated}
        isDarkTheme={isDarkTheme}
      />
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 16,
    flexDirection: 'row', // allows placing items side by side
    justifyContent: 'space-between',
  },
  iconButton: {
    padding: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 80, // Ensure content isn't hidden behind FAB
  },
});

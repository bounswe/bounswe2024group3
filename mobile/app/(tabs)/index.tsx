// app/(tabs)/index.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import PostCard from '../../components/PostCard';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import FloatingButton from '../../components/FloatingButton';
import CreatePostModal from '../../components/CreatePostModal';

interface Post {
  id: number;
  title: string;
  username: string;
  type: string;
  spotifyId: string;
  likes: number;
  dislikes: number;
  userAction: 'like' | 'dislike' | null;
  created_at: Date;
}

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme((prevState) => !prevState);
  };

  const fetchPosts = async () => {
    try {
      // Ensure base URL has trailing slash
      let baseUrl = process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL;
      if (!baseUrl.endsWith('/')) {
        baseUrl += '/';
      }

      console.log('Fetching posts from URL:', `${baseUrl}get-posts/`);
      const response = await axios.get(`${baseUrl}get-posts/`);
      const fetchedPosts = response.data.posts.map((item: any) => ({
        id: item.id,
        title: item.comment || 'Untitled',
        username: item.username,
        type: item.content.content_type || 'unknown',
        spotifyId: item.content.link.split('/').pop(),
        likes: item.total_likes || 0,
        dislikes: item.total_dislikes || 0,
        userAction: null,  // or 'like'/'dislike' if your backend returns user-specific action
        created_at: new Date(item.created_at),
      }));
      setPosts(fetchedPosts);
      console.log('Fetched posts:', fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to fetch posts. Please try again later.');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard 
      isFeed={true} 
      post={item} 
      isDarkTheme={isDarkTheme}
      onUpdate={fetchPosts} // Pass the fetchPosts function as a callback
    />
  );

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Memoize the callback to prevent unnecessary re-renders
  const handlePostCreated = useCallback(() => {
    fetchPosts(); // Refresh posts after a new post is created
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? '#121212' : '#f2f2f2' },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
          <Ionicons
            name={isDarkTheme ? 'sunny-outline' : 'moon-outline'}
            size={24}
            color={isDarkTheme ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      </View>

      {/* Posts List */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
          contentContainerStyle={styles.listContent}
          refreshing={false} // You can implement pull-to-refresh if desired
          // onRefresh={fetchPosts}
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
    paddingBottom: 80, // To ensure content is not hidden behind the FAB
  },
});

export default App;

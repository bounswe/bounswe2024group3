// app/(tabs)/index.tsx

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import PostCard from '../../components/PostCard';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { req, createSpotifyLink, parseSpotifyLink } from '../../utils/client';

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [spotifyLink, setSpotifyLink] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme((prevState) => !prevState);
  };

  const fetchPosts = async () => {
    try {
      console.log('URL:', `${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}get-posts/`);
      const response = await axios.get(`${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}get-posts/`);
      const fetchedPosts = response.data.posts.map((item: any) => ({
        id: item.id,
        title: item.comment || 'Untitled',
        username: item.username,
        type: item.content.content_type || 'unknown',
        spotifyId: item.content.link.split('/').pop(),
        likes: item.total_likes || 0,
        dislikes: item.total_dislikes || 0,
        userAction: null,
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
    <PostCard isFeed={true} post={item} isDarkTheme={isDarkTheme} />
  );

  const openModal = () => {
    setSpotifyLink('');
    setComment('');
    setIsModalVisible(true);
  };

  const closeModal = () => {
    if (!isSubmitting) {
      setIsModalVisible(false);
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!spotifyLink.trim()) {
      Alert.alert('Validation Error', 'Please enter a Spotify URL.');
      return;
    }
    if (!comment.trim()) {
      Alert.alert('Validation Error', 'Please enter a comment.');
      return;
    }

    let formattedLink: string;
    try {
      const parsed = parseSpotifyLink(spotifyLink.trim());
      formattedLink = createSpotifyLink(parsed);
    } catch (error) {
      Alert.alert('Invalid URL', 'Please enter a valid Spotify URL.');
      return;
    }

    const postData = {
      link: formattedLink,
      comment: comment.trim(),
      image: '', // Assuming image is optional
      // If latitude and longitude are required, you can integrate location services here
    };

    setIsSubmitting(true);

    try {
      const response = await req('create-post', 'post', postData);
      console.log('Post created:', response.data);
      Alert.alert('Success', 'Post created successfully!');
      setIsModalVisible(false);
      fetchPosts(); // Refresh posts
    } catch (error: any) {
      console.error('Error creating post:', error);
      Alert.alert('Error', error.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        />
      </View>

      {/* Floating "+" Button */}
      <TouchableOpacity style={styles.fab} onPress={openModal}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Create Post Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: isDarkTheme ? '#1e1e1e' : '#fff' },
            ]}
          >
            <Text style={[styles.modalTitle, { color: isDarkTheme ? '#fff' : '#000' }]}>
              Create a New Post
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDarkTheme ? '#333' : '#f9f9f9',
                  color: isDarkTheme ? '#fff' : '#000',
                },
              ]}
              placeholder="Spotify URL"
              placeholderTextColor={isDarkTheme ? '#aaa' : '#555'}
              value={spotifyLink}
              onChangeText={setSpotifyLink}
              autoCapitalize="none"
              keyboardType="url"
            />
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: isDarkTheme ? '#333' : '#f9f9f9',
                  color: isDarkTheme ? '#fff' : '#000',
                },
              ]}
              placeholder="Comment"
              placeholderTextColor={isDarkTheme ? '#aaa' : '#555'}
              value={comment}
              onChangeText={setComment}
              multiline={true}
              numberOfLines={4}
            />
            {isSubmitting ? (
              <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
            ) : (
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#1e90ff',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#1e90ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#aaa',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loading: {
    marginTop: 12,
  },
});

export default App;

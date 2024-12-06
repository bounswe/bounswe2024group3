// app/(tabs)/components/CreatePostModal.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { req, createSpotifyLink, parseSpotifyLink } from '../utils/client';

interface CreatePostModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPostCreated: () => void;
  isDarkTheme: boolean;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isVisible,
  onClose,
  onPostCreated,
  isDarkTheme,
}) => {
  const [spotifyLink, setSpotifyLink] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slideAnim = useRef(new Animated.Value(-300)).current; // Initial position above the screen

  useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 12,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

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
      // If latitude and longitude are required, integrate location services here
    };

    setIsSubmitting(true);

    try {
      const response = await req('create-post', 'post', postData);
      console.log('Post created:', response.data);
      Alert.alert('Success', 'Post created successfully!');
      setSpotifyLink('');
      setComment('');
      onClose();
      onPostCreated(); // Refresh posts in parent component
    } catch (error: any) {
      console.error('Error creating post:', error);
      Alert.alert('Error', error.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="none" // We'll handle animation manually
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View
            style={[ 
              styles.modalContainer,
              { backgroundColor: isDarkTheme ? '#1e1e1e' : '#fff' },
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={[styles.modalTitle, { color: isDarkTheme ? '#fff' : '#000' }]}>
              Create a New Post
            </Text>
            <TextInput
              style={[ 
                styles.input,
                { backgroundColor: isDarkTheme ? '#333' : '#f9f9f9', color: isDarkTheme ? '#fff' : '#000' },
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
                { backgroundColor: isDarkTheme ? '#333' : '#f9f9f9', color: isDarkTheme ? '#fff' : '#000' },
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
                <TouchableOpacity style={[styles.submitButton, { backgroundColor: '#1DB954' }]} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.cancelButton, { backgroundColor: '#1DB954' }]} onPress={onClose}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
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
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
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

export default CreatePostModal;

// components/PostCard.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import SpotifyEmbed from './SpotifyEmbed'; // Ensure this path is correct
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

interface PostDetails {
  id: number;
  title: string;
  username: string;
  type: string;
  spotifyId: string;
  likes: number;
  dislikes: number;
  userAction: 'like' | 'dislike' | null;
  created_at: Date;
  imageUrl?: string;    // If you have images 
  content?: string;     // Additional content
}

interface PostCardProps {
  post: PostDetails;
  isFeed?: boolean;
  isDarkTheme?: boolean;
  onUpdate?: () => void; // Callback to parent to refresh posts
}

const PostCard: React.FC<PostCardProps> = ({ post, isFeed, isDarkTheme, onUpdate }) => {
  const [likes, setLikes] = useState<number>(post.likes);
  const [dislikes, setDislikes] = useState<number>(post.dislikes);
  const [userAction, setUserAction] = useState<'like' | 'dislike' | null>(
    post.userAction
  );

  // Animation values
  const likeScale = useState(new Animated.Value(1))[0];
  const dislikeScale = useState(new Animated.Value(1))[0];

  const animateButton = (scaleRef: Animated.Value) => {
    Animated.sequence([
      Animated.timing(scaleRef, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleRef, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLike = async () => {
    if (userAction === 'like') return; // Already liked

    try {
      console.log(`Sending like request for post ID: ${post.id}`);

      // Ensure base URL has trailing slash
      let baseUrl = process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL;
      if (!baseUrl.endsWith('/')) {
        baseUrl += '/';
      }

      // Make POST request to the "like" endpoint
      const response = await axios.post(
        `${baseUrl}posts/${post.id}/like/`
      );

      // Suppose the server returns updated counts:
      // { id: <postId>, total_likes: X, total_dislikes: Y, ... }
      const updatedData = response.data;

      setLikes(updatedData.total_likes);
      setDislikes(updatedData.total_dislikes);
      setUserAction('like');
      animateButton(likeScale);

      // Optionally, trigger parent to refresh posts
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'Failed to like the post. Please try again.');
    }
  };

  const handleDislike = async () => {
    if (userAction === 'dislike') return; // Already disliked

    try {
      console.log(`Sending dislike request for post ID: ${post.id}`);

      // Ensure base URL has trailing slash
      let baseUrl = process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL;
      if (!baseUrl.endsWith('/')) {
        baseUrl += '/';
      }

      // Make POST request to the "dislike" endpoint
      const response = await axios.post(
        `${baseUrl}posts/${post.id}/dislike/`
      );

      // Suppose the server returns updated counts:
      const updatedData = response.data;

      setLikes(updatedData.total_likes);
      setDislikes(updatedData.total_dislikes);
      setUserAction('dislike');
      animateButton(dislikeScale);

      // Optionally, trigger parent to refresh posts
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error disliking post:', error);
      Alert.alert('Error', 'Failed to dislike the post. Please try again.');
    }
  };

  // Theme-based styles
  const backgroundColor = isDarkTheme ? '#1e1e1e' : '#fff';
  const textColor = isDarkTheme ? '#fff' : '#000';

  // Helper to get dynamic icon color
  const getActionColor = (action: 'like' | 'dislike') => {
    if (userAction === action) {
      return '#2f95dc'; // Active color
    }
    return isDarkTheme ? '#aaa' : '#555';
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {post.imageUrl ? (
        <Image source={{ uri: post.imageUrl }} style={styles.image} />
      ) : (
        post.title && (
          <Text style={[styles.title, { color: textColor }]}>{post.title}</Text>
        )
      )}
      <Text style={[styles.username, { color: textColor }]}>
        {post.username}
      </Text>
      {isFeed && (
        <SpotifyEmbed type={post.type} spotifyId={post.spotifyId} />
      )}

      {/* If "post.content" exists and you want to display it */}
      {post.content && (
        <Text style={[styles.content, { color: textColor }]}>
          {post.content}
        </Text>
      )}

      <Text style={[styles.date, { color: textColor }]}>
        {new Date(post.created_at).toLocaleString()}
      </Text>

      {/* Like and Dislike Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} activeOpacity={0.7}>
          <Animated.View
            style={[
              styles.actionButton,
              {
                transform: [{ scale: likeScale }],
                backgroundColor: userAction === 'like' ? '#e0f7fa' : 'transparent',
              },
            ]}
          >
            <Icon
              name="thumb-up"
              size={24}
              color={getActionColor('like')}
              style={styles.icon}
            />
            <Text style={[styles.actionText, { color: textColor }]}>
              {likes}
            </Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDislike} activeOpacity={0.7}>
          <Animated.View
            style={[
              styles.actionButton,
              {
                transform: [{ scale: dislikeScale }],
                backgroundColor: userAction === 'dislike' ? '#ffebee' : 'transparent',
              },
            ]}
          >
            <Icon
              name="thumb-down"
              size={24}
              color={getActionColor('dislike')}
              style={styles.icon}
            />
            <Text style={[styles.actionText, { color: textColor }]}>
              {dislikes}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  username: {
    fontWeight: '600',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    marginVertical: 8,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 16,
  },
  icon: {
    // Additional styling if needed
  },
});

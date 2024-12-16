// components/PostCard.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import SpotifyEmbed from './SpotifyEmbed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { Link } from 'expo-router';

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
  imageUrl?: string;
  content?: string;
}

interface PostCardProps {
  post: Post;
  isFeed: boolean;
  isDarkTheme: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, isFeed, isDarkTheme }) => {
  const [likes, setLikes] = useState<number>(post.likes);
  const [dislikes, setDislikes] = useState<number>(post.dislikes);
  const [userAction, setUserAction] = useState<'like' | 'dislike' | null>(post.userAction);

  // Loading states
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [isDisliking, setIsDisliking] = useState<boolean>(false);

  // State for lyrics
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isLyricsLoading, setIsLyricsLoading] = useState<boolean>(false);
  const [showLyrics, setShowLyrics] = useState<boolean>(false);

  // Animation values
  const likeScale = useState(new Animated.Value(1))[0];
  const dislikeScale = useState(new Animated.Value(1))[0];

  // Theme-based colors
  const backgroundColor = isDarkTheme ? '#1e1e1e' : '#fff';
  const textColor = isDarkTheme ? '#fff' : '#000';

  // Determine button color
  const getActionColor = (action: 'like' | 'dislike') => {
    if (userAction === action) {
      return action === 'like' ? 'blue' : 'red';
    }
    return isDarkTheme ? '#aaa' : '#555';
  };

  // Handle Like
  const handleLike = async () => {
    if (userAction === 'like') {
      Alert.alert('Oops!', 'You have already liked this post.');
      return;
    }
    setIsLiking(true);
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}posts/${post.id}/like/`
      );

      if (response.data.likes !== undefined && response.data.dislikes !== undefined) {
        setLikes(response.data.likes);
        setDislikes(response.data.dislikes);
      } else if (
        response.data.total_likes !== undefined &&
        response.data.total_dislikes !== undefined
      ) {
        setLikes(response.data.total_likes);
        setDislikes(response.data.total_dislikes);
      } else {
        // If no updated counts from backend:
        setLikes((prev) => prev + 1);
        if (userAction === 'dislike') {
          setDislikes((prev) => Math.max(prev - 1, 0));
        }
      }

      setUserAction('like');

      Animated.sequence([
        Animated.timing(likeScale, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(likeScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to like the post. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };

  // Handle Dislike
  const handleDislike = async () => {
    if (userAction === 'dislike') {
      Alert.alert('Oops!', 'You have already disliked this post.');
      return;
    }
    setIsDisliking(true);
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}posts/${post.id}/dislike/`
      );

      if (response.data.likes !== undefined && response.data.dislikes !== undefined) {
        setLikes(response.data.likes);
        setDislikes(response.data.dislikes);
      } else if (
        response.data.total_likes !== undefined &&
        response.data.total_dislikes !== undefined
      ) {
        setLikes(response.data.total_likes);
        setDislikes(response.data.total_dislikes);
      } else {
        setDislikes((prev) => prev + 1);
        if (userAction === 'like') {
          setLikes((prev) => Math.max(prev - 1, 0));
        }
      }

      setUserAction('dislike');

      Animated.sequence([
        Animated.timing(dislikeScale, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(dislikeScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to dislike the post. Please try again.');
    } finally {
      setIsDisliking(false);
    }
  };

  // Fetch lyrics
  const fetchLyrics = async () => {
    try {
      setIsLyricsLoading(true);
      const spotifyUrl = `https://open.spotify.com/track/${post.spotifyId}`;
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}get_lyrics/`,
        {
          params: { spotify_url: spotifyUrl },
        }
      );
      setLyrics(data.lyrics);
    } catch (error) {
      console.error('Error fetching lyrics:', error);
      setLyrics('Failed to load lyrics. Please try again.');
    } finally {
      setIsLyricsLoading(false);
      setShowLyrics(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Title or Image */}
      {post.imageUrl ? (
        <Image source={{ uri: post.imageUrl }} style={styles.image} />
      ) : (
        post.title && <Text style={[styles.title, { color: textColor }]}>{post.title}</Text>
      )}

      {/* Make the username clickable via expo-router Link */}
      <Link href={`/profile/${post.username}`} asChild>
        <TouchableOpacity>
          <Text style={[styles.username, { color: textColor }]}>{post.username}</Text>
        </TouchableOpacity>
      </Link>

      {/* Date */}
      <Text style={[styles.date, { color: textColor }]}>
        {new Date(post.created_at).toLocaleString()}
      </Text>

      {/* Spotify Embed */}
      {<SpotifyEmbed type={post.type} spotifyId={post.spotifyId} />}

      {/* Text Content */}
      {post.content && (
        <Text style={[styles.content, { color: textColor }]}>{post.content}</Text>
      )}

      {/* Like / Dislike */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} disabled={isLiking}>
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
            <Text style={[styles.actionText, { color: textColor }]}>{likes}</Text>
            {isLiking && (
              <ActivityIndicator
                size="small"
                color={isDarkTheme ? '#fff' : '#000'}
                style={{ marginLeft: 8 }}
              />
            )}
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDislike} disabled={isDisliking}>
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
            <Text style={[styles.actionText, { color: textColor }]}>{dislikes}</Text>
            {isDisliking && (
              <ActivityIndicator
                size="small"
                color={isDarkTheme ? '#fff' : '#000'}
                style={{ marginLeft: 8 }}
              />
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Show / Hide Lyrics Button */}
      <View style={{ marginTop: 16 }}>
        {!showLyrics ? (
          <TouchableOpacity
            style={[styles.showLyricsButton, { borderColor: isDarkTheme ? '#fff' : '#333' }]}
            onPress={fetchLyrics}
          >
            <Text style={{ color: textColor, fontWeight: 'bold' }}>Show lyrics</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.showLyricsButton, { borderColor: isDarkTheme ? '#fff' : '#333' }]}
            onPress={() => setShowLyrics(false)}
          >
            <Text style={{ color: textColor, fontWeight: 'bold' }}>Hide lyrics</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lyrics Display */}
      {showLyrics && (
        <View style={{ marginTop: 16 }}>
          {isLyricsLoading ? (
            <ActivityIndicator size="small" color={isDarkTheme ? '#fff' : '#000'} />
          ) : (
            <Text style={{ color: textColor }}>{lyrics}</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
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
    marginVertical: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    marginVertical: 8,
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
  icon: {},
  showLyricsButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
});

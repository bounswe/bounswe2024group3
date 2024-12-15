import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import SpotifyEmbed from './SpotifyEmbed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

// ... (Keep the PostDetails and PostCardProps interfaces the same)

const PostCard: React.FC<PostCardProps> = ({ post, isFeed, isDarkTheme }) => {
  const [likes, setLikes] = useState<number>(post.likes);
  const [dislikes, setDislikes] = useState<number>(post.dislikes);
  const [userAction, setUserAction] = useState<'like' | 'dislike' | null>(
    post.userAction
  );

  // State for lyrics
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isLyricsLoading, setIsLyricsLoading] = useState<boolean>(false);
  const [showLyrics, setShowLyrics] = useState<boolean>(false);

  // Animation values
  const likeScale = useState(new Animated.Value(1))[0];
  const dislikeScale = useState(new Animated.Value(1))[0];

  const handleLike = () => {
    if (userAction !== 'like') {
      setLikes(likes + 1);
      setUserAction('like');
      if (userAction === 'dislike') {
        setDislikes(dislikes - 1);
      }

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
    }
  };

  const handleDislike = () => {
    if (userAction !== 'dislike') {
      setDislikes(dislikes + 1);
      setUserAction('dislike');
      if (userAction === 'like') {
        setLikes(likes - 1);
      }

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
    }
  };

  // Called when the user presses "Show lyrics"
  const fetchLyrics = async () => {
    try {
      setIsLyricsLoading(true);
      // Build the full Spotify URL using the ID
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
      setShowLyrics(true); // Toggle the display
    }
  };

  // Define colors based on the theme
  const backgroundColor = isDarkTheme ? '#1e1e1e' : '#fff';
  const textColor = isDarkTheme ? '#fff' : '#000';

  // Helper function to determine action button color
  const getActionColor = (action: 'like' | 'dislike') => {
    if (userAction === action) {
      return 'blue';
    }
    return isDarkTheme ? '#aaa' : '#555';
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Title or image */}
      {post.imageUrl ? (
        <Image source={{ uri: post.imageUrl }} style={styles.image} />
      ) : (
        post.title && (
          <Text style={[styles.title, { color: textColor }]}>{post.title}</Text>
        )
      )}

      {/* Username and date */}
      <Text style={[styles.username, { color: textColor }]}>
        {post.username}
      </Text>
      <Text style={[styles.date, { color: textColor }]}>
        {new Date(post.created_at).toLocaleString()}
      </Text>

      {/* Spotify embed if feed */}
      {isFeed && <SpotifyEmbed type={post.type} spotifyId={post.spotifyId} />}

      {/* If there's text content (post.content?), show it */}
      {post.content && (
        <Text style={[styles.content, { color: textColor }]}>
          {post.content}
        </Text>
      )}

      {/* Like and Dislike buttons */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} activeOpacity={0.7}>
          <Animated.View
            style={[
              styles.actionButton,
              {
                transform: [{ scale: likeScale }],
                backgroundColor:
                  userAction === 'like' ? '#e0f7fa' : 'transparent',
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
                backgroundColor:
                  userAction === 'dislike' ? '#ffebee' : 'transparent',
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

      {/* Show Lyrics Button */}
      <View style={{ marginTop: 16 }}>
        {!showLyrics ? (
          <TouchableOpacity
            style={[
              styles.showLyricsButton,
              { borderColor: isDarkTheme ? '#fff' : '#333' },
            ]}
            onPress={fetchLyrics}
          >
            <Text style={{ color: textColor, fontWeight: 'bold' }}>
              Show lyrics
            </Text>
          </TouchableOpacity>
        ) : (
          // If we already have lyrics or are loading them, toggle the view
          <TouchableOpacity
            style={[
              styles.showLyricsButton,
              { borderColor: isDarkTheme ? '#fff' : '#333' },
            ]}
            onPress={() => setShowLyrics(false)}
          >
            <Text style={{ color: textColor, fontWeight: 'bold' }}>
              Hide lyrics
            </Text>
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

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 }, // iOS shadow
    shadowOpacity: 0.2, // iOS shadow
    shadowRadius: 1.41, // iOS shadow
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
    marginBottom: 4,
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
  icon: {
    // Additional styling if needed
  },
  showLyricsButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
});

export default PostCard;

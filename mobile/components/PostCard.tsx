import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import SpotifyEmbed from './SpotifyEmbed'; // Ensure this path is correct
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icons

// ... (Keep the PostDetails and PostCardProps interfaces as they are)

const PostCard: React.FC<PostCardProps> = ({ post, isFeed, isDarkTheme }) => {
  const [likes, setLikes] = useState<number>(post.likes);
  const [dislikes, setDislikes] = useState<number>(post.dislikes);
  const [userAction, setUserAction] = useState<'like' | 'dislike' | null>(
    post.userAction
  );

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

      // Animate button
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

      // Animate button
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
      <Text style={[styles.content, { color: textColor }]}>{post.content}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 1 }, // For iOS shadow
    shadowOpacity: 0.2, // For iOS shadow
    shadowRadius: 1.41, // For iOS shadow
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

export default PostCard;

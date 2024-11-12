import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import SpotifyEmbed from './SpotifyEmbed'; // Ensure this path is correct

// Define the type for the post details
interface PostDetails {
  id: number;
  title?: string;
  content: string;
  username: string;
  imageUrl?: string | null;
  type: string;
  spotifyId: string;
  likes: number;
  dislikes: number;
  userAction: 'like' | 'dislike' | null;
  created_at: Date;
}

// Define the props for the PostCard component
interface PostCardProps {
  post: PostDetails;
  isFeed: boolean;
  isDarkTheme: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, isFeed, isDarkTheme }) => {
  const [likes, setLikes] = useState<number>(post.likes);
  const [dislikes, setDislikes] = useState<number>(post.dislikes);
  const [userAction, setUserAction] = useState<'like' | 'dislike' | null>(
    post.userAction
  );

  const handleLike = () => {
    if (userAction !== 'like') {
      setLikes(likes + 1);
      setUserAction('like');
      if (userAction === 'dislike') {
        setDislikes(dislikes - 1);
      }
    }
  };

  const handleDislike = () => {
    if (userAction !== 'dislike') {
      setDislikes(dislikes + 1);
      setUserAction('dislike');
      if (userAction === 'like') {
        setLikes(likes - 1);
      }
    }
  };

  // Define colors based on the theme
  const backgroundColor = isDarkTheme ? '#333' : '#fff';
  const textColor = isDarkTheme ? '#fff' : '#000';

  // Helper function to determine action button color
  const getActionColor = (action: 'like' | 'dislike') => {
    return userAction === action ? 'blue' : textColor;
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
      <Text style={{ color: textColor }}>{post.content}</Text>
      <Text style={{ color: textColor }}>
        {new Date(post.created_at).toLocaleString()}
      </Text>

      {/* Like and Dislike Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike}>
          <Text style={{ color: getActionColor('like') }}>
            👍 {likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDislike}>
          <Text style={{ color: getActionColor('dislike') }}>
            👎 {dislikes}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
  },
  title: {
    fontSize: 24,
  },
  username: {
    fontWeight: 'bold',
    marginVertical: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
});

export default PostCard;

// app/profile/[username].tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  FlatList,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import PostCard from '../../components/PostCard';

interface UserData {
  message: string;
  username: string;
  user_id: number;
  name: string;
  surname: string;
  email: string;
  labels: string; // e.g., "['artist']"
}

interface UserPost {
  id: number;
  comment: string;
  image: string;
  link: string;
  created_at: string;
  total_likes: number;
  total_dislikes: number;
  tags: string[];
  content: {
    id: number;
    link: string;
    content_type: string;
    artist_names: string[];
    playlist_name: string;
    album_name: string;
    song_name: string;
    genres: string[];
    ai_description: string;
  };
}

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);

  // Fetch user details
  const fetchUserData = useCallback(async () => {
    if (!username) return;

    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}get_user?username=${username}`
      );
      setUserData(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch user details.');
    } finally {
      setLoadingUser(false);
    }
  }, [username]);

  // Fetch user posts
  const fetchUserPosts = useCallback(async () => {
    if (!username) return;

    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}get-user-posts?username=${username}`
      );
      setUserPosts(response.data.posts);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch user posts.');
    } finally {
      setLoadingPosts(false);
    }
  }, [username]);

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, [fetchUserData, fetchUserPosts]);

  // Map the userPost structure into the props your PostCard expects
  const mapUserPostToPost = (userPost: UserPost) => {
    return {
      id: userPost.id,
      title: userPost.comment || 'Untitled',
      username: username, // We already know the user
      type: userPost.content.content_type || 'unknown',
      spotifyId: extractSpotifyId(userPost.link),
      likes: userPost.total_likes || 0,
      dislikes: userPost.total_dislikes || 0,
      userAction: null,
      created_at: new Date(userPost.created_at),
      imageUrl: userPost.image ? userPost.image : undefined,
      content: userPost.comment || undefined,
    };
  };

  // Extract the track ID from the Spotify link
  const extractSpotifyId = (link: string) => {
    const parts = link.split('/');
    const lastPart = parts[parts.length - 1];
    // strip query params if any
    return lastPart.includes('?') ? lastPart.split('?')[0] : lastPart;
  };

  const renderPost = ({ item }: { item: ReturnType<typeof mapUserPostToPost> }) => {
    return <PostCard isFeed={false} post={item} isDarkTheme={false} />;
  };

  if (loadingUser || loadingPosts) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text>No user data found.</Text>
      </View>
    );
  }

  // Optional: parse labels if it's a stringified array (e.g. "['artist']")
  let labelsArray: string[] = [];
  try {
    labelsArray = JSON.parse(userData.labels);
  } catch (e) {
    labelsArray = [];
  }

  // Render a header component that displays user info
  const renderHeader = () => (
    <View>
      <View style={styles.userInfo}>
        <Text style={styles.title}>{`${userData.name} ${userData.surname}`}</Text>
        <Text style={styles.username}>@{userData.username}</Text>
        <Text style={styles.email}>{userData.email}</Text>
        <Text style={styles.labels}>Labels: {labelsArray.join(', ')}</Text>
      </View>
      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>Posts by {username}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={userPosts.map(mapUserPostToPost)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <Text style={styles.noPostsText}>This user hasn't posted anything yet.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80, // extra space so the last post isn't hidden
  },
  userInfo: {
    marginVertical: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  labels: {
    fontSize: 14,
    color: '#777',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  noPostsText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 16,
  },
});

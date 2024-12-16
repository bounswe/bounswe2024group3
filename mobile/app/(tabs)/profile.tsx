// app/profile.tsx

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  FlatList,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";

import PostCard from "../../components/PostCard";

// Define interfaces
interface UserData {
  user_id: number;
  name: string;
  surname: string;
  email: string;
  username: string;
  labels: string[]; // assuming labels are stored as an array
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

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [myPosts, setMyPosts] = useState<UserPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const router = useRouter();


  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          console.log("Loaded userData:", parsedData); // Debugging
          setUserData(parsedData);
        } else {
          console.log("No userData found in AsyncStorage"); // Debugging
          Alert.alert("Error", "No user data found. Please log in again.");
          router.replace("/login");
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        Alert.alert("Error", "Failed to load user data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  // Fetch the logged-in user's posts
  const fetchMyPosts = useCallback(async () => {
    if (!userData?.username) {
      console.log("Username is undefined"); // Debugging
      Alert.alert("Error", "Username is missing. Please log in again.");
      router.replace("/login");
      return;
    }
    setLoadingPosts(true);

    try {
      const url = `${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}get-user-posts?username=${userData.username}`;
      console.log("Fetching posts from URL:", url); // Debugging
      const response = await axios.get(url);
      console.log("Fetched posts response:", response.data); // Debugging

      if (response.data && Array.isArray(response.data.posts)) {
        setMyPosts(response.data.posts);
      } else {
        console.log("No posts found in response"); // Debugging
        setMyPosts([]);
      }
    } catch (error) {
      console.error("Failed to fetch user posts:", error);
      Alert.alert("Error", "Failed to fetch your posts. Please try again later.");
    } finally {
      setLoadingPosts(false);
    }
  }, [userData?.username, process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL , router]);

  useEffect(() => {
    if (userData?.username) {
      fetchMyPosts();
    }
  }, [userData, fetchMyPosts]);

  // Map the API's userPost shape to the Post interface for PostCard
  const mapUserPostToPost = (userPost: UserPost) => {
    return {
      id: userPost.id,
      title: userPost.comment || "Untitled",
      username: userData.username,
      type: userPost.content.content_type || "unknown",
      spotifyId: extractSpotifyId(userPost.link),
      likes: userPost.total_likes || 0,
      dislikes: userPost.total_dislikes || 0,
      userAction: null,
      created_at: new Date(userPost.created_at),
      imageUrl: userPost.image ? userPost.image : undefined,
      content: userPost.comment || undefined,
    };
  };

  // Helper function to extract Spotify ID from URL
  const extractSpotifyId = (link: string) => {
    const parts = link.split("/");
    const lastPart = parts[parts.length - 1];
    return lastPart.includes("?") ? lastPart.split("?")[0] : lastPart;
  };

  // Render individual post
  const renderPost = ({ item }: { item: ReturnType<typeof mapUserPostToPost> }) => (
    <PostCard isFeed={true} post={item} isDarkTheme={false} />
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      router.replace("/login");
    } catch (error) {
      console.error("Failed to clear user data:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMyPosts();
    setRefreshing(false);
  }, [fetchMyPosts]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>No user data found.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace("/login")}>
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Parse labels if they are stored as a string
  let labelsArray: string[] = [];
  if (typeof userData.labels === "string") {
    try {
      labelsArray = JSON.parse(userData.labels);
      console.log("Parsed labels:", labelsArray); // Debugging
    } catch (e) {
      console.log("Failed to parse labels:", e); // Debugging
      labelsArray = [userData.labels];
    }
  } else if (Array.isArray(userData.labels)) {
    labelsArray = userData.labels;
  }

  return (
    <SafeAreaView style={styles.flexContainer}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.welcomeText}>
          Welcome, <Text style={styles.highlight}>{userData.name} {userData.surname}</Text>!
        </Text>

        {/* User Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>User Information</Text>
          <View style={styles.cardContent}>
            <Text style={styles.infoText}>
              <Text style={styles.label}>User ID:</Text> {userData.user_id}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Email:</Text> {userData.email}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Username:</Text> {userData.username}
            </Text>
          </View>
        </View>

        {/* Roles Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Roles</Text>
          <View style={styles.rolesContainer}>
            {labelsArray.length > 0 ? (
              labelsArray.map((role: string, index: number) => (
                <View key={index} style={styles.roleBadge}>
                  <Text style={styles.roleText}>{role}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.infoText}>No roles assigned</Text>
            )}
          </View>
        </View>

        {/* My Posts Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Posts</Text>
          {loadingPosts ? (
            <ActivityIndicator size="small" color="#000" style={{ marginTop: 10 }} />
          ) : myPosts.length === 0 ? (
            <Text style={styles.infoText}>You haven't posted anything yet.</Text>
          ) : (
            <FlatList
              data={myPosts.map(mapUserPostToPost)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderPost}
              scrollEnabled={false} // Let ScrollView handle scrolling
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  highlight: {
    color: "#007bff",
    fontWeight: "700",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#007bff",
  },
  cardContent: {
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  rolesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  roleBadge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    margin: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  roleText: {
    color: "#555",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#f05454",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingBottom: 20, // To ensure content isn't hidden behind other UI elements
  },
});

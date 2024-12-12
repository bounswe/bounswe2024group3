import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; 
import PostCard from '../../components/PostCard'; // Use PostCard instead of RecommendationItem

interface Track {
  link: string;
  description: string;
  count: number;
}

export default function MostListenedNearbyScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false); // If you want a theme toggle

  const fetchData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const storedLatitude = await AsyncStorage.getItem('latitude');
      const storedLongitude = await AsyncStorage.getItem('longitude');
      let latitude = 41.080895;
      let longitude = 29.0343434;

      if (storedLatitude && storedLongitude) {
        latitude = parseFloat(storedLatitude);
        longitude = parseFloat(storedLongitude);
      }

      const radius = 10; // adjust if needed
      const url = `${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}most-listened-nearby/?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;

      console.log("Requesting:", url);
      const response = await axios.get(url);

      if (response.data && Array.isArray(response.data.tracks)) {
        setTracks(response.data.tracks);
      } else {
        console.warn("No valid tracks data found in response");
        setError('No tracks found.');
        setTracks([]);
      }
    } catch (err: any) {
      console.error("Error fetching most listened nearby tracks:", err);
      setError('Failed to fetch tracks.');
      setTracks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (tracks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No tracks found nearby.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Track }) => {
    const parts = item.link.split('/');
    const spotifyId = parts[parts.length - 1];
    const type = parts[3] || 'track';

    // Create a post object compatible with PostCard
    // You can parse `description` if it has relevant info such as image, name, etc.
    const post = {
      id: spotifyId,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)}`, // e.g. "Track", "Album", etc.
      content: 'Most listened track nearby', // You could parse description for something meaningful
      username: 'Local Listener',           // Example placeholder
      imageUrl: '',                         // If you can parse an image from description, do it here
      type: type,                           // The content type inferred from the link
      spotifyId: spotifyId,                 // Extracted Spotify ID
      likes: item.count || 0,               // Using the count as likes or popularity score
      dislikes: 0,                          // No dislikes data available, default to 0
      userAction: null,                     // No user action data provided
      created_at: new Date().toISOString(), // Current date, or parse from description if available
    };

    return <PostCard post={post} isFeed={true} isDarkTheme={isDarkTheme} />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Most Listened Nearby</Text>
      <FlatList
        data={tracks}
        keyExtractor={(item, index) => item.link + index}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingBottom: 50,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
});

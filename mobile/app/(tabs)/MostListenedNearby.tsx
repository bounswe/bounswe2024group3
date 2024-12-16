import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  RefreshControl,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import PostCard from '../../components/PostCard'; // Ensure PostCard can handle optional fields

// Unified data structure with optional fields for flexibility
interface NearbyDataState {
  link: string;
  count: number; // "most listened" uses 'count', "most shared" uses 'share_count' mapped to 'count'
  song_name?: string;
  artist_names?: string[];
  album_name?: string;
  description?: string;
}

// Possible tabs
type NearbyTab = 'listened' | 'shared';

export default function NearbyScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<NearbyDataState[]>([]);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Optional: Theme toggle
  const [activeTab, setActiveTab] = useState<NearbyTab>('listened');

  const fetchData = useCallback(async () => {
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

      const radius = 10; // Adjust as needed

      let endpoint = '';
      if (activeTab === 'listened') {
        endpoint = 'most-listened-nearby'; // e.g., /most-listened-nearby/
      } else {
        endpoint = 'most-shared-nearby-things'; // e.g., /most-shared-nearby-things/
      }

      const url = `${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}${endpoint}/?latitude=${latitude}&longitude=${longitude}&radius=${radius}`;
      console.log('Requesting:', url);

      const response = await axios.get(url);

      if (activeTab === 'listened') {
        /**
         * Response shape:
         * {
         *   "tracks": [
         *     {
         *       "link": "https://open.spotify.com/track/5DXKtoZLm31msT7tNGNHLG",
         *       "count": 2
         *     },
         *     ...
         *   ]
         * }
         */
        if (!response.data || !Array.isArray(response.data.tracks)) {
          console.warn('No valid tracks data found in response');
          setError('No data found.');
          setData([]);
        } else {
          const unifiedData: NearbyDataState[] = response.data.tracks.map(
            (item: any) => ({
              link: item.link,
              count: item.count ?? 0,
              // Optional fields remain undefined
            })
          );
          setData(unifiedData);
        }
      } else {
        /**
         * Response shape:
         * {
         *   "songs": [
         *     {
         *       "link": "https://open.spotify.com/track/5DXKtoZLm31msT7tNGNHLG",
         *       "song_name": "Vossi Bop",
         *       "artist_names": ["Stormzy"],
         *       "album_name": "Heavy Is The Head",
         *       "description": "AI description generation failed",
         *       "share_count": 2
         *     },
         *     ...
         *   ],
         *   "pagination": {...}
         * }
         */
        if (!response.data || !Array.isArray(response.data.songs)) {
          console.warn('No valid songs data found in response');
          setError('No data found.');
          setData([]);
        } else {
          const unifiedData: NearbyDataState[] = response.data.songs.map(
            (item: any) => ({
              link: item.link,
              count: item.share_count ?? 0,
              song_name: item.song_name,
              artist_names: item.artist_names,
              album_name: item.album_name,
              description: item.description,
            })
          );
          setData(unifiedData);
        }
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data.');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [activeTab, fetchData]);

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

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>
          {activeTab === 'listened'
            ? 'No tracks found nearby.'
            : 'No shared items found nearby.'}
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: NearbyDataState }) => {
    // Extract Spotify ID from the link
    const parts = item.link.split('/');
    const spotifyId = parts[parts.length - 1];
    // e.g., "https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3"
    const type = parts[3] || 'track';

    const post = {
      id: spotifyId,
      title: item.song_name || `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content:
        item.description ||
        (activeTab === 'listened'
          ? 'Most listened nearby'
          : 'Most shared nearby'),
      username:
        item.artist_names && item.artist_names.length
          ? item.artist_names.join(', ')
          : '',
      imageUrl: '', // Optionally, fetch album art based on spotifyId
      type: type, // "track", "album", etc.
      spotifyId: spotifyId, // Extracted from the link
      likes: item.count, // Treat "count" as a popularity measure
      dislikes: 0,
      userAction: null,
      created_at: new Date().toISOString(),
    };

    return <PostCard post={post} isFeed={true} isDarkTheme={isDarkTheme} />;
  };

  return (
    <View style={styles.container}>
      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <Button
          title="Most Listened"
          onPress={() => setActiveTab('listened')}
          color={activeTab === 'listened' ? '#007AFF' : '#8e8e8e'}
        />
        <Button
          title="Most Shared"
          onPress={() => setActiveTab('shared')}
          color={activeTab === 'shared' ? '#007AFF' : '#8e8e8e'}
        />
      </View>

      {/* Heading */}
      <Text style={styles.header}>
        {activeTab === 'listened' ? 'Most Listened Nearby' : 'Most Shared Nearby'}
      </Text>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.link + index}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 50,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
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

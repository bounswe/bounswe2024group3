import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window'); // Get the width of the screen

const FeedPage = () => {
  const [feed, setFeed] = useState([]); // State to manage feed data
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    setIsLoading(true);
    const feedEndpoint = 'http://207.154.246.225/api/user_feed';

    try {
      const response = await axios.get(feedEndpoint);
      if (response.data.posts) {
        console.log('Feed fetched successfully');
        console.log(response.data.posts);
        setFeed(response.data.posts); // Update feed data using setState
      } else {
        console.log('Failed to fetch feed');
        throw new Error('Failed to fetch feed');
      }
    } catch (error) {
      console.error('Fetch Feed Error:', error);
      Alert.alert('Fetch Feed Error', error.message || 'An error occurred while fetching the feed');
    }
    setIsLoading(false);
  };

  const renderFeed = () => {
    return feed.map((item, index) => (
      <View key={index} style={styles.bookContainer}>
        <Text style={styles.bookInfo}>Username: {item.username}</Text>
        <View style={styles.line}></View>
        <Text style={styles.bookInfo}>Content: {item.content}</Text>
        <View style={styles.line}></View>
        <Text style={styles.bookInfo}>Created At: {new Date(item.created_at).toLocaleString()}</Text>
        <View style={styles.line}></View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.refreshButton} onPress={fetchFeed}>
        <Text style={styles.refreshButtonText}>Refresh Feed</Text>
      </TouchableOpacity>
      {isLoading ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <ScrollView style={styles.resultsContainer}>
          {Array.isArray(feed) && feed.length > 0 ? renderFeed() : <Text>No feed items found.</Text>}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const colors = {
  primary: '#F8F4E1',
  secondary: '#AF8F6F',
  third: '#74512D',
  fourth: '#543310',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.third,
  },
  refreshButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 18,
  },
  resultsContainer: {
    paddingHorizontal: 20,
  },
  feedContainer: {
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    color: colors.third,
  },
  content: {
    fontSize: 16,
    color: colors.fourth,
  },
  createdAt: {
    fontSize: 14,
    color: colors.secondary,
  },
  likeStatus: {
    fontSize: 14,
    color: colors.secondary,
  },
  line: {
    height: 1,
    backgroundColor: colors.third,
    marginVertical: 5,
  },bookInfo: {
    fontSize: 16,
    color: colors.fourth,
    fontFamily: 'courier new',
    fontWeight: 'bold',
  },  bookContainer: {
    padding: 16,
    margin: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
});

export default FeedPage;

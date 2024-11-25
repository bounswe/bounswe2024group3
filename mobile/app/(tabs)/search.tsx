import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  TextInput,
  Text,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import PostCard from '../../components/PostCard'; 
import { REACT_APP_BACKEND_URL } from '@env';
import axios from 'axios';

export default function SearchScreen() {
  const [query, setQuery] = useState(''); // To capture search input
  const [posts, setPosts] = useState([]); // To store search results
  const [isLoading, setIsLoading] = useState(false); // To track loading state
  const [error, setError] = useState(''); // To display error messages

  useEffect(() => {
    if (query.trim() === '') {
      setPosts([]); // Clear results when the search bar is empty
      return;
    }

    const fetchPosts = async () => {
      setIsLoading(true);
      setError('');
      try {
        const searchQuery = `search/?search=${query}`;
        const response = await axios.get(`${REACT_APP_BACKEND_URL}${searchQuery}`);
        console.log('Search response:', response.data);

        const fetchedPosts = response.data.contents || [];
        if (fetchedPosts.length === 0) {
          setError('No posts found');
        }
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Search failed:', err);
        setError('Failed to fetch posts');
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchPosts(); // Debounced search
    }, 500);

    return () => clearTimeout(delayDebounce); // Cleanup on unmount or query change
  }, [query]);

  const renderPost = ({ item }: { item: any }) => (
    <PostCard post={item} isFeed={false} isDarkTheme={false} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Search Posts</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
          contentContainerStyle={styles.resultsContainer}
          ListEmptyComponent={
            query.trim() !== '' && !isLoading ? (
              <Text style={styles.noResults}>No results found</Text>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  noResults: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
  resultsContainer: {
    paddingHorizontal: 10,
  },
});
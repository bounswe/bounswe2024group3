// app/(tabs)/recommendations.tsx

import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
import PostCard from '../../components/PostCard';
import { mockPosts } from '../../pages/mockPosts';
import { Ionicons } from '@expo/vector-icons';

function Recommendations() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [randomPosts, setRandomPosts] = useState([]);

  const toggleTheme = () => {
    setIsDarkTheme((previousState) => !previousState);
  };

  const getRandomPosts = () => {
    const shuffledPosts = [...mockPosts].sort(() => 0.5 - Math.random());
    setRandomPosts(shuffledPosts.slice(0, 3));
  };

  useEffect(() => {
    getRandomPosts();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: isDarkTheme ? '#121212' : '#f2f2f2' }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
          <Ionicons
            name={isDarkTheme ? 'sunny-outline' : 'moon-outline'}
            size={24}
            color={isDarkTheme ? '#fff' : '#000'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={getRandomPosts} style={styles.iconButton}>
          <Ionicons
            name="refresh-outline"
            size={24}
            color={isDarkTheme ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={randomPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard isFeed={true} post={item} isDarkTheme={isDarkTheme} />
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  iconButton: {
    marginLeft: 16,
    padding: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});

export default Recommendations;

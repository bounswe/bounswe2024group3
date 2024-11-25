import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, Text, TouchableOpacity, View } from 'react-native';
import PostCard from '../../components/PostCard';
import { mockPosts } from '../../pages/mockPosts';

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
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkTheme ? '#000' : '#fff' }}>
      <View style={{ padding: 16 }}>
        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            backgroundColor: isDarkTheme ? '#fff' : '#000',
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <Text
            style={{ color: isDarkTheme ? '#000' : '#fff', textAlign: 'center', fontSize: 16 }}
          >
            Toggle Theme
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={getRandomPosts}
          style={{
            backgroundColor: '#2f95dc',
            padding: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16 }}>
            Refresh Recommendations
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          data={randomPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostCard isFeed={true} post={item} isDarkTheme={isDarkTheme} />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

export default Recommendations;

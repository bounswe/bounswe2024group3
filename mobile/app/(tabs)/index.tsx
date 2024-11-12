import React, { useState } from 'react';
import { SafeAreaView, FlatList, Text, TouchableOpacity, View } from 'react-native';
import PostCard from '../../components/PostCard';
import { mockPosts } from '../../pages/mockPosts';

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme((previousState) => !previousState);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDarkTheme ? '#000' : '#fff' }}
    >
      <View style={{ padding: 16 }}>
        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            backgroundColor: isDarkTheme ? '#fff' : '#000',
            padding: 12,
            borderRadius: 8,
          }}
        >
          <Text
            style={{ color: isDarkTheme ? '#000' : '#fff', textAlign: 'center', fontSize: 16 }}
          >
            Toggle Theme
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          data={mockPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostCard isFeed={true} post={item} isDarkTheme={isDarkTheme} />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

export default App;

import React from 'react';
import { SafeAreaView, FlatList } from 'react-native';
import PostCard from '../../components/PostCard'; 
import { mockPosts } from '../../pages/mockPosts'; 

function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={mockPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostCard isFeed={true} post={item} />}
      />
    </SafeAreaView>
  );
}

export default App;

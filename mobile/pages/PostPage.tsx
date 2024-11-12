import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import PostCard from '../components/PostCard';
import { mockPosts, PostDetails } from './mockPosts';

const PostPage: React.FC<{ type: string }> = ({ type }) => {
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const [newPostContent, setNewPostContent] = useState('');

  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  const handlePostSubmit = () => {
    const newPost: PostDetails = {
      id: posts.length + 1,
      imageUrl: null,
      title: undefined,
      content: newPostContent,
      username: 'ekrembal',
      likes: 0,
      dislikes: 0,
      created_at: new Date(),
      type,
      spotifyId: '',
      userAction: null,
    };
    mockPosts.push(newPost);
    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  return (
    <View style={styles.container}>
      {/* Post Input Section */}
      <View style={styles.addPostSection}>
        <Text style={styles.title}>Add a New Post</Text>
        <TextInput
          value={newPostContent}
          onChangeText={setNewPostContent}
          placeholder="Write your post content here..."
          style={styles.textInput}
        />
        <Button title="Submit Post" onPress={handlePostSubmit} />
      </View>

      {/* Posts List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostCard isFeed={false} post={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addPostSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
});

export default PostPage;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from 'react-native';
import PostCard from '../components/PostCard';
import { mockPosts, PostDetails } from './mockPosts';

const PostPage: React.FC<{ type: string }> = ({ type }) => {
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Added theme state

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

  // Theme toggle function
  const toggleTheme = () => {
    setIsDarkTheme((prevState) => !prevState);
  };

  // Define colors based on the theme
  const backgroundColor = isDarkTheme ? '#000' : '#fff';
  const textColor = isDarkTheme ? '#fff' : '#000';
  const placeholderTextColor = isDarkTheme ? '#888' : '#666';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Toggle Theme Button */}
      <View style={{ padding: 16 }}>
        <Button
          title="Toggle Theme"
          onPress={toggleTheme}
          color={isDarkTheme ? '#fff' : '#000'}
        />
      </View>

      {/* Post Input Section */}
      <View style={styles.addPostSection}>
        <Text style={[styles.title, { color: textColor }]}>
          Add a New Post
        </Text>
        <TextInput
          value={newPostContent}
          onChangeText={setNewPostContent}
          placeholder="Write your post content here..."
          placeholderTextColor={placeholderTextColor}
          style={[
            styles.textInput,
            { color: textColor, borderColor: textColor },
          ]}
        />
        <Button
          title="Submit Post"
          onPress={handlePostSubmit}
          color={isDarkTheme ? '#fff' : '#000'}
        />
      </View>

      {/* Posts List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard isFeed={false} post={item} isDarkTheme={isDarkTheme} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Removed padding to prevent double padding with addPostSection
  },
  addPostSection: {
    marginBottom: 16,
    paddingHorizontal: 16, // Added horizontal padding
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
});

export default PostPage;

import React, { useState } from 'react';
import { View, Text, Image, Button, TouchableOpacity } from 'react-native';
import  SpotifyEmbed  from './SpotifyEmbed'; // Create a custom Spotify Embed for React Native

const PostCard = ({ post, isFeed }) => {
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [userAction, setUserAction] = useState(post.userAction);

  const handleLike = () => {
    if (userAction !== 'like') {
      setLikes(likes + 1);
      setUserAction('like');
      if (userAction === 'dislike') {
        setDislikes(dislikes - 1);
      }
    }
  };

  const handleDislike = () => {
    if (userAction !== 'dislike') {
      setDislikes(dislikes + 1);
      setUserAction('dislike');
      if (userAction === 'like') {
        setLikes(likes - 1);
      }
    }
  };

  return (
    <View style={{ padding: 16, backgroundColor: '#fff', marginBottom: 16 }}>
      {post.imageUrl ? (
        <Image source={{ uri: post.imageUrl }} style={{ width: '100%', height: 200 }} />
      ) : (
        <Text style={{ fontSize: 24 }}>{post.title}</Text>
      )}
      <Text style={{ fontWeight: 'bold', marginVertical: 8 }}>{post.username}</Text>
      {isFeed && <SpotifyEmbed type={post.type} spotifyId={post.spotifyId} />}
      <Text>{post.content}</Text>
      <Text>{new Date(post.created_at).toLocaleString()}</Text>

      {/* Like and Dislike Actions */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 }}>
        <TouchableOpacity onPress={handleLike}>
          <Text style={{ color: userAction === 'like' ? 'blue' : 'black' }}>👍 {likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDislike}>
          <Text style={{ color: userAction === 'dislike' ? 'blue' : 'black' }}>👎 {dislikes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostCard;

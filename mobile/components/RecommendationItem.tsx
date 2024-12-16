import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

interface RecommendationProps {
  rec: {
    type: string;
    spotifyId: string;
  };
}

const RecommendationItem: React.FC<RecommendationProps> = ({ rec }) => {
  const spotifyEmbedUrl = `https://open.spotify.com/embed/${rec.type}/${rec.spotifyId}`;

  const handlePress = () => {
    // Opens the Spotify link in a browser or Spotify app if installed
    const spotifyUrl = `https://open.spotify.com/${rec.type}/${rec.spotifyId}`;
    Linking.openURL(spotifyUrl).catch((err) => {
      console.error('Failed to open URL:', err);
    });
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: spotifyEmbedUrl }}
        style={styles.webview}
        // On iOS, this might need special config to allow inline media
        // For example: 
        // allowsInlineMediaPlayback
        // mediaPlaybackRequiresUserAction={false}
      />
      {/* Invisible overlay */}
      <TouchableOpacity style={styles.overlay} onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 230,
    height: 100,
  },
  webview: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    zIndex: 10,
  },
});

export default RecommendationItem;

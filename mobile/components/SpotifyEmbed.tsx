import React from 'react';
import { WebView } from 'react-native-webview';

const SpotifyEmbed = ({ type, spotifyId }) => {
  return (
    <WebView
      source={{ uri: `https://open.spotify.com/embed/${type}/${spotifyId}` }}
      style={{ height: 80, width: '100%' }}
    />
  );
};

export default SpotifyEmbed;

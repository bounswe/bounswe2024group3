import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import SpotifyEmbed from './SpotifyEmbed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

interface SearchCardProps {
  post: Post;
  isDarkTheme: boolean;
}

interface Post {
  id: number;
  title: string;
  username: string;
  type: string;
  spotifyId: string;
  content?: string; // Assuming there's content
  genres?: string[]; // Array of genres
}

const SearchCard: React.FC<SearchCardProps> = ({ post, isDarkTheme }) => {
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isLyricsLoading, setIsLyricsLoading] = useState<boolean>(false);
  const [showLyrics, setShowLyrics] = useState<boolean>(false);

  // Fetch lyrics from the API
  const fetchLyrics = async () => {
    try {
      setIsLyricsLoading(true);
      const spotifyUrl = `https://open.spotify.com/track/${post.spotifyId}`;
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}get_lyrics/`,
        { params: { spotify_url: spotifyUrl } }
      );
      setLyrics(data.lyrics);
    } catch (error) {
      console.error('Error fetching lyrics:', error);
      setLyrics('Failed to load lyrics. Please try again.');
    } finally {
      setIsLyricsLoading(false);
      setShowLyrics(true);
    }
  };

  // Define colors based on the theme
  const backgroundColor = isDarkTheme ? '#1e1e1e' : '#fff';
  const textColor = isDarkTheme ? '#fff' : '#000';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Title */}
      {post.title && (
        <Text style={[styles.title, { color: textColor }]}>{post.title}</Text>
      )}

      {/* Username */}
      <Text style={[styles.username, { color: textColor }]}>
        {post.username}
      </Text>

      {/* Spotify Embed */}
      <SpotifyEmbed type={post.type} spotifyId={post.spotifyId} />

      {/* Content */}
      {post.content && (
        <Text style={[styles.content, { color: textColor }]}>
          {post.content}
        </Text>
      )}

      {/* Genres */}
      {post.genres && post.genres.length > 0 && (
        <View style={styles.genresContainer}>
          <Text style={[styles.genresTitle, { color: textColor }]}>
            Genres:
          </Text>
          <View style={styles.genresList}>
            {post.genres.map((genre, index) => (
              <View key={index} style={[styles.genreChip, { borderColor: textColor }]}>
                <Text style={{ color: textColor }}>{genre}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Show Lyrics Button */}
      <View style={{ marginTop: 16 }}>
        {!showLyrics ? (
          <TouchableOpacity
            style={[
              styles.showLyricsButton,
              { borderColor: isDarkTheme ? '#fff' : '#333' },
            ]}
            onPress={fetchLyrics}
          >
            <Text style={{ color: textColor, fontWeight: 'bold' }}>
              Show lyrics
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.showLyricsButton,
              { borderColor: isDarkTheme ? '#fff' : '#333' },
            ]}
            onPress={() => setShowLyrics(false)}
          >
            <Text style={{ color: textColor, fontWeight: 'bold' }}>
              Hide lyrics
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lyrics Display */}
      {showLyrics && (
        <View style={{ marginTop: 16 }}>
          {isLyricsLoading ? (
            <ActivityIndicator size="small" color={isDarkTheme ? '#fff' : '#000'} />
          ) : (
            <Text style={{ color: textColor }}>{lyrics}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 }, // iOS shadow
    shadowOpacity: 0.2, // iOS shadow
    shadowRadius: 1.41, // iOS shadow
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  username: {
    fontWeight: '600',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    marginVertical: 8,
  },
  genresContainer: {
    marginTop: 16,
  },
  genresTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  genresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  showLyricsButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
});

export default SearchCard;
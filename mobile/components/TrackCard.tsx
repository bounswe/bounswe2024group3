// components/TrackCard.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TrackCard = ({ track, isDarkTheme }) => {
  const handlePress = () => {
    Linking.openURL(track.link).catch((err) => console.error("Failed to open URL:", err));
  };

  return (
    <View style={[styles.card, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="musical-notes-outline"
          size={24}
          color={isDarkTheme ? '#fff' : '#000'}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.description, { color: isDarkTheme ? '#fff' : '#000' }]}>
          {track.description || 'No Description'}
        </Text>
        <Text style={[styles.count, { color: isDarkTheme ? '#ccc' : '#555' }]}>
          Plays: {track.count}
        </Text>
        <TouchableOpacity onPress={handlePress}>
          <Text style={[styles.link, { color: '#1e90ff' }]}>
            Listen on Spotify
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2, // For Android
    shadowColor: '#000', // For iOS
    shadowOffset: { width: 0, height: 2 }, // For iOS
    shadowOpacity: 0.1, // For iOS
    shadowRadius: 4, // For iOS
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  count: {
    fontSize: 14,
    marginBottom: 8,
  },
  link: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default TrackCard;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

const SongQuizScreen = () => {
  const [lyricSnippet, setLyricSnippet] = useState('');
  const [options, setOptions] = useState([]);
  const [correctLink, setCorrectLink] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchQuizData = async () => {
    setLoading(true);
    setErrorMessage('');
    setSelectedOption(null);

    try {
      // Endpoint might be something like: /get_song_quiz_lyrics/
      const response = await axios.get(`${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}get_song_quiz_lyrics/`);

      const data = response.data;
      // If the response contains an error key
      if (data.error) {
        setErrorMessage(data.error);
      } else {
        setLyricSnippet(data.lyric_snippet);
        setOptions(data.options);
        setCorrectLink(data.correct_link);
      }
    } catch (error) {
      console.warn(error);
      setErrorMessage('Failed to fetch quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, []);

  const handleOptionPress = (optionLink) => {
    setSelectedOption(optionLink);
  };

  const renderOption = ({ item }) => {
    const isSelected = item.link === selectedOption;
    const isCorrect = selectedOption && selectedOption === correctLink && isSelected;

    return (
      <TouchableOpacity
        style={[
          styles.optionButton,
          isSelected && { backgroundColor: '#f0c0c0' }  // highlight if selected
        ]}
        onPress={() => handleOptionPress(item.link)}
      >
        <Text style={styles.optionText}>
          {item.name} - {item.artist}
        </Text>
        {/* Show "Correct" or "Wrong" if user has selected an option */}
        {selectedOption && isSelected && (
          <Text style={styles.feedbackText}>
            {isCorrect ? ' ✓ Correct!' : ' ✗ Wrong!'}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : (
        <>
          <Text style={styles.snippet}>{lyricSnippet}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item.link}
            renderItem={renderOption}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </>
      )}
      {/* Optionally, a button to fetch a new quiz question */}
      <TouchableOpacity style={styles.newQuizButton} onPress={fetchQuizData}>
        <Text style={styles.newQuizText}>New Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SongQuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snippet: {
    fontSize: 16,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  optionButton: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap'
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  },
  newQuizButton: {
    marginTop: 10,
    padding: 14,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center'
  },
  newQuizText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

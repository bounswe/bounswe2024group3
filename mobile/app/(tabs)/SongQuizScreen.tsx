import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import axios from 'axios';

const TOTAL_QUESTIONS = 5;

const SongQuizScreen = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [points, setPoints] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [lyricSnippet, setLyricSnippet] = useState('');
  const [options, setOptions] = useState([]);
  const [correctLink, setCorrectLink] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch a single quiz question
  const fetchQuizData = async () => {
    setLoading(true);
    setErrorMessage('');
    setSelectedOption(null);

    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}get_song_quiz_lyrics/`);

      const data = response.data;
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

  // Initialize the first question
  useEffect(() => {
    if (!quizCompleted) {
      fetchQuizData();
    }
  }, [currentQuestion, quizCompleted]);

  const handleOptionPress = (optionLink) => {
    if (selectedOption) {
      // Prevent multiple selections
      return;
    }

    setSelectedOption(optionLink);

    if (optionLink === correctLink) {
      setPoints(prevPoints => prevPoints + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < TOTAL_QUESTIONS) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(1);
    setPoints(0);
    setQuizCompleted(false);
    fetchQuizData();
  };

  const renderOption = ({ item }) => {
    const isSelected = item.link === selectedOption;
    const isCorrect = item.link === correctLink;

    // Determine the background color based on selection and correctness
    let backgroundColor = '#eee';
    if (selectedOption) {
      if (isSelected) {
        backgroundColor = isCorrect ? '#c0f0c0' : '#f0c0c0'; // Green for correct, red for wrong
      } else if (isCorrect) {
        backgroundColor = '#c0f0c0'; // Highlight correct answer
      }
    }

    return (
      <TouchableOpacity
        style={[
          styles.optionButton,
          { backgroundColor }
        ]}
        onPress={() => handleOptionPress(item.link)}
        disabled={!!selectedOption} // Disable options after selection
      >
        <Text style={styles.optionText}>
          {item.name} - {item.artist}
        </Text>
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

  if (quizCompleted) {
    return (
      <View style={styles.container}>
        <Text style={styles.summaryText}>Quiz Completed!</Text>
        <Text style={styles.scoreText}>You scored {points} out of {TOTAL_QUESTIONS}</Text>
        <TouchableOpacity style={styles.newQuizButton} onPress={handleRestartQuiz}>
          <Text style={styles.newQuizText}>Restart Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.progressText}>Question {currentQuestion} of {TOTAL_QUESTIONS}</Text>
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
      {selectedOption && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
          <Text style={styles.nextButtonText}>
            {currentQuestion < TOTAL_QUESTIONS ? 'Next Question' : 'See Results'}
          </Text>
        </TouchableOpacity>
      )}
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>Points: {points}</Text>
      </View>
    </View>
  );
};

export default SongQuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snippet: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
    flexWrap: 'wrap',
  },
  nextButton: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#28a745',
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newQuizButton: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  newQuizText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  pointsContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  scoreText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

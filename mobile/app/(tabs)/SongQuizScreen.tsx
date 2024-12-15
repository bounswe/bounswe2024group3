import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView 
} from 'react-native';
import axios from 'axios';

const QuizOptions = [1, 3, 5, 10];

const SongQuizScreen = () => {
  const [selectedQuizLength, setSelectedQuizLength] = useState(null); // Number of questions selected
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

  // Initialize the first question when quiz starts or currentQuestion changes
  useEffect(() => {
    if (selectedQuizLength && !quizCompleted) {
      fetchQuizData();
    }
  }, [currentQuestion, selectedQuizLength, quizCompleted]);

  // Handle user's option selection
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

  // Navigate to the next question or complete the quiz
  const handleNextQuestion = () => {
    if (currentQuestion < selectedQuizLength) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  // Restart the quiz by resetting all state variables
  const handleRestartQuiz = () => {
    setSelectedQuizLength(null);
    setCurrentQuestion(1);
    setPoints(0);
    setQuizCompleted(false);
    setLyricSnippet('');
    setOptions([]);
    setCorrectLink('');
    setSelectedOption(null);
    setErrorMessage('');
  };

  // Render each quiz option
  const renderOption = (item) => {
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
        key={item.link}
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

  // Render the selection screen
  const renderSelectionScreen = () => (
    <View style={styles.selectionContainer}>
      <Text style={styles.title}>Choose Quiz Length</Text>
      <ScrollView contentContainerStyle={styles.selectionButtonsContainer}>
        {QuizOptions.map((item) => (
          <TouchableOpacity 
            key={item}
            style={styles.selectionButton} 
            onPress={() => setSelectedQuizLength(item)}
          >
            <Text style={styles.selectionButtonText}>
              {item} Question{item > 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Render the quiz screen
  const renderQuizScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progressText}>Question {currentQuestion} of {selectedQuizLength}</Text>
        <Text style={styles.pointsText}>Points: {points}</Text>
      </View>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : (
        <>
          <Text style={styles.snippet}>{lyricSnippet}</Text>
          <View style={styles.optionsContainer}>
            {options.map(renderOption)}
          </View>
        </>
      )}
      {selectedOption && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
          <Text style={styles.nextButtonText}>
            {currentQuestion < selectedQuizLength ? 'Next Question' : 'See Results'}
          </Text>
        </TouchableOpacity>
      )}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </View>
  );

  // Render the results screen
  const renderResultsScreen = () => (
    <View style={styles.container}>
      <Text style={styles.summaryText}>Quiz Completed!</Text>
      <Text style={styles.scoreText}>You scored {points} out of {selectedQuizLength}</Text>
      <TouchableOpacity style={styles.newQuizButton} onPress={handleRestartQuiz}>
        <Text style={styles.newQuizText}>Restart Quiz</Text>
      </TouchableOpacity>
    </View>
  );

  // Main render logic
  if (!selectedQuizLength) {
    return renderSelectionScreen();
  }

  if (quizCompleted) {
    return renderResultsScreen();
  }

  return (
    <View style={styles.container}>
      {!loading && renderQuizScreen()}
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
  selectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  selectionButtonsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  selectionButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    marginBottom: 10,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  snippet: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
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
    marginTop: 30,
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
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25, // Half of ActivityIndicator size
    marginTop: -25,
    zIndex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});

// __tests__/SongQuizScreen.test.tsx

import React from 'react';
import { render, waitFor, fireEvent, act } from '@testing-library/react-native';
import SongQuizScreen from './SongQuizScreen'; // Adjust the import path as necessary
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock ActivityIndicator to reduce noise in tests
jest.mock('react-native/Libraries/Components/ActivityIndicator/ActivityIndicator', () => 'ActivityIndicator');

describe('SongQuizScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the quiz length selection screen initially', () => {
    const { getByText } = render(<SongQuizScreen />);
    expect(getByText('Choose Quiz Length')).toBeTruthy();
    QuizOptions.forEach((option) => {
      expect(getByText(`${option} Question${option > 1 ? 's' : ''}`)).toBeTruthy();
    });
  });

  it('fetches and displays the first quiz question upon selecting quiz length', async () => {
    // Mock the API response for fetching quiz data
    const mockQuizData = {
      lyric_snippet: 'This is a sample lyric snippet.',
      options: [
        { name: 'Song A', artist: 'Artist A', link: 'spotifyLinkA' },
        { name: 'Song B', artist: 'Artist B', link: 'spotifyLinkB' },
        { name: 'Song C', artist: 'Artist C', link: 'spotifyLinkC' },
        { name: 'Song D', artist: 'Artist D', link: 'spotifyLinkD' },
      ],
      correct_link: 'spotifyLinkA',
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockQuizData });

    const { getByText, queryByText } = render(<SongQuizScreen />);

    // Select quiz length
    const quizLengthButton = getByText('5 Questions');
    fireEvent.press(quizLengthButton);

    // Expect loading indicator to appear
    expect(queryByText('Failed to fetch quiz. Please try again.')).toBeNull();

    // Wait for the quiz data to load
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/get_song_quiz_lyrics/');
    });

    // Check if the lyric snippet and options are displayed
    expect(getByText('This is a sample lyric snippet.')).toBeTruthy();
    expect(getByText('Song A - Artist A')).toBeTruthy();
    expect(getByText('Song B - Artist B')).toBeTruthy();
    expect(getByText('Song C - Artist C')).toBeTruthy();
    expect(getByText('Song D - Artist D')).toBeTruthy();

    // Ensure the Next Question button is not visible yet
    expect(queryByText('Next Question')).toBeNull();
  });

  it('handles correct option selection and updates points', async () => {
    const mockQuizData = {
      lyric_snippet: 'This is a sample lyric snippet.',
      options: [
        { name: 'Song A', artist: 'Artist A', link: 'spotifyLinkA' },
        { name: 'Song B', artist: 'Artist B', link: 'spotifyLinkB' },
      ],
      correct_link: 'spotifyLinkA',
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockQuizData });

    const { getByText } = render(<SongQuizScreen />);

    // Select quiz length
    const quizLengthButton = getByText('3 Questions');
    fireEvent.press(quizLengthButton);

    // Wait for quiz data to load
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/get_song_quiz_lyrics/');
    });

    // Select the correct option
    const correctOption = getByText('Song A - Artist A');
    fireEvent.press(correctOption);

    // Next Question button should appear
    await waitFor(() => {
      expect(getByText('Next Question')).toBeTruthy();
    });

    // Points should be updated to 1
    const pointsText = getByText('Points: 1');
    expect(pointsText).toBeTruthy();
  });

  it('handles incorrect option selection without updating points', async () => {
    const mockQuizData = {
      lyric_snippet: 'Another sample lyric snippet.',
      options: [
        { name: 'Song X', artist: 'Artist X', link: 'spotifyLinkX' },
        { name: 'Song Y', artist: 'Artist Y', link: 'spotifyLinkY' },
      ],
      correct_link: 'spotifyLinkX',
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockQuizData });

    const { getByText } = render(<SongQuizScreen />);

    // Select quiz length
    const quizLengthButton = getByText('1 Question');
    fireEvent.press(quizLengthButton);

    // Wait for quiz data to load
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/get_song_quiz_lyrics/');
    });

    // Select the incorrect option
    const incorrectOption = getByText('Song Y - Artist Y');
    fireEvent.press(incorrectOption);

    // Next Question button should appear
    await waitFor(() => {
      expect(getByText('See Results')).toBeTruthy();
    });

    // Points should remain 0
    const pointsText = getByText('Points: 0');
    expect(pointsText).toBeTruthy();
  });

  it('completes the quiz and displays the results screen', async () => {
    const mockQuizData = {
      lyric_snippet: 'Lyric snippet for question 1.',
      options: [
        { name: 'Song A', artist: 'Artist A', link: 'spotifyLinkA' },
        { name: 'Song B', artist: 'Artist B', link: 'spotifyLinkB' },
      ],
      correct_link: 'spotifyLinkA',
    };

    const mockQuizData2 = {
      lyric_snippet: 'Lyric snippet for question 2.',
      options: [
        { name: 'Song C', artist: 'Artist C', link: 'spotifyLinkC' },
        { name: 'Song D', artist: 'Artist D', link: 'spotifyLinkD' },
      ],
      correct_link: 'spotifyLinkD',
    };

    // First question
    mockedAxios.get.mockResolvedValueOnce({ data: mockQuizData });

    const { getByText, queryByText } = render(<SongQuizScreen />);

    // Select quiz length
    const quizLengthButton = getByText('2 Questions');
    fireEvent.press(quizLengthButton);

    // Wait for first question to load
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/get_song_quiz_lyrics/');
    });

    // Select correct option for first question
    const correctOption1 = getByText('Song A - Artist A');
    fireEvent.press(correctOption1);

    // Click Next Question
    const nextQuestionButton = getByText('Next Question');
    fireEvent.press(nextQuestionButton);

    // Mock the second question's API response
    mockedAxios.get.mockResolvedValueOnce({ data: mockQuizData2 });

    // Wait for second question to load
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(mockedAxios.get).toHaveBeenLastCalledWith('http://localhost:8000/api/get_song_quiz_lyrics/');
    });

    // Select correct option for second question
    const correctOption2 = getByText('Song D - Artist D');
    fireEvent.press(correctOption2);

    // Click See Results
    const seeResultsButton = getByText('See Results');
    fireEvent.press(seeResultsButton);

    // Verify results screen
    await waitFor(() => {
      expect(getByText('Quiz Completed!')).toBeTruthy();
      expect(getByText('You scored 2 out of 2')).toBeTruthy();
      expect(getByText('Restart Quiz')).toBeTruthy();
    });
  });

  it('restarts the quiz correctly when Restart Quiz is pressed', async () => {
    const mockQuizData = {
      lyric_snippet: 'Lyric snippet for question 1.',
      options: [
        { name: 'Song A', artist: 'Artist A', link: 'spotifyLinkA' },
        { name: 'Song B', artist: 'Artist B', link: 'spotifyLinkB' },
      ],
      correct_link: 'spotifyLinkA',
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockQuizData });

    const { getByText, queryByText } = render(<SongQuizScreen />);

    // Select quiz length
    const quizLengthButton = getByText('1 Question');
    fireEvent.press(quizLengthButton);

    // Wait for quiz data to load
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/get_song_quiz_lyrics/');
    });

    // Select an option
    const option = getByText('Song A - Artist A');
    fireEvent.press(option);

    // Click Next Question
    const nextQuestionButton = getByText('See Results');
    fireEvent.press(nextQuestionButton);

    // Verify results screen
    await waitFor(() => {
      expect(getByText('Quiz Completed!')).toBeTruthy();
    });

    // Click Restart Quiz
    const restartButton = getByText('Restart Quiz');
    fireEvent.press(restartButton);

    // Verify that we're back to the selection screen
    await waitFor(() => {
      expect(getByText('Choose Quiz Length')).toBeTruthy();
      expect(queryByText('Quiz Completed!')).toBeNull();
    });
  });

  it('displays an error message when fetching quiz data fails', async () => {
    // Mock API failure
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    const { getByText, queryByText } = render(<SongQuizScreen />);

    // Select quiz length
    const quizLengthButton = getByText('3 Questions');
    fireEvent.press(quizLengthButton);

    // Wait for API call to fail
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8000/api/get_song_quiz_lyrics/');
    });

    // Check for error message
    expect(getByText('Failed to fetch quiz. Please try again.')).toBeTruthy();

    // Ensure no options are displayed
    expect(queryByText('This is a sample lyric snippet.')).toBeNull();
  });
});

// __tests__/recommendations.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CombinedPosts from '../(tabs)/recommendations'; // adjust path as needed
import axios from 'axios';

// Mock axios so we don't make real requests
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CombinedPosts Component', () => {
  // Mock data returned by the backend
  const mockPosts = [
    {
      id: 1,
      comment: 'Mock Comment 1',
      username: 'User1',
      content: { content_type: 'track', link: 'https://open.spotify.com/track/mockID1' },
      total_likes: 5,
      total_dislikes: 1,
      created_at: '2024-01-01T12:00:00Z',
    },
    {
      id: 2,
      comment: 'Mock Comment 2',
      username: 'User2',
      content: { content_type: 'album', link: 'https://open.spotify.com/album/mockID2' },
      total_likes: 8,
      total_dislikes: 2,
      created_at: '2024-01-02T12:00:00Z',
    },
    {
      id: 3,
      comment: 'Mock Comment 3',
      username: 'User3',
      content: { content_type: 'artist', link: 'https://open.spotify.com/artist/mockID3' },
      total_likes: 3,
      total_dislikes: 0,
      created_at: '2024-01-03T12:00:00Z',
    },
    {
      id: 4,
      comment: 'Mock Comment 4',
      username: 'User4',
      content: { content_type: 'track', link: 'https://open.spotify.com/track/mockID4' },
      total_likes: 1,
      total_dislikes: 0,
      created_at: '2024-01-04T12:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Set environment variable if needed. The component references `process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL`
    process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL = 'https://mock-backend.com/';

    // Default mock for axios GET request
    mockedAxios.get.mockResolvedValue({
      data: {
        posts: mockPosts
      }
    });
  });

  it('renders successfully and fetches random posts on mount', async () => {
    const { getByText } = render(<CombinedPosts />);

    // Verifies the fetch call used the correct endpoint
    expect(mockedAxios.get).toHaveBeenCalledWith('https://mock-backend.com/get-posts/');

    // Wait for random posts to be displayed; they are pulled from the 4 mockPosts, but only 3 displayed.
    // We can't predict the order, but if the data is valid, we can see some text from any of the comments.
    await waitFor(() => {
      // Check that at least one known post comment is on screen (since 3 of 4 will show up)
      expect(getByText(/Mock Comment /)).toBeTruthy();
    });
  });

  it('displays an error message if the data is not an array', async () => {
    // Make the endpoint return a non-array
    mockedAxios.get.mockResolvedValue({ data: { posts: null } });

    const { getByText } = render(<CombinedPosts />);

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(getByText('Posts data is not an array.')).toBeTruthy();
    });
  });

  it('displays an error message if the request fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    const { getByText } = render(<CombinedPosts />);

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(getByText('Failed to fetch posts.')).toBeTruthy();
    });
  });

  it('refreshes posts when refresh icon is pressed', async () => {
    const { getByTestId } = render(<CombinedPosts />);

    // Wait for initial load
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

    // We assume the refresh icon has a testID, or we can identify by accessibilityLabel
    // If not, you can wrap the TouchableOpacity in a testID or locate by Ionicon name
    const refreshButton = getByTestId('refresh-icon'); 
    fireEvent.press(refreshButton);

    // fetchRandomPosts called again
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });

  it('toggles between dark and light theme on pressing the theme icon', async () => {
    const { getByTestId, getByText } = render(<CombinedPosts />);

    // Wait for initial fetch
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

    // Press the theme toggle
    const themeToggleButton = getByTestId('theme-icon');
    fireEvent.press(themeToggleButton);

    // No direct textual confirmation that theme changed, but this ensures no error is thrown.
    // Optionally, if you have a style or UI element that changes, you could test that as well.
  });
});
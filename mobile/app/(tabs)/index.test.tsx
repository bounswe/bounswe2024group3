// __tests__/index.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../(tabs)/index';
import axios from 'axios';

// Mock axios so we don't actually make real network requests
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

/**
 * A helper function to provide mock data for posts
 */
const mockPosts = [
  {
    id: 1,
    comment: 'Mock Comment 1',
    username: 'User1',
    content: {
      content_type: 'track',
      link: 'https://open.spotify.com/track/mockSpotifyId1',
    },
    total_likes: 10,
    total_dislikes: 2,
    created_at: '2024-01-01T12:00:00Z',
  },
  {
    id: 2,
    comment: 'Mock Comment 2',
    username: 'User2',
    content: {
      content_type: 'album',
      link: 'https://open.spotify.com/album/mockSpotifyId2',
    },
    total_likes: 5,
    total_dislikes: 1,
    created_at: '2024-01-02T12:00:00Z',
  },
];

/**
 * We can set a default mock resolved value for "get" calls.
 * This simulates a successful HTTP request returning a `posts` array.
 */
mockedAxios.get.mockResolvedValue({
  data: {
    posts: mockPosts,
  },
});

describe('App (index.tsx)', () => {
  beforeEach(() => {
    // Clear all mock calls and instances between tests
    jest.clearAllMocks();

    // If needed, set the environment variable for each test.
    // This ensures the correct URL is used in the component calls.
    process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL = 'https://mock-backend.com/';
  });

  it('renders correctly and fetches All Posts on mount', async () => {
    const { getByText } = render(<App />);

    // On mount, fetchAllPosts should be called once
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://mock-backend.com/get-posts/'
    );

    // Wait until the posts are rendered. Check if expected UI elements appear.
    await waitFor(() => {
      expect(getByText('Mock Comment 1')).toBeTruthy();
      expect(getByText('Mock Comment 2')).toBeTruthy();
    });
  });

  it('toggles theme when pressing the theme icon', () => {
    const { getByRole, getByTestId } = render(<App />);

    /**
     * NOTE: The Ionicons component doesn't come with a built-in testID,
     * so you may want to wrap it in a <View testID="theme-icon"> or similar.
     *
     * For demonstration, let's assume you added `testID="theme-icon"` to the icon button.
     *
     *   <TouchableOpacity onPress={toggleTheme} style={styles.iconButton} testID="theme-icon">
     *     <Ionicons ... />
     *   </TouchableOpacity>
     */
    const themeToggle = getByTestId('theme-icon');

    // Initially, isDarkTheme = false. Press the icon to toggle.
    fireEvent.press(themeToggle);

    // We don’t have an immediate textual or UI sign that the theme changed,
    // but we can test side effects or style changes if needed. For now, this ensures no errors.
  });

  it('calls fetchAllPosts when pressing the "All Posts" button', async () => {
    const { getByText } = render(<App />);
    const allPostsButton = getByText('All Posts');

    // Clear previous calls from the initial mount fetch
    mockedAxios.get.mockClear();

    // Press the "All Posts" button
    fireEvent.press(allPostsButton);

    // Now fetchAllPosts is called again
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://mock-backend.com/get-posts/'
    );
  });

  it('calls fetchFollowingPosts when pressing the "Following" button', async () => {
    const { getByText } = render(<App />);
    const followingButton = getByText('Following');

    // Clear out the initial fetch call from mount
    mockedAxios.get.mockClear();

    // Press the "Following" button
    fireEvent.press(followingButton);

    // Check that we called the correct endpoint
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://mock-backend.com/get-following-posts/'
    );
  });

  it('opens the CreatePostModal when floating button is pressed', () => {
    const { getByText, queryByText } = render(<App />);

    // The modal has a prop isVisible={isModalVisible}.
    // By default, isModalVisible is false, so let's check the modal is not in the tree initially.
    expect(queryByText('Create a New Post')).toBeNull(); // or whatever text indicates the modal is open

    // Press the floating button (the text is not guaranteed; if you have testID, use that)
    const floatingButton = getByText('+');
    fireEvent.press(floatingButton);

    // Now the modal should appear
    // For demonstration, let's assume your <CreatePostModal> shows "Create a New Post" text
    // when it's visible.
    expect(queryByText('Create a New Post')).toBeTruthy();
  });

  it('calls fetchAllPosts after a post is created', async () => {
    const { getByText, queryByText } = render(<App />);

    // Press the floating button to open the modal
    const floatingButton = getByText('+');
    fireEvent.press(floatingButton);

    // After the post is created, the onPostCreated callback calls fetchAllPosts
    // Typically the modal might have a "Submit" or "Post" button that triggers onPostCreated
    // For demonstration, let's assume there's a "Submit" button.
    // We'll mock the axios call and close the modal.
    mockedAxios.get.mockClear();

    // Simulate pressing "Submit" in the modal
    // In your CreatePostModal component, you might have a button with the text "Submit"
    const submitButton = queryByText('Submit');
    if (submitButton) {
      fireEvent.press(submitButton);
    }

    // Wait for the fetchAllPosts call
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://mock-backend.com/get-posts/'
      );
    });
  });
});
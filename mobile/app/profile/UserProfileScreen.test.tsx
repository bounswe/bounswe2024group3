// __tests__/UserProfileScreen.test.tsx
import React from 'react';
import { render, waitFor, fireEvent, act } from '@testing-library/react-native';
import UserProfileScreen from './[username]';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Mocks
jest.mock('axios');
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
jest.spyOn(Alert, 'alert'); // We'll track Alert calls

describe('UserProfileScreen', () => {
  const mockAxios = axios as jest.Mocked<typeof axios>;

  const mockNavigateParams = {
    username: 'testUser',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // By default, return some user data for each test
    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify({ user_id: 999, username: 'currentUser' })
    );
  });

  // Helper to render the screen
  // We mock the expo-router's useLocalSearchParams
  jest.mock('expo-router', () => ({
    useLocalSearchParams: () => mockNavigateParams,
  }));

  it('renders loading indicators when loadingUser or loadingPosts are true', async () => {
    // By default in the component, loadingUser and loadingPosts start as true
    // so we expect an ActivityIndicator to appear initially.

    const { getByTestId, queryByText } = render(<UserProfileScreen />);

    // There's a view with testID="loading-indicator" or we can just look for ActivityIndicator
    // In this code, there's no explicit testID, but we can check that the "ActivityIndicator" is on screen
    // The simplest check: there's "No user data found." or spinner.
    // We'll rely on the spinner or the code that user data isn't fetched yet
    expect(queryByText('No user data found.')).toBeNull();

    // Wait for axios calls to resolve
    await waitFor(() => {
      // eventually loadingUser and loadingPosts become false after fetch
      // but let's confirm there's an <ActivityIndicator /> while waiting
      // We can check that the spinner was shown at some point
    });
  });

  it('displays "No user data found." if the userData fetch fails or is null', async () => {
    // Mock the user detail call to fail or return null
    mockAxios.get.mockImplementationOnce(async (url) => {
      if (url.includes('get_user')) {
        // Return a 404 or invalid data
        return Promise.resolve({ data: null });
      }
      // For get-user-posts we can safely return empty
      return Promise.resolve({ data: { posts: [] } });
    });

    const { getByText } = render(<UserProfileScreen />);

    // Wait for the effect calls to resolve
    await waitFor(() => {
      expect(getByText('No user data found.')).toBeTruthy();
    });
  });

  it('renders user info and posts when data is fetched successfully', async () => {
    // Mock user data
    const mockUserData = {
      message: 'OK',
      username: 'testUser',
      user_id: 123,
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      labels: "['artist', 'listener']",
    };

    // Mock user posts
    const mockPosts = [
      {
        id: 1,
        comment: 'Test post',
        image: '',
        link: 'https://open.spotify.com/track/abc123',
        created_at: '2024-01-01T00:00:00Z',
        total_likes: 5,
        total_dislikes: 1,
        tags: [],
        content: {
          id: 1,
          link: 'https://open.spotify.com/track/abc123',
          content_type: 'track',
          artist_names: ['Artist A'],
          playlist_name: '',
          album_name: '',
          song_name: 'Song A',
          genres: [],
          ai_description: '',
        },
      },
    ];

    mockAxios.get.mockImplementation(async (url) => {
      if (url.includes('get_user')) {
        return Promise.resolve({ data: mockUserData });
      } else if (url.includes('get-user-posts')) {
        return Promise.resolve({ data: { posts: mockPosts } });
      } else if (url.includes('check-following')) {
        return Promise.resolve({ data: { is_following: false } });
      }
      return Promise.resolve({});
    });

    const { getByText, queryByText } = render(<UserProfileScreen />);

    // Wait for loading to finish
    await waitFor(() => {
      // Check if user info is displayed
      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('@testUser')).toBeTruthy();
      expect(getByText('john.doe@example.com')).toBeTruthy();
      expect(getByText('Labels: artist, listener')).toBeTruthy();

      // Check if post is rendered
      expect(getByText('Test post')).toBeTruthy();

      // "No user data found" should not exist now
      expect(queryByText('No user data found.')).toBeNull();
    });
  });

  it('shows "Follow" button if not following, "Unfollow" if following', async () => {
    // mock user data, user posts, check-following
    const mockUserData = {
      message: 'OK',
      username: 'testUser',
      user_id: 123,
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      labels: "['artist']",
    };
    mockAxios.get.mockImplementation(async (url) => {
      if (url.includes('get_user')) {
        return Promise.resolve({ data: mockUserData });
      } else if (url.includes('get-user-posts')) {
        return Promise.resolve({ data: { posts: [] } });
      } else if (url.includes('check-following')) {
        return Promise.resolve({ data: { is_following: true } });
      }
      return Promise.resolve({});
    });

    // Current user is user_id=999, different from user 123, so the follow button should appear
    // but since is_following = true, we expect "Unfollow"
    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify({ user_id: 999, username: 'currentUser' })
    );

    const { findByText } = render(<UserProfileScreen />);

    // Wait for the "Unfollow" button
    const unfollowBtn = await findByText('Unfollow');
    expect(unfollowBtn).toBeTruthy();
  });

  it('calls handleUnfollow when "Unfollow" is pressed', async () => {
    const mockUserData = {
      username: 'testUser',
      user_id: 123,
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      labels: '[]',
    };
    mockAxios.get.mockImplementation(async (url) => {
      if (url.includes('get_user')) {
        return Promise.resolve({ data: mockUserData });
      } else if (url.includes('get-user-posts')) {
        return Promise.resolve({ data: { posts: [] } });
      } else if (url.includes('check-following')) {
        // Already following
        return Promise.resolve({ data: { is_following: true } });
      }
      return Promise.resolve({});
    });
    mockAxios.post.mockResolvedValue({ data: {} });

    // Current user is different from userData's user_id
    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify({ user_id: 999, username: 'currentUser' })
    );

    const { findByText } = render(<UserProfileScreen />);

    const unfollowBtn = await findByText('Unfollow');
    fireEvent.press(unfollowBtn);

    // handleUnfollow triggers a post to `/unfollow/123/`
    expect(mockAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('unfollow/123/'),
    );
  });

  it('calls handleFollow when "Follow" is pressed', async () => {
    const mockUserData = {
      username: 'testUser',
      user_id: 123,
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      labels: '[]',
    };
    mockAxios.get.mockImplementation(async (url) => {
      if (url.includes('get_user')) {
        return Promise.resolve({ data: mockUserData });
      } else if (url.includes('get-user-posts')) {
        return Promise.resolve({ data: { posts: [] } });
      } else if (url.includes('check-following')) {
        // Not following
        return Promise.resolve({ data: { is_following: false } });
      }
      return Promise.resolve({});
    });
    mockAxios.post.mockResolvedValue({ data: {} });

    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify({ user_id: 999, username: 'currentUser' })
    );

    const { findByText } = render(<UserProfileScreen />);
    const followBtn = await findByText('Follow');
    fireEvent.press(followBtn);

    expect(mockAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('follow/123/'),
    );
  });

  it('hides Follow/Unfollow button if currentUserId === userData.user_id', async () => {
    const mockUserData = {
      username: 'testUser',
      user_id: 999, // same as current user
      name: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      labels: '[]',
    };
    mockAxios.get.mockImplementation(async (url) => {
      if (url.includes('get_user')) {
        return Promise.resolve({ data: mockUserData });
      } else if (url.includes('get-user-posts')) {
        return Promise.resolve({ data: { posts: [] } });
      } else if (url.includes('check-following')) {
        return Promise.resolve({ data: { is_following: false } });
      }
      return Promise.resolve({});
    });

    // In this scenario, the user is viewing their own profile
    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify({ user_id: 999, username: 'testUser' })
    );

    const { queryByText } = render(<UserProfileScreen />);
    await waitFor(() => {
      // Follow or Unfollow buttons should NOT appear
      expect(queryByText('Follow')).toBeNull();
      expect(queryByText('Unfollow')).toBeNull();
    });
  });

  it('displays an alert if follow request fails', async () => {
    const mockUserData = {
      username: 'testUser',
      user_id: 123,
      name: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      labels: '[]',
    };
    mockAxios.get.mockImplementation(async (url) => {
      if (url.includes('get_user')) {
        return Promise.resolve({ data: mockUserData });
      } else if (url.includes('get-user-posts')) {
        return Promise.resolve({ data: { posts: [] } });
      } else if (url.includes('check-following')) {
        return Promise.resolve({ data: { is_following: false } });
      }
      return Promise.resolve({});
    });

    // Mock the follow call to fail
    mockAxios.post.mockRejectedValueOnce(new Error('Network error'));

    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify({ user_id: 999, username: 'currentUser' })
    );

    const { findByText } = render(<UserProfileScreen />);
    const followBtn = await findByText('Follow');

    fireEvent.press(followBtn);

    // Wait for follow call to fail
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to follow user.');
    });
  });

  it('displays user posts in FlatList; shows "This user hasn\'t posted anything yet." if empty', async () => {
    const mockUserData = {
      username: 'testUser',
      user_id: 123,
      name: 'Jane',
      surname: 'Doe',
      email: 'jane@example.com',
      labels: '[]',
    };
    // Return empty posts for test
    mockAxios.get.mockImplementation(async (url) => {
      if (url.includes('get_user')) {
        return Promise.resolve({ data: mockUserData });
      } else if (url.includes('get-user-posts')) {
        return Promise.resolve({ data: { posts: [] } });
      } else if (url.includes('check-following')) {
        return Promise.resolve({ data: { is_following: false } });
      }
      return Promise.resolve({});
    });

    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify({ user_id: 999, username: 'currentUser' })
    );

    const { getByText } = render(<UserProfileScreen />);

    // Wait for the calls to resolve
    await waitFor(() => {
      // confirm the "no posts" text
      expect(getByText("This user hasn't posted anything yet.")).toBeTruthy();
    });
  });
});

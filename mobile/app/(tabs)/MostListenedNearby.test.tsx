// __tests__/MostListenedNearby.test.tsx

import React from 'react';
import { render, waitFor, fireEvent, act } from '@testing-library/react-native';
import MostListenedNearby from './MostListenedNearby'; // Updated import path
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock PostCard component to simplify tests
jest.mock('../../components/PostCard', () => {
  return ({ post }: { post: any }) => (
    <Text testID={`PostCard-${post.id}`}>{post.title}</Text>
  );
});

describe('MostListenedNearby', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a loading indicator initially', () => {
    const { getByTestId } = render(<MostListenedNearby />);
    const activityIndicator = getByTestId('loading-indicator');
    expect(activityIndicator).toBeTruthy();
  });

  it('fetches and displays most listened data', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation(() =>
      Promise.resolve(null)
    );

    const mockListenedData = {
      tracks: [
        { link: 'https://open.spotify.com/track/abc123', count: 5 },
        { link: 'https://open.spotify.com/track/def456', count: 3 },
      ],
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockListenedData });

    const { getByText } = render(<MostListenedNearby />);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:8000/api/most-listened-nearby/?latitude=41.080895&longitude=29.0343434&radius=10'
      );
    });

    expect(getByText('Track')).toBeTruthy(); // Mocked PostCard renders 'Track'
  });

  it('switches tabs and fetches "Most Shared" data', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation(() =>
      Promise.resolve(null)
    );

    const mockSharedData = {
      songs: [
        {
          link: 'https://open.spotify.com/track/ghi789',
          song_name: 'Song X',
          artist_names: ['Artist X'],
          album_name: 'Album X',
          description: 'Popular song.',
          share_count: 10,
        },
      ],
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockSharedData });

    const { getByText } = render(<MostListenedNearby />);

    const sharedButton = getByText('Most Shared');
    fireEvent.press(sharedButton);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:8000/api/most-shared-nearby-things/?latitude=41.080895&longitude=29.0343434&radius=10'
      );
    });

    expect(getByText('Song X')).toBeTruthy();
    expect(getByText('Popular song.')).toBeTruthy();
  });

  it('displays error message when API call fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    const { getByText } = render(<MostListenedNearby />);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
      expect(getByText('Failed to fetch data.')).toBeTruthy();
    });
  });

  it('displays empty state when no data is available', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { tracks: [] } });

    const { getByText } = render(<MostListenedNearby />);

    await waitFor(() => {
      expect(getByText('No tracks found nearby.')).toBeTruthy();
    });
  });

  it('refreshes data on pull-to-refresh', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { tracks: [] } });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        tracks: [{ link: 'https://open.spotify.com/track/xyz789', count: 8 }],
      },
    });

    const { getByTestId, getByText } = render(<MostListenedNearby />);

    const flatList = getByTestId('NearbyFlatList');
    fireEvent(flatList, 'refresh');

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(getByText('Track')).toBeTruthy();
    });
  });
});

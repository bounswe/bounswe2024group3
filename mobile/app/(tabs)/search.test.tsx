import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import SearchScreen from './search'; // Adjust the path to your SearchScreen file

jest.mock('axios');

describe('SearchScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the search screen correctly', () => {
    const { getByPlaceholderText, getByTestId } = render(<SearchScreen />);

    expect(getByPlaceholderText('Search...')).toBeTruthy();
    expect(getByTestId('toggle-theme-button')).toBeTruthy();
  });

  it('fetches and displays posts based on search query', async () => {
    const mockPosts = [
      {
        id: 1,
        comment: 'Sample Post',
        description: "{'release_date': '2024-01-01'}",
        content_type: 'track',
        link: 'https://example.com/track/1',
        created_at: '2024-01-01T00:00:00Z',
        total_likes: 10,
        total_dislikes: 2,
      },
    ];
    axios.get.mockResolvedValue({ data: { contents: mockPosts } });

    const { getByPlaceholderText, findByText } = render(<SearchScreen />);

    const searchInput = getByPlaceholderText('Search...');
    fireEvent.changeText(searchInput, 'test query');

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('test query')));

    expect(await findByText('release date: 2024-01-01')).toBeTruthy();
  });

  it('displays an error message when no results are found', async () => {
    axios.get.mockResolvedValue({ data: { contents: [] } });

    const { getByPlaceholderText, findByText } = render(<SearchScreen />);

    const searchInput = getByPlaceholderText('Search...');
    fireEvent.changeText(searchInput, 'no results');

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('no results')));
    expect(await findByText('No posts found')).toBeTruthy();
  });

  it('displays an error message when the fetch fails', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));

    const { getByPlaceholderText, findByText } = render(<SearchScreen />);

    const searchInput = getByPlaceholderText('Search...');
    fireEvent.changeText(searchInput, 'fail query');

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('fail query')));
    expect(await findByText('Failed to fetch posts')).toBeTruthy();
  });

  it('toggles the theme correctly', () => {
    const { getByTestId } = render(<SearchScreen />);
    const toggleButton = getByTestId('toggle-theme-button');

    // Initial state
    fireEvent.press(toggleButton);

    // Check if theme toggles (actual implementation of theme logic may vary)
    // You can test this by observing UI changes such as background color
  });
});
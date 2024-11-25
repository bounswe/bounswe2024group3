// App.test.js

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from './App';
import { mockPosts } from '../../pages/mockPosts';
import { Text } from 'react-native';

// Mock the PostCard component
jest.mock('../../components/PostCard', () => {
  return ({ post }) => <Text>{post.title}</Text>;
});

// Mock the Ionicons component
jest.mock('@expo/vector-icons', () => {
  return {
    Ionicons: ({ name, color }) => <Text>{name}</Text>,
  };
});

// Mock SafeAreaView if necessary
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, style }) => <View style={style}>{children}</View>,
  };
});

describe('App Component', () => {
  it('renders the initial UI correctly', () => {
    const { getByText, getAllByText } = render(<App />);

    // Check that the theme icon is rendered
    expect(getByText('moon-outline')).toBeTruthy();

    // Check that the correct number of posts are rendered
    const postTitles = mockPosts.map((post) => post.title);
    const renderedPosts = getAllByText((content) => postTitles.includes(content));
    expect(renderedPosts.length).toBe(mockPosts.length);
  });

  it('toggles theme when the theme button is pressed', () => {
    const { getByText, queryByText } = render(<App />);

    // Initially, the theme icon should be 'moon-outline'
    expect(getByText('moon-outline')).toBeTruthy();

    // Press the theme toggle button
    fireEvent.press(getByText('moon-outline'));

    // After toggling, the theme icon should be 'sunny-outline'
    expect(queryByText('moon-outline')).toBeNull();
    expect(getByText('sunny-outline')).toBeTruthy();
  });

  it('renders PostCard components with correct props', () => {
    const { getAllByText } = render(<App />);

    // Check that all PostCard components are rendered with correct titles
    const postTitles = mockPosts.map((post) => post.title);
    const renderedPosts = getAllByText((content) => postTitles.includes(content));
    expect(renderedPosts.length).toBe(mockPosts.length);
  });
});

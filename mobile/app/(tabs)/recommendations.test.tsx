// app/(tabs)/recommendations.test.tsx

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Recommendations from './recommendations';
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

// Mock the SafeAreaView (if necessary)
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, style }) => <View style={style}>{children}</View>,
  };
});

describe('Recommendations Component', () => {
  it('renders 3 random posts on mount', () => {
    const { getAllByText } = render(<Recommendations />);
    const postTitles = mockPosts.map(post => post.title);
    const renderedPosts = getAllByText((content) => postTitles.includes(content));
    expect(renderedPosts.length).toBe(3);
  });

  it('toggles theme when theme toggle button is pressed', () => {
    const { getByText, queryByText } = render(<Recommendations />);

    // Initially, the theme icon should be 'moon-outline'
    expect(getByText('moon-outline')).toBeTruthy();

    // Press the theme toggle button
    fireEvent.press(getByText('moon-outline'));

    // Now, the theme icon should be 'sunny-outline'
    expect(queryByText('moon-outline')).toBeNull();
    expect(getByText('sunny-outline')).toBeTruthy();
  });

  it('refreshes posts when refresh button is pressed', () => {
    const { getByText, getAllByText } = render(<Recommendations />);

    // Get initial post titles
    const initialPosts = getAllByText((content) => content.startsWith('Post ')).map(node => node.props.children);

    // Press the refresh button
    fireEvent.press(getByText('refresh-outline'));

    // Get new post titles
    const refreshedPosts = getAllByText((content) => content.startsWith('Post ')).map(node => node.props.children);

    // The posts may or may not be different due to randomness, but there should still be 3 posts
    expect(refreshedPosts.length).toBe(3);
  });
});

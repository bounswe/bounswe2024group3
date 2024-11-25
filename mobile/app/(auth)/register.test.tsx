import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Register from './register';
import { req } from '../../utils/client';

// Mock the `req` function to simulate API requests
jest.mock('../../utils/client', () => ({
  req: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

describe('Register Component', () => {
  it('renders the registration form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<Register />);

    // Check if all input fields and the Register button are rendered
    expect(getByPlaceholderText('Name')).toBeTruthy();
    expect(getByPlaceholderText('Surname')).toBeTruthy();
    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Register')).toBeTruthy();
  });

  it('displays an error when required fields are empty', async () => {
    const { getByText, findByText } = render(<Register />);

    // Trigger the registration process with empty fields
    fireEvent.press(getByText('Register'));

    // Expect an error to be displayed
    expect(await findByText(/an error occurred/i)).toBeTruthy();
  });

  it('calls the API with correct data when form is submitted', async () => {
    const { getByPlaceholderText, getByText } = render(<Register />);

    // Fill out the form
    fireEvent.changeText(getByPlaceholderText('Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Surname'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Username'), 'johndoe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'johndoe@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    // Select roles
    fireEvent.press(getByText('⬜️ Artist')); // Toggle the checkbox

    // Mock successful API response
    (req as jest.Mock).mockResolvedValueOnce({});

    // Submit the form
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      // Check if the API was called with the correct data
      expect(req).toHaveBeenCalledWith('register', 'post', {
        name: 'John',
        surname: 'Doe',
        email: 'johndoe@example.com',
        username: 'johndoe',
        password: 'password123',
        labels: ['artist'],
      });
    });
  });

  it('handles API errors gracefully', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<Register />);

    // Fill out the form
    fireEvent.changeText(getByPlaceholderText('Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Surname'), 'Doe');
    fireEvent.changeText(getByPlaceholderText('Username'), 'johndoe');
    fireEvent.changeText(getByPlaceholderText('Email'), 'johndoe@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    // Mock API error response
    (req as jest.Mock).mockRejectedValueOnce(new Error('Registration failed'));

    // Submit the form
    fireEvent.press(getByText('Register'));

    // Expect an error message to be displayed
    expect(await findByText('Registration failed')).toBeTruthy();
  });
});
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from './login';
import { req } from '../../utils/client';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';

jest.mock('../../utils/client', () => ({
  req: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../context/UserContext', () => ({
  useUser: jest.fn(),
}));

describe('Login Component', () => {
  const mockSetUsername = jest.fn();
  const mockSetUserId = jest.fn();
  const mockSetEmail = jest.fn();
  const mockSetLatitude = jest.fn();
  const mockSetLongitude = jest.fn();
  const mockLogin = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      setUsername: mockSetUsername,
      setUserId: mockSetUserId,
      setEmail: mockSetEmail,
      setLatitude: mockSetLatitude,
      setLongitude: mockSetLongitude,
    });

    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    );

    expect(getByPlaceholderText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText("Don't have an account? Register")).toBeTruthy();
  });

  it('displays an error when login fails', async () => {
    (req as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

    const { getByPlaceholderText, getByText, findByText } = render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Username'), 'invaliduser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');
    fireEvent.press(getByText('Login'));

    expect(await findByText('Login failed. Please try again.')).toBeTruthy();
    expect(req).toHaveBeenCalledWith('login', 'post', {
      username: 'invaliduser',
      password: 'wrongpassword',
    });
  });

  it('calls API and navigates to home on successful login', async () => {
    (req as jest.Mock).mockResolvedValueOnce({
      data: {
        user_id: '12345',
        email: 'user@example.com',
        latitude: 40.7128,
        longitude: -74.006,
      },
    });

    const { getByPlaceholderText, getByText } = render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    );

    fireEvent.changeText(getByPlaceholderText('Username'), 'validuser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'correctpassword');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(req).toHaveBeenCalledWith('login', 'post', {
        username: 'validuser',
        password: 'correctpassword',
      });

      expect(mockSetUsername).toHaveBeenCalledWith('validuser');
      expect(mockSetUserId).toHaveBeenCalledWith('12345');
      expect(mockSetEmail).toHaveBeenCalledWith('user@example.com');
      expect(mockSetLatitude).toHaveBeenCalledWith(40.7128);
      expect(mockSetLongitude).toHaveBeenCalledWith(-74.006);

      expect(mockLogin).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith({ pathname: '/(tabs)' });
    });
  });

  it('shows a loading indicator while logging in', async () => {
    const { getByText, getByPlaceholderText, queryByTestId } = render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    );

    (req as jest.Mock).mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 1000)));

    fireEvent.changeText(getByPlaceholderText('Username'), 'loadinguser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'loadingpassword');
    fireEvent.press(getByText('Login'));

    expect(queryByTestId('ActivityIndicator')).toBeTruthy();

    await waitFor(() => {
      expect(queryByTestId('ActivityIndicator')).toBeFalsy();
    });
  });
});
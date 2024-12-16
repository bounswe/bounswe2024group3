// app/profile/[username].tsx

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!username) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_REACT_APP_BACKEND_URL}get_user?username=${username}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text>No user data found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Text>Username: {userData.username}</Text>
      <Text>Name: {userData.name} {userData.surname}</Text>
      <Text>Email: {userData.email}</Text>
      <Text>Labels: {userData.labels}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    marginBottom: 12,
    fontWeight: 'bold',
  },
});

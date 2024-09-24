import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');

const UserSearchPage = ({ query: initialQuery, results: initialResults = [] }) => {
  const [query, setQuery] = useState(initialQuery);
  const [input, setInput] = useState('');
  const [results, setResults] = useState(initialResults); // State to manage results
  const [isLoading, setIsLoading] = useState(false);
  const [followStatus, setFollowStatus] = useState({}); // State to manage follow status

  const handleQuery = async () => {
    setIsLoading(true);
    const searchEndpoint = 'http://207.154.246.225/api/';

    try {
      const response = await axios.get(`${searchEndpoint}search_users/?query=${encodeURIComponent(input)}`);
      if (response.data.message === 'Users retrieved successfully') {
        console.log('search successful');
        console.log(response.data.users);
        setResults(response.data.users); // Update results using setState
      } else {
        console.log(response.data.message || 'Failed to search');
        throw new Error(response.data.message || 'Failed to search');
      }
    } catch (error) {
      console.error('search Error:', error);
      Alert.alert('search Error', error.message || 'An error occurred during search');
    }
    setIsLoading(false);
  };

  const handleFollowUnfollow = async (userId) => {
    try {
      const response = await axios.post(`http://207.154.246.225/api/follow_unfollow_user/`, {
        target_user_id: userId
      });
      console.log(response.data);
      if (response.data.message === 'Successfully unfollowed user' || response.data.message === 'Successfully followed user') {
        // Toggle follow status without checking any condition
        setFollowStatus((prevStatus) => ({
          ...prevStatus,
          [userId]: !prevStatus[userId], // Toggle follow status
        }));
      } else {
        console.error('Failed to follow/unfollow the user');
      }
    } catch (error) {
      console.error('Error following/unfollowing the user:', error);

    }

  };

  const renderUsers = () => {
    return results.map((user, index) => (
      <View key={index} style={styles.userContainer}>
        <Text style={styles.userInfo}>Name: {user.name}</Text>
        <Text style={styles.userInfo}>Username: {user.username}</Text>
        <TouchableOpacity
          style={followStatus[user.user_id] ? styles.unfollowButton : styles.followButton}
          onPress={() => handleFollowUnfollow(user.user_id)}
        >
          <Text style={styles.buttonText}>
            {followStatus[user.user_id] ? 'Unfollow' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputButtonRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Browse Users"
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleQuery}>
          <Text style={styles.buttonText}>Browse!</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <ScrollView style={styles.resultsContainer}>
          {Array.isArray(results) && results.length > 0 ? renderUsers() : <Text>No users found. Try a different search!</Text>}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const colors = {
  primary: '#F8F4E1',
  secondary: '#AF8F6F',
  third: '#74512D',
  fourth: '#543310',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  inputButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  input: {
    height: 40,
    borderColor: colors.third,
    borderWidth: 1,
    flex: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  resultsContainer: {
    paddingHorizontal: 20,
  },
  userContainer: {
    borderWidth: 1,
    borderColor: colors.third,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  userInfo: {
    fontSize: 18,
    color: colors.third,
  },
  followButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  unfollowButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default UserSearchPage;

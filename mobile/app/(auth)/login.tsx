import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, ActivityIndicator } from "react-native";
import { useUser } from "../../context/UserContext";
import { AuthContext } from '../../context/AuthContext';
import { req } from "../../utils/client";
import { Link } from "expo-router";
import { useRouter } from 'expo-router';

export default function Login() {
  const { setUsername, setUserId, setEmail, setLatitude, setLongitude } = useUser();
  const [username, setUsernameInput] = useState("");
  const [password, setPasswordInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = React.useContext(AuthContext);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      let response = await req("login", "post", {
        username: username,
        password: password,
      });
      const { user_id, email, latitude, longitude } = response.data;

      setUsername(username);
      setUserId(user_id);
      setEmail(email);
      setLatitude(latitude || 0);
      setLongitude(longitude || 0);

      console.log("Login successful");
      // Navigate to the home page after successful login
      router.replace({ pathname: "/(tabs)" });
      login();

    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsernameInput}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPasswordInput}
        style={styles.input}
        secureTextEntry
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
        <Link href="/register" style={styles.link}>
        Don't have an account? Register
      </Link>

      {/* <Link href="/forgot-password" style={styles.link}>
        Forgot password?
      </Link> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { height: 50, borderColor: "#ccc", borderWidth: 1, marginBottom: 12, paddingHorizontal: 10 },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
  link: { color: "blue", textAlign: "center", marginTop: 20 },
});
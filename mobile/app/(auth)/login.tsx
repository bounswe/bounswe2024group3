// app/(auth)/login.tsx

import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { req } from "../../utils/client";
import { AuthContext } from "../../context/AuthContext";
import { Link, useRouter } from "expo-router";

export default function Login() {
  const [username, setUsernameInput] = useState("");
  const [password, setPasswordInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const router = useRouter();
  const { login } = useContext(AuthContext); // Destructure directly for clarity

  const handleLogin = async () => {
    // Basic validation
    if (!username.trim() || !password.trim()) {
      setLocalError("Username and password are required.");
      return;
    }

    setIsLoading(true);
    setLocalError("");

    try {
      const response = await req("login", "post", {
        username,
        password,
      });

      // Destructure response data
      const { user_id, email, name, surname, labels } = response.data;
      console.log("User data:", user_id, email, name, surname, labels);

      // Ensure labels is a proper array
      let parsedLabels = [];
      if (typeof labels === "string") {
        // Replace single quotes with double quotes and parse
        parsedLabels = JSON.parse(labels.replace(/'/g, '"'));
      } else if (Array.isArray(labels)) {
        parsedLabels = labels;
      }

      // **Include `username` in userData**
      const userData = {
        user_id,
        username, // Added username from state
        email,
        name,
        surname,
        labels: parsedLabels,
      };

      // Store userData in AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      console.log("Login successful");

      // Navigate to the main app (assuming /(tabs) is your main app)
      router.replace("/(tabs)");
      login(); // Update AuthContext
    } catch (err) {
      setLocalError("Login failed. Please check your credentials and try again.");
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
        autoCorrect={false}
        keyboardType="default"
        returnKeyType="next"
        onSubmitEditing={() => {
          // Focus the password input when username is submitted
          passwordInputRef.current?.focus();
        }}
        blurOnSubmit={false}
      />
      <TextInput
        ref={passwordInputRef}
        placeholder="Password"
        value={password}
        onChangeText={setPasswordInput}
        style={styles.input}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />
      {localError ? <Text style={styles.error}>{localError}</Text> : null}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
      <Link href="/register" style={styles.link}>
        Don't have an account? Register
      </Link>
    </View>
  );
}

// Create a ref for the password input to handle focus
import { useRef } from "react";
import { TextInput as RNTextInput } from "react-native";

const passwordInputRef = React.createRef<RNTextInput>();

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 20, backgroundColor: "#f9f9f9" },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
  link: { color: "blue", textAlign: "center", marginTop: 20 },
  loader: { marginVertical: 20 },
});

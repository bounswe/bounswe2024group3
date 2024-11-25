import React, { useState } from "react";
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
  const { login } = React.useContext(AuthContext);

  const handleLogin = async () => {
    setIsLoading(true);
    setLocalError("");
    try {
      const response = await req("login", "post", {
        username,
        password,
      });
  
      const { user_id, email, name, surname, labels } = response.data;
      console.log("User data:", user_id, email, name, surname, labels);
  
      // Ensure labels is a proper array
      let parsedLabels = [];
      if (typeof labels === "string") {
        parsedLabels = labels.replace(/'/g, '"'); // Replace single quotes with double quotes
        parsedLabels = JSON.parse(parsedLabels); // Parse the corrected string
      } else if (Array.isArray(labels)) {
        parsedLabels = labels;
      }
  
      const userData = {
        user_id,
        email,
        name,
        surname,
        labels: parsedLabels,
      };
  
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
  
      console.log("Login successful");
  
      router.replace("/(tabs)");
      login();
    } catch (err) {
      setLocalError("Login failed. Please try again.");
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
      {localError && <Text style={styles.error}>{localError}</Text>}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
      <Link href="/register" style={styles.link}>
        Don't have an account? Register
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
  link: { color: "blue", textAlign: "center", marginTop: 20 },
});
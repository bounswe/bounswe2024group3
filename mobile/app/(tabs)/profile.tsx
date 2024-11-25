import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Profile() {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          setUserData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      router.replace("/login");
    } catch (error) {
      console.error("Failed to clear user data:", error);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No user data found.</Text>
        <Button title="Go to Login" onPress={() => router.replace("/login")} />
      </View>
    );
  }

  const renderRoles = () => {
    if (userData.labels && Array.isArray(userData.labels)) {
      return userData.labels.map((role: string, index: number) => (
        <View key={index} style={styles.roleBadge}>
          <Text style={styles.roleText}>{role}</Text>
        </View>
      ));
    }
    return <Text style={styles.infoText}>No roles assigned</Text>;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome to your profile, {userData.name} {userData.surname}!
      </Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>User ID:</Text> {userData.user_id}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Email:</Text> {userData.email}
        </Text>

        <Text style={styles.label}>Roles:</Text>
        <View style={styles.rolesContainer}>{renderRoles()}</View>
      </View>

      <Button title="Logout" onPress={handleLogout} color="#ff5c5c" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  infoContainer: {
    marginBottom: 20,
    width: "100%",
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  rolesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  roleBadge: {
    backgroundColor: "#007bff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 5,
  },
  roleText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});
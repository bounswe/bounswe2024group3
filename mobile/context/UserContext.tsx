import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext<{
  setError: (message: string) => void;
  curError: string | null;
  username: string;
  userId: number;
  email: string;
  latitude: number;
  longitude: number;
  setUsername: (username: string) => void;
  setUserId: (userId: number) => void;
  setEmail: (email: string) => void;
  setLatitude: (latitude: number) => void;
  setLongitude: (longitude: number) => void;
}>({
  setError: (error: string) => {},
  curError: "",
  username: "",
  userId: 0,
  email: "",
  latitude: 0,
  longitude: 0,
  setUsername: (username: string) => {},
  setUserId: (userId: number) => {},
  setEmail: (email: string) => {},
  setLatitude: (latitude: number) => {},
  setLongitude: (longitude: number) => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string>("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [curError, setError] = useState<string>("");
  const [userId, setUserId] = useState<number>(0);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        const storedLatitude = await AsyncStorage.getItem("latitude");
        const storedLongitude = await AsyncStorage.getItem("longitude");
        const storedEmail = await AsyncStorage.getItem("email");
        const storedUserId = await AsyncStorage.getItem("userId");

        if (storedUsername) setUsername(storedUsername);
        if (storedLatitude) setLatitude(parseFloat(storedLatitude));
        if (storedLongitude) setLongitude(parseFloat(storedLongitude));
        if (storedEmail) setEmail(storedEmail);
        if (storedUserId) setUserId(Number(storedUserId));
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const saveUserData = async () => {
      try {
        if (username) {
          await AsyncStorage.setItem("username", username);
          await AsyncStorage.setItem("email", email);
          await AsyncStorage.setItem("userId", userId.toString());
          if (latitude && longitude) {
            await AsyncStorage.setItem("latitude", latitude.toString());
            await AsyncStorage.setItem("longitude", longitude.toString());
          } else {
            await AsyncStorage.removeItem("latitude");
            await AsyncStorage.removeItem("longitude");
          }
        } else {
          await AsyncStorage.removeItem("username");
          await AsyncStorage.removeItem("email");
          await AsyncStorage.removeItem("userId");
          await AsyncStorage.removeItem("latitude");
          await AsyncStorage.removeItem("longitude");
        }
      } catch (error) {
        console.error("Failed to save user data:", error);
      }
    };

    saveUserData();
  }, [username, email, userId, latitude, longitude]);

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        userId,
        setUserId,
        email,
        setEmail,
        curError,
        setError,
        latitude,
        setLatitude,
        longitude,
        setLongitude,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
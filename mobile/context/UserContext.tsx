import React, { createContext, useContext, useState, useEffect } from "react";

type UserContextType = {
  username: string;
  userId: number;
  email: string;
  latitude: number;
  longitude: number;
  labels: string[];
  curError: string | null;
  setUsername: (username: string) => void;
  setUserId: (userId: number) => void;
  setEmail: (email: string) => void;
  setLatitude: (latitude: number) => void;
  setLongitude: (longitude: number) => void;
  setLabels: (labels: string[]) => void;
  setError: (error: string) => void;
  clearUserData: () => void;
};

export const UserContext = createContext<UserContextType>({
  username: "",
  userId: 0,
  email: "",
  latitude: 0,
  longitude: 0,
  labels: [],
  curError: null,
  setUsername: () => {},
  setUserId: () => {},
  setEmail: () => {},
  setLatitude: () => {},
  setLongitude: () => {},
  setLabels: () => {},
  setError: () => {},
  clearUserData: () => {},
});

// export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {

  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [labels, setLabels] = useState<string[]>([]);
  const [curError, setError] = useState<string | null>(null);

  const clearUserData = () => {
    setUsername("");
    setUserId(0);
    setEmail("");
    setLatitude(0);
    setLongitude(0);
    setLabels([]);
    setError(null);
  };

  useEffect(() => {
    console.log("User Context Updated:", {
      username,
      email,
      userId,
      latitude,
      longitude,
    });
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
        latitude,
        setLatitude,
        longitude,
        setLongitude,
        labels,
        setLabels,
        curError,
        setError,
        clearUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
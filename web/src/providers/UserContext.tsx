import { createContext, useContext, useState,useEffect } from "react";

const UserContext = createContext<{
  setError: (message: string) => void;
  curError: string | null;
  username: string;
  userId: number;
  email: string;
  setUsername: (username: string) => void;
  setUserId: (userId: number) => void;
  setEmail: (email: string) => void;
}>({
  setError: (error: string) => {},
  curError: "",
  username: "",
  userId: 0,
  email: "",
  setUsername: (username: string) => {},
  setUserId: (userId: number) => {},
  setEmail: (email: string) => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: any }) => {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [curError, setError] = useState("");
  const [userId, setUserId] = useState(0);
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (username) localStorage.setItem("username", username);
    else localStorage.removeItem("username");
  }, [username]);

  return (
    <UserContext.Provider value={{ username, setUsername, userId, setUserId, email, setEmail, curError, setError }}>
      {children}
    </UserContext.Provider>
  );
};
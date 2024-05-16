import { createContext, useContext, useState } from "react";

const UserContext = createContext<{
  setError: (message: string) => void;
  curError: string | null;
  username: string;
  userId: number;
  setUsername: (username: string) => void;
  setUserId: (userId: number) => void;
}>({
  setError: (error: string) => {},
  curError: "",
  username: "",
  userId: 0,
  setUsername: (username: string) => {},
  setUserId: (userId: number) => {}
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: any }) => {
  const [username, setUsername] = useState("");
  const [curError, setError] = useState("");
  const [userId, setUserId] = useState(0);

  return (
    <UserContext.Provider value={{ username, setUsername, userId, setUserId, curError, setError }}>
      {children}
    </UserContext.Provider>
  );
};

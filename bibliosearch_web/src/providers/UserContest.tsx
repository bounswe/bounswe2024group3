import { createContext, useContext, useState } from "react";

const UserContext = createContext<{
  setError: (message: string) => void;
  curError: string | null;
  username: string;
  setUsername: (username: string) => void;
}>({
  setError: (error: string) => {},
  curError: "",
  username: "",
  setUsername: (username: string) => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: any }) => {
  const [username, setUsername] = useState("");
  const [curError, setError] = useState("");

  return (
    <UserContext.Provider value={{ username, setUsername, curError, setError }}>
      {children}
    </UserContext.Provider>
  );
};

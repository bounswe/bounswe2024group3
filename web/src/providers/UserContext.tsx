import { createContext, useContext, useState,useEffect } from "react";

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

export const UserProvider = ({ children }: { children: any }) => {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [latitude, setLatitude] = useState<number>(parseFloat(localStorage.getItem("latitude") || "0"));
  const [longitude, setLongitude] = useState<number>(parseFloat(localStorage.getItem("longitude") || "0"));
  const [curError, setError] = useState("");
  const [userId, setUserId] = useState(0);
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (username){ 
      localStorage.setItem("username", username);
      if (latitude && longitude){  
        localStorage.setItem("latitude", latitude.toString());
        localStorage.setItem("longitude", longitude.toString());      
      }  else{ 
        localStorage.removeItem("latitude");
        localStorage.removeItem("longitude");
      }
    }
    else {
      localStorage.removeItem("username");
      localStorage.removeItem("latitude");
      localStorage.removeItem("longitude");
      } 
    }, [username]);

  return (
    <UserContext.Provider value={{ username, setUsername, userId, setUserId, email, setEmail, curError, setError, latitude, setLatitude, longitude, setLongitude }}>
      {children}
    </UserContext.Provider>
  );
};
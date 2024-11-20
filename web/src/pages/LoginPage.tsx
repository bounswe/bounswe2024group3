import React, { useState } from "react";
import FormInput from "../components/FormInput";
import { req } from "../utils/client";
import { useNavigate } from "react-router-dom";
import { useUser } from "../providers/UserContext";

import useAccessibility from "../components/Accessibility";

import LocationFetcher from "../components/LocationFetcher";


const LoginPage = () => {
  useAccessibility();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { setUsername: setGlobalUsername } = useUser();
  const { setUserId: setGlobalUserId } = useUser();
  const { setEmail: setGlobalEmail } = useUser();

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response = await req("login", "post", {
        username: username,
        password: password,
      });
      console.log("Login Successful", response.data);
      localStorage.setItem("username", username);
      setGlobalUsername(username);
      setGlobalUserId(response.data.user_id);
      setGlobalEmail(response.data.email);

      setIsLoggedIn(true); // Trigger location fetching
      navigate("/");
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error.message);
    }
  };

  const navigateToResetRequest = () => {
    navigate("/request-reset");
  };

  return (
    <form className="flex flex-col gap-4 p-4" onSubmit={handleLogin}>
      <FormInput
        icon="user"
        type="user"
        placeholder="username"
        value={username}
        onChange={(e: any) => setUsername(e.target.value)}
        aria-label="Username"
      />
      <FormInput
        icon="password"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e: any) => setPassword(e.target.value)}
        aria-label="Password"
      />
      <button type="submit" className="btn btn-primary mt-4" aria-label="Submit">
        Login
      </button>
      <button
        type="button"
        className="btn btn-secondary mt-4"
        onClick={navigateToResetRequest}
        aria-label="Forgot Password?"
      >
        Forgot Password?
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {isLoggedIn && <LocationFetcher />} {/* Only rendered after login */}
    </form>
  );
};

export default LoginPage;

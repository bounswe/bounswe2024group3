import React, { useState } from "react";
import FormInput from "../components/FormInput";
import { req } from "../utils/client";
import { useNavigate } from "react-router-dom";
import { useUser } from "../providers/UserContext";

import useAccessibility from "../components/Accessibility";
import { fetchLocation } from "../components/LocationFetcher";

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

      await fetchLocation();

      setGlobalUsername(username);
      setGlobalUserId(response.data.user_id);
      setGlobalEmail(response.data.email);

      setIsLoggedIn(true);
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
    <form
      className="flex flex-col gap-4 p-4"
      onSubmit={handleLogin}
      aria-labelledby="login-form-title"
    >
      <h1 id="login-form-title" className="text-2xl font-bold mb-4">
        Login
      </h1>
      <FormInput
        icon="user"
        type="user"
        placeholder="Username"
        value={username}
        onChange={(e: any) => setUsername(e.target.value)}
        aria-label="Enter your username"
      />
      <FormInput
        icon="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e: any) => setPassword(e.target.value)}
        aria-label="Enter your password"
      />
      <button
        type="submit"
        className="btn btn-primary mt-4"
        aria-label="Log in to your account"
      >
        Login
      </button>
      <button
        type="button"
        className="btn btn-secondary mt-4"
        onClick={navigateToResetRequest}
        aria-label="Forgot your password? Reset it here."
      >
        Forgot Password?
      </button>

      {error && (
        <p className="text-red-500" role="alert">
          {error}
        </p>
      )}
    </form>
  );
};

export default LoginPage;

import React, { useState } from "react";
import FormInput from "../components/FormInput";
import { req } from "../utils/client";
import { useUser } from "../providers/UserContest";

const LoginPage = () => {
  const [username, setUsername] = useState("asd");
  const [password, setPassword] = useState("asd");
  const [error, setError] = useState("");
  const { setUsername: setGlobalUsername } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response = await req("login", "post", {
        username: username,
        password: password,
      });
      console.log("Login Successful", response.data);
      setGlobalUsername(username);
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error.message);
    }
  };

  return (
    <form className="flex flex-col gap-4 p-4" onSubmit={handleLogin}>
      <FormInput
        icon="user"
        type="user"
        placeholder="username"
        value={username}
        onChange={(e: any) => setUsername(e.target.value)}
      />
      <FormInput
        icon="password"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e: any) => setPassword(e.target.value)}
      />
      <button type="submit" className="btn btn-primary mt-4">
        Login
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default LoginPage;
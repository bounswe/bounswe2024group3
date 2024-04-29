import React, { useState } from "react";
import SvgIcon from "../components/SvgIcon";
import { req } from "../utils/client";

const LoginPage = () => {
  const [username, setUsername] = useState("asd");
  const [password, setPassword] = useState("asd");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response = await req("login", "post", {
        username: username,
        password: password,
      });
      console.log("Login Successful", response.data);
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error.message);
    }
  };

  return (
    <form className="flex flex-col gap-4 p-4" onSubmit={handleLogin}>
      <label className="input input-bordered flex items-center gap-2">
        <SvgIcon icon="user" />
        <input
          type="text"
          className="grow"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label className="input input-bordered flex items-center gap-2">
        <SvgIcon icon="password" />
        <input
          type="password"
          className="grow"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit" className="btn btn-primary mt-4">
        Login
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default LoginPage;

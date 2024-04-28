import React, { useState } from "react";
import axios from "axios";
import SvgIcon from "../components/SvgIcon";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        process.env.REACT_APP_LOGIN_ENDPOINT || "",
        {
          username: username,
          password: password,
        }
      );
      console.log("Login Successful", response.data);
      // Handle further actions here after successful login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form className="flex flex-col gap-4 p-4" onSubmit={handleLogin}>
      <label className="input input-bordered flex items-center gap-2">
        <SvgIcon icon = "user"/>
        <input
          type="text"
          className="grow"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="input input-bordered flex items-center gap-2">
      <SvgIcon icon = "user"/>

        <input
          type="text"
          className="grow"
          placeholder="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
      </label>
      <label className="input input-bordered flex items-center gap-2">
      <SvgIcon icon = "email"/>

        <input
          type="text"
          className="grow"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="input input-bordered flex items-center gap-2">
      <SvgIcon icon = "user"/>

        <input
          type="text"
          className="grow"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label className="input input-bordered flex items-center gap-2">
      <SvgIcon icon = "password"/>

        <input
          type="password"
          className="grow"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit" className="btn btn-primary mt-4">
        Register
      </button>
    </form>
  );
};

export default RegisterPage;

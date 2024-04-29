import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SvgIcon from "../components/SvgIcon";
import { req } from "../utils/client";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("asdd");
  const [surname, setSurname] = useState("asdd");
  const [email, setEmail] = useState("asdd@gmail.com");
  const [username, setUsername] = useState("asd");
  const [password, setPassword] = useState("asd");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await req("register", "post", {
        name: name,
        surname: surname,
        email: email,
        username: username,
        password: password,
      });
      navigate("/login");
    } catch (error: any) {
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
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="input input-bordered flex items-center gap-2">
        <SvgIcon icon="user" />

        <input
          type="text"
          className="grow"
          placeholder="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
      </label>
      <label className="input input-bordered flex items-center gap-2">
        <SvgIcon icon="email" />

        <input
          type="text"
          className="grow"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
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
        Register
      </button>
      <p className="text-red-500">{error}</p>
    </form>
  );
};

export default RegisterPage;

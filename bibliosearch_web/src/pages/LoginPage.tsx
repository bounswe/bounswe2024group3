import React, { useState } from "react";
import axios from "axios";
import FormInput from "../components/FormInput";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/login",
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
      <FormInput icon= "user" type="user" placeholder ="username" value ={username} onChange ={(e:any) => setUsername(e.target.value)} /> 
      <FormInput icon= "password" type = "password" placeholder ="password" value ={password} onChange ={(e:any) => setPassword(e.target.value)} /> 
      <button type="submit" className="btn btn-primary mt-4">
        Login
      </button>
    </form>
  );
};

export default LoginPage;

import React, { useState } from "react";
import axios from "axios";
import FormInput from "../components/FormInput";

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
      <FormInput icon= "user" type="text" placeholder ="Name" value ={name} onChange ={(e:any) => setName(e.target.value)} /> 
      <FormInput icon= "user" type="text" placeholder ="Surname" value ={surname} onChange ={(e:any) => setSurname(e.target.value)} /> 
      <FormInput icon= "email" type="text" placeholder ="Email" value ={email} onChange ={(e:any) => setEmail(e.target.value)} /> 
      <FormInput icon= "user" type="text" placeholder ="Username" value ={username} onChange ={(e:any) => setUsername(e.target.value)} /> 
      <FormInput icon= "password" type="text" placeholder ="Password" value ={password} onChange ={(e:any) => setPassword(e.target.value)} /> 

      <button type="submit" className="btn btn-primary mt-4">
        Register
      </button>
    </form>
  );
};

export default RegisterPage;

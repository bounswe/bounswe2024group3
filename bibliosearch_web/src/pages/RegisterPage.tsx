import React, { useState } from "react";
import FormInput from "../components/FormInput";
import { useNavigate } from "react-router-dom";
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
      <FormInput icon= "user" type="text" placeholder ="Name" value ={name} onChange ={(e:any) => setName(e.target.value)} /> 
      <FormInput icon= "user" type="text" placeholder ="Surname" value ={surname} onChange ={(e:any) => setSurname(e.target.value)} /> 
      <FormInput icon= "email" type="text" placeholder ="Email" value ={email} onChange ={(e:any) => setEmail(e.target.value)} /> 
      <FormInput icon= "user" type="text" placeholder ="Username" value ={username} onChange ={(e:any) => setUsername(e.target.value)} /> 
      <FormInput icon= "password" type="text" placeholder ="Password" value ={password} onChange ={(e:any) => setPassword(e.target.value)} /> 
      <button type="submit" className="btn btn-primary mt-4">
        Register
      </button>
      <p className="text-red-500">{error}</p>
    </form>
  );
};

export default RegisterPage;

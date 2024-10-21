import React, { useState } from "react";
import FormInput from "../components/FormInput";
import { useNavigate } from "react-router-dom";
import { req } from "../utils/client";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [labels, setLabels] = useState<string[]>([]);

  const [error, setError] = useState("");
 
  const handleCheckboxChange = (value:any) => {
    setLabels((prevLabels) =>
      prevLabels.includes(value)
        ? prevLabels.filter((label) => label !== value)
        : [...prevLabels, value]
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await req('register' , 'post', {
        name: name,
        surname: surname,
        email: email,
        username: username,
        password: password,
        labels : labels
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
      <FormInput icon= "email" type="email" placeholder ="Email" value ={email} onChange ={(e:any) => setEmail(e.target.value)} /> 
      <FormInput icon= "user" type="text" placeholder ="Username" value ={username} onChange ={(e:any) => setUsername(e.target.value)} /> 
      <FormInput icon= "password" type="password" placeholder ="Password" value ={password} onChange ={(e:any) => setPassword(e.target.value)} /> 
      <p className="text-lg font-bold text-slate-950" >Select Roles </p>
        <div >
          <ul>
            <li>
              <label>
                <input
                  type="checkbox"
                  value="Artist"
                  checked={labels.includes('Artist')}
                  onChange={() => handleCheckboxChange('Artist')}
                />
                Artist
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  value="Hobbyist"
                  checked={labels.includes('Hobbyist')}
                  onChange={() => handleCheckboxChange('Hobbyist')}
                />
                Hobbyist
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  value="Listener"
                  checked={labels.includes('Listener')}
                  onChange={() => handleCheckboxChange('Listener')}
                />
                Listener
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  value="Organizer"
                  checked={labels.includes('Organizer')}
                  onChange={() => handleCheckboxChange('Organizer')}
                />
                Organizer
              </label>
            </li>
          </ul>
        </div>
      <button type="submit" className="btn btn-primary mt-4">
        Register
      </button>
      <p className="text-red-500">{error}</p>
    </form>
  );
};

export default RegisterPage;
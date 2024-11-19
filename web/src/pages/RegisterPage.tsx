import React, { useState } from "react";
import FormInput from "../components/FormInput";
import { useNavigate } from "react-router-dom";
import { req } from "../utils/client";
import useAccessibility from "../components/Accessibility";

const RegisterPage = () => {
  useAccessibility();
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
      <FormInput icon= "user" type="text" placeholder ="Name" value ={name} onChange ={(e:any) => setName(e.target.value)} aria-label="Name" /> 
      <FormInput icon= "user" type="text" placeholder ="Surname" value ={surname} onChange ={(e:any) => setSurname(e.target.value)} aria-label="Surname" /> 
      <FormInput icon= "email" type="email" placeholder ="Email" value ={email} onChange ={(e:any) => setEmail(e.target.value)} aria-label="Email" /> 
      <FormInput icon= "user" type="text" placeholder ="Username" value ={username} onChange ={(e:any) => setUsername(e.target.value)} aria-label="Username" /> 
      <FormInput icon= "password" type="password" placeholder ="Password" value ={password} onChange ={(e:any) => setPassword(e.target.value)} aria-label="Password" /> 
      <p tabIndex={0} className="text-lg font-bold text-slate-950" aria-label="Select Role">Select Roles </p>
        <div >
          <ul>
            <li>
              <label>
                <input
                  type="checkbox"
                  value="Artist"
                  checked={labels.includes('Artist')}
                  onChange={() => handleCheckboxChange('Artist')}
                  aria-label="Artist"
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
                  aria-label="Hobbyist"
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
                  aria-label="Listener"
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
                  aria-label="Organizer"
                />
                Organizer
              </label>
            </li>
          </ul>
        </div>
      <button type="submit" className="btn btn-primary mt-4" aria-label="submit">
        Register
      </button>
      <p className="text-red-500">{error}</p>
    </form>
  );
};

export default RegisterPage;
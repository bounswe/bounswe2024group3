import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarAccount from "./NavbarAccount";
import { useUser } from "../providers/UserContext";

const Header = () => {
  const { username } = useUser();

  const navigate = useNavigate();


  return (
    <div className="navbar bg-base-100 shadow-xl rounded-box">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl" to="/">
          Spot On
        </Link>
      </div>  
        {// going to change this part when userContext is active
        }
      <div><NavbarAccount username={username} /></div>
      
    </div>
  );
};

export default Header;

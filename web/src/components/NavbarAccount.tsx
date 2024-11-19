import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { req } from "../utils/client";
import { useUser } from "../providers/UserContext";
import useAccessibility from "./Accessibility";

type NavbarAccountProps = {
  username: string;
};

const NavbarAccount = ({ username }: NavbarAccountProps) => {
  const navigate = useNavigate();
  const { setUsername, setError } = useUser();
  useAccessibility();

  const logout = async () => {
    try {
      await req("logout", "post", {});
    } catch (error: any) {
      console.error("Logout failed:", error);
      setError(error.message);
    }
    setUsername("");
    localStorage.clear();  // Clear all localStorage data (or selectively remove keys)

    navigate("/");
  };

  if (username !== "") {
    return (
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <img alt={username} src="https://i.pravatar.cc/300" />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
        >
          <li>
            <Link to="/profile" aria-label="profile">Profile</Link>
          </li>
          <li>
            <Link to="/settings" aria-label="settings">Settings</Link>
          </li>
          <li>
            <Link to="/" onClick={logout} aria-label="Logout">
              Logout
            </Link>
          </li>
        </ul>
      </div>
    );
  } else {
    return (
      <ul className="menu menu-horizontal px-1">
        <li>
          <Link to="/login" aria-label="Login">Login</Link>
        </li>
        <li>
          <Link to="/register" aria-label="Register">Register</Link>
        </li>
      </ul>
    );
  }
};

export default NavbarAccount;
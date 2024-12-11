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
    localStorage.clear(); // Clear all localStorage data (or selectively remove keys)

    navigate("/");
  };

  if (username !== "") {
    return (
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          aria-haspopup="menu"
          aria-expanded="false"
          className="btn btn-ghost btn-circle avatar"
          aria-label="User menu"
        >
          <div className="w-10 rounded-full">
            <img
              alt={`Avatar of ${username}`}
              src="https://i.pravatar.cc/300"
              aria-hidden="true"
            />
          </div>
        </div>
        <ul
          tabIndex={0}
          role="menu"
          className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          aria-label="User options menu"
        >
          <li role="none">
            <Link to="/profile" role="menuitem" aria-label="Go to Profile">
              Profile
            </Link>
          </li>
          <li role="none">
            <Link to="/settings" role="menuitem" aria-label="Go to Settings">
              Settings
            </Link>
          </li>
          <li role="none">
            <Link to="/" onClick={logout} role="menuitem" aria-label="Logout">
              Logout
            </Link>
          </li>
        </ul>
      </div>
    );
  } else {
    return (
      <ul
        className="menu menu-horizontal px-1"
        role="menu"
        aria-label="Navigation menu"
      >
        <li role="none">
          <Link to="/login" role="menuitem" aria-label="Go to Login">
            Login
          </Link>
        </li>
        <li role="none">
          <Link to="/register" role="menuitem" aria-label="Go to Register">
            Register
          </Link>
        </li>
      </ul>
    );
  }
};

export default NavbarAccount;

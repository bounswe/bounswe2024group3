import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarAccount from "./NavbarAccount";
import { useUser } from "../providers/UserContest";

const Header = () => {
  const { username } = useUser();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search/${query}`);
  };

  return (
    <div className="navbar bg-base-100 shadow-xl rounded-box">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl" to="/">
          BiblioSearch
        </Link>
      </div>
      <form onSubmit={handleSearch} className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <NavbarAccount username={username} />
      </form>
    </div>
  );
};

export default Header;

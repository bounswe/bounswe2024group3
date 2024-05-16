import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarAccount from "./NavbarAccount";
import { useUser } from "../providers/UserContest";

const Header = () => {
  const { username } = useUser();
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState(false); // State to track search type

  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search/${query}`);
  };
  const handleSearchUser = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search_users/${query}`);
  };
  const toggleSearchType = () => {
    setSearchType((prevType) => (prevType === false? true : false));
  };

  return (
    <div className="navbar bg-base-100 shadow-xl rounded-box">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl" to="/feed">
          BiblioSearch
        </Link>
      </div>  
      <button type="button" className="btn btn-secondary" onClick={toggleSearchType}>
          {searchType === false ? "Switch to User Search" : "Switch to Book Search"}
        </button>
      {searchType && <form onSubmit={handleSearchUser} className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search user"
            className="input input-bordered w-24 md:w-auto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </form>}
      {!searchType &&
      <form onSubmit={handleSearch} className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search book"
            className="input input-bordered w-24 md:w-auto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </form>}
      <div><NavbarAccount username={username} /></div>
      
    </div>
  );
};

export default Header;

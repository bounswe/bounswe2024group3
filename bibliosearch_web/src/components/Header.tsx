import { Link } from "react-router-dom";
import NavbarAccount from "./NavbarAccount";
import { useUser } from "../providers/UserContest";

const Header = () => {
  const { username } = useUser();
  return (
    <div className="navbar bg-base-100 shadow-xl rounded-box">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl" to="/">
          BiblioSearch
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div>
        <NavbarAccount username={username} />
      </div>
    </div>
  );
};

export default Header;
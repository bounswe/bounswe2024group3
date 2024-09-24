import React from "react";
import { UserDetails } from "../pages/SearchUserPage";
import { Link } from "react-router-dom";  // Import Link component from react-router-dom

// UserCard component
const UserCard = ({ user }: { user: UserDetails }) => {
  console.log(user.userId);
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{user.username}</h2>
        <p>Name: {user.name}</p>
        <p>Surname: {user.surname}</p>
        <Link to={`/user_profile/${user.userId}`} className="btn btn-primary">View Profile</Link>
      </div>
    </div>
  );
};

export default UserCard;

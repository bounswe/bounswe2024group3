import React, { useState } from "react";
import { UserDetails } from "../pages/SearchUserPage";

// UserCard component
const UserCard = ({ user }: { user: UserDetails }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
     
      <div className="card-body">
        <h2 className="card-title">{user.username}</h2>
        <p>Name: {user.name}</p>
        <p>Surname: {user.surname}</p>
        
      </div>
    </div>
  );
};

export default UserCard;

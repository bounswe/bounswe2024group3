import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { req } from "../utils/client";
import UserCard from "../components/UserCard";

export type UserDetails = {
  id: number;
 username: string;
 name:string;
 surname:string;
};

export const SearchUserPage = () => {
  const { query } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<UserDetails[]>([]);

  useEffect(() => {
    const handleQuery = async () => {
      setIsLoading(true);
      setError("");
      setUsers([]);
      try {
        const searchQuery = `search_users/?query=${query}`;
        const response = await req(searchQuery, "get", {});
        console.log("Search response:", response.data);
        const users: UserDetails[] = response.data.users.map(
          (user: any, idx: number) => ({
            id: idx,
            username: user.username,
            name: user.name,
            surname: user.surname
          })

        );
        if (users.length === 0) {
            throw new Error("No users found");
        }
        setUsers(users);
      } catch (error: any) {
        console.error("Search failed:", error);
        setError(error.message);
      }
      setIsLoading(false);
    };
    handleQuery();
  }, [query]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center pt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center pt-5">
      {/* <h1>Search Page {query}</h1> */}
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      {error && <p className="text-red-500">{error}</p>}
      {/* {JSON.stringify(users, null, 2)} */}
      
      <div className="flex flex-col gap-4">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      </div>
    
  );
};

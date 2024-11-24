import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { req } from "../utils/client";
import { PostDetails } from "./PostPage";
import PostCard from "../components/PostCard";

export const SearchPage = () => {
    const { query } = useParams();
  
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [posts,setPosts] = useState<PostDetails[]>([]);
    
    useEffect(() => {
        const handleQuery = async () => {
          setIsLoading(true);
          setError("");
          setPosts([]);
          try {
            const searchQuery = `posts/search?keyword=${query}`;
            const response = await req(searchQuery, "get", {});
            console.log("Search response:", response.data);
            const posts: PostDetails[] = response.data.data.map(
              (post: any, idx: number) => ({
                id: idx,
               
              })
            );
            if (posts.length === 0) {
                throw new Error("No books found");
            }
            setPosts(posts);
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
          {error && <p className="text-red-500">{error}</p>}
    
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} isFeed ={false} post={post} />
            ))}
          </div>
        </div>
      );
   


}

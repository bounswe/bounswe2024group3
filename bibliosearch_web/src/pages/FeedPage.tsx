import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { req } from "../utils/client";
import PostCard from "../components/PostCard";
import PostPopup from "../components/PostPopUp";

export type PostDetails = {
  id: number;
  imageUrl: string | null;
  bookname: string;
  content: string;
  username: string;
  likes: number;
  dislikes: number;
  created_at: Date,
};

export const FeedPage = () => {
  const { query } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showCreateButton, setShowCreateButton] = useState(true);
  const [posts, setPosts] = useState<PostDetails[]>([]);

  useEffect(() => {
    const handleQuery = async () => {
      setIsLoading(true);
      setError("");
      setPosts([]);
      try {
        const feedQuery = `user_feed/`;
        const response = await req(feedQuery, "get", {});
        console.log("Feed response:", response.data);
        const posts: PostDetails[] = response.data.posts.map(
          (post: any, idx: number) => ({
            id: idx,     
            bookname: post.bookname,
            content: post.content,  
            username: post.username,
            created_at: new Date(post.created_at),
          })
        );
        if (posts.length === 0) {
            throw new Error("No posts found");
        }
        setPosts(posts);
      } catch (error: any) {
        console.error("Get failed:", error);
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
      {<h1 className="text-2xl font-bold mb-4">Feed Page</h1>}

      {error && <p className="text-red-500">{error}</p>}

  
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

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
  author: string;
  likes: number;
  dislikes: number;
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
        const feedQuery = `get/feed`;
        const response = await req(feedQuery, "get", {});
        console.log("Feed response:", response.data);
        const posts: PostDetails[] = response.data.data.map(
          (post: any, idx: number) => ({
            id: idx,
            imageUrl: post.imageUrl,
            bookname: post.bookname,
            content: post.content,  
            author: post.author,
            
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
      {error && <p className="text-red-500">{error}</p>}
      {error && (
        <p className="text-black-500">
          <PostCard
            key={0}
            post={{
              id: 0,
              imageUrl: null,
              bookname: "Bookname",
              content: "Content",
              author: "Author",
              likes: 0,
              dislikes: 0,
            }}
          />
        </p>
      )}
      
      {showCreateButton && <button  className="btn btn-primary fixed bottom-4 right-4" onClick={() => setShowPopup(true)}>Create a Post</button>
      }


      
      {showPopup && <PostPopup />}

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

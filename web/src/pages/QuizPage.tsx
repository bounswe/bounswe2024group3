import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { req } from "../utils/client";
import PostCard from "../components/PostCard";
import CreatePostForm from "../components/CreatePostForm";
import { useUser } from "../providers/UserContext";
import { PostDetails } from "./FeedPage";
import QuizComponent from "../components/QuizComponent";

export const QuizPage = () => {
  const { query } = useParams();
  const username = useUser().username;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<PostDetails[]>([]);

  useEffect(() => {
    const handleQuery = async () => {
      setIsLoading(true);
      setError("");
      setPosts([]);

      try {
        // Fetch posts
        const feedQuery = `get-posts/`;
        const response = await req(feedQuery, "get", {});
        console.log("Feed response:", response.data);

        const posts: PostDetails[] = response.data.posts;
        if (!posts.length) {
          throw new Error("No posts found");
        }

        setPosts(posts);
      } catch (error: any) {
        console.error("Error occurred:", error);
        setError(error.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
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
  return username ? (
    <div className="flex justify-center items-start">
      {/* Main content area */}
      {/* <div className="w-64 bg-gray-100 p-4 mr-4">
        <h3 className=" text-lg font-semibold mb-4">Most Shared Nearby</h3>
        {mostSharedNearbys.slice(0, 5).map((rec) => (
          <RecommendationItem
            key={parseSpotifyLink(rec).id}
            rec={{
              type: parseSpotifyLink(rec).type,
              spotifyId: parseSpotifyLink(rec).id,
            }}
          />
        ))}
      </div> */}
      <div className="flex-1 max-w-2xl w-full">
        {posts.length > 0 && <QuizComponent posts={posts} />}
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-start">
      <h1>Please login to see feed. </h1>
    </div>
  );
};

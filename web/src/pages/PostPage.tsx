import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { Spotify } from "react-spotify-embed";
import RecommendationItem from "../components/RecommendationItem";
import { useUser } from "../providers/UserContext";
import useAccessibility from "../components/Accessibility";
import { PostDetails } from "./FeedPage";
import { createSpotifyLink, req } from "../utils/client";

interface PostPageProps {
  type: string;
}

const PostPage: React.FC<PostPageProps> = ({ type }) => {
  const { spotifyId } = useParams<{ spotifyId: string }>();
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const [newPostContent, setNewPostContent] = useState(""); // To track new post content
  const { username } = useUser();

  useEffect(() => {
    // If spotifyId is provided, filter posts by it; otherwise, show all posts

    const handleQuery = async () => {
      try {
        if (!spotifyId) {
          throw new Error("Invalid Spotify ID");
        }
        const response = await req(`get-posts?link=${
          createSpotifyLink({ type, id: spotifyId })
        }`, "get", {});
        console.log("Post response:", response.data);
        const posts: PostDetails[] = response.data.posts;
        setPosts(posts);
      } catch (error: any) {
        console.error("Failed to fetch posts:", error);
      }
    };
    handleQuery();
  }, [spotifyId]);

  if (!posts || !posts.length) {
    return <div>No posts found!</div>;
  }

  return (
    <div className="flex">
      {/* Main Content Section */}
      <div className="flex-1">
        <Spotify wide link={`https://open.spotify.com/${type}/${spotifyId}`} />

        {/* Show the post creation section only if the user is logged in */}
        {true && (
          <div className="add-post-section">
            <h3>Add a New Post</h3>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Write your post content here..."
              className="textarea textarea-bordered w-full mb-4"
            />
            <button className="btn btn-primary" onClick={() => alert("asd")}>
              Submit Post
            </button>
          </div>
        )}

        {/* Render the list of posts */}
        {posts.map((post) => (
          <PostCard key={post.id} isFeed={false} post={post} />
        ))}
      </div>

      {/* Recommendations Bar */}
      {/* <div className="w-64 bg-gray-100 p-4 ml-4">
        <h3 className="text-lg font-semibold mb-4">Recommended for You</h3>
        {mockPosts
          .filter((x) => x.spotifyId !== spotifyId && x.type === type)
          .slice(0, 10)
          .map((rec) => (
            <RecommendationItem key={rec.id} rec={rec} />
          ))}
      </div> */}
    </div>
  );
};

export default PostPage;

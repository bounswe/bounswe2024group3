import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { Spotify } from "react-spotify-embed";
import RecommendationItem from "../components/RecommendationItem";
import { useUser } from "../providers/UserContext";
import useAccessibility from "../components/Accessibility";
import { PostDetails } from "./FeedPage";
import { createSpotifyLink, parseSpotifyLink, req } from "../utils/client";
import CreatePostForm from "../components/CreatePostForm";
import LyricsCard from "../components/LyricsCard";
interface PostPageProps {
  type: string;
}

const PostPage: React.FC<PostPageProps> = ({ type }) => {
  const { spotifyId } = useParams<{ spotifyId: string }>();
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [newPostContent, setNewPostContent] = useState(""); // To track new post content
  const { username } = useUser();
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [lyricsError, setLyricsError] = useState<string | null>(null);

  useEffect(() => {
    // If spotifyId is provided, filter posts by it; otherwise, show all posts


    const handleQuery = async () => {
      try {
        if (!spotifyId) {
          throw new Error("Invalid Spotify ID");
        }
        const response = await req(
          `get-posts?link=${createSpotifyLink({ type, id: spotifyId })}`,
          "get",
          {}
        );
        console.log("Post response:", response.data);
        const posts: PostDetails[] = response.data.posts;
        setPosts(posts);
      } catch (error: any) {
        console.error("Failed to fetch posts:", error);
      }
    };

    const addNowPlaying = async () => {
      try {
        if (!spotifyId) {
          throw new Error("Invalid Spotify ID");
        }
        const storedLatitude = localStorage.getItem("latitude");
        const storedLongitude = localStorage.getItem("longitude");
        const response = await req("save-now-playing", "post", {
          link: createSpotifyLink({ type, id: spotifyId }),
          latitude: parseFloat(storedLatitude || "0"),
          longitude: parseFloat(storedLongitude || "0"),
        });
        console.log("Added now playing:", response.data);
      } catch (error: any) {
        console.error("Failed to add now playing:", error);
      }
    };
    
    const fetchLyrics = async () => {
      if (type !== "track" || !spotifyId) return;
      setLyricsLoading(true);
      setLyricsError(null);
      try {
        const response = await req(
          `get_lyrics?spotify_url=${createSpotifyLink({ type, id: spotifyId })}`,
          "get",
          {}
        );
        setLyrics(response.data.lyrics);
      } catch (error: any) {
        console.error("Failed to fetch lyrics:", error);
        setLyricsError(error.message || "Unable to fetch lyrics");
      } finally {
        setLyricsLoading(false);
      }
    };
    
    const getRecommendations = async () => {
      try {
        const response = await req("get-posts/", "get", {});
        console.log("Feed response:", response.data);
        const posts: PostDetails[] = response.data.posts;

        if (posts.length === 0) {
          throw new Error("No posts found");
        }

        // Extract links, make them unique, and limit to 10
        let links = posts.map((post) => post.content.link);
        const uniqueLinks = Array.from(new Set(links)).slice(0, 10);

        setRecommendations(uniqueLinks);
        console.log("Recommendations response:", uniqueLinks);
      } catch (error: any) {
        console.error("Failed to fetch recommendations:", error);
      }
    };

    handleQuery();
    addNowPlaying();
    getRecommendations();
    fetchLyrics(); // Fetch lyrics if type is "track"

  }, [spotifyId, type]);

  if (!posts || !posts.length || !spotifyId) {
    return <div>No posts found!</div>;
  }

  return (
    <div className="flex justify-center">
       {/* Left Column: Lyrics */}
       {type === "track" && (
      <div className="mr-10"> {/* Added margin to create space */}
        <LyricsCard 
          lyrics={lyrics || ''} 
          isLoading={lyricsLoading}
          error={lyricsError}
        />
      </div>
    )}
      {/* Main Content Section */}
      <div className="flex-1  max-w-2xl w-full">
        <Spotify wide link={`https://open.spotify.com/${type}/${spotifyId}`} />

        {/* Show the post creation section only if the user is logged in
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
        )} */}

        <CreatePostForm
          initialLink={createSpotifyLink({ type, id: spotifyId })}
        />
        
        {/* Render the list of posts */}
        {posts.map((post) => (
          <PostCard key={post.id} isFeed={false} post={post} />
        ))}
      </div>

      {/* Recommendations Bar */}
      <div className="w-64 bg-base-200 p-4 ml-10">
        <h3 className="text-lg font-semibold mb-4">Recommended for You</h3>
        {recommendations
          .filter((x) => parseSpotifyLink(x).id !== spotifyId)
          .slice(0, 10)
          .map((rec) => (
            <RecommendationItem
              key={parseSpotifyLink(rec).id}
              rec={{
                type: parseSpotifyLink(rec).type,
                spotifyId: parseSpotifyLink(rec).id,
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default PostPage;

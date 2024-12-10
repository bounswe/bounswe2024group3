import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { Spotify } from "react-spotify-embed";
import RecommendationItem from "../components/RecommendationItem";
import { useUser } from "../providers/UserContext";
import { PostDetails } from "./FeedPage";
import { createSpotifyLink, parseSpotifyLink, req } from "../utils/client";
import CreatePostForm from "../components/CreatePostForm";

interface PostPageProps {
  type: string;
}

const PostPage: React.FC<PostPageProps> = ({ type }) => {
  const { spotifyId } = useParams<{ spotifyId: string }>();
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const { username } = useUser();

  useEffect(() => {
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
        await req("save-now-playing", "post", {
          link: createSpotifyLink({ type, id: spotifyId }),
          latitude: parseFloat(storedLatitude || "0"),
          longitude: parseFloat(storedLongitude || "0"),
        });
      } catch (error: any) {
        console.error("Failed to add now playing:", error);
      }
    };

    const getRecommendations = async () => {
      try {
        const response = await req("get-posts/", "get", {});
        const posts: PostDetails[] = response.data.posts;

        if (posts.length === 0) {
          throw new Error("No posts found");
        }

        const links = posts.map((post) => post.content.link);
        const uniqueLinks = Array.from(new Set(links)).slice(0, 10);

        setRecommendations(uniqueLinks);
      } catch (error: any) {
        console.error("Failed to fetch recommendations:", error);
      }
    };

    handleQuery();
    addNowPlaying();
    getRecommendations();
  }, [spotifyId]);

  if (!posts || !posts.length || !spotifyId) {
    return (
      <div role="alert" aria-live="polite">
        No posts found!
      </div>
    );
  }

  return (
    <div className="flex justify-center" aria-label="Post details page">
      {/* Main Content Section */}
      <div className="flex-1 max-w-2xl w-full" aria-labelledby="main-content">
        <h1 id="main-content" className="sr-only">
          Main content
        </h1>
        <Spotify
          wide
          link={`https://open.spotify.com/${type}/${spotifyId}`}
          aria-label={`Spotify embed for ${type}`}
        />

        <CreatePostForm
          initialLink={createSpotifyLink({ type, id: spotifyId })}
        />

        {/* Render the list of posts */}
        <div aria-labelledby="posts-list">
          <h2 id="posts-list" className="sr-only">
            Posts related to this Spotify content
          </h2>
          {posts.map((post) => (
            <PostCard key={post.id} isFeed={false} post={post} />
          ))}
        </div>
      </div>

      {/* Recommendations Bar */}
      <div
        className="w-64 bg-gray-100 p-4 ml-4"
        aria-labelledby="recommendations-bar"
      >
        <h2 id="recommendations-bar" className="text-lg font-semibold mb-4">
          Recommended for You
        </h2>
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

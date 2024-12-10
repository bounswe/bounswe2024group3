import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { parseSpotifyLink, req } from "../utils/client";
import PostCard from "../components/PostCard";
import CreatePostForm from "../components/CreatePostForm";
import RecommendationItem from "../components/RecommendationItem";
import { useUser } from "../providers/UserContext";

export type PostContent = {
  id: number;
  link: string;
  description: string;
  content_type: string;
};

export type PostDetails = {
  id: number;
  imageUrl: string | null;
  title: string | undefined;
  content: PostContent;
  comment: string;
  username: string;
  total_likes: number;
  total_dislikes: number;
  created_at: Date;
  userAction: string | null;
};

interface Track {
  link: string;
  description: string;
  count: number;
}
interface Song {
  content__link: string;
  content__description: string;
  count: number;
}
interface MostSharedNearbyResponse {
  tracks: Song[];
}

interface MostListenedNearbyResponse {
  tracks: Track[];
}

interface MostListenedNearbyParams {
  latitude: number;
  longitude: number;
  radius?: number; // Optional radius in kilometers, default is 10
}

export const FeedPage = () => {
  const { query } = useParams();
  const username = useUser().username;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mostListenedNearbys, setMostListenedNearbys] = useState<string[]>([]);
  const [posts, setPosts] = useState<PostDetails[]>([]);

  async function getMostListenedNearby(
    params: MostListenedNearbyParams
  ): Promise<Track[]> {
    const { latitude, longitude, radius = 10 } = params;

    try {
      const queryParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
      });

      const requestUrl = `most-listened-nearby/?${queryParams.toString()}`;
      console.log("Requesting:", requestUrl);

      const response = await req(requestUrl, "get", {});

      if (!response.data || !response.data.tracks) {
        console.warn("No tracks data found in response");
        return [];
      }

      const trackLinks = response.data.tracks.map((track: Track) => track.link);
      setMostListenedNearbys(trackLinks);

      return response.data.tracks;
    } catch (error) {
      console.error("Error fetching most listened nearby tracks:", error);
      return [];
    }
  }

  useEffect(() => {
    const handleQuery = async () => {
      setIsLoading(true);
      setError("");
      setPosts([]);

      try {
        const feedQuery = `get-posts/`;
        const response = await req(feedQuery, "get", {});
        console.log("Feed response:", response.data);

        const posts: PostDetails[] = response.data.posts;
        if (!posts.length) {
          throw new Error("No posts found");
        }

        setPosts(posts);

        const mostListenedTracks = await getMostListenedNearby({
          latitude: localStorage.getItem("latitude")
            ? parseFloat(localStorage.getItem("latitude")!)
            : 41.080895,
          longitude: localStorage.getItem("longitude")
            ? parseFloat(localStorage.getItem("longitude")!)
            : 29.0343434,
        });

        console.log("Most listened tracks:", mostListenedTracks);
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
      <div
        className="flex flex-col justify-center items-center pt-10"
        role="alert"
        aria-busy="true"
        aria-label="Loading feed"
      >
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return username ? (
    <div className="flex justify-center items-start" aria-label="Feed content">
      {/* Main content area */}
      <div className="flex-1 max-w-2xl w-full">
        <CreatePostForm />
        {error && <p className="text-red-500" role="alert">{error}</p>}

        {posts.map((post) => (
          <PostCard key={post.id} post={post} isFeed={true} />
        ))}
      </div>

      {/* Most Listened Nearby Sidebar */}
      <div
        className="w-64 bg-gray-100 p-4 ml-4"
        aria-label="Sidebar: Most Listened Nearby"
      >
        <h3 className="text-lg font-semibold mb-4">Most Listened Nearby</h3>
        {mostListenedNearbys.slice(0, 5).map((rec) => (
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
  ) : (
    <div className="flex justify-center items-start" role="alert">
      <h1>Please login to see feed.</h1>
    </div>
  );
};

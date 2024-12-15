import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  count: number;
}
interface Song {
  content__link: string;
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
  const [showPopup, setShowPopup] = useState(false);
  const [showCreateButton, setShowCreateButton] = useState(true);
  const [mostListenedNearbys, setMostListenedNearbys] = useState<string[]>([]);
  const [mostSharedNearbys, setMostSharedNearbys] = useState<string[]>([]);
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

      // Make the GET request
      const response = await req(requestUrl, "get", {});

      if (!response.data || !response.data.tracks) {
        console.warn("No tracks data found in response");
        return [];
      }

      // Process and set tracks
      const trackLinks = response.data.tracks.map((track: Track) => track.link);
      setMostListenedNearbys(trackLinks);

      return response.data.tracks;
    } catch (error) {
      // Gracefully handle errors
      console.error("Error fetching most listened nearby tracks:", error);
      return []; // Return empty array to avoid uncaught runtime errors
    }
  }


  async function getMostSharedNearby(
    params: MostListenedNearbyParams
  ): Promise<Song[]> {
    const { latitude, longitude, radius = 10 } = params;

    try {
      const queryParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
      });

      const requestUrl = `most-shared-nearby-things/?${queryParams.toString()}`;
      console.log("Requesting:", requestUrl);

      // Make the GET request
      const response = await req(requestUrl, "get", {});

      if (!response.data || !response.data.songs) {
        console.warn("No songs data found in response");
        return [];
      }

      // Process and set tracks
      const trackLinks = response.data.songs.map((song: Song) => song.content__link);
      setMostSharedNearbys(trackLinks);

      return response.data.songs;
    } catch (error) {
      // Gracefully handle errors
      console.error("Error fetching most listened nearby tracks:", error);
      return []; // Return empty array to avoid uncaught runtime errors
    }
  }

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
        const mostSharedSongs = await getMostSharedNearby({
          latitude: localStorage.getItem("latitude")
            ? parseFloat(localStorage.getItem("latitude")!)
            : 41.080895,
          longitude: localStorage.getItem("longitude")
            ? parseFloat(localStorage.getItem("longitude")!)
            : 29.0343434,
        });
        console.log("Most shared songs:", mostSharedSongs);

        setPosts(posts);

        // Fetch most listened nearby
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
      <div className="flex flex-col justify-center items-center pt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }


  return username ? (
    <div className="flex justify-between max-w-screen-xl mx-auto w-full">


         {/* Most Listened Nearby */}
         <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Most Shared Nearby</h3>
          {mostSharedNearbys.slice(0, 5).map((rec) => (
            <RecommendationItem
              key={parseSpotifyLink(rec).id}
              rec={{
                type: parseSpotifyLink(rec).type,
                spotifyId: parseSpotifyLink(rec).id,
              }}
            />
          ))}
        </div>
      {/* Main content */}
      <div className="flex-1 max-w-2xl mx-auto">
        <CreatePostForm />
        {error && <p className="text-red-500">{error}</p>}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} isFeed={true} />
        ))}
      </div>

      {/* Right sidebar - Fixed position */}
      <div className="w-64 ml-4 fixed right-4 top-20">
        {/* Playlists Button */}
        <Link 
          to="/view-playlist" 
          className="btn btn-primary w-full mb-4"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" 
            />
          </svg>
          My Playlists
        </Link>

        {/* Most Listened Nearby */}
        <div className="bg-base-200 p-4 rounded-lg">
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
    </div>
) : (
    <div className="flex justify-center items-start">
      <h1>Please login to see feed. </h1>
    </div>
  );
};

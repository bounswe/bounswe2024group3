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
  link: string;
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
      const trackLinks = response.data.songs.map((song: Song) => song.link);
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
    <div className="flex justify-center max-w-screen-xl mx-auto w-full gap-6"  aria-label="Feed content">
  {/* Left Sidebar: Most Shared Nearby */}
  <div className="w-64 hidden lg:block"> {/* Hide on small screens */}
  <Link to="/map" className="btn btn-primary w-full mb-4 flex items-center">
  <svg 
    version="1.1" 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5 mr-2" 
    viewBox="0 0 512 512" 
    fill="currentColor"     
  >
    <path d="M256,48c-0.1,0-0.1,0-0.2,0c0,0,0,0-0.1,0c-0.1,0-0.2,0-0.2,0C140.8,48.3,48,141.3,48,256c0,114.7,92.8,207.7,207.5,208  c0.1,0,0.2,0,0.2,0c0,0,0.1,0,0.1,0c0.1,0,0.1,0,0.2,0c114.9,0,208-93.1,208-208C464,141.1,370.9,48,256,48z M264.3,172.5  c22.1-0.6,43.5-3.5,64.2-8.5c6.2,24.5,10.1,52.8,10.7,83.8h-74.9V172.5z M264.3,155.8V66c22.4,6.2,45.2,36.1,59.6,82  C304.7,152.6,284.8,155.2,264.3,155.8z M247.7,65.8v90.1c-20.7-0.6-40.8-3.3-60.1-8C202.2,101.7,225.1,71.6,247.7,65.8z   M247.7,172.5v75.2h-75.4c0.6-31,4.5-59.3,10.7-83.8C203.8,168.9,225.5,171.9,247.7,172.5z M155.5,247.7H64.9  c1.8-42.8,17.8-82,43.3-113c18.5,10.2,38.2,18.6,58.8,24.8C160.2,186,156.2,215.9,155.5,247.7z M155.5,264.3  c0.6,31.7,4.6,61.7,11.4,88.2c-20.6,6.3-40.2,14.6-58.8,24.8c-25.5-31-41.4-70.2-43.3-113H155.5z M172.3,264.3h75.4v75.1  c-22.2,0.6-43.9,3.6-64.7,8.7C176.8,323.6,172.9,295.3,172.3,264.3z M247.7,356.1v90.2c-22.6-5.9-45.5-35.9-60.1-82.1  C206.9,359.4,227,356.7,247.7,356.1z M264.3,446v-90c20.5,0.6,40.4,3.3,59.7,7.9C309.5,409.9,286.8,439.8,264.3,446z M264.3,339.4  v-75.1h74.9c-0.6,30.9-4.5,59.2-10.7,83.7C307.8,343,286.4,340,264.3,339.4z M355.9,264.3h91.2c-1.8,42.8-17.8,81.9-43.3,113  c-18.7-10.3-38.5-18.7-59.3-25C351.3,325.8,355.3,296,355.9,264.3z M355.9,247.7c-0.6-31.7-4.6-61.6-11.3-88.1  c20.8-6.3,40.6-14.7,59.2-24.9c25.5,31,41.5,70.2,43.3,113.1H355.9z M392.4,121.9c-16.6,8.8-34,16.1-52.3,21.6  c-9.7-31.3-23.4-56.8-39.5-73.6C336,78.4,367.6,96.8,392.4,121.9z M210.8,70.1c-16.1,16.7-29.7,42.2-39.3,73.3  c-18.1-5.5-35.4-12.7-51.8-21.5C144.2,96.9,175.6,78.6,210.8,70.1z M119.6,390c16.4-8.8,33.8-16,51.8-21.5  c9.7,31.2,23.3,56.6,39.4,73.4C175.6,433.4,144.2,415.1,119.6,390z M300.6,442.1c16.2-16.8,29.8-42.3,39.6-73.7  c18.3,5.5,35.7,12.8,52.3,21.6C367.7,415.2,336,433.6,300.6,442.1z"/>
  </svg>
  Map
</Link>
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
  </div>

  {/* Main Content */}
  <div className="flex-1 max-w-2xl mx-auto relative">
    <CreatePostForm /> {/* Prioritize Create Post */}
    {error && <p className="text-red-500">{error}</p>}
    {posts.map((post) => (
      <PostCard key={post.id} post={post} isFeed={true} />
    ))}
  </div>

  {/* Right Sidebar: Most Listened Nearby */}
  <div className="w-64 hidden lg:block sticky top-20">
    {/* Playlists Button */}
    <Link to="/view-playlist" className="btn btn-primary w-full mb-4">
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

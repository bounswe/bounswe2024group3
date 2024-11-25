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
  const [showPopup, setShowPopup] = useState(false);
  const [showCreateButton, setShowCreateButton] = useState(true);
  const [mostListenedNearbys, setMostListenedNearbys] = useState<string[]>([]);
  const [mostSharedNearbys, setMostSharedNearbys ]= useState<string[]>([]);
  const [posts, setPosts] = useState<PostDetails[]>([]);

  async function getMostListenedNearby(params: MostListenedNearbyParams): Promise<Track[]> {
    try {
      const { latitude, longitude, radius = 10 } = params;
  
      // Construct the query parameters
      const queryParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
      });
  
      // Make the GET request
      const response = await req(
        `most-listened-nearby/?${queryParams.toString()}`,"get",{});

      // Return the list of tracks
      const trackLinks =  response.data.tracks.map((track: Track) => track.link);
      setMostListenedNearbys(trackLinks);
      return response.data.tracks;
    } catch (error) {
      // Handle error (optional: add better error handling based on the API response)
      console.error('Error fetching most listened nearby tracks:', error);
      throw error;
    }
  }

  async function getMostSharedNearbyThings(params: MostListenedNearbyParams): Promise<Track[]> {
    try {
      const { latitude, longitude, radius = 10 } = params;
  
      // Construct the query parameters
      const queryParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
      });
  
      // Make the GET request
      const response = await req(
        `most-shared-nearby-things/?${queryParams.toString()}`,"get",{});

      // Return the list of tracks
      const trackLinks =  response.data.songs.map((track: Song) => track.content__link);
      setMostSharedNearbys(trackLinks);
      return response.data.tracks;
    } catch (error) {
      // Handle error (optional: add better error handling based on the API response)
      console.error('Error fetching most listened nearby tracks:', error);
      throw error;
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
        if (posts.length === 0) {
          throw new Error("No posts found");
        }
        getMostListenedNearby({latitude: localStorage.getItem("latitude")?  parseFloat(localStorage.getItem("latitude")!): 41.080895,
           longitude: localStorage.getItem("longitude") ?  parseFloat(localStorage.getItem("longitude")!) : 29.0343434 });
        getMostSharedNearbyThings({latitude: localStorage.getItem("latitude")?  parseFloat(localStorage.getItem("latitude")!): 41.080895,
          longitude: localStorage.getItem("longitude") ?  parseFloat(localStorage.getItem("longitude")!) : 29.0343434 });
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
    username ?
    <div className="flex justify-center items-start">
      {/* Main content area */}
      <div className="w-64 bg-gray-100 p-4 mr-4">
    <h3 className=" text-lg font-semibold mb-4">Most Shared Nearby</h3>
    {mostSharedNearbys
      .slice(0, 5)
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
      <div className="flex-1 max-w-2xl w-full">
        
        <CreatePostForm />
        {error && <p className="text-red-500">{error}</p>}
  
        {posts.map((post) => (
          <PostCard key={post.id} post={post} isFeed={true} />
        ))}
      </div>
  
      {/* Most Listened Nearby Sidebar */}
      <div className="w-64 bg-gray-100 p-4 ml-4">
        <h3 className="text-lg font-semibold mb-4">Most Listened Nearby</h3>
        {mostListenedNearbys
          .slice(0, 5)
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
:
     <div className="flex justify-center items-start">
      <h1> 
      Please login to see feed. </h1> 
      </div>

);
  
};

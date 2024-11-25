import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { parseSpotifyLink, req } from "../utils/client";
import PostCard from "../components/PostCard";
import { PostContent, PostDetails } from "./FeedPage";
import RecommendationItem from "../components/RecommendationItem";



export const SearchPage = () => {
    const { query } = useParams();
  
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [posts,setPosts] = useState<PostContent[]>([]);
    const [trackLinks, setTrackLinks] = useState<string[]>([]);
    
    useEffect(() => {
        const handleQuery = async () => {
          setIsLoading(true);
          setError("");
          setPosts([]);
          try {
            const searchQuery = `search?search=${query}`;
            const response = await req(searchQuery, "get", {});
            console.log("Search response:", response.data);
            const posts: PostContent[] = response.data.contents;
            const trackLinks =  response.data.contents.map((track: PostContent) => track.link);
            setTrackLinks(trackLinks);
            if (response.data.total_results === 0) {
                throw new Error("No items found");
            }
            setPosts(posts);
          } catch (error: any) {
            console.error("Search failed:", error);
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
        <div className="flex flex-col items-center pt-10 min-h-screen bg-gray-50">
        {/* Error Message */}
        {error && <p className="text-red-500 text-lg mb-6">{error}</p>}
      
        {/* Search Results Container */}
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
          <h3 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Search Results
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {trackLinks.length > 0 ? (
              trackLinks.slice(0, 5).map((rec) => (
                <RecommendationItem
                  key={parseSpotifyLink(rec).id}
                  rec={{
                    type: parseSpotifyLink(rec).type,
                    spotifyId: parseSpotifyLink(rec).id,
                  }}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">No results found</p>
            )}
          </div>
        </div>
      </div>
      
      );
   


}

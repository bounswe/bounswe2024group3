import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { parseSpotifyLink, req } from "../utils/client";
import RecommendationItem from "../components/RecommendationItem";
import { PostContent } from "./FeedPage";

export const SearchPage = () => {
  const { query } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<PostContent[]>([]);
  const [trackLinks, setTrackLinks] = useState<string[]>([]);

  useEffect(() => {
    const handleQuery = async () => {
      setIsLoading(true);
      setError("");
      setPosts([]);
      try {
        const searchQuery = `search?search=${query}`;
        const response = await req(searchQuery, "get", {});
        const posts: PostContent[] = response.data.contents;
        const trackLinks = response.data.contents.map(
          (track: PostContent) => track.link
        );
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
      <div
        className="flex flex-col justify-center items-center pt-10"
        role="alert"
        aria-busy="true"
        aria-live="polite"
        aria-label="Loading search results"
      >
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center pt-10 min-h-screen bg-gray-50"
      aria-labelledby="search-results-title"
    >
      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-lg mb-6" role="alert">
          {error}
        </p>
      )}

      {/* Search Results Container */}
      <div
        className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8"
        role="region"
        aria-labelledby="search-results-title"
      >
        <h3
          id="search-results-title"
          className="text-3xl font-bold mb-8 text-center text-gray-800"
        >
          Search Results
        </h3>
        <div className="grid grid-cols-1 gap-6" aria-live="polite">
          {trackLinks.length > 0 ? (
            trackLinks.slice(0, 5).map((rec) => (
              <RecommendationItem
                key={parseSpotifyLink(rec).id}
                rec={{
                  type: parseSpotifyLink(rec).type,
                  spotifyId: parseSpotifyLink(rec).id,
                }}
                aria-label={`Recommendation for ${parseSpotifyLink(rec).type}`}
              />
            ))
          ) : (
            <p className="text-center text-gray-500" role="status">
              No results found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

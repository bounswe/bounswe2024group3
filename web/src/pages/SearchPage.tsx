// SearchPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { parseSpotifyLink, req } from "../utils/client";
import RecommendationItem from "../components/RecommendationItem";
import { Link } from "react-router-dom";

interface PostContent {
    id: number;
    link: string;
    content_type: string;
}

interface Profile {
    id: number;
    username: string;
    name: string;
    surname: string;
    labels: string;
}

interface SearchResult {
    id: string;
    name: string;
    artists?: string[];
    album?: string;
    image_url?: string;
    genres?: string[];
    release_date?: string;
    external_url: string;
    preview_url?: string;
}

interface GroupedResults {
    tracks?: SearchResult[];
    albums?: SearchResult[];
    artists?: SearchResult[];
}

export const SearchPage = () => {
    const { query } = useParams();
    
    const [isLoading, setIsLoading] = useState(false);
    const [isSpotifySearching, setIsSpotifySearching] = useState(false);
    const [error, setError] = useState("");
    const [contents, setContents] = useState<PostContent[]>([]);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [activeTab, setActiveTab] = useState<string>("all");
    const [spotifyResults, setSpotifyResults] = useState<GroupedResults>({});

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'track', label: 'Songs' },
        { id: 'album', label: 'Albums' },
        { id: 'artist', label: 'Artists' },
        { id: 'profiles', label: 'Profiles' },
    ];

    const handleSpotifySearch = async () => {
      if (!query) return;
      
      setIsSpotifySearching(true);
      try {
          const response = await req(
              `search_spotify?q=${query}&type=track,album,artist`, 
              'GET',
              {} // Add empty object as third argument
          );
          if (response.data.results) {
              setSpotifyResults(response.data.results);
          }
      } catch (err) {
          console.error('Spotify search failed:', err);
      } finally {
          setIsSpotifySearching(false);
      }
  };
    useEffect(() => {
        if (!query) {
            setContents([]);
            setProfiles([]);
            setSpotifyResults({});
            setError("");
            return;
        }

        const handleSearch = async () => {
            setIsLoading(true);
            setError("");
            setContents([]);
            setProfiles([]);
            
            try {
                // Database search
                const searchQuery = `search?search=${query}`;
                const response = await req(searchQuery, "get", {});
                
                setContents(response.data.contents || []);
                setProfiles(response.data.profiles || []);
                
                // Spotify search
                await handleSpotifySearch();
                
            } catch (error: any) {
                console.error("Search failed:", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        handleSearch();
    }, [query]);

    const renderSpotifyResults = () => {
        if (activeTab === 'all' || !spotifyResults) {
            return (
                <>
                    {spotifyResults.tracks && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">Tracks</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {spotifyResults.tracks.map(track => (
                                    <div key={track.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                                        {track.image_url && (
                                            <img src={track.image_url} alt={track.name} className="w-full h-40 object-cover rounded mb-2"/>
                                        )}
                                        <h4 className="font-semibold truncate">{track.name}</h4>
                                        <p className="text-sm text-gray-600 truncate">{track.artists?.join(', ')}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {spotifyResults.albums && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">Albums</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {spotifyResults.albums.map(album => (
                                    <div key={album.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                                        {album.image_url && (
                                            <img src={album.image_url} alt={album.name} className="w-full h-40 object-cover rounded mb-2"/>
                                        )}
                                        <h4 className="font-semibold truncate">{album.name}</h4>
                                        <p className="text-sm text-gray-600 truncate">{album.artists?.join(', ')}</p>
                                        <p className="text-xs text-gray-500">{album.release_date}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {spotifyResults.artists && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">Artists</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {spotifyResults.artists.map(artist => (
                                    <div key={artist.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                                        {artist.image_url && (
                                            <img src={artist.image_url} alt={artist.name} className="w-full h-40 object-cover rounded-full mb-2"/>
                                        )}
                                        <h4 className="font-semibold truncate">{artist.name}</h4>
                                        <p className="text-sm text-gray-600 truncate">{artist.genres?.join(', ')}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            );
        }

        // Render specific type results
        const typeMap = {
            'track': spotifyResults.tracks,
            'album': spotifyResults.albums,
            'artist': spotifyResults.artists
        };

        const results = typeMap[activeTab as keyof typeof typeMap] || [];

        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((item: SearchResult) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                        {item.image_url && (
                            <img 
                                src={item.image_url} 
                                alt={item.name} 
                                className={`w-full h-40 object-cover mb-2 ${activeTab === 'artist' ? 'rounded-full' : 'rounded'}`}
                            />
                        )}
                        <h4 className="font-semibold truncate">{item.name}</h4>
                        {item.artists && (
                            <p className="text-sm text-gray-600 truncate">{item.artists.join(', ')}</p>
                        )}
                        {item.release_date && (
                            <p className="text-xs text-gray-500">{item.release_date}</p>
                        )}
                        {item.genres && (
                            <p className="text-sm text-gray-600 truncate">{item.genres.join(', ')}</p>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderContent = () => {
        if (activeTab === 'profiles' && profiles.length > 0) {
            return (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {profiles.map((profile) => (
                        <Link 
                            to={`/user/${profile.username}`} 
                            key={profile.id} 
                            className="block hover:no-underline"
                        >
                            <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
                                <p className="font-semibold text-center text-gray-800">{profile.name} {profile.surname}</p>
                                <p className="text-sm text-gray-500 text-center">
                                    {profile.labels.replace(/[\[\]']/g, '')}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            );
        }

        return (
            <div className="space-y-8">
                {/* Database Results */}
                {contents.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">From Your Network</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {contents
                                .filter(content => activeTab === 'all' || content.content_type === activeTab)
                                .map((content) => (
                                    <RecommendationItem
                                        key={parseSpotifyLink(content.link).id}
                                        rec={{
                                            type: parseSpotifyLink(content.link).type,
                                            spotifyId: parseSpotifyLink(content.link).id,
                                        }}
                                    />
                                ))}
                        </div>
                    </div>
                )}

                {/* Spotify Results */}
                {Object.keys(spotifyResults).length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">From Spotify</h2>
                        {renderSpotifyResults()}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center pt-10 min-h-screen bg-gray-50">
            {error && <p className="text-red-500 text-lg mb-6">{error}</p>}
            
            <div className="w-full max-w-6xl px-4">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-full transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-gray-100 rounded-lg p-6">
                    {isLoading || isSpotifySearching ? (
                        <div className="flex justify-center items-center h-40">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : (
                        renderContent()
                    )}
                </div>
            </div>
        </div>
    );
};
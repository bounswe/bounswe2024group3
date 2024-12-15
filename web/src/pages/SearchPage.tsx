import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { parseSpotifyLink, req } from "../utils/client";
import RecommendationItem from "../components/RecommendationItem";
import { Link } from "react-router-dom"; // Add this import at the top

interface PostContent {
    id: number;
    link: string;
    content_type: string;
}

export const SearchPage = () => {
    const { query } = useParams();
  
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [contents, setContents] = useState<PostContent[]>([]);
    const [profiles, setProfiles] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<string>("all");
    
    // Group contents by their type
    const groupedContents = contents.reduce((acc: { [key: string]: PostContent[] }, content) => {
        const type = content.content_type || 'other';
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(content);
        return acc;
    }, {});

    useEffect(() => {

      if (!query) {
        setContents([]);
        setProfiles([]);
        setError("");
        return;
    }

        const handleQuery = async () => {
            setIsLoading(true);
            setError("");
            setContents([]);
            setProfiles([]);
            
            try {
                const searchQuery = `search?search=${query}`;
                const response = await req(searchQuery, "get", {});
                
                setContents(response.data.contents || []);
                setProfiles(response.data.profiles || []);
                
                if (response.data.content_results_count === 0 && response.data.profile_results_count === 0) {
                    throw new Error("No results found");
                }
            } catch (error: any) {
                console.error("Search failed:", error);
                setError(error.message);
            }
            setIsLoading(false);
        };
        handleQuery();
    }, [query]);

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'track', label: 'Songs' },
        { id: 'album', label: 'Albums' },
        { id: 'artist', label: 'Artists' },
        { id: 'profiles', label: 'Profiles' },
    ];

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
        const filteredContents = activeTab === 'all' 
            ? contents 
            : contents.filter(content => content.content_type === activeTab);

        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredContents.map((content) => (
                    <RecommendationItem
                        key={parseSpotifyLink(content.link).id}
                        rec={{
                            type: parseSpotifyLink(content.link).type,
                            spotifyId: parseSpotifyLink(content.link).id,
                        }}
                    />
                ))}
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
                    {isLoading ? (
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
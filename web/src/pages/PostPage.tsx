// web/src/pages/PostPage.tsx
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { Spotify } from "react-spotify-embed";
import RecommendationItem from "../components/RecommendationItem";
import { PostDetails } from "./FeedPage";
import { createSpotifyLink, req } from "../utils/client";
import CreatePostForm from "../components/CreatePostForm";
import LyricsCard from "../components/LyricsCard";

interface Suggestion {
  name: string;
  artist: string;
  spotify_url: string;
  reason: string;
}

interface ContentDetails {
  id: number;
  link: string;
  content_type: string;
  artist_names: string[];
  album_name: string;
  song_name: string;
  genres: string[];
  ai_description: string;
  suggestions: Suggestion[];
  artist_name?: string;
  followers?: number;
  popularity?: number;
  top_tracks?: Array<{
    name: string;
    spotify_url: string;
  }>;

}

interface Playlist {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
}

interface PostPageProps {
  type: string;
}

const PostPage: React.FC<PostPageProps> = ({ type }) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
  const [playlistSearchQuery, setPlaylistSearchQuery] = useState('');
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>([]);

  const { spotifyId } = useParams<{ spotifyId: string }>();
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const [content, setContent] = useState<ContentDetails | null>(null);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [lyricsError, setLyricsError] = useState<string | null>(null);


  // Handle Spotify Authentication
  const handleSpotifyAuth = async () => {
    try {
      const response = await req('spotify/auth-url/', 'get', null);
      if (response.data && response.data.auth_url) {
        localStorage.setItem('returnToPath', window.location.pathname);
        window.location.href = response.data.auth_url;
      } else {
        console.error('No auth URL received');
      }
    } catch (error) {
      console.error('Failed to get auth URL:', error);
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
  // Handle return from Spotify auth
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    const returnPath = localStorage.getItem('returnToPath');
    
    if (code && returnPath) {
      localStorage.removeItem('returnToPath');
      
      const handleAuthCode = async () => {
        try {
          await req('spotify/callback/', 'post', { code });
          window.location.href = returnPath;
        } catch (error) {
          console.error('Failed to handle Spotify auth:', error);
        }
      };
      
      handleAuthCode();
    }
  }, []);

  // Fetch main page data
  useEffect(() => {
    const fetchData = async () => {
      if (!spotifyId) return;

      try {
        const spotifyLink = createSpotifyLink({ type, id: spotifyId });
        const response = await req(
          `get_pages_of_spot_embeds?link=${spotifyLink}`,
          "get",
          {}
        );

        if (response.data.posts) {
          setPosts(response.data.posts);
        }
        if (response.data.content) {
          setContent(response.data.content);
        }

        // Fetch lyrics if it's a track
        if (type === "track") {
          setLyricsLoading(true);
          setLyricsError(null);
          try {
            const lyricsResponse = await req(
              `get_lyrics?spotify_url=${spotifyLink}`,
              "get",
              {}
            );
            setLyrics(lyricsResponse.data.lyrics || "No lyrics found");
          } catch (error: any) {
            console.error("Failed to fetch lyrics:", error);
            setLyrics("No lyrics found");
            setLyricsError(null);
          } finally {
            setLyricsLoading(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
    addNowPlaying();

  }, [spotifyId, type]);

  // Fetch user playlists
  const fetchUserPlaylists = async () => {
    try {
      const response = await req('spotify/playlists/', 'get', null);
      console.log("Playlists response:", response);
      
      if (response.status === 401 || 
          (response.data && response.data.error === 'spotify_auth_required') ||
          response.data.error === 'Failed to load response data') {
        await handleSpotifyAuth();
        return;
      }
    
      // Access the playlists array from response.data.playlists
      const playlists = Array.isArray(response.data.playlists) ? response.data.playlists : [];
      console.log("Processed playlists:", playlists);
      setUserPlaylists(playlists);
      setFilteredPlaylists(playlists);
    } catch (error: any) {
      console.error('Failed to fetch playlists:', error);
      
      if (error.response && (
          error.response.status === 401 || 
          (error.response.data && error.response.data.error === 'spotify_auth_required') ||
          error.message.includes('Failed to load response data')
      )) {
        await handleSpotifyAuth();
        return;
      }
      setUserPlaylists([]);
      setFilteredPlaylists([]);
    }
  };  // Handle adding track to playlist
  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      if (!spotifyId) {
        console.error('No track ID available');
        return;
      }
  
      const formData = new FormData();
      formData.append('track_id', spotifyId);
  
      const response = await req(`spotify/playlist/${playlistId}/tracks/`, 'post', formData);
  
      if (response.status === 401 || (response.data && response.data.error === 'spotify_auth_required')) {
        await handleSpotifyAuth();
        return;
      }
  
      // Add success notification here if you want
      console.log('Successfully added track to playlist');
      modalRef.current?.close();
    } catch (error: any) {
      console.error('Failed to add track to playlist:', error);
      
      if (error.response && (error.response.status === 401 || 
          (error.response.data && error.response.data.error === 'spotify_auth_required'))) {
        await handleSpotifyAuth();
        return;
      }
    }
  };
  // Handle playlist search
  const handlePlaylistSearch = (query: string) => {
    setPlaylistSearchQuery(query);
    if (!Array.isArray(userPlaylists)) return;
    
    const filtered = userPlaylists.filter(playlist =>
      playlist.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPlaylists(filtered);
  };

  if (!spotifyId) {
    return <div>Invalid URL!</div>;
  }

  return (
    <div className="flex justify-center">
      {/* Left Column: Lyrics (only for tracks) */}
      {type === "track" && (
        <div className="mr-10">
          <LyricsCard
            lyrics={lyrics || "No lyrics found"}
            isLoading={lyricsLoading}
            error={null}
          />
        </div>
      )}

      {/* Main Content Section */}
      <div className="flex-1 max-w-2xl w-full">
        {/* Spotify Embed */}
        <Spotify wide link={`https://open.spotify.com/${type}/${spotifyId}`} />

        {/* Add to Playlist Button (only for tracks) */}
        {type === "track" && (
          <button
            className="btn btn-primary w-full my-4"
            onClick={async () => {
              try {
                setIsLoadingPlaylists(true);
                await fetchUserPlaylists();
                modalRef.current?.showModal();
              } catch (error) {
                console.error('Failed to handle playlist action:', error);
              } finally {
                setIsLoadingPlaylists(false);
              }
            }}
          >
            Add to Playlist
          </button>
        )}

        {/* AI Description */}
        {content && content.ai_description && (
          <div className="bg-base-200 p-4 rounded-lg my-4">
            <h3 className="text-lg font-semibold mb-2">AI Description</h3>
            <p>{content.ai_description}</p>
          </div>
        )}

        {/* Create Post Form */}
        <CreatePostForm
          initialLink={createSpotifyLink({ type, id: spotifyId })}
        />

        {/* Posts */}
        {posts.map((post) => (
          <PostCard key={post.id} isFeed={false} post={post} />
        ))}
      </div>

      {/* Right Column: Recommendations */}
      {content && content.suggestions && content.suggestions.length > 0 && (
        <div className="w-64 bg-base-200 p-4 ml-10">
          <h3 className="text-lg font-semibold mb-4">You might also like</h3>
          {content.suggestions.map((suggestion, index) => (
            <div key={index} className="mb-4">
              <RecommendationItem
                rec={{
                  type: "track",
                  spotifyId: suggestion.spotify_url.split("/").pop() || "",
                }}
              />
              <p className="text-sm mt-1 text-gray-600">{suggestion.reason}</p>
            </div>
          ))}
        </div>
      )}

      {/* Playlist Modal */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Add to Playlist</h3>
          
          {isLoadingPlaylists ? (
            <div className="flex justify-center py-4">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Search your playlists..."
                  className="input input-bordered w-full"
                  value={playlistSearchQuery}
                  onChange={(e) => handlePlaylistSearch(e.target.value)}
                />
              </div>

              <div className="mt-4 max-h-96 overflow-y-auto">
                {Array.isArray(filteredPlaylists) && filteredPlaylists.length > 0 ? (
                  filteredPlaylists.map(playlist => (
                    <div key={playlist.id} 
                      className="flex items-center justify-between p-2 hover:bg-base-200 rounded">
                      <div className="flex items-center gap-3">
                        {playlist.image_url && (
                          <img
                            src={playlist.image_url}
                            alt={playlist.name}
                            className="w-12 h-12 rounded"
                          />
                        )}
                        <div>
                          <p className="font-semibold">{playlist.name}</p>
                          <p className="text-sm text-gray-500">{playlist.description}</p>
                        </div>
                      </div>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleAddToPlaylist(playlist.id)}
                      >
                        Add
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No playlists found
                  </div>
                )}
              </div>
            </>
          )}

          <div className="modal-action">
            <button
              className="btn"
              onClick={() => modalRef.current?.close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default PostPage;
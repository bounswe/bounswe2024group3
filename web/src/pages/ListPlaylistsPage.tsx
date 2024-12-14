// src/pages/ListPlaylistsPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { req } from '../utils/client';
import { useUser } from '../providers/UserContext';
import PlaylistCard from '../components/PlaylistCard';

interface GeneratedPlaylist {
    id: string;
    name: string;
    description: string;
    spotify_url: string;
    reasoning: string;
}

interface UserPlaylist {
    id: string;
    name: string;
    description: string;
    public: boolean;
    tracks_total: number;
    external_url: string;
    image_url: string | null;
    owner?: {
        display_name: string;
        id: string;
    };
    followers?: number;
    created_at?: string;
    last_modified?: string;
}

interface PlaylistsResponse {
    playlists: UserPlaylist[];
    total: number;
    limit: number;
    offset: number;
    next: string | null;
    previous: string | null;
}

const ListPlaylistsPage: React.FC = () => {
    // Refs
    const dialogRef = useRef<HTMLDialogElement>(null);

    // State
    const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isFetchingPlaylists, setIsFetchingPlaylists] = useState(false);
    const [generatedPlaylist, setGeneratedPlaylist] = useState<GeneratedPlaylist | null>(null);
    const [userPlaylists, setUserPlaylists] = useState<UserPlaylist[]>([]);
    const [error, setError] = useState('');
    
    // Hooks
    const { username } = useUser();

    // Effects
    useEffect(() => {
        checkSpotifyConnection();
    }, []);

    // API Handlers
    const checkSpotifyConnection = async () => {
        try {
            const localState = localStorage.getItem('isSpotifyConnected');
            if (localState === 'true') {
                setIsSpotifyConnected(true);
                fetchUserPlaylists();
                return;
            }

            const response = await req('spotify/status', 'get', null);
            setIsSpotifyConnected(response.data.connected);

            if (response.data.connected) {
                localStorage.setItem('isSpotifyConnected', 'true');
                fetchUserPlaylists();
            } else {
                localStorage.removeItem('isSpotifyConnected');
            }
        } catch (err) {
            console.error('Failed to check Spotify connection:', err);
            setError('Failed to check Spotify connection');
        }
    };

    const fetchUserPlaylists = async () => {
        setIsFetchingPlaylists(true);
        setError('');
        try {
            const response = await req('spotify/playlists/', 'get', null);
            const data = response.data as PlaylistsResponse;
            setUserPlaylists(data.playlists);
        } catch (err: any) {
            setError('Failed to fetch playlists');
        } finally {
            setIsFetchingPlaylists(false);
        }
    };

    const handleSpotifyConnect = async () => {
        try {
            const response = await req('spotify/auth/', 'get', null);
            window.location.href = response.data.auth_url;
        } catch (err) {
            setError('Failed to connect to Spotify');
        }
    };

    const handleGeneratePlaylist = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        setError('');

        try {
            const response = await req('spotify/generate-playlist', 'post', { prompt });
            if (response.data.success && response.data.playlist) {
                setGeneratedPlaylist(response.data.playlist);
                fetchUserPlaylists(); // Refresh playlist list
                dialogRef.current?.close();
            } else if (response.data.error === "Spotify account not connected" && response.data.auth_url) {
                window.location.href = response.data.auth_url;
            } else {
                setError(response.data.error || 'Failed to generate playlist');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to generate playlist');
        } finally {
            setIsGenerating(false);
        }
    };

    // Component Renders
    const CreatePlaylistModal = () => (
        <dialog ref={dialogRef} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Create AI Playlist</h3>
                <form onSubmit={handleGeneratePlaylist}>
                    <div className="form-control">
                        <textarea 
                            className="textarea textarea-bordered h-24"
                            placeholder="Example: A playlist for a summer road trip with upbeat indie rock songs"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal-action">
                        <button 
                            type="submit" 
                            className={`btn btn-primary ${isGenerating ? 'loading' : ''}`}
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'Generating...' : 'Generate Playlist'}
                        </button>
                        <button 
                            type="button"
                            className="btn"
                            onClick={() => dialogRef.current?.close()}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );

    const GeneratedPlaylistView = () => (
        generatedPlaylist && (
            <div className="mt-8 bg-base-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-2">{generatedPlaylist.name}</h2>
                <p className="text-gray-600 mb-4">{generatedPlaylist.description}</p>
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">AI's Reasoning:</h3>
                    <p>{generatedPlaylist.reasoning}</p>
                </div>
                <iframe 
                    src={`https://open.spotify.com/embed/playlist/${generatedPlaylist.spotify_url.split('/').pop()}`}
                    width="100%"
                    height="380"
                    frameBorder="0"
                    allow="encrypted-media"
                    className="rounded-lg"
                />
            </div>
        )
    );

    // Conditional Renders
    if (!username) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <p className="text-lg text-center text-gray-600">
                    Please login to view playlists
                </p>
            </div>
        );
    }

    if (!isSpotifyConnected) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-6">Connect to Spotify</h1>
                    <p className="mb-4">To view and create playlists, you need to connect your Spotify account first.</p>
                    <button 
                        onClick={handleSpotifyConnect}
                        className="btn btn-primary"
                    >
                        Connect Spotify
                    </button>
                </div>
            </div>
        );
    }

    // Main Render
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Your Playlists</h1>
                    <button 
                        onClick={() => dialogRef.current?.showModal()}
                        className="btn btn-primary"
                    >
                        Create AI Playlist
                    </button>
                </div>

                <CreatePlaylistModal />

                {/* Error Display */}
                {error && (
                    <div className="alert alert-error mb-6">
                        <p>{error}</p>
                    </div>
                )}

                {/* Generated Playlist */}
                <GeneratedPlaylistView />

                {/* Playlists Grid */}
                {isFetchingPlaylists ? (
                    <div className="flex justify-center py-8">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : userPlaylists.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">No playlists found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userPlaylists.map(playlist => (
                            <PlaylistCard 
                                key={playlist.id} 
                                playlist={playlist}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListPlaylistsPage;
// src/pages/PlaylistDetailPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { req } from '../utils/client';

interface Track {
    id: string;
    name: string;
    artist: string;
    album: string;
    duration_ms: number;
    image_url: string;
    preview_url: string | null;
}

interface PlaylistDetail {
    id: string;
    name: string;
    description: string;
    public: boolean;
    tracks_total: number;
    image_url: string | null;
    tracks: Track[];
}

interface SearchResult {
    id: string;
    name: string;
    artist: string;
    album: string;
    image_url: string;
}

const PlaylistDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const modalRef = useRef<HTMLDialogElement>(null);
    const navigate = useNavigate();


    const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPlaylistDetails();
    }, [id]);

    const fetchPlaylistDetails = async () => {
        try {
            const response = await req(`spotify/playlist/${id}/`, 'get', null);
            setPlaylist(response.data);
        } catch (err) {
            setError('Failed to fetch playlist details');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
    
        setIsSearching(true);
        try {
            // Using URLSearchParams to properly format the query parameters
            const params = new URLSearchParams({
                q: searchQuery,
                type: 'track',  // Just 'track', not comma-separated
                limit: '20'
            });
    
            const response = await req(`search_spotify/?${params.toString()}`, 'get', null);
            // Or alternatively:
            // const response = await req('search_spotify/', 'get', null, { params });
    
            if (response.data.results?.tracks) {
                setSearchResults(response.data.results.tracks.map((track: any) => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists.join(', '),
                    album: track.album,
                    image_url: track.image_url
                })));
            }
        } catch (err) {
            console.error('Search failed:', err);
        } finally {
            setIsSearching(false);
        }
    };    
    const handleAddTrack = async (trackId: string) => {
        try {
            await req(`spotify/playlist/${id}/tracks/`, 'post', {
                track_id: trackId,  // Make sure this matches your backend expectation
            });
            await fetchPlaylistDetails();
            // Optionally close the modal after successful addition
            modalRef.current?.close();
        } catch (err) {
            console.error('Failed to add track:', err);
            setError('Failed to add track to playlist');
        }
    };

    

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>;
    }

    if (error || !playlist) {
        return <div className="container mx-auto px-4 py-8">
            <div className="alert alert-error">{error || 'Playlist not found'}</div>
        </div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex gap-8 mb-8">
                    {playlist.image_url && (
                        <img 
                            src={playlist.image_url}
                            alt={playlist.name}
                            className="w-64 h-64 rounded-lg shadow-lg"
                        />
                    )}
                    <div className="flex flex-col justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
                            <p className="text-gray-600 mb-4">{playlist.description}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{playlist.tracks_total} tracks</span>
                                <span>•</span>
                                <span>{playlist.public ? 'Public' : 'Private'}</span>
                            </div>
                        </div>
                        <button 
                            className="btn btn-primary w-fit"
                            onClick={() => modalRef.current?.showModal()}
                        >
                            Add Tracks
                        </button>
                    </div>
                </div>

                {/* Tracks Table */}
                <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Title</th>
                            <th>Artist</th>
                            <th>Album</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                    {playlist.tracks.map(track => (
                    <tr 
                        key={track.id}
                        onClick={() => {
                            // Directly navigate to the track page
                            navigate(`/track/${track.id}`, {
                                state: { 
                                    type: 'track',
                                    spotifyId: track.id
                                }
                            });
                        }}
        className="cursor-pointer hover:bg-base-200"
                            >
                                <td>
                                    <img 
                                        src={track.image_url} 
                                        alt={track.name}
                                        className="w-10 h-10 rounded"
                                    />
                                </td>
                                <td>{track.name}</td>
                                <td>{track.artist}</td>
                                <td>{track.album}</td>
                                <td>{formatDuration(track.duration_ms)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
                {/* Search Modal */}
                <dialog ref={modalRef} className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Add Tracks</h3>
                        <div className="form-control">
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Search for songs..."
                                    className="input input-bordered w-full"
                                    value={searchQuery}
                                    onChange={e => {
                                        setSearchQuery(e.target.value);
                                        handleSearch();
                                    }}
                                />
                                <button 
                                    type="button"
                                    className="btn btn-square"
                                    onClick={handleSearch}
                                    disabled={isSearching}
                                >
                                    {isSearching ? (
                                        <span className="loading loading-spinner" />
                                    ) : (
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 max-h-96 overflow-y-auto">
                            {searchResults.map(track => (
                                <div key={track.id} className="flex items-center justify-between p-2 hover:bg-base-200 rounded">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={track.image_url} 
                                            alt={track.name}
                                            className="w-12 h-12 rounded"
                                        />
                                        <div>
                                            <p className="font-semibold">{track.name}</p>
                                            <p className="text-sm text-gray-500">{track.artist}</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleAddTrack(track.id)}
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="modal-action">
                            <button 
                                type="button"
                                className="btn"
                                onClick={() => modalRef.current?.close()}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            </div>
        </div>
    );
};

export default PlaylistDetailPage;
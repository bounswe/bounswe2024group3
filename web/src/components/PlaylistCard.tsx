// src/components/PlaylistCard.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface PlaylistCardProps {
    playlist: {
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
    };
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
    const [isHovered, setIsHovered] = useState(false);

    const MusicIcon = () => (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 text-base-content opacity-30" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
        >
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" 
            />
        </svg>
    );

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatFollowers = (count?: number) => {
        if (!count) return '0';
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        }
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    const PlaylistImage = () => (
        <div className="relative group">
            {playlist.image_url ? (
                <img 
                    src={playlist.image_url} 
                    alt={playlist.name}
                    className={`w-full h-48 object-cover rounded-t-xl transition-transform duration-300 ${
                        isHovered ? 'scale-105' : ''
                    }`}
                />
            ) : (
                <div className="w-full h-48 bg-base-300 flex items-center justify-center rounded-t-xl">
                    <MusicIcon />
                </div>
            )}
            <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : ''
            }`}>
                <Link 
                    to={`/view-playlist/${playlist.id}`}
                    className="btn btn-primary btn-sm"
                >
                    View Playlist
                </Link>
            </div>
        </div>
    );

    const PlaylistInfo = () => (
        <div className="p-4">
            <div className="flex justify-between items-start mb-2">
                <h2 className="font-bold text-xl truncate flex-1">
                    {playlist.name}
                </h2>
                <div className="badge badge-primary ml-2">
                    {playlist.public ? 'Public' : 'Private'}
                </div>
            </div>
            
            {playlist.description && (
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {playlist.description}
                </p>
            )}

            <div className="flex flex-col gap-1 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                    </svg>
                    <span>{playlist.tracks_total} tracks</span>
                </div>
                
                {playlist.owner && (
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Created by {playlist.owner.display_name}</span>
                    </div>
                )}

                {playlist.followers !== undefined && (
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{formatFollowers(playlist.followers)} followers</span>
                    </div>
                )}

                {(playlist.created_at || playlist.last_modified) && (
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                            {playlist.last_modified 
                                ? `Updated ${formatDate(playlist.last_modified)}`
                                : `Created ${formatDate(playlist.created_at)}`
                            }
                        </span>
                    </div>
                )}
            </div>
        </div>
    );

    const CardActions = () => (
        <div className="p-4 pt-0 flex justify-between items-center border-t border-base-300">
            <div className="flex gap-2">
                <Link 
                    to={`/view-playlist/${playlist.id}`}
                    className="btn btn-primary btn-sm"
                >
                    View Details
                </Link>
                <a 
                    href={playlist.external_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                    onClick={(e) => e.stopPropagation()}
                >
                    Open in Spotify
                </a>
            </div>
        </div>
    );

    return (
        <div 
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <PlaylistImage />
            <PlaylistInfo />
            <CardActions />
        </div>
    );
};

export default PlaylistCard;
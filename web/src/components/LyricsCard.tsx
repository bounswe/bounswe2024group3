import React, { useState } from 'react';

interface LyricsCardProps {
  lyrics: string;
  isLoading?: boolean;
  error?: string | null;
}

const LyricsCard: React.FC<LyricsCardProps> = ({ 
  lyrics, 
  isLoading = false, 
  error = null 
}) => {
  const [showFullLyrics, setShowFullLyrics] = useState(false);

  const renderLyrics = (lyrics: string) => {
    // Split lyrics into sentences, with a maximum of 3 if not expanded
    const sentences = lyrics.split(/[.!?]+/).filter(sentence => sentence.trim());
    const truncatedLyrics = showFullLyrics 
      ? sentences 
      : sentences.slice(0, 3);

    return (
      <div className="text-sm text-base-content leading-relaxed">
        {truncatedLyrics.map((sentence, index) => (
          <p key={index} className="mb-2">
            {sentence.trim() + (index < truncatedLyrics.length - 1 ? '.' : '')}
          </p>
        ))}
        {sentences.length > 3 && (
          <button 
            className="btn btn-ghost btn-sm mt-2"
            onClick={() => setShowFullLyrics(!showFullLyrics)}
          >
            {showFullLyrics ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-xl ">
        <div className="card-body">
          <div className="flex items-center">
            <span className="loading loading-spinner loading-md mr-2"></span>
            <p className="text-base-content">Loading lyrics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-error bg-opacity-10 shadow-xl">
        <div className="card-body">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
        Lyrics
        </h2>
        {renderLyrics(lyrics)}
      </div>
    </div>
  );
};

export default LyricsCard;
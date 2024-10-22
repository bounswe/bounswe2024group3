import { Spotify } from "react-spotify-embed";
import { Link } from "react-router-dom";

const RecommendationItem: React.FC<{ rec: { type: string; spotifyId: string } }> = ({ rec }) => {
  return (
    <div className="relative" style={{ width: '230px', height: '100px' }}>
      {/* Spotify Embed */}
      <Spotify
        width={230}
        height={100}
        link={`https://open.spotify.com/${rec.type}/${rec.spotifyId}`}
      />

      {/* Invisible clickable overlay */}
        <Link
      to={`/${rec.type}/${rec.spotifyId}`}
      className="absolute inset-0 z-10"
      aria-label="Override Spotify link"
    ></Link>
      
    </div>
  );
};

export default RecommendationItem;
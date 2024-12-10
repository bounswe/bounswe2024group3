import { Spotify } from "react-spotify-embed";
import { Link } from "react-router-dom";

const RecommendationItem: React.FC<{ rec: { type: string; spotifyId: string } }> = ({ rec }) => {
  return (
    <div
      className="relative"
      style={{ width: "230px", height: "100px" }}
      role="region"
      aria-labelledby={`recommendation-${rec.spotifyId}`}
    >
      {/* Spotify Embed */}
      <Spotify
        width={230}
        height={100}
        link={`https://open.spotify.com/${rec.type}/${rec.spotifyId}`}
        aria-label={`Spotify embed for ${rec.type}`}
      />

      {/* Invisible clickable overlay */}
      <Link
        to={`/${rec.type}/${rec.spotifyId}`}
        className="absolute inset-0 z-10"
        aria-label={`Open details for ${rec.type} with ID ${rec.spotifyId}`}
        id={`recommendation-${rec.spotifyId}`}
      ></Link>
    </div>
  );
};

export default RecommendationItem;

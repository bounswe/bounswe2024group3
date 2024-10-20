import { useParams } from "react-router-dom";
import SpotifyEmbed from "../components/SpotifyEmbed";

interface PostPageProps {
  type: string;
}

const PostPage: React.FC<PostPageProps> = ({ type }) => {
  const { spotifyId } = useParams<{ spotifyId: string }>();

  if (!spotifyId) {
    return <div>Error: Missing spotifyId parameter!</div>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold underline text-red-600">
        Post Page - {type.toUpperCase()}
      </h1>
      <SpotifyEmbed spotifyId={`spotify:${type}:${spotifyId}?theme=0`} />
      <button className="btn btn-primary">Primary</button>
    </>
  );
};

export default PostPage;
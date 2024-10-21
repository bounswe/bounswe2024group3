import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { Spotify } from "react-spotify-embed";

interface PostPageProps {
  type: string;
}

export type PostDetails = {
  id: number;
  imageUrl: string | null;
  title: string | undefined;
  content: string;
  username: string;
  likes: number;
  dislikes: number;
  created_at: Date;
  type: string;
  spotifyId: string;
  userAction: string | null;
};

const PostPage: React.FC<PostPageProps> = ({ type }) => {
  const { spotifyId } = useParams<{ spotifyId: string }>();

  if (!spotifyId) {
    return <div>Error: Missing spotifyId parameter!</div>;
  }

  return (
    <>

      <Spotify wide link={`https://open.spotify.com/${type}/${spotifyId}`} />
      <PostCard
        isFeed={true}
        post={{
          id: 1,
          imageUrl: null,
          title: undefined,
          content: "This is the content of the post",
          username: "trella",
          likes: 10,
          dislikes: 5,
          created_at: new Date(),
          type: "track",
          spotifyId: spotifyId,
          userAction: "like",
        }}
      />
      <button className="btn btn-primary">Primary</button>
    </>
  );
};

export default PostPage;

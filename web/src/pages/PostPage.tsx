import { useParams } from "react-router-dom";
import SpotifyEmbed from "../components/SpotifyEmbed";
import PostCard from "../components/PostCard";


interface PostPageProps {
  type: string;
}

export type PostDetails = {
  id: number;
  imageUrl: string | null;
  title: string;
  content: string;
  username: string;
  likes: number;
  dislikes: number;
  created_at: Date,
  type: string;
  spotifyId: string;
};

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
      <PostCard
        post={{
          id: 1,
          imageUrl: null,
          title: "Post Title",
          content: "This is the content of the post",
          username: "Username",
          likes: 10,
          dislikes: 5,
          created_at: new Date(),
          type: "track",
          spotifyId: spotifyId,
        }} />
      <button className="btn btn-primary">Primary</button>
    </>
  );
};

export default PostPage;
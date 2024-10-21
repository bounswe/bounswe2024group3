import { useEffect, useState } from "react";
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

export let mockPosts: PostDetails[] = [
  {
    id: 1,
    imageUrl: null,
    title: undefined,
    content: "Selamlar, şöyle bir playlist hazırladım. Ortamlarda çalarsınız :)",
    username: "ekrembal",
    likes: 10,
    dislikes: 5,
    created_at: new Date(),
    type: "playlist",
    spotifyId: "3oAH9FsuQGzqP5hAHiEcFD",
    userAction: "like",
  },
  {
    id: 2,
    imageUrl: null,
    title: undefined,
    content: "I really like this song",
    username: "trella",
    likes: 10,
    dislikes: 5,
    created_at: new Date(),
    type: "track",
    spotifyId: "7x76RN4ZCsw5DxT8LOmexq",
    userAction: null,
  },
  // Add more posts if needed
];

const PostPage: React.FC<PostPageProps> = ({ type }) => {
  const { spotifyId } = useParams<{ spotifyId: string }>();
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const [newPostContent, setNewPostContent] = useState(""); // To track new post content

  useEffect(() => {
    // If spotifyId is provided, filter posts by it; otherwise, show all posts
    if (spotifyId) {
      const filteredPosts = mockPosts.filter(
        (post) => post.spotifyId === spotifyId
      );
      setPosts(filteredPosts);
    } else {
      setPosts(mockPosts); // Show all posts if no spotifyId is given
    }
  }, [spotifyId]);

  const handlePostSubmit = () => {
    // Add the new post to the list
    const newPost: PostDetails = {
      id: posts.length + 1,
      imageUrl: null,
      title: undefined,
      content: newPostContent,
      username: "ekrembal", // You can replace this with the logged-in user's name
      likes: 0,
      dislikes: 0,
      created_at: new Date(),
      type,
      spotifyId: spotifyId || "",
      userAction: null,
    };
    mockPosts.push(newPost); // Add the new post to the mockPosts array
    setPosts([newPost, ...posts]); // Add the new post to the top of the list
    setNewPostContent(""); // Clear the input field
  };

  if (!posts.length) {
    return <div>No posts found!</div>;
  }

  return (
    <div>
      <Spotify wide link={`https://open.spotify.com/${type}/${spotifyId}`} />
      
      {/* Show the post creation section only if the user is logged in */}
      {true && (
        <div className="add-post-section">
          <h3>Add a New Post</h3>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Write your post content here..."
            className="textarea textarea-bordered w-full mb-4"
          />
          <button className="btn btn-primary" onClick={handlePostSubmit}>
            Submit Post
          </button>
        </div>
      )}

      {/* Render the list of posts */}
      {posts.map((post) => (
        <PostCard key={post.id} isFeed={false} post={post} />
      ))}
    </div>
  );
};

export default PostPage;
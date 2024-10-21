import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { Spotify } from "react-spotify-embed";
import RecommendationItem from "../components/RecommendationItem";
import { useUser } from "../providers/UserContext";

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
    id: 11,
    imageUrl: null,
    title: undefined,
    content:
      "Selamlar, şöyle bir playlist hazırladım. Ortamlarda çalarsınız :)",
    username: "ekrembal",
    likes: 10,
    dislikes: 5,
    created_at: new Date(),
    type: "playlist",
    spotifyId: "3oAH9FsuQGzqP5hAHiEcFD",
    userAction: "like",
  },
  {
    id: 12,
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
  {
    id: 13,
    imageUrl: null,
    title: undefined,
    content: "Мне очень нравится этот альбом",
    username: "нравьбом",
    likes: 1,
    dislikes: 2,
    created_at: new Date(),
    type: "album",
    spotifyId: "6RFizmJ3VitZBr8kwo62Kq",
    userAction: "dislike",
  },
  {
    id: 1,
    imageUrl: null,
    title: undefined,
    content:
      "Check out this track: 'New Person, Same Old Mistakes' by Tame Impala. It's amazing!",
    username: "ekrembal",
    likes: 15,
    dislikes: 3,
    created_at: new Date(),
    type: "track",
    spotifyId: "52ojopYMUzeNcudsoz7O9D",
    userAction: "like",
  },
  {
    id: 2,
    imageUrl: null,
    title: undefined,
    content: "I'm vibing with 'The Finishing'. Give it a listen!",
    username: "trella",
    likes: 20,
    dislikes: 1,
    created_at: new Date(),
    type: "track",
    spotifyId: "2SCLswvRP8hAYdIKsrLV6h",
    userAction: null,
  },
  {
    id: 3,
    imageUrl: null,
    title: undefined,
    content: "Burning Hour is on repeat for me today. Great track!",
    username: "nate",
    likes: 12,
    dislikes: 2,
    created_at: new Date(),
    type: "track",
    spotifyId: "2dje3ZBu1j1r0QfR7mtS0l",
    userAction: "like",
  },
  {
    id: 4,
    imageUrl: null,
    title: undefined,
    content: "Are You There is perfect for a chill evening.",
    username: "musiclover",
    likes: 18,
    dislikes: 0,
    created_at: new Date(),
    type: "track",
    spotifyId: "1LuK2NE1dkha6A4Cey3tsA",
    userAction: null,
  },
  {
    id: 5,
    imageUrl: null,
    title: undefined,
    content: "I'm really into '24/7'. Listen to it if you haven't yet!",
    username: "ekrembal",
    likes: 25,
    dislikes: 4,
    created_at: new Date(),
    type: "track",
    spotifyId: "4UySkSnMBKf1PS32agnwxp",
    userAction: "like",
  },
  {
    id: 6,
    imageUrl: null,
    title: undefined,
    content: "Vanity Corner is such a unique track. What do you think?",
    username: "nate",
    likes: 8,
    dislikes: 1,
    created_at: new Date(),
    type: "track",
    spotifyId: "2e7CRfHmTnrT5SxfXbQ0lF",
    userAction: null,
  },
  {
    id: 7,
    imageUrl: null,
    title: undefined,
    content: "I made this playlist 'nE'. Let me know your thoughts!",
    username: "ekrembal",
    likes: 30,
    dislikes: 5,
    created_at: new Date(),
    type: "playlist",
    spotifyId: "0Ljm42Eo0Ia1bDuw6sGvVI",
    userAction: "like",
  },
  {
    id: 8,
    imageUrl: null,
    title: undefined,
    content: "The 'zıbar' playlist is perfect for chilling. Check it out!",
    username: "trella",
    likes: 22,
    dislikes: 3,
    created_at: new Date(),
    type: "playlist",
    spotifyId: "7kbGTNApfe03SjBDIFrQ3B",
    userAction: null,
  },
  {
    id: 9,
    imageUrl: null,
    title: undefined,
    content: "Dive deep into my 'POSEIDON' playlist! Hope you enjoy.",
    username: "нравьбом",
    likes: 16,
    dislikes: 2,
    created_at: new Date(),
    type: "playlist",
    spotifyId: "6fMfMHqUS72fM3YS8MDKtr",
    userAction: "dislike",
  },
  {
    id: 10,
    imageUrl: null,
    title: undefined,
    content: "Here's a great Techno playlist I've been enjoying lately!",
    username: "musiclover",
    likes: 28,
    dislikes: 1,
    created_at: new Date(),
    type: "playlist",
    spotifyId: "24ztzWYSKzrV8G5OiMw8yS",
    userAction: null,
  },
];

const PostPage: React.FC<PostPageProps> = ({ type }) => {
  const { spotifyId } = useParams<{ spotifyId: string }>();
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const [newPostContent, setNewPostContent] = useState(""); // To track new post content
  const { username } = useUser();


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
      username: username ,// You can replace this with the logged-in user's name
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
    <div className="flex">
      {/* Main Content Section */}
      <div className="flex-1">
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

      {/* Recommendations Bar */}
      <div className="w-64 bg-gray-100 p-4 ml-4">
        <h3 className="text-lg font-semibold mb-4">Recommended for You</h3>
        {mockPosts
          .filter((x) => x.spotifyId !== spotifyId && x.type === type)
          .slice(0, 10)
          .map((rec) => (
            <RecommendationItem key={rec.id} rec={rec} />
          ))}
      </div>
    </div>
  );
};

export default PostPage;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { Spotify } from "react-spotify-embed";
import RecommendationItem from "../components/RecommendationItem";
import { useUser } from "../providers/UserContext";
import useAccessibility from "../components/Accessibility";

interface PostPageProps {
  type: string;
}

export type PostDetails = {
  id: number;
  imageUrl: string | null;
  title: string | undefined;
  content: any;
  comment: string;
  username: string;
  likes: number;
  dislikes: number;
  created_at: Date;

  userAction: string | null;

  tags: string[];
};
export let mockPosts: PostDetails[] = [
  {
    id: 11,
    imageUrl: null,
    title: undefined,
    comment: "Selamlar, şöyle bir playlist hazırladım. Ortamlarda çalarsınız :)",
    content: {
      id: "3oAH9FsuQGzqP5hAHiEcFD",
      link: "https://open.spotify.com/playlist/3oAH9FsuQGzqP5hAHiEcFD",
      description: "Selamlar, şöyle bir playlist hazırladım. Ortamlarda çalarsınız :)",
      content_type: "playlist",
    },
    username: "ekrembal",
    likes: 10,
    dislikes: 5,
    created_at: new Date(),
    userAction: "like",
    tags: [],
  },
  {
    id: 12,
    imageUrl: null,
    title: undefined,
    comment: "I really like this song",
    content: {
      id: "7x76RN4ZCsw5DxT8LOmexq",
      link: "https://open.spotify.com/track/7x76RN4ZCsw5DxT8LOmexq",
      description: "I really like this song",
      content_type: "track",
    },
    username: "trella",
    likes: 10,
    dislikes: 5,
    created_at: new Date(),
    userAction: null,
    tags: [],
  },
  {
    id: 13,
    imageUrl: null,
    title: undefined,
    comment: "Мне очень нравится этот альбом",
    content: {
      id: "6RFizmJ3VitZBr8kwo62Kq",
      link: "https://open.spotify.com/album/6RFizmJ3VitZBr8kwo62Kq",
      description: "Мне очень нравится этот альбом",
      content_type: "album",
    },
    username: "нравьбом",
    likes: 1,
    dislikes: 2,
    created_at: new Date(),
    userAction: "dislike",
    tags: [],
  },
  {
    id: 1,
    imageUrl: null,
    title: undefined,
    comment: "Check out this track: 'New Person, Same Old Mistakes' by Tame Impala. It's amazing!",
    content: {
      id: "52ojopYMUzeNcudsoz7O9D",
      link: "https://open.spotify.com/track/52ojopYMUzeNcudsoz7O9D",
      description: "Check out this track: 'New Person, Same Old Mistakes' by Tame Impala. It's amazing!",
      content_type: "track",
    },
    username: "ekrembal",
    likes: 15,
    dislikes: 3,
    created_at: new Date(),
    userAction: "like",
    tags: [],
  },
  {
    id: 2,
    imageUrl: null,
    title: undefined,
    comment: "I'm vibing with 'The Finishing'. Give it a listen!",
    content: {
      id: "2SCLswvRP8hAYdIKsrLV6h",
      link: "https://open.spotify.com/track/2SCLswvRP8hAYdIKsrLV6h",
      description: "I'm vibing with 'The Finishing'. Give it a listen!",
      content_type: "track",
    },
    username: "trella",
    likes: 20,
    dislikes: 1,
    created_at: new Date(),
    userAction: null,
    tags: [],
  },
  {
    id: 3,
    imageUrl: null,
    title: undefined,
    comment: "Burning Hour is on repeat for me today. Great track!",
    content: {
      id: "2dje3ZBu1j1r0QfR7mtS0l",
      link: "https://open.spotify.com/track/2dje3ZBu1j1r0QfR7mtS0l",
      description: "Burning Hour is on repeat for me today. Great track!",
      content_type: "track",
    },
    username: "nate",
    likes: 12,
    dislikes: 2,
    created_at: new Date(),
    userAction: "like",
    tags: [],
  },
  {
    id: 4,
    imageUrl: null,
    title: undefined,
    comment: "Are You There is perfect for a chill evening.",
    content: {
      id: "1LuK2NE1dkha6A4Cey3tsA",
      link: "https://open.spotify.com/track/1LuK2NE1dkha6A4Cey3tsA",
      description: "Are You There is perfect for a chill evening.",
      content_type: "track",
    },
    username: "musiclover",
    likes: 18,
    dislikes: 0,
    created_at: new Date(),
    userAction: null,
    tags: [],
  },
  {
    id: 5,
    imageUrl: null,
    title: undefined,
    comment: "I'm really into '24/7'. Listen to it if you haven't yet!",
    content: {
      id: "4UySkSnMBKf1PS32agnwxp",
      link: "https://open.spotify.com/track/4UySkSnMBKf1PS32agnwxp",
      description: "I'm really into '24/7'. Listen to it if you haven't yet!",
      content_type: "track",
    },
    username: "ekrembal",
    likes: 25,
    dislikes: 4,
    created_at: new Date(),
    userAction: "like",
    tags: [],
  },
  {
    id: 6,
    imageUrl: null,
    title: undefined,
    comment: "Vanity Corner is such a unique track. What do you think?",
    content: {
      id: "2e7CRfHmTnrT5SxfXbQ0lF",
      link: "https://open.spotify.com/track/2e7CRfHmTnrT5SxfXbQ0lF",
      description: "Vanity Corner is such a unique track. What do you think?",
      content_type: "track",
    },
    username: "nate",
    likes: 8,
    dislikes: 1,
    created_at: new Date(),
    userAction: null,
    tags: [],
  },
  {
    id: 7,
    imageUrl: null,
    title: undefined,
    comment: "I made this playlist 'nE'. Let me know your thoughts!",
    content: {
      id: "0Ljm42Eo0Ia1bDuw6sGvVI",
      link: "https://open.spotify.com/playlist/0Ljm42Eo0Ia1bDuw6sGvVI",
      description: "I made this playlist 'nE'. Let me know your thoughts!",
      content_type: "playlist",
    },
    username: "ekrembal",
    likes: 30,
    dislikes: 5,
    created_at: new Date(),
    userAction: "like",
    tags: [],
  },
  {
    id: 8,
    imageUrl: null,
    title: undefined,
    comment: "The 'zıbar' playlist is perfect for chilling. Check it out!",
    content: {
      id: "7kbGTNApfe03SjBDIFrQ3B",
      link: "https://open.spotify.com/playlist/7kbGTNApfe03SjBDIFrQ3B",
      description: "The 'zıbar' playlist is perfect for chilling. Check it out!",
      content_type: "playlist",
    },
    username: "trella",
    likes: 22,
    dislikes: 3,
    created_at: new Date(),
    userAction: null,
    tags: [],
  },
  {
    id: 9,
    imageUrl: null,
    title: undefined,
    comment: "Dive deep into my 'POSEIDON' playlist! Hope you enjoy.",
    content: {
      id: "6fMfMHqUS72fM3YS8MDKtr",
      link: "https://open.spotify.com/playlist/6fMfMHqUS72fM3YS8MDKtr",
      description: "Dive deep into my 'POSEIDON' playlist! Hope you enjoy.",
      content_type: "playlist",
    },
    username: "нравьбом",
    likes: 16,
    dislikes: 2,
    created_at: new Date(),
    userAction: "dislike",
    tags: [],
  },
  {
    id: 10,
    imageUrl: null,
    title: undefined,
    comment: "Here's a great Techno playlist I've been enjoying lately!",
    content: {
      id: "24ztzWYSKzrV8G5OiMw8yS",
      link: "https://open.spotify.com/playlist/24ztzWYSKzrV8G5OiMw8yS",
      description: "Here's a great Techno playlist I've been enjoying lately!",
      content_type: "playlist",
    },
    username: "musiclover",
    likes: 19,
    dislikes: 4,
    created_at: new Date(),
    userAction: null,
    tags: [],
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
      
      userAction: null,
      link: "",
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

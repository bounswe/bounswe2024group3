import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { req } from "../utils/client";
import PostCard from "../components/PostCard";
import CreatePostForm from "../components/CreatePostForm";

export type PostContent = {
  id: number;
  link: string;
  description: string;
  content_type: string;
};

export type PostDetails = {
  id: number;
  imageUrl: string | null;
  title: string | undefined;
  content: PostContent;
  comment: string;
  username: string;
  total_likes: number;
  total_dislikes: number;
  created_at: Date;
  userAction: string | null;
};

export const FeedPage = () => {
  const { query } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showCreateButton, setShowCreateButton] = useState(true);
  const [posts, setPosts] = useState<PostDetails[]>([]);

  useEffect(() => {
    const handleQuery = async () => {
      setIsLoading(true);
      setError("");
      setPosts([]);
      try {
        const feedQuery = `get-posts/`;
        const response = await req(feedQuery, "get", {});
        console.log("Feed response:", response.data);
        const posts: PostDetails[] = response.data.posts.map(
          (post: any, idx: number) => ({
            id: post.id, // Use the actual `id` from the post instead of the index
            comment: post.comment,
            username: post.username || "", // Assuming `username` might not be available in the JSON, using a fallback
            created_at: new Date(post.created_at),
            image: post.image,
            link: post.link,
            total_likes: post.total_likes,
            content: {
              id: post.content.id,
              link: post.content.link,
              description: post.content.description,
              content_type: post.content.content_type,
            },
            tags: post.tags.map((tag: any) => tag.name),
          })
        );
        if (posts.length === 0) {
          throw new Error("No posts found");
        }
        setPosts(posts);
      } catch (error: any) {
        console.error("Get failed:", error);
        setError(error.message);
      }
      setIsLoading(false);
    };
    handleQuery();
  }, [query]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center pt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex-1 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-4">Feed Page</h1>
        <CreatePostForm />
        {error && <p className="text-red-500">{error}</p>}

        {posts.map((post) => (
          <PostCard key={post.id} post={post} isFeed={true} />
        ))}
      </div>
    </div>
  );
};

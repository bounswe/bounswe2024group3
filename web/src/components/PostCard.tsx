import React, { useState } from "react";
import {Link} from "react-router-dom";
import { PostDetails } from "../pages/PostPage";
import { Spotify } from "react-spotify-embed";
import SvgIcon from "./SvgIcon";
import useAccessibility from "./Accessibility";

const PostCard = ({ post, isFeed }: { post: PostDetails; isFeed: boolean }) => {
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [userAction, setUserAction] = useState<string | null>(post.userAction);
  useAccessibility();

  // Handle like
  const handleLike = async () => {
    if (userAction === "like") return; // Prevent double like

    // Make request to backend to increment likes (dummy API call)
    try {
      await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      setLikes((prev) => prev + 1);
      if (userAction === "dislike") setDislikes((prev) => prev - 1); // Undo dislike
      setUserAction("like");
    } catch (error) {
      console.error("Failed to like the post", error);
    }
  };

  // Handle dislike
  const handleDislike = async () => {
    if (userAction === "dislike") return; // Prevent double dislike

    // Make request to backend to increment dislikes (dummy API call)
    try {
      await fetch(`/api/posts/${post.id}/dislike`, { method: "POST" });
      setDislikes((prev) => prev + 1);
      if (userAction === "like") setLikes((prev) => prev - 1); // Undo like
      setUserAction("dislike");
    } catch (error) {
      console.error("Failed to dislike the post", error);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl p-6 max-w-xlg mx-auto my-4">
      {/* Conditional rendering for the image */}
      <figure>
        {post.imageUrl ? (
          <img src={post.imageUrl} alt={post.title} />
        ) : (
          <h1 className="text-4xl text-center">{post.title}</h1>
        )}
      </figure>
      <div className="card-body">
        {/* Username links to the user's profile */}
        <h2 className="card-title">
          <a
            href={`/profile/${post.username}`}
            className="text-blue-500 hover:underline"
          >
            {post.username}
          </a>
        </h2>
        {isFeed && (
          <div className="relative">
            {/* Spotify Embed */}
            <Spotify
              width=  "100%"
              height="100%"
              link={`https://open.spotify.com/${post.type}/${post.spotifyId}`}
            />

            {/* Invisible clickable overlay */}
            <Link
  to={`/${post.type}/${post.spotifyId}`}
  className="absolute inset-0 z-10"
  aria-label="Override Spotify link"
></Link>
          </div>
        )}
        <div className="card-body">
          <p>{post.content}</p>
        </div>

        <p className="right align">
          {new Date(post.created_at).toLocaleString()}
        </p>

        {/* Like and Dislike actions */}
        <div className="card-actions justify-end">
          <button
            className={`btn ${userAction === "like" ? "btn-primary" : ""}`}
            onClick={handleLike}
            aria-label="Like"
          >
            <SvgIcon icon="like" className="mr-2" />
            {likes}
          </button>
          <button
            className={`btn ${userAction === "dislike" ? "btn-primary" : ""}`}
            onClick={handleDislike}
            aria-label="Dislike"
          >
            <SvgIcon icon="dislike" className="mr-2" />
            {dislikes}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

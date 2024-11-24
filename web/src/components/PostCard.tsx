import React, { useState } from "react";

import {Link} from "react-router-dom";
import { PostDetails } from "../pages/FeedPage";
import { Spotify } from "react-spotify-embed";
import SvgIcon from "./SvgIcon";
import useAccessibility from "./Accessibility";
import { parseSpotifyLink, req } from "../utils/client";


const PostCard = ({ post, isFeed }: { post: PostDetails; isFeed: boolean }) => {
  const [likes, setLikes] = useState(post.total_likes);
  const [dislikes, setDislikes] = useState(post.total_dislikes);
  const [userAction, setUserAction] = useState<string | null>(post.userAction);
  useAccessibility();

  // Handle like
  const handleLike = async () => {
    if (userAction === "like") return; // Prevent double like

    try {
      // Backend request to increment likes
      const response =  await req(`posts/${post.id}/like/`,"post",{});

      // Update local states
      setLikes((prev) => prev + 1);
      if (userAction === "dislike") setDislikes((prev) => prev - 1); // Undo dislike
      setUserAction("like");
    } catch (error) {
      console.error("Failed to like the post:", error);
    }
  };

  // Handle dislike
  const handleDislike = async () => {
    if (userAction === "dislike") return; // Prevent double dislike

    try {
      // Backend request to increment dislikes
      const response =  await req(`posts/${post.id}/dislike`,"post",{});

      // Update local states
      setDislikes((prev) => prev + 1);
      if (userAction === "like") setLikes((prev) => prev - 1); // Undo like
      setUserAction("dislike");
    } catch (error) {
      console.error("Failed to dislike the post:", error);
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
              width="100%"
              height="100%"
              link={post.content.link}
            />
            <Link

  to={`/${post.content.content_type}/${parseSpotifyLink(post.content.link).id}`}
  className="absolute inset-0 z-10"
  aria-label="Override Spotify link"
></Link>
          </div>
        )}
        <div className="card-body">
          <p>{post.comment}</p>
        </div>

        {/* Post creation date */}
        <p className="text-right text-sm text-gray-500">
          {new Date(post.created_at).toLocaleString()}
        </p>

        {/* Like and Dislike actions */}
        <div className="card-actions justify-end space-x-2">
          <button
            className={`btn ${userAction === "like" ? "btn-primary" : "btn-secondary"}`}
            onClick={handleLike}
            aria-label="Like"
          >
            <SvgIcon icon="like" className="mr-2" />
            {likes}
          </button>
          <button
            className={`btn ${userAction === "dislike" ? "btn-primary" : "btn-secondary"}`}
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

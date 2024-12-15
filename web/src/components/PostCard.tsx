import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PostDetails } from "../pages/FeedPage";
import { Spotify } from "react-spotify-embed";
import SvgIcon from "./SvgIcon";
import useAccessibility from "./Accessibility";
import { parseSpotifyLink, req } from "../utils/client";

const PostCard = ({ post, isFeed }: { post: PostDetails; isFeed: boolean }) => {
  const [likes, setLikes] = useState(post.total_likes);
  const [dislikes, setDislikes] = useState(post.total_dislikes);
  const [userAction, setUserAction] = useState<string | null>(post.userAction);

  // const [isFollowing, setIsFollowing] = useState(post.isFollowing); // Check if the user is already followed
  useAccessibility();

  // Handle Follow/Unfollow
  // const handleFollowToggle = async () => {
  //   try {
  //     const endpoint = isFollowing
  //       ? `/api/users/${post.username}/unfollow`
  //       : `/api/users/${post.username}/follow`;

  //     const response = await fetch(endpoint, { method: "POST" });
  //     if (!response.ok) throw new Error("Failed to toggle follow status");

  //     // Toggle the follow state
  //     setIsFollowing(!isFollowing);
  //   } catch (error) {
  //     console.error("Error while toggling follow/unfollow:", error);
  //   }
  // };

  // Handle like
  const handleLike = async () => {
    if (userAction === "like") return; // Prevent double like

    try {
      // Backend request to increment likes
      const response = await req(`posts/${post.id}/like/`, "post", {});

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
      const response = await req(`posts/${post.id}/dislike`, "post", {});

      // Update local states
      setDislikes((prev) => prev + 1);
      if (userAction === "like") setLikes((prev) => prev - 1); // Undo like
      setUserAction("dislike");
    } catch (error) {
      console.error("Failed to dislike the post:", error);
    }
  };

  return (
    <div
      className="card bg-base-100 shadow-xl p-6 max-w-xlg mx-auto my-4"
      role="article"
      aria-labelledby={`post-title-${post.id}`}
      aria-describedby={`post-description-${post.id}`}
    >
      {/* Conditional rendering for the image */}
      <figure>
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={`Image related to the post titled "${post.title}"`}
          />
        ) : (
          <h1
            className="text-4xl text-center"
            id={`post-title-${post.id}`}
            aria-label={post.title}
          >
            {post.title}
          </h1>
        )}
      </figure>

      <div className="card-body">
        {/* Username links to the user's profile */}
        <h2 className="card-title">
          <a
            href={`/user/${post.username}`}
            className="text-blue-500 hover:underline"
            aria-label={`Visit ${post.username}'s profile`}
          >
            {post.username}
          </a>
        </h2>

        {/* Follow/Unfollow button
        <button
          onClick={handleFollowToggle}
          className={`btn ${isFollowing ? "btn-secondary" : "btn-primary"}`}
          aria-label={isFollowing ? "Unfollow user" : "Follow user"}
        >
          {isFollowing ? "Unfollow" : "Follow"}

        </button> */}
        
        {isFeed && (
          <div className="relative">
            {/* Spotify Embed */}
            <Spotify
              width="100%"
              height="100%"
              link={post.content.link}
              aria-label="Spotify embed"
            />
            <Link
              to={`/${post.content.content_type}/${parseSpotifyLink(post.content.link).id}`}
              className="absolute inset-0 z-10"
              aria-label="Open Spotify content details"
            ></Link>
          </div>
        )}
        <div className="card-body" id={`post-description-${post.id}`}>
          <p>{post.comment}</p>
        </div>

        {/* Post creation date */}
        <p className="text-right text-sm text-gray-500" aria-label="Post date">
          {new Date(post.created_at).toLocaleString()}
        </p>

        {/* Like and Dislike actions */}
        <div className="card-actions justify-end space-x-2">
          <button
            className={`btn ${
              userAction === "like" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={handleLike}
            aria-label={`Like post. Current likes: ${likes}`}
          >
            <SvgIcon icon="like" className="mr-2" />
            {likes}
          </button>
          <button
            className={`btn ${
              userAction === "dislike" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={handleDislike}
            aria-label={`Dislike post. Current dislikes: ${dislikes}`}
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

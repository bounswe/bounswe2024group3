import React, { useState, useEffect } from "react";
import { req } from "../utils/client";

const CreatePostForm = () => {
  const [link, setLink] = useState("");
  const [comment, setComment] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    const storedLatitude = localStorage.getItem("latitude");
    const storedLongitude = localStorage.getItem("longitude");

    if (storedLatitude && storedLongitude) {
      setLatitude(storedLatitude);
      setLongitude(storedLongitude);
    } else {
      console.error("Latitude or Longitude not found in localStorage");
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e:any) => {
    e.preventDefault();

    const postData = {
      link,
      comment,
      image: "", // Default to an empty string
      latitude,
      longitude,
    };

    try {
      // Send the post data to your backend
      const response = await req("create-post", "post", postData);


     

      // Reset form fields on successful submission
      setLink("");
      setComment("");
      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl p-6 max-w-lg mx-auto my-4">
      <h2 className="card-title mb-4">Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-4">
          <label htmlFor="link" className="block mb-2">Spotify Link:</label>
          <input
            type="text"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="comment" className="block mb-2">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="textarea textarea-bordered w-full"
            rows={3}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePostForm;

import React, { useState, useEffect } from "react";
import { createSpotifyLink, parseSpotifyLink, req } from "../utils/client";

const CreatePostForm = ({ initialLink = "" }) => {
  const [link, setLink] = useState(initialLink);
  const [comment, setComment] = useState("");
  const [latitude, setLatitude] = useState("0");
  const [longitude, setLongitude] = useState("0");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      link: createSpotifyLink(parseSpotifyLink(link)),
      comment,
      image: "", // Default to an empty string
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    try {
      // Send the post data to your backend
      const response = await req("create-post", "post", postData);

      // Reset form fields on successful submission
      setComment("");
      if (!initialLink) setLink("");
      alert("Post created successfully!");

      // Reload the page to display the new post
      window.location.reload();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <>
      {/* Floating "+" Button */}
      <button
        className="btn btn-circle btn-primary fixed bottom-4 right-4 shadow-lg"
        onClick={() => setIsModalOpen(true)}
        aria-label="Create a new post"
      >
        +
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="modal modal-open"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div className="modal-box">
            <h2 id="modal-title" className="font-bold text-lg mb-4">
              Create a New Post
            </h2>
            <p id="modal-description" className="sr-only">
              Fill in the form below to create a new post with a Spotify link and optional comment.
            </p>
            <form onSubmit={handleSubmit}>
              {!initialLink && (
                <div className="form-group mb-4">
                  <label htmlFor="link" className="block mb-2">
                    Spotify Link:
                  </label>
                  <input
                    type="text"
                    id="link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="input input-bordered w-full"
                    required
                    aria-label="Spotify link"
                  />
                </div>
              )}
              <div className="form-group mb-4">
                <label htmlFor="comment" className="block mb-2">
                  Comment:
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="textarea textarea-bordered w-full"
                  rows={3}
                  aria-label="Comment about the post"
                />
              </div>
              <div className="modal-action">
                <button
                  type="submit"
                  className="btn btn-primary"
                  aria-label="Submit the form to create a post"
                >
                  Create Post
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Cancel and close the modal"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePostForm;

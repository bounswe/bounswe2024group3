import React, { useState, useEffect } from "react";
import axios from "axios";
import { req } from "../utils/client";
import { useUser } from "../providers/UserContest";
import { useNavigate } from 'react-router-dom';

interface Author {
  author_id: number;
  author_name: string;
}

interface Genre {
  genre_id: number;
  genre_name: string;
}

export interface Booklist {
  booklist_id: number;
  booklist_name: string;
}

interface UserProfile {
  name: string;
  surname: string;
  username: string;
  email: string;
  fav_authors: Author[];
  fav_genres: Genre[];
  booklists: Booklist[];
}

interface BookDetails {
  id: number;
  title: string;
  cover_url: string | null;
  authors: string[];
  genres: string[];
  isbn: string;
  description: string;
  publication_date: string;
  page_count: number | null;
}

const Profile = () => {

  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [booklistDetails, setBooklistDetails] = useState<BookDetails[]>([]);
  const [selectedBooklist, setSelectedBooklist] = useState<Booklist | null>(null);
  const { userId } = useUser();

  useEffect(() => {
    if (userId) {
      setLoading(true);
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}get_user_profile/?user_id=${userId}`)
        .then((response) => {
          setProfile(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError("Failed to fetch profile");
          setLoading(false);
        });
    }
  }, [userId]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;

    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}update_user_profile/`, profile, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        alert("Profile updated successfully!");
        setLoading(false);
        setEditMode(false);
      })
      .catch((error) => {
        setError("Failed to update profile");
        setLoading(false);
      });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      setLoading(true);
      axios
        .delete(`${process.env.REACT_APP_BACKEND_URL}delete_user/`, {
          withCredentials: true,
        })
        .then((response) => {
          alert("User deleted successfully");
          navigate('/register');
          // Handle post-deletion logic, e.g., redirect to login page
        })
        .catch((error) => {
          setError("Failed to delete profile");
          setLoading(false);
        });
    }
  };

  const handleNewBooklist = () => {
    const booklistName = window.prompt("Enter a name for the new booklist");
    if (booklistName) {
      setLoading(true);
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}create_booklist/`, { name: booklistName }, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((response) => {
          alert("Booklist created successfully!");
          setLoading(false);
          setProfile((prev) =>
            prev ? { ...prev, booklists: [...prev.booklists, response.data] } : null
          );
        })
        .catch((error) => {
          setError("Failed to create booklist");
          setLoading(false);
        });
    }
  };

  const handleBooklistClick = async (booklistId: number, booklist_name: string) => {
    // alert("Fetching booklist details...");
    // alert("Booklist ID: " + booklistId);
    // alert("Booklist Name: " + booklist_name);
    try {
      const response = await req(`get_specific_booklist/?booklist_id=${booklistId}`, "get", {});
      setBooklistDetails(response.data.books);
      setSelectedBooklist({
        booklist_id: booklistId,
        booklist_name,
      });
    } catch (error) {

      setSelectedBooklist({
        booklist_id: booklistId,
        booklist_name,
      })
      setBooklistDetails([]);
      console.error("Error fetching booklist details:", error);
    }
  };

  const closeModal = () => {
    setBooklistDetails([]);
    setSelectedBooklist(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 style={{ color: "#333", fontSize: "24px", borderBottom: "2px solid #999", paddingBottom: "10px" }}>
        Profile
      </h1>
      {!editMode ? (
        <div style={{ color: "#666", marginTop: "20px" }}>
          <p>
            <strong>Username:</strong> {profile?.username}
          </p>
          <p>
            <strong>Name:</strong> {profile?.name}
          </p>
          <p>
            <strong>Surname:</strong> {profile?.surname}
          </p>
          <p>
            <strong>Email:</strong> {profile?.email}
          </p>
          <div>
            <strong>Favorite Authors:</strong>
            <ul>
              {profile?.fav_authors.map((author) => (
                <li key={author.author_id} style={{ listStyleType: "none" }}>
                  {author.author_name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Favorite Genres:</strong>
            <ul>
              {profile?.fav_genres.map((genre) => (
                <li key={genre.genre_id} style={{ listStyleType: "none" }}>
                  {genre.genre_name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Booklists:</strong>
            <ul>
              {profile?.booklists.map((booklist) => (
                <li key={booklist.booklist_id} style={{ listStyleType: "none" }}>
                  <button className="btn btn-ghost" onClick={() => handleBooklistClick(booklist.booklist_id, booklist.booklist_name)}>
                    {booklist.booklist_name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="button-container" style={{ marginTop: "20px" }}>
            <div>
              <button onClick={() => setEditMode(true)} className="btn btn-secondary" style={{ width: "100%", marginBottom: "10px" }}>
                Edit Profile
              </button>
            </div>
            <div>
              <button onClick={handleDelete} className="btn btn-danger mb-2" style={{ width: "100%" }}>
                Delete Profile
              </button>
            </div>
            <div>
              <button onClick={handleNewBooklist} className="btn btn-danger" style={{ width: "100%" }}>
                Create a Booklist
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ color: "#666", marginTop: "20px" }}>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Username:
              <input type="text" name="username" value={profile?.username || ""} onChange={handleInputChange} style={{ display: "block", width: "100%" }} />
            </label>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Name:
              <input type="text" name="name" value={profile?.name || ""} onChange={handleInputChange} style={{ display: "block", width: "100%" }} />
            </label>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Surname:
              <input type="text" name="surname" value={profile?.surname || ""} onChange={handleInputChange} style={{ display: "block", width: "100%" }} />
            </label>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Email:
              <input type="email" name="email" value={profile?.email || ""} onChange={handleInputChange} style={{ display: "block", width: "100%" }} />
            </label>
          </div>
          <div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginBottom: "10px" }}>
              Update Profile
            </button>
          </div>
          <div>
            <button type="button" onClick={() => setEditMode(false)} className="btn btn-secondary" style={{ width: "100%" }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {selectedBooklist && (
        <div className={`modal ${selectedBooklist ? "modal-open" : ""}`}>
          <div className="modal-box">
            <h3 className="font-bold text-lg">{selectedBooklist.booklist_name}</h3>
            {booklistDetails.length === 0 ? (
              <p>No books in this booklist</p>
            ) : (
              <ul>
                {booklistDetails.map((book) => (
                  <li key={book.id} className="my-2">
                    <div className="flex items-center">
                      {book.cover_url && (
                        <img src={book.cover_url} alt={book.title} className="w-16 h-24 object-cover mr-4" />
                      )}
                      <div>
                        <h4 className="text-lg font-semibold">{book.title}</h4>
                        <p className="text-sm text-gray-600">{book.authors.join(", ")}</p>
                        <p className="text-sm text-gray-600">{book.publication_date}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="modal-action">
              <button onClick={closeModal} className="btn btn-primary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

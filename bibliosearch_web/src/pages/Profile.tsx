import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../providers/UserContest'; // Ensure correct import path

interface Author {
  author_id: number;
  author_name: string;
}

interface Genre {
  genre_id: number;
  genre_name: string;
}

interface Booklist {
  booklist_id: number;
  booklist_name: string;
}

interface UserProfile {
  name: string;
  surname: string;
  username: string; // Assuming username is part of the profile
  email: string; // Assuming email is also needed
  fav_authors: Author[];
  fav_genres: Genre[];
  booklists: Booklist[];
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { userId } = useUser();
  const { username } = useUser();
  const { email } = useUser();
  console.log(userId);

  useEffect(() => {
    if (userId) {
      
      setLoading(true);
      axios.get(`${process.env.REACT_APP_BACKEND_URL}get_user_profile/?user_id=${userId}`)
        .then(response => {
          setProfile(response.data);
          console.log(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError('Failed to fetch profile');
          setLoading(false);
        });
    }
  }, [userId]);

  console.log(999);
  console.log(profile);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfile(prev => prev ? { ...prev, [name]: value } : null);
  };


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;

    setLoading(true);
    
    axios.post(`${process.env.REACT_APP_BACKEND_URL}update_user_profile/`, profile, {    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true  // Ensures cookies are sent with the request})
}).then(response => {
        alert('Profile updated successfully!');
        setLoading(false);
        setEditMode(false); // Turn off edit mode after successful update
      })
      .catch(error => {
        setError('Failed to update profile');
        setLoading(false);
      });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      setLoading(true);
      axios.delete(`${process.env.REACT_APP_BACKEND_URL}delete_user/`, {
        withCredentials: true
      }).then(response => {
        alert('User deleted successfully');
        // Handle post-deletion logic, e.g., redirect to login page
      }).catch(error => {
        setError('Failed to delete profile');
        setLoading(false);
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
  <div>
    <h1>Profile</h1>
    {!editMode ? (
      <>
        <p><strong>Username:</strong> {profile?.username}</p>
        <p><strong>Name:</strong> {profile?.name}</p>
        <p><strong>Surname:</strong> {profile?.surname}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Favorite Authors:</strong> {profile?.fav_authors.map(author => <span key={author.author_id}>{author.author_name}, </span>)}</p>
        <p><strong>Favorite Genres:</strong> {profile?.fav_genres.map(genre => <span key={genre.genre_id}>{genre.genre_name}, </span>)}</p>
        <p><strong>Booklists:</strong> {profile?.booklists.map(booklist => <span key={booklist.booklist_id}>{booklist.booklist_name}, </span>)}</p>
        <button onClick={() => setEditMode(true)}>Edit Profile</button>
        <button onClick={handleDelete} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>Delete Profile</button>
      </>
    ) : (
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={profile?.username || ''} onChange={handleInputChange} />
        </label>
        <label>
          Name:
          <input type="text" name="name" value={profile?.name || ''} onChange={handleInputChange} />
        </label>
        <label>
          Surname:
          <input type="text" name="surname" value={profile?.surname || ''} onChange={handleInputChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={profile?.email || ''} onChange={handleInputChange} />
        </label>
        <button type="submit">Update Profile</button>
        <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
      </form>
    )}
  </div>
);

};

export default Profile;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../providers/UserContest'; 

interface FavoriteAuthor {
  author_id: number;
  author_name: string;
}

interface FavoriteGenre {
  genre_id: number;
  genre_name: string;
}

interface Booklist {
  booklist_id: number;
  booklist_name: string;
}

interface UserProfile {
  username: string;
  name: string;
  surname: string;
  email: string;
  fav_authors: FavoriteAuthor[];
  fav_genres: FavoriteGenre[];
  booklists: Booklist[];
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    const { userId } = useUser();
    console.log(userId);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACKEND_URL + 'get_user_profile/?user_id=' + userId);
        setProfile(response.data);
      } catch (error) {
        setError('Error fetching profile');
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Failed to load profile information.</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Name:</strong> {profile.name} </p>
      <p><strong>Surname:</strong> {profile.surname}</p>
      <h2>Favorite Authors</h2>
      <ul>
        {profile.fav_authors.map((author) => (
          <li key={author.author_id}>{author.author_name}</li>
        ))}
      </ul>
      <h2>Favorite Genres</h2>
      <ul>
        {profile.fav_genres.map((genre) => (
          <li key={genre.genre_id}>{genre.genre_name}</li>
        ))}
      </ul>
      <h2>Booklists</h2>
      <ul>
        {profile.booklists.map((booklist) => (
          <li key={booklist.booklist_id}>{booklist.booklist_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;

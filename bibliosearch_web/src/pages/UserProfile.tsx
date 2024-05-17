    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { useParams } from 'react-router-dom'; // For fetching URL params
    import { req } from '../utils/client';

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
    username: string;
    email: string;
    fav_authors: Author[];
    fav_genres: Genre[];
    booklists: Booklist[];
    }

    const UserProfile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams<{ id: string }>(); // Using useParams to fetch the user ID from the URL
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}get_user_profile/?user_id=${id}`
        );
        setProfile(response.data);
        await checkFollowStatus();
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    

    const checkFollowStatus = async () => {
      try {
        const response = await req(
          `check_user_follows_user/?target_user_id=${id}`,
          'get',
          {}
        );
        console.log(response);
        setIsFollowing(response.data.is_following);
      } catch (error) {
        console.error('Failed to check follow status:', error);
        setError('Failed to check follow status');
      }
    };

    fetchProfile();
    checkFollowStatus();
  }, [id]);
    
  const handleFollow = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await req('follow_unfollow_user', 'post', {
        target_user_id: id
      });
      setIsFollowing((prev) => !prev); // Toggle the follow status
      console.log('Follow/unfollow action completed');
    } catch (error: any) {
      setError(error.message);
    }
  };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!profile) return <div>No profile data available.</div>;

    return (
        <div>
        <h1>User Profile</h1>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Surname:</strong> {profile.surname}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Favorite Authors:</strong> {profile.fav_authors.map(author => `${author.author_name}, `)}</p>
        <p><strong>Favorite Genres:</strong> {profile.fav_genres.map(genre => `${genre.genre_name}, `)}</p>
        <p><strong>Booklists:</strong> {profile.booklists.map(booklist => `${booklist.booklist_name}, `)}</p>
        <div className="button-container">
        <button className="btn btn-primary mt-4" onClick={handleFollow}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      </div>
        </div>
    );
    };

    export default UserProfile;

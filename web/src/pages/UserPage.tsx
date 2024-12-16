import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { req } from "../utils/client";
import PostCard from "../components/PostCard";
import { useUser } from "../providers/UserContext";
import { PostDetails } from "./FeedPage";

export type UserDetails = {
  username: string;
  user_id: number;
  name: string;
  surname: string;
  email: string;
  labels: string[];
  profilePicture: string | null;
  isFollowing: boolean;
};

interface Playlist {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  tracks_total: number;
  external_url: string;
  public: boolean;
}

const UserPage = () => {
  const { user } = useParams<{ user: string }>();
  const { username } = useUser();
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userPosts, setUserPosts] = useState<PostDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const isCurrentUser = !user;

  // New states for playlists
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);

  // Fetch user data and posts
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const query = isCurrentUser ? username : user;

        // Fetch user details
        const userResponse = await req(`get_user?username=${query}`, "get", {});
        setUserDetails(userResponse.data);

        if (!isCurrentUser) {
          const checkFollowing = await req(`check-following?username=${query}`, "get", {});
          setUserDetails((prevDetails) =>
            prevDetails ? { ...prevDetails, isFollowing: checkFollowing.data.is_following } : null
          );
        }

        // Fetch user posts
        const postsResponse = await req(`get-user-posts?username=${query}`, "get", {});
        setUserPosts(postsResponse.data.posts);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        setError(error.message || "Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [username, user, isCurrentUser]);

  // New effect for fetching playlists
  useEffect(() => {
    const fetchUserPlaylists = async () => {
      if (!userDetails?.user_id) return;
      
      setPlaylistsLoading(true);
      try {
        const response = await req(`spotify/get_user_spotify_playlists/${userDetails.user_id}/`, "get", {});
        if (response.data.is_connected) {
          setPlaylists(response.data.playlists);
          setIsSpotifyConnected(true);
        } else {
          setIsSpotifyConnected(false);
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setPlaylistsLoading(false);
      }
    };

    fetchUserPlaylists();
  }, [userDetails?.user_id]);

  const handleFollowToggle = async () => {
    if (!userDetails) return;

    try {
      const endpoint = userDetails.isFollowing
        ? `unfollow/${userDetails.user_id}`
        : `follow/${userDetails.user_id}`;

      const response = await req(endpoint, "post", {});
      if (!response) throw new Error("Failed to toggle follow status");

      setUserDetails((prevDetails) =>
        prevDetails ? { ...prevDetails, isFollowing: !prevDetails.isFollowing } : null
      );
    } catch (error) {
      console.error("Error while toggling follow/unfollow:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center pt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;
  if (!userDetails) return <p>User not found</p>;

  return (
    <div className="flex flex-col items-center w-full px-4">
      {/* Profile Section */}
      <div className="w-full max-w-4xl bg-base-100 rounded-lg shadow-lg mb-6">
        <div className="flex flex-col md:flex-row items-center p-6">
          {/* Profile Picture */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <img
              src={
                userDetails.profilePicture ||
                "https://via.placeholder.com/150?text=No+Image"
              }
              alt={`${userDetails.name} ${userDetails.surname}`}
              className="object-cover w-full h-full"
            />
          </div>

          {/* User Info */}
          <div className="flex-1 mt-4 md:mt-0 md:ml-6 text-center md:text-left">
            <h1 className="text-2xl font-semibold">{`${userDetails.name} ${userDetails.surname}`}</h1>
            <p className="text-gray-600">@{userDetails.username}</p>

            {/* Labels */}
            {/* {userDetails.labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {userDetails.labels.map((label, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )} */}

            {/* Edit Button for Current User */}
            {isCurrentUser && (
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                Edit Profile
              </button>
            )}
            {!isCurrentUser && (
              <button
                onClick={handleFollowToggle}
                className={`mt-4 ${
                  userDetails.isFollowing
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white px-4 py-2 rounded transition`}
              >
                {userDetails.isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">{`${
          isCurrentUser ? "Your" : `${userDetails.name}'s`
        } Posts`}</h2>
        {userPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} isFeed={true} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No posts to display.</p>
        )}
      </div>

      {/* New Playlists Section */}
      <div className="w-full max-w-4xl">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">
          {`${isCurrentUser ? "Your" : `${userDetails.name}'s`} Playlists`}
        </h2>

        {!isSpotifyConnected ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              {isCurrentUser 
                ? "Connect your Spotify account to display your playlists"
                : "This user hasn't connected their Spotify account yet"}
            </p>
            {isCurrentUser && (
              <Link to="/view-playlist" className="btn btn-primary mt-4">
                Connect Spotify
              </Link>
            )}
          </div>
        ) : playlistsLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : playlists.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {playlists.map((playlist) => (
              <div 
                key={playlist.id} 
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/view-playlist/${playlist.id}`)}
              >
                <figure className="px-4 pt-4">
                  <img 
                    src={playlist.image_url || "https://via.placeholder.com/150?text=No+Image"} 
                    alt={playlist.name}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                </figure>
                <div className="card-body p-4">
                  <h3 className="card-title text-sm line-clamp-2">{playlist.name}</h3>
                  <p className="text-xs text-gray-500">{playlist.tracks_total} tracks</p>
                  {playlist.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {playlist.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            {isCurrentUser 
              ? "You don't have any public playlists yet"
              : "This user doesn't have any public playlists"}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserPage;

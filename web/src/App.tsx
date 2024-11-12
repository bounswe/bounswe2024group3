import PostCard from "./components/PostCard";
import { mockPosts } from "./pages/PostPage";
import { useUser } from "./providers/UserContext";
import useAccessibility, { setScreenReaderMode } from "./components/Accessibility";
function App() {

  useAccessibility();
  const { username } = useUser();
  return (
    <>
      {username ? mockPosts.map((post) => (
          <PostCard key={post.id} isFeed={true} post={post} />
      )) :
      <p className="text-lg text-center text-gray-600 mt-10">
          Please login to see the posts
        </p>}
    </>
  );
}

export default App;

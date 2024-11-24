import PostCard from "./components/PostCard";
import { useUser } from "./providers/UserContext";
import useAccessibility, { setScreenReaderMode } from "./components/Accessibility";
import CreatePostForm from "./components/CreatePostForm";
function App() {

  useAccessibility();
  const { username } = useUser();
  return (
    <>
    { <CreatePostForm />

    }
      {username ? null:
      <p className="text-lg text-center text-gray-600 mt-10">
          Please login to see the posts
        </p>}
    </>
  );
}

export default App;

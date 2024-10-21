import PostCard from "./components/PostCard";
import { mockPosts } from "./pages/PostPage";

function App() {
  return (
    <>
      {mockPosts.map((post) => (
          <PostCard key={post.id} isFeed={true} post={post} />
      ))}
    </>
  );
}

export default App;

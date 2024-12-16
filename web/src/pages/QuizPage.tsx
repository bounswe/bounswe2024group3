// web/src/pages/QuizPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { req } from "../utils/client";
import { useUser } from "../providers/UserContext";
import { PostDetails } from "./FeedPage";
import QuizComponent from "../components/QuizComponent";
import LyricsQuizComponent from "../components/LyricsQuizComponent";

export const QuizPage = () => {
  const { query } = useParams();
  const username = useUser().username;
  const [quizType, setQuizType] = useState<'posts' | 'lyrics'>('posts');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<PostDetails[]>([]);

  useEffect(() => {
    if (quizType === 'posts') {
      const handleQuery = async () => {
        setIsLoading(true);
        setError("");
        setPosts([]);

        try {
          const feedQuery = `get-posts/`;
          const response = await req(feedQuery, "get", {});
          const posts: PostDetails[] = response.data.posts;
          if (!posts.length) {
            throw new Error("No posts found");
          }
          setPosts(posts);
        } catch (error: any) {
          console.error("Error occurred:", error);
          setError(error.message || "An unexpected error occurred");
        } finally {
          setIsLoading(false);
        }
      };

      handleQuery();
    }
  }, [query, quizType]);

  if (!username) {
    return (
      <div className="flex justify-center items-start">
        <h1>Please login to see quizzes. </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="tabs tabs-boxed mb-6">
        <a 
          className={`tab ${quizType === 'posts' ? 'tab-active' : ''}`}
          onClick={() => setQuizType('posts')}
        >
          Posts Quiz
        </a>
        <a 
          className={`tab ${quizType === 'lyrics' ? 'tab-active' : ''}`}
          onClick={() => setQuizType('lyrics')}
        >
          Lyrics Quiz
        </a>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center pt-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="flex-1 max-w-2xl w-full">
          {quizType === 'posts' && posts.length > 0 && <QuizComponent posts={posts} />}
          {quizType === 'lyrics' && <LyricsQuizComponent />}
        </div>
      )}
    </div>
  );
};
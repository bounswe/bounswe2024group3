// web/src/components/QuizComponent.tsx
import { useState, useEffect } from "react";
import { PostDetails } from "../pages/FeedPage";
import { Spotify } from "react-spotify-embed";
import { req } from "../utils/client";

interface QuizProps {
  posts: PostDetails[];
}

interface RandomSong {
  link: string;
  name: string;
  artist: string;
}

const QuizComponent: React.FC<QuizProps> = ({ posts }) => {
  const [quizTracks, setQuizTracks] = useState<RandomSong[]>([]);
  const [correctTrack, setCorrectTrack] = useState<string>("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const shuffleArray = <T,>(array: T[]): T[] => {
    return array.sort(() => Math.random() - 0.5);
  };

  const generateQuiz = async () => {
    try {
      setLoading(true);
      // Get 4 random tracks from Spotify API
      const response = await req("random-songs/", "get", { limit: 4 });
      const randomSongs: RandomSong[] = response.data.songs;

      // Select one random song as the correct answer
      const correctSong = randomSongs[0];
      const otherSongs = randomSongs.slice(1);

      const allTracks = shuffleArray([correctSong, ...otherSongs]);

      if (correctSong.link === correctTrack) {
        generateQuiz();
        return;
      }

      setQuizTracks(allTracks);
      setCorrectTrack(correctSong.link);
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerClick = (track: RandomSong) => {
    if (track.link === correctTrack) {
      setScore(prev => prev + 1);
      alert("Correct! 🎉");
      generateQuiz();
    } else {
      alert("Try Again! 🤔");
    }
  };

  useEffect(() => {
    generateQuiz();
  }, [posts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="stats shadow mb-6">
        <div className="stat">
          <div className="stat-title">Score</div>
          <div className="stat-value">{score}</div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Guess the Correct Track</h2>
      {correctTrack && (
        <div className="relative mb-8" style={{ width: 300, height: 100 }}>
          <Spotify width={300} height={100} link={correctTrack} />

          {/* Left overlay */}
          <div
            className="absolute inset-0 bg-white"
            style={{
              clipPath: "polygon(0 0, 100% 0, 90% 60%, 100% 100%, 0 100%)",
            }}
          />

          {/* Right overlay */}
          <div
            className="absolute inset-0 bg-white"
            style={{
              clipPath: "polygon(190% 0, 75% 0, 97% 58%, 75% 100%, 190% 100%)",
            }}
          />

          {/* Main overlay */}
          <div
            className="absolute inset-0 bg-white"
            style={{
              pointerEvents: "none",
            }}
          />

          {/* Play text */}
          <div
            className="absolute text-center text-black"
            style={{
              top: "41%",
              left: "88%",
              fontSize: "14px",
              pointerEvents: "none",
            }}
          >
            Play
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        {quizTracks.map((track, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(track)}
            className="btn btn-primary h-auto py-4 flex flex-col items-center"
          >
            <span className="font-bold">{track.name}</span>
            <span className="text-sm opacity-90">{track.artist}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizComponent;
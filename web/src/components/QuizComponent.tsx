import { useState, useEffect } from "react";
import { PostDetails } from "../pages/FeedPage";
import { Spotify } from "react-spotify-embed";

interface QuizProps {
  posts: PostDetails[];
}

const QuizComponent: React.FC<QuizProps> = ({ posts }) => {
  const [quizTracks, setQuizTracks] = useState<string[]>([]);
  const [correctTrack, setCorrectTrack] = useState<string>("");

  const shuffleArray = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const generateQuiz = () => {
    try {
      console.log("asdadasfagad");
      // Extract unique links from posts
      const uniqueLinks = Array.from(
        new Set(posts.map((post) => post.content.link))
      );

      if (uniqueLinks.length < 4) {
        alert("Not enough unique tracks to generate a quiz!");
        return;
      }

      // Randomly select 4 tracks
      const selectedTracks = shuffleArray(uniqueLinks).slice(0, 4);

      // Set one track as the correct answer
      const correctAnswer =
        selectedTracks[Math.floor(Math.random() * selectedTracks.length)];

      console.log("Selected tracks:", selectedTracks);
      console.log("Correct answer:", correctAnswer);

      if (correctAnswer === correctTrack) {
        generateQuiz();
        return;
      }

      setQuizTracks(selectedTracks);
      setCorrectTrack(correctAnswer);
    } catch (error) {
      console.error("Error generating quiz:", error);
    }
  };

  const handleAnswerClick = (track: string) => {
    if (track === correctTrack) {
      alert("Correct!");
      generateQuiz();
    } else {
      alert("Try Again!");
    }
  };

  useEffect(() => {
    generateQuiz();
  }, [posts]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4">Guess the Correct Track</h2>
      {correctTrack && (
        <div className="relative" style={{ width: 300, height: 100 }}>
          {/* Spotify Embed */}
          <Spotify width={300} height={100} link={correctTrack} />

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-white"
            style={{
              // pointerEvents: "none", // Allow interaction with the play button
              clipPath: "polygon(0 0, 100% 0, 90% 60%, 100% 100%, 0 100%)", // Rectangle covering the leftmost part (60% width)
            }}
          ></div>

          <div
            className="absolute inset-0 bg-white"
            style={{
              // pointerEvents: "none", // Allow interaction with the play button
              clipPath: "polygon(190% 0, 75% 0, 97% 58%, 75% 100%, 190% 100%)", // Rectangle covering the leftmost part (60% width)
            }}
          ></div>

          <div
            className="absolute inset-0 bg-white"
            style={{
              pointerEvents: "none", // Allow interaction with the play button
            }}
          ></div>

          <div
            className="absolute text-center text-black"
            style={{
              top: "41%", // Adjust y-axis (default center)
              left: "88%", // Adjust x-axis (default center)
              // transform: "translate(-50%, -50%)", // Center align the text
              fontSize: "14px", // Adjust font size if needed
              pointerEvents: "none", // Allow interaction with the play button
            }}
          >Play
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {quizTracks.map((track, index) => (
          <div key={index} className="flex flex-col items-center">
            <Spotify width={200} height={100} link={track} />{" "}
            <button
              onClick={() => handleAnswerClick(track)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizComponent;

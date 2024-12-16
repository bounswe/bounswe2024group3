// web/src/components/LyricsQuizComponent.tsx
import { useState, useEffect } from 'react';
import { req } from '../utils/client';

interface Track {
  link: string;
  name: string;
  artist: string;
}

interface QuizData {
  lyric_snippet: string;
  options: Track[];
  correct_link: string;
}

const LyricsQuizComponent = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const fetchNewQuiz = async () => {
    setLoading(true);
    setSelectedAnswer(null);
    setIsCorrect(null);
    
    try {
      const response = await req('get_song_quiz_lyrics', 'get', {});
      setQuizData(response.data);
    } catch (err) {
      setError('Failed to fetch quiz data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewQuiz();
  }, []);

  const handleAnswer = (link: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple answers
    
    setSelectedAnswer(link);
    const correct = link === quizData?.correct_link;
    setIsCorrect(correct);
    if (correct) setScore(prev => prev + 1);
  };

  const handleNextQuiz = () => {
    fetchNewQuiz();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="text-right mb-4">
        Score: {score}
      </div>
      
      <div className="bg-base-200 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Guess the Song from Lyrics</h2>
        <div className="italic text-lg mb-6 p-4 bg-base-100 rounded">
          "{quizData?.lyric_snippet}"
        </div>
        
        <div className="grid gap-4">
          {quizData?.options.map((track) => (
            <button
              key={track.link}
              onClick={() => handleAnswer(track.link)}
              disabled={selectedAnswer !== null}
              className={`btn btn-outline ${
                selectedAnswer === track.link
                  ? isCorrect
                    ? 'btn-success'
                    : 'btn-error'
                  : selectedAnswer && track.link === quizData.correct_link
                  ? 'btn-success'
                  : ''
              }`}
            >
              {track.name} - {track.artist}
            </button>
          ))}
        </div>
      </div>

      {selectedAnswer && (
        <div className="text-center">
          <div className={`text-lg mb-4 ${isCorrect ? 'text-success' : 'text-error'}`}>
            {isCorrect ? 'Correct!' : 'Wrong answer!'}
          </div>
          <button onClick={handleNextQuiz} className="btn btn-primary">
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};

export default LyricsQuizComponent;
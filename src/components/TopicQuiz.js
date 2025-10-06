import React, { useState, useEffect, useRef } from 'react';
import { callQuizGeneratorAPI } from '../utils/aiService';
import { sendActivityEmail } from '../utils/emailService';

const TopicQuiz = ({ topic, user, onQuizComplete }) => {
  const [questions, setQuestions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  // Use a ref to ensure the API call is made only once
  const quizFetched = useRef(false);

  useEffect(() => {
    // Only fetch the quiz if it hasn't been fetched yet
    if (!quizFetched.current) {
      quizFetched.current = true; // Mark as fetched immediately
      const generateQuiz = async () => {
        setIsLoading(true);
        const generatedQuestions = await callQuizGeneratorAPI(topic, user.class);
        // Basic validation to ensure we have a usable array
        if (Array.isArray(generatedQuestions) && generatedQuestions.length > 0) {
          setQuestions(generatedQuestions);
        } else {
          // If the API fails or returns bad data, set questions to an empty array to show the error screen
          setQuestions([]);
        }
        setIsLoading(false);
      };

      generateQuiz();
    }
  }, [topic, user.class]); // Dependencies are correct

  const handleAnswer = (answer) => {
    if (selectedAnswer) return; // Prevent re-answering

    setSelectedAnswer(answer);
    if (answer === questions[currentQuestionIndex].correct_answer) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(i => i + 1);
        setSelectedAnswer(null); // Reset for the next question
      } else {
        setIsFinished(true); // Mark the quiz as finished
      }
    }, 1200);
  };
  
  const handleFinishAndExit = () => {
      onQuizComplete(score, topic.id);
      sendActivityEmail(user, 'Complete Quiz', `Topic: ${topic.title}, Score: ${score}/${questions.length}`);
  }

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="card text-center">
        <h2 className="text-2xl font-bold mb-4">Generating Your Quiz...</h2>
        <div className="flex justify-center items-center space-x-2 dot-pulse">
          <div className="w-4 h-4 bg-brand-primary rounded-full"></div>
          <div className="w-4 h-4 bg-brand-primary rounded-full"></div>
          <div className="w-4 h-4 bg-brand-primary rounded-full"></div>
        </div>
        <p className="text-text-secondary mt-4">Your personalized quiz for "{topic.title}" is being created!</p>
      </div>
    );
  }

  // Handle case where API fails or returns no questions
  if (!questions || questions.length === 0) {
    return (
      <div className="card text-center">
        <h2 className="text-2xl font-bold mb-4 text-brand-danger">Oops!</h2>
        <p className="text-text-secondary mb-4">Could not generate a quiz for this topic. Please try again later.</p>
        <button onClick={() => onQuizComplete(0, topic.id)} className="btn-primary">Back to Subject</button>
      </div>
    );
  }

  // Render the final results screen
  if (isFinished) {
    return (
      <div className="card text-center">
        <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
        <p className="text-text-secondary mb-4">You've completed the quiz for "{topic.title}"</p>
        <p className="text-6xl font-bold my-6">{score} <span className="text-3xl text-text-tertiary">/ {questions.length}</span></p>
        {score < 5 && <p className="text-brand-danger font-semibold mb-6">This topic seems a bit tricky. We've marked it for you to review.</p>}
        <button onClick={handleFinishAndExit} className="btn-primary">Back to Subject</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // This is a safety check for the current question and its options
  if (!currentQuestion || !Array.isArray(currentQuestion.options)) {
      return (
          <div className="card text-center">
              <p>Error loading question data. Please try again.</p>
               <button onClick={() => onQuizComplete(0, topic.id)} className="btn-primary mt-4">Back to Subject</button>
          </div>
      )
  }

  // Render the active quiz question
  return (
    <div className="card">
      <h2 className="text-2xl font-bold font-serif mb-2">Quiz: {topic.title}</h2>
      <p className="text-text-secondary mb-6">Question {currentQuestionIndex + 1} of {questions.length}</p>

      <p className="text-lg font-semibold mb-6">{currentQuestion.question}</p>

      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={!!selectedAnswer}
            className={`w-full p-4 text-left font-semibold rounded-lg border-2 transition-all ${
              selectedAnswer
                ? (option === currentQuestion.correct_answer ? 'bg-green-100 border-green-500 text-green-800' : (option === selectedAnswer ? 'bg-red-100 border-red-500 text-red-800' : 'bg-gray-100 border-gray-200 text-gray-500'))
                : 'bg-white hover:bg-gray-50 border-border'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicQuiz;
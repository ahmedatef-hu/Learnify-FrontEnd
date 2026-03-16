import React, { useState, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';

/**
 * Quiz Interface Component
 * Displays quiz questions and handles answer submission
 */
const QuizInterface = ({ onQuizComplete }) => {
  const {
    currentQuiz,
    quizAnswers,
    quizScore,
    loading,
    error,
    updateAnswer,
    submitQuiz,
  } = useQuiz();
  const [submitted, setSubmitted] = useState(false);

  if (!currentQuiz) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No quiz loaded</p>
      </div>
    );
  }

  const handleSubmit = async () => {
    try {
      const result = await submitQuiz();
      setSubmitted(true);
      if (onQuizComplete) {
        onQuizComplete(result);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (submitted && quizScore) {
    const percentage = Math.round(
      (quizScore.score / quizScore.total) * 100
    );
    const isPassed = percentage >= 60;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-6xl mb-4">
            {isPassed ? '🎉' : '📚'}
          </div>
          <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
            {isPassed ? 'Great Job!' : 'Keep Practicing!'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {isPassed
              ? 'You passed the quiz!'
              : 'Review the material and try again.'}
          </p>

          <div className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 rounded-xl p-8 mb-6">
            <p className="text-gray-600 dark:text-gray-400 mb-2">Your Score</p>
            <p className="text-5xl font-bold text-teal-600 dark:text-teal-400 mb-2">
              {percentage}%
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {quizScore.score} out of {quizScore.total} correct
            </p>
          </div>

          {quizScore.feedback && (
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Feedback:
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                {quizScore.feedback}
              </p>
            </div>
          )}

          <button
            onClick={() => window.location.href = '/study-planner'}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition"
          >
            Back to Study Planner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          {currentQuiz.title || 'Quiz'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {currentQuiz.description}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="space-y-8 mb-8">
        {currentQuiz.questions?.map((question, idx) => (
          <div
            key={question.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <span className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-semibold">
                {idx + 1}
              </span>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {question.text}
              </h3>
            </div>

            <div className="space-y-3 ml-12">
              {question.options?.map((option, optIdx) => (
                <label
                  key={optIdx}
                  className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={quizAnswers[question.id] === option}
                    onChange={(e) =>
                      updateAnswer(question.id, e.target.value)
                    }
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => window.history.back()}
          className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || Object.keys(quizAnswers).length === 0}
          className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
};

export default QuizInterface;

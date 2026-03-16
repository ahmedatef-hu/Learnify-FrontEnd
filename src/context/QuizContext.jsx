import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiClient } from '../services/apiClient';

/**
 * Quiz Context
 * Manages quiz state, revision chat, and planner updates
 */
const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [revisionMessages, setRevisionMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load quiz for a specific topic
   */
  const loadQuiz = useCallback(async (topicId, materials = null) => {
    setLoading(true);
    setError(null);
    try {
      const quiz = await apiClient.fetchQuizByTopic(topicId, materials);
      setCurrentQuiz({ ...quiz, topicId });
      setQuizAnswers({});
      setQuizScore(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update answer for a specific question
   */
  const updateAnswer = useCallback((questionId, answer) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  }, []);

  /**
   * Submit quiz and get score
   */
  const submitQuiz = useCallback(async () => {
    if (!currentQuiz) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.submitQuizAnswers(
        currentQuiz.topicId,
        quizAnswers
      );
      setQuizScore(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentQuiz, quizAnswers]);

  /**
   * Add message to revision chat
   */
  const addRevisionMessage = useCallback((message, isUser = true) => {
    setRevisionMessages((prev) => [
      ...prev,
      { text: message, isUser, timestamp: new Date() },
    ]);
  }, []);

  /**
   * Get AI hint for revision
   */
  const getRevisionHint = useCallback(
    async (topicId, question, lessonId = null, materials = null) => {
      addRevisionMessage(question, true);
      setLoading(true);
      setError(null);
      try {
        // Use the new chat endpoint with full AI support
        const response = await apiClient.getRevisionChat(
          topicId, 
          question, 
          materials,
          revisionMessages
        );
        addRevisionMessage(response.response, false);
        return response;
      } catch (err) {
        setError(err.message);
        addRevisionMessage('Sorry, I could not process your question. Please try again.', false);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [addRevisionMessage, revisionMessages]
  );

  /**
   * Clear revision chat
   */
  const clearRevisionChat = useCallback(() => {
    setRevisionMessages([]);
  }, []);

  /**
   * Clear quiz state
   */
  const clearQuiz = useCallback(() => {
    setCurrentQuiz(null);
    setQuizAnswers({});
    setQuizScore(null);
  }, []);

  const value = {
    currentQuiz,
    quizAnswers,
    quizScore,
    revisionMessages,
    loading,
    error,
    loadQuiz,
    updateAnswer,
    submitQuiz,
    addRevisionMessage,
    getRevisionHint,
    clearRevisionChat,
    clearQuiz,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
};

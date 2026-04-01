import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import RevisionChat from '../components/RevisionChat';
import QuizInterface from '../components/QuizInterface';
import { Storage } from '../utils/storage';
import { apiClient } from '../services/apiClient';
import { StreakService } from '../services/streakService';
import StreakNotification from '../components/StreakNotification';

/**
 * Revision Page Component
 * Combines revision chat and quiz generation for a specific topic
 */
const RevisionPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { loadQuiz, clearQuiz, quizScore, clearRevisionChat } = useQuiz();
  const [topicData, setTopicData] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [loading, setLoading] = useState(true);
  const [streakNotification, setStreakNotification] = useState({ show: false, message: '' });

  useEffect(() => {
    // Clear chat when topic changes
    clearRevisionChat();
    loadTopicData();
  }, [topicId, clearRevisionChat]);

  const loadTopicData = async () => {
    try {
      // In a real app, fetch from backend
      // For now, use demo data from localStorage
      const subjects = Storage.getSubjects();
      const topic = subjects.find((s) => s.name === topicId);
      if (topic) {
        setTopicData(topic);
      } else {
        setTopicData({ name: topicId, id: topicId });
      }
    } catch (error) {
      console.error('Error loading topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    try {
      // Get materials for this topic
      const materials = Storage.getMaterials(topicId);
      
      if (materials && materials.length > 0) {
        // Navigate to exam generator with materials
        navigate(`/pdf-exam?subject=${encodeURIComponent(topicId)}`);
      } else {
        alert('Please add study materials first to generate an AI exam!');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    }
  };

  const handleQuizComplete = async (result) => {
    try {
      // Update planner based on score
      const percentage = Math.round((result.score / result.total) * 100);
      const subjects = Storage.getSubjects();
      const subjectIndex = subjects.findIndex((s) => s.name === topicId);

      if (subjectIndex !== -1) {
        const subject = subjects[subjectIndex];
        let updatedSubject = { ...subject };

        // Update based on score
        if (percentage >= 80) {
          // High score: reduce study time
          updatedSubject.completed = Math.min(
            subject.total,
            subject.completed + 2
          );
        } else if (percentage < 60) {
          // Low score: increase study time
          updatedSubject.completed = Math.max(0, subject.completed - 1);
        }

        subjects[subjectIndex] = updatedSubject;
        localStorage.setItem('subjects', JSON.stringify(subjects));

        // Save quiz result
        const exam = {
          subject: topicId,
          score: result.score,
          total: result.total,
          percentage,
          date: new Date().toISOString(),
        };
        Storage.saveExam(exam);
      }

      // Record streak activity for revision
      const streakResult = StreakService.recordActivity('revision');
      if (streakResult.streakIncreased) {
        setStreakNotification({
          show: true,
          message: streakResult.message
        });
      }

      // Show success message and redirect
      setTimeout(() => {
        navigate('/study-planner', {
          state: { message: 'Quiz completed! Planner updated.' },
        });
      }, 2000);
    } catch (error) {
      console.error('Error updating planner:', error);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <StreakNotification 
        message={streakNotification.message}
        show={streakNotification.show}
        onClose={() => setStreakNotification({ show: false, message: '' })}
      />
      <div className="container mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/study-planner')}
          className="mb-6 text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-2"
        >
          ← Back to Study Planner
        </button>

        {showQuiz ? (
          <div>
            <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              📝 Quiz: {topicData?.name}
            </h1>
            <QuizInterface onQuizComplete={handleQuizComplete} />
          </div>
        ) : (
          <div>
            <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
              📚 Revise: {topicData?.name}
            </h1>
            <div className="max-w-4xl mx-auto">
              <RevisionChat
                topicId={topicId}
                topicName={topicData?.name}
                onGenerateQuiz={handleGenerateQuiz}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevisionPage;

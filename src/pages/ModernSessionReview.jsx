/**
 * Modern Session Review Page
 * Enhanced with modern design and animations
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModernReviewForm from '../components/ModernReviewForm';
import ModernReviewList from '../components/ModernReviewList';
import { reviewApi } from '../services/reviewApi';
import { progressApi } from '../services/progressApi';

const ModernSessionReview = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Mock data - in production, get from auth context and session API
  const currentStudentId = 'student_123';
  const sessionData = {
    id: sessionId,
    title: 'React Hooks Deep Dive',
    skill: 'React',
    teacher: 'Sarah Johnson',
    student: 'Current User',
    date: new Date().toISOString(),
    duration: '2 hours',
    description: 'Master React Hooks with hands-on examples and real-world projects',
    level: 'Intermediate',
    topics: ['useState', 'useEffect', 'Custom Hooks', 'Performance Optimization']
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleReviewSubmitted = async (reviewData) => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call with demo data
      console.log('Review submitted:', reviewData);
      
      // In real app: const response = await reviewApi.createReview(reviewData);
      
      setShowReviewForm(false);
      
      // Show success message with animation
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-up';
      successDiv.innerHTML = '✅ Review submitted successfully!';
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        successDiv.remove();
      }, 3000);
      
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteSession = async () => {
    try {
      // Simulate progress update
      console.log('Session completed for:', sessionData.skill);
      
      setSessionCompleted(true);
      setShowReviewForm(true);
      
      // Show success animation
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-up';
      successDiv.innerHTML = '🎉 Session completed! Progress updated.';
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        successDiv.remove();
      }, 3000);
      
    } catch (error) {
      console.error('Failed to complete session:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-100 dark:from-gray-900 dark:via-rose-900 dark:to-orange-950">
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-6 py-12">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl w-1/2"></div>
              <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-3xl"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-3xl"></div>
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-100 dark:from-gray-900 dark:via-rose-900 dark:to-orange-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-rose-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-rose-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-yellow-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative pt-20 pb-20">
        <div className="container mx-auto px-6 py-12">
          {/* Modern Header */}
          <div className="mb-12">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 mb-6 transition-colors duration-300"
            >
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-800/50 transition-colors duration-300">
                <span className="text-sm">←</span>
              </div>
              <span className="font-medium">Back to Sessions</span>
            </button>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl mb-6 shadow-2xl animate-float">
                <span className="text-3xl">⭐</span>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-rose-800 to-orange-800 dark:from-white dark:via-rose-200 dark:to-orange-200 bg-clip-text text-transparent mb-4">
                Session Review
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Share your experience and help others learn from your journey
              </p>
            </div>
          </div>
          {/* Modern Session Info Card */}
          <div className="mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-orange-600 to-yellow-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-10 border border-white/20 dark:border-gray-700/50 shadow-2xl">
                
                {/* Session Header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <span className="text-3xl">🎓</span>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                          {sessionData.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg mt-1">
                          {sessionData.description}
                        </p>
                      </div>
                    </div>

                    {/* Session Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl border border-gray-200/50 dark:border-gray-600/30">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                              <span className="text-lg">🎯</span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Skill</p>
                              <p className="font-bold text-gray-800 dark:text-white">{sessionData.skill}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl border border-gray-200/50 dark:border-gray-600/30">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                              <span className="text-lg">👨‍🏫</span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Teacher</p>
                              <p className="font-bold text-gray-800 dark:text-white">{sessionData.teacher}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl border border-gray-200/50 dark:border-gray-600/30">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                              <span className="text-lg">⏱️</span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Duration</p>
                              <p className="font-bold text-gray-800 dark:text-white">{sessionData.duration}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl border border-gray-200/50 dark:border-gray-600/30">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                              <span className="text-lg">📊</span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Level</p>
                              <p className="font-bold text-gray-800 dark:text-white">{sessionData.level}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Topics Covered */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Topics Covered:</h4>
                      <div className="flex flex-wrap gap-2">
                        {sessionData.topics.map((topic, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-gradient-to-r from-rose-100 to-orange-100 dark:from-rose-900/30 dark:to-orange-900/30 text-rose-800 dark:text-rose-200 rounded-full text-sm font-medium border border-rose-200 dark:border-rose-700/50"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 ml-6">
                    {!sessionCompleted && (
                      <button
                        onClick={handleCompleteSession}
                        className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10">✅</span>
                        <span className="relative z-10">Complete Session</span>
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                      </button>
                    )}
                    
                    {sessionCompleted && !showReviewForm && (
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10">📝</span>
                        <span className="relative z-10">Write Review</span>
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                      </button>
                    )}

                    <button
                      onClick={() => navigate('/progress-dashboard')}
                      className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10">📊</span>
                      <span className="relative z-10">View Progress</span>
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                    </button>
                  </div>
                </div>

                {/* Session Status */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200/50 dark:border-gray-600/30">
                  <div className={`
                    flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold shadow-lg
                    ${sessionCompleted 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                    }
                  `}>
                    <span className="text-lg">
                      {sessionCompleted ? '✅' : '⏳'}
                    </span>
                    <span>
                      {sessionCompleted ? 'Session Completed' : 'Session In Progress'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Session Date:</span> {formatDate(sessionData.date)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Modern Review Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Review Form */}
            <div className="stagger-animation">
              {showReviewForm ? (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                  <div className="relative">
                    <ModernReviewForm
                      sessionId={sessionId}
                      studentId={currentStudentId}
                      onReviewSubmitted={handleReviewSubmitted}
                      onCancel={() => setShowReviewForm(false)}
                      isSubmitting={isSubmitting}
                    />
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-gray-600/20 rounded-3xl blur opacity-30"></div>
                  <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-10 border border-white/20 dark:border-gray-700/50 shadow-2xl text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <span className="text-4xl">💭</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      Ready to Share Your Experience?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                      {sessionCompleted 
                        ? 'Your feedback helps other students choose the best learning sessions and helps teachers improve their content.'
                        : 'Complete the session first to unlock the review feature and share your learning experience.'
                      }
                    </p>
                    
                    {sessionCompleted && (
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10">✨</span>
                        <span className="relative z-10">Write Your Review</span>
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="stagger-animation" style={{ animationDelay: '200ms' }}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 rounded-3xl blur opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div className="relative">
                  <ModernReviewList 
                    sessionId={sessionId}
                    currentStudentId={currentStudentId}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modern Progress Tracking Section */}
          <div className="stagger-animation" style={{ animationDelay: '400ms' }}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-10 border border-white/20 dark:border-gray-700/50 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <span className="text-3xl">📈</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Learning Progress
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Track your growth and achievements</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative text-center p-6 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl border border-gray-200/50 dark:border-gray-600/30">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {sessionCompleted ? '1' : '0'}
                      </div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Sessions Completed
                      </div>
                    </div>
                  </div>
                  
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative text-center p-6 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl border border-gray-200/50 dark:border-gray-600/30">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-2xl">🚀</span>
                      </div>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {sessionData.skill}
                      </div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Skill Practiced
                      </div>
                    </div>
                  </div>
                  
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative text-center p-6 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl border border-gray-200/50 dark:border-gray-600/30">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-2xl">⏰</span>
                      </div>
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {sessionData.duration}
                      </div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Time Invested
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => navigate('/progress-dashboard')}
                    className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-indigo-500/25 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">📊</span>
                    <span className="relative z-10">View Full Progress Dashboard</span>
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernSessionReview;
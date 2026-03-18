/**
 * Modern Review List Component
 * Enhanced list of reviews with modern design and animations
 */

import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { reviewApi } from '../services/reviewApi';

const ModernReviewList = ({ sessionId, currentStudentId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [averageRating, setAverageRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');

  // Demo data for when API is not available
  const getDemoReviews = () => {
    return {
      reviews: [
        {
          id: 1,
          studentId: 'student_456',
          studentName: 'Ahmed Hassan',
          rating: 5,
          comment: 'Excellent session! Sarah explained React Hooks very clearly and the hands-on examples were really helpful. I finally understand useEffect and custom hooks. Highly recommended!',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          studentId: 'student_789',
          studentName: 'Nour Ibrahim',
          rating: 4,
          comment: 'Great session overall. The content was well-structured and Sarah was very patient with questions. Would have liked more advanced examples but perfect for intermediate level.',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          studentId: 'student_321',
          studentName: 'Omar Ali',
          rating: 5,
          comment: 'Amazing learning experience! The practical approach and real-world examples made complex concepts easy to understand. Sarah is an excellent teacher.',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 4,
          studentId: currentStudentId,
          studentName: 'You',
          rating: 4,
          comment: 'Very informative session. Learned a lot about React Hooks and best practices. The interactive coding examples were particularly helpful.',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      pagination: { total: 4, pages: 1, currentPage: 1 },
      averageRating: 4.5
    };
  };

  const loadReviews = async (page = 1, sort = 'newest') => {
    try {
      setLoading(true);
      setError(null);
      
      // Try API first, fallback to demo data
      try {
        const response = await reviewApi.getSessionReviews(sessionId, {
          page,
          limit: 10,
          sortBy: sort
        });

        if (response.success) {
          setReviews(response.data.reviews);
          setPagination(response.data.pagination);
          setAverageRating(response.data.averageRating);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using demo data');
      }
      
      // Use demo data
      const demoData = getDemoReviews();
      setReviews(demoData.reviews);
      setPagination(demoData.pagination);
      setAverageRating(demoData.averageRating);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      loadReviews(currentPage, sortBy);
    }
  }, [sessionId, currentPage, sortBy]);

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      // Simulate deletion for demo
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-up';
      successDiv.innerHTML = '🗑️ Review deleted successfully';
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        successDiv.remove();
      }, 3000);
      
    } catch (err) {
      alert('Failed to delete review: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAvatarColor = (index) => {
    const colors = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600', 
      'from-orange-500 to-red-600',
      'from-purple-500 to-pink-600',
      'from-teal-500 to-cyan-600',
      'from-rose-500 to-orange-600'
    ];
    return colors[index % colors.length];
  };
  if (loading) {
    return (
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 shadow-2xl">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-2xl w-1/3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-24"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Error Loading Reviews</h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => loadReviews(currentPage, sortBy)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Student Reviews ({pagination.total || 0})
            </h3>
          </div>
          
          {averageRating > 0 && (
            <div className="flex items-center gap-3 ml-16">
              <StarRating rating={averageRating} readonly size="md" showValue={false} />
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {averageRating.toFixed(1)} average rating
              </span>
              <div className="px-3 py-1 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>

        {/* Sort Options */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="appearance-none bg-white/80 dark:bg-gray-700/80 border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 pr-10 text-gray-900 dark:text-white font-medium focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
          >
            <option value="newest">🕒 Newest First</option>
            <option value="oldest">📅 Oldest First</option>
            <option value="rating_high">⭐ Highest Rating</option>
            <option value="rating_low">📉 Lowest Rating</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500">▼</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-4xl">💭</span>
          </div>
          <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No Reviews Yet</h4>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-md mx-auto">
            Be the first to share your experience and help other students make informed decisions!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="group relative stagger-animation"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative border-2 border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 bg-gray-50/30 dark:bg-gray-700/20 hover:border-orange-300/50 dark:hover:border-orange-500/50 transition-all duration-300">
                
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${getAvatarColor(index)} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {review.studentName ? review.studentName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-bold text-lg text-gray-800 dark:text-white">
                          {review.studentName || 'Anonymous User'}
                        </p>
                        {review.studentId === currentStudentId && (
                          <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-medium">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} readonly size="sm" showValue={false} />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {review.rating}/5
                      </span>
                    </div>
                    
                    {review.studentId === currentStudentId && (
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="group/btn w-10 h-10 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                        title="Delete review"
                      >
                        <span className="text-red-600 dark:text-red-400 group-hover/btn:scale-110 transition-transform duration-300">🗑️</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Review Content */}
                <div className="relative">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    "{review.comment}"
                  </p>
                  
                  {/* Quote decoration */}
                  <div className="absolute -top-2 -left-2 text-4xl text-orange-300 dark:text-orange-600 opacity-50 font-serif">
                    "
                  </div>
                </div>

                {/* Review Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-600/30">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>👍</span>
                    <span>Helpful review</span>
                  </div>
                  
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    Review #{review.id}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-600/30">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="group flex items-center gap-2 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <span>←</span>
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-600 text-white rounded-xl font-bold">
              {currentPage}
            </span>
            <span className="text-gray-500 dark:text-gray-400">of</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium">
              {pagination.pages}
            </span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.pages}
            className="group flex items-center gap-2 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <span>Next</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ModernReviewList;
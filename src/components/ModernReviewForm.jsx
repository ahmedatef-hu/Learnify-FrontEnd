/**
 * Modern Review Form Component
 * Enhanced form for creating reviews with modern design
 */

import React, { useState } from 'react';
import StarRating from './StarRating';

const ModernReviewForm = ({ 
  sessionId, 
  studentId, 
  onReviewSubmitted, 
  onCancel,
  isSubmitting = false 
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (comment.trim().length === 0) {
      newErrors.comment = 'Please write a comment';
    } else if (comment.length > 500) {
      newErrors.comment = 'Comment must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const reviewData = {
      sessionId,
      studentId,
      rating,
      comment: comment.trim()
    };

    try {
      await onReviewSubmitted(reviewData);
      // Reset form
      setRating(0);
      setComment('');
      setErrors({});
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const getRatingMessage = (rating) => {
    const messages = {
      1: "😞 Poor - Needs significant improvement",
      2: "😐 Fair - Below expectations", 
      3: "🙂 Good - Met expectations",
      4: "😊 Very Good - Exceeded expectations",
      5: "🤩 Excellent - Outstanding experience!"
    };
    return messages[rating] || "";
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
          <span className="text-2xl">📝</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Write Your Review
          </h3>
          <p className="text-gray-600 dark:text-gray-300">Share your learning experience</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Rating Section */}
        <div className="relative">
          <label className="block text-lg font-semibold text-gray-800 dark:text-white mb-4">
            How would you rate this session? *
          </label>
          
          <div className="flex flex-col items-center p-6 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl border border-gray-200/50 dark:border-gray-600/30">
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size="xl"
              showValue={false}
            />
            
            {rating > 0 && (
              <div className="mt-4 text-center">
                <p className="text-lg font-medium text-gray-800 dark:text-white mb-1">
                  {getRatingMessage(rating)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You rated: {rating} out of 5 stars
                </p>
              </div>
            )}
          </div>
          
          {errors.rating && (
            <div className="mt-3 flex items-center gap-2 text-red-600 dark:text-red-400">
              <span className="text-lg">⚠️</span>
              <p className="text-sm font-medium">{errors.rating}</p>
            </div>
          )}
        </div>

        {/* Comment Section */}
        <div className="relative">
          <label className="block text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Tell us about your experience *
          </label>
          
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you learn? How was the teaching style? Would you recommend this session to others? Share your thoughts..."
              rows={6}
              maxLength={500}
              className="w-full px-6 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl 
                       bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white
                       focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400
                       resize-none transition-all duration-300 text-lg leading-relaxed
                       placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            
            {/* Character Counter */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <div className={`
                px-3 py-1 rounded-full text-xs font-medium
                ${comment.length > 450 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                  : comment.length > 350
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }
              `}>
                {comment.length}/500
              </div>
            </div>
          </div>
          
          {errors.comment && (
            <div className="mt-3 flex items-center gap-2 text-red-600 dark:text-red-400">
              <span className="text-lg">⚠️</span>
              <p className="text-sm font-medium">{errors.comment}</p>
            </div>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="relative group">
            <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur"></div>
            <div className="relative bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">❌</span>
                </div>
                <div>
                  <p className="font-semibold text-red-800 dark:text-red-200">Submission Failed</p>
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || comment.trim().length === 0}
            className="group relative flex-1 inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {isSubmitting ? (
              <>
                <div className="relative z-10 w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="relative z-10">Submitting Review...</span>
              </>
            ) : (
              <>
                <span className="relative z-10 text-xl">✨</span>
                <span className="relative z-10">Submit Review</span>
              </>
            )}
            
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="group relative px-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl
                       text-gray-700 dark:text-gray-300 font-semibold text-lg
                       hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-400 dark:hover:border-gray-500
                       focus:ring-4 focus:ring-gray-500/20 focus:border-gray-500
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300"
            >
              <span className="relative z-10">Cancel</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ModernReviewForm;
/**
 * Review API Client
 * Handles all review-related API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const reviewApi = {
  /**
   * Create a new review
   * @param {Object} reviewData - Review data
   * @returns {Promise<Object>} Created review
   */
  async createReview(reviewData) {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create review');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  /**
   * Get reviews for a session
   * @param {string} sessionId - Session ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Reviews with pagination
   */
  async getSessionReviews(sessionId, options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'newest' } = options;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy
      });

      const response = await fetch(`${API_BASE_URL}/reviews/session/${sessionId}?${queryParams}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch reviews');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching session reviews:', error);
      throw error;
    }
  },

  /**
   * Get reviews by student
   * @param {string} studentId - Student ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Student reviews with pagination
   */
  async getStudentReviews(studentId, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await fetch(`${API_BASE_URL}/reviews/student/${studentId}?${queryParams}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch student reviews');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching student reviews:', error);
      throw error;
    }
  },

  /**
   * Get review statistics for a session
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Review statistics
   */
  async getReviewStats(sessionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/stats/${sessionId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch review stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching review stats:', error);
      throw error;
    }
  },

  /**
   * Delete a review
   * @param {string} reviewId - Review ID
   * @param {string} studentId - Student ID (for authorization)
   * @returns {Promise<Object>} Deletion result
   */
  async deleteReview(reviewId, studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete review');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
};

export default reviewApi;
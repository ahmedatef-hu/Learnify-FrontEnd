/**
 * Progress API Client
 * Handles all progress tracking API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const progressApi = {
  /**
   * Create or update progress
   * @param {Object} progressData - Progress data
   * @returns {Promise<Object>} Updated progress
   */
  async updateProgress(progressData) {
    try {
      const response = await fetch(`${API_BASE_URL}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  },

  /**
   * Get all progress for a student
   * @param {string} studentId - Student ID
   * @returns {Promise<Object>} Student progress with stats
   */
  async getStudentProgress(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/${studentId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching student progress:', error);
      throw error;
    }
  },

  /**
   * Get specific skill progress
   * @param {string} studentId - Student ID
   * @param {string} skillName - Skill name
   * @returns {Promise<Object>} Skill progress
   */
  async getSkillProgress(studentId, skillName) {
    try {
      const encodedSkill = encodeURIComponent(skillName);
      const response = await fetch(`${API_BASE_URL}/progress/${studentId}/${encodedSkill}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch skill progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching skill progress:', error);
      throw error;
    }
  },

  /**
   * Get progress dashboard data
   * @param {string} studentId - Student ID
   * @returns {Promise<Object>} Dashboard data
   */
  async getProgressDashboard(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/dashboard/${studentId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch dashboard data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  /**
   * Update progress after session completion
   * @param {string} studentId - Student ID
   * @param {string} skillName - Skill name
   * @param {boolean} sessionCompleted - Whether session was completed
   * @returns {Promise<Object>} Updated progress
   */
  async completeSession(studentId, skillName, sessionCompleted = true) {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/session-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          skillName,
          sessionCompleted
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update session progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating session progress:', error);
      throw error;
    }
  },

  /**
   * Delete progress record
   * @param {string} progressId - Progress ID
   * @param {string} studentId - Student ID (for authorization)
   * @returns {Promise<Object>} Deletion result
   */
  async deleteProgress(progressId, studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/${progressId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting progress:', error);
      throw error;
    }
  }
};

export default progressApi;
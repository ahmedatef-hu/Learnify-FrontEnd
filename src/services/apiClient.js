/**
 * API Client Service
 * Handles all communication with the AI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = {
  /**
   * Fetch quizzes for a specific topic
   * @param {string} topicId - Unique identifier for the topic
   * @param {Array} materials - Optional array of study materials
   * @returns {Promise<Array>} Array of quiz questions
   */
  async fetchQuizByTopic(topicId, materials = null) {
    try {
      let url = `${API_BASE_URL}/quizzes/topic/${topicId}`;
      
      // If materials are provided, send them as query parameter
      if (materials && materials.length > 0) {
        const materialsParam = encodeURIComponent(JSON.stringify(materials));
        url += `?materials=${materialsParam}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch quiz');
      return await response.json();
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  },

  /**
   * Submit quiz answers and get score
   * @param {string} topicId - Topic ID
   * @param {Array} answers - User's answers
   * @returns {Promise<Object>} Score and feedback
   */
  async submitQuizAnswers(topicId, answers) {
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, answers }),
      });
      if (!response.ok) throw new Error('Failed to submit quiz');
      return await response.json();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  },

  /**
   * Get revision hints for a topic
   * @param {string} topicId - Topic ID
   * @param {string} question - Student's question
   * @param {string} lessonId - Optional lesson ID for specific lesson context
   * @returns {Promise<Object>} Hint and explanation
   */
  async getRevisionHint(topicId, question, lessonId = null) {
    try {
      const body = { topicId, question };
      if (lessonId) {
        body.lessonId = lessonId;
      }

      const response = await fetch(`${API_BASE_URL}/revision/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Failed to get hint');
      return await response.json();
    } catch (error) {
      console.error('Error getting hint:', error);
      throw error;
    }
  },

  /**
   * Update study planner based on quiz score
   * @param {string} topicId - Topic ID
   * @param {number} score - Quiz score (0-100)
   * @param {Object} plannerData - Current planner data
   * @returns {Promise<Object>} Updated planner data
   */
  async updatePlannerByScore(topicId, score, plannerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/planner/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, score, plannerData }),
      });
      if (!response.ok) throw new Error('Failed to update planner');
      return await response.json();
    } catch (error) {
      console.error('Error updating planner:', error);
      throw error;
    }
  },

  /**
   * Get all topics for a subject
   * @param {string} subjectId - Subject ID
   * @returns {Promise<Array>} Array of topics
   */
  async getTopicsBySubject(subjectId) {
    try {
      const response = await fetch(`${API_BASE_URL}/topics/subject/${subjectId}`);
      if (!response.ok) throw new Error('Failed to fetch topics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw error;
    }
  },

  /**
   * Generate exam from materials using AI
   * @param {Array} materials - Study materials
   * @param {string} subject - Subject name
   * @returns {Promise<Object>} Generated exam questions
   */
  async generateExam(materials, subject) {
    try {
      const response = await fetch(`${API_BASE_URL}/quiz/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materials, subject }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate exam');
      }
      return await response.json();
    } catch (error) {
      console.error('Error generating exam:', error);
      throw error;
    }
  },

  /**
   * Get AI chat response for revision
   * @param {string} topicId - Topic ID
   * @param {string} question - Student's question
   * @param {Array} materials - Study materials
   * @param {Array} conversationHistory - Previous messages
   * @returns {Promise<Object>} AI response
   */
  async getRevisionChat(topicId, question, materials = null, conversationHistory = []) {
    try {
      const response = await fetch(`${API_BASE_URL}/revision/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, question, materials, conversationHistory }),
      });
      if (!response.ok) throw new Error('Failed to get chat response');
      return await response.json();
    } catch (error) {
      console.error('Error getting chat response:', error);
      throw error;
    }
  },
};

export default apiClient;

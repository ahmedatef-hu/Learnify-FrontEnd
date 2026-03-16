import React, { useState, useRef, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import { Storage } from '../utils/storage';

/**
 * Revision Chat Component
 * Allows students to ask questions and get AI hints for revision
 */
const RevisionChat = ({ topicId, topicName, onGenerateQuiz }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const messagesEndRef = useRef(null);
  const { revisionMessages, loading, getRevisionHint, clearRevisionChat } =
    useQuiz();

  // Get materials for this topic
  const materials = Storage.getMaterials(topicName) || [];

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [revisionMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const question = inputValue;
    setInputValue('');

    try {
      // Pass materials to AI for context
      await getRevisionHint(topicId, question, selectedLesson, materials);
    } catch (error) {
      console.error('Error getting hint:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6">
        <h2 className="text-2xl font-bold mb-1">💬 Revision Chat</h2>
        <p className="text-teal-100">{topicName}</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Lesson Selector */}
        {materials.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <label className="block text-sm font-medium mb-2 text-blue-800 dark:text-blue-200">
              Select a lesson for focused revision (optional):
            </label>
            <select
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              className="w-full px-3 py-2 border border-blue-200 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            >
              <option value="">All lessons</option>
              {materials
                .sort((a, b) => a.lessonNumber - b.lessonNumber)
                .map((material) => (
                  <option key={material.id} value={material.id}>
                    Lesson {material.lessonNumber}: {material.title}
                  </option>
                ))}
            </select>
          </div>
        )}

        {revisionMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-4xl mb-2">🤖</p>
              <p className="text-gray-500 dark:text-gray-400">
                Ask me anything about {topicName}!
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                I'll provide hints and explanations to help you revise.
              </p>
              {materials.length > 0 && (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                  💡 You can select a specific lesson for targeted revision
                </p>
              )}
            </div>
          </div>
        ) : (
          revisionMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  msg.isUser
                    ? 'bg-teal-600 text-white rounded-br-none'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.isUser
                      ? 'text-teal-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
        <form onSubmit={handleSendMessage} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearRevisionChat}
              className="flex-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition"
            >
              Clear Chat
            </button>
            <button
              type="button"
              onClick={onGenerateQuiz}
              className="flex-1 bg-green-600 text-white text-sm py-2 rounded-lg hover:bg-green-700 transition"
            >
              Generate Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RevisionChat;

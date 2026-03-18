/**
 * Skill Card Component
 * Displays individual skill progress with level badge
 */

import React from 'react';
import ProgressBar from './ProgressBar';

const SkillCard = ({ 
  skill, 
  onUpdateProgress, 
  onDeleteProgress,
  currentStudentId 
}) => {
  const getLevelColor = (level) => {
    switch (level) {
      case 'Advanced':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Beginner':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getLevelEmoji = (level) => {
    switch (level) {
      case 'Advanced':
        return '🏆';
      case 'Intermediate':
        return '📚';
      case 'Beginner':
        return '🌱';
      default:
        return '📖';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleCompleteSession = () => {
    if (onUpdateProgress) {
      onUpdateProgress(skill.studentId, skill.skillName, skill.completedSessions + 1, skill.totalSessions);
    }
  };

  const handleDecreaseSession = () => {
    if (onUpdateProgress && skill.completedSessions > 0) {
      onUpdateProgress(skill.studentId, skill.skillName, skill.completedSessions - 1, skill.totalSessions);
    }
  };

  const handleAddTotalSessions = () => {
    if (onUpdateProgress) {
      onUpdateProgress(skill.studentId, skill.skillName, skill.completedSessions, skill.totalSessions + 1);
    }
  };

  return (
    <div className="group relative h-full">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Main Card */}
      <div className="relative h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 shadow-2xl hover:shadow-xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden">
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full blur-2xl transform -translate-x-12 translate-y-12"></div>
        </div>

        {/* Header Section */}
        <div className="relative flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg text-white font-bold text-lg
                ${skill.skillLevel === 'Advanced' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                  skill.skillLevel === 'Intermediate' ? 'bg-gradient-to-br from-yellow-500 to-orange-600' :
                  'bg-gradient-to-br from-blue-500 to-indigo-600'}
              `}>
                {getLevelEmoji(skill.skillLevel)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white leading-tight">
                  {skill.skillName}
                </h3>
                <span className={`
                  inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold mt-1
                  ${getLevelColor(skill.skillLevel)}
                `}>
                  {skill.skillLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCompleteSession}
              disabled={skill.completedSessions >= skill.totalSessions}
              className="group/btn relative w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-green-500/25 transform hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              title="Complete a session"
            >
              <span className="text-lg">✅</span>
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button
              onClick={handleDecreaseSession}
              disabled={skill.completedSessions === 0}
              className="group/btn relative w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-orange-500/25 transform hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              title="Decrease completed sessions"
            >
              <span className="text-xl font-bold">✕</span>
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            {onDeleteProgress && (
              <button
                onClick={() => onDeleteProgress(skill.id, currentStudentId)}
                className="group/btn relative w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-red-500/25 transform hover:scale-110 transition-all duration-300"
                title="Delete progress"
              >
                <span className="text-lg">🗑️</span>
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              </button>
            )}
          </div>
        </div>

        {/* Progress Section */}
        <div className="relative mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Progress</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {skill.progressPercentage}%
            </span>
          </div>
          
          <ProgressBar
            progress={skill.progressPercentage}
            color="auto"
            size="md"
            animated={true}
          />
          
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{skill.completedSessions} completed</span>
            <span>{skill.totalSessions} total</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="relative group/stat">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"></div>
            <div className="relative text-center p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl border border-gray-200/50 dark:border-gray-600/30">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {skill.completedSessions}
              </div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Completed
              </div>
            </div>
          </div>
          
          <div className="relative group/stat">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"></div>
            <div className="relative text-center p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl border border-gray-200/50 dark:border-gray-600/30">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                {skill.totalSessions - skill.completedSessions}
              </div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Remaining
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative pt-4 border-t border-gray-200/50 dark:border-gray-600/30">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Updated: {formatDate(skill.lastUpdated)}
            </div>
            
            {/* Completion Badge */}
            {skill.progressPercentage === 100 && (
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-bold shadow-lg animate-pulse">
                🎉 Complete!
              </div>
            )}
          </div>
        </div>

        {/* Hover Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default SkillCard;
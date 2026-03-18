/**
 * Progress Bar Component
 * Animated progress bar with customizable styling
 */

import React from 'react';

const ProgressBar = ({ 
  progress = 0, 
  label, 
  showPercentage = true, 
  size = 'md',
  color = 'blue',
  animated = true 
}) => {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    teal: 'bg-teal-500'
  };

  const getColorByProgress = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const progressColor = color === 'auto' ? getColorByProgress(progress) : colorClasses[color];
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full">
      {/* Label and Percentage */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-3">
          {label && (
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {clampedProgress}%
            </span>
          )}
        </div>
      )}

      {/* Modern Progress Bar Container */}
      <div className={`
        relative w-full bg-gray-200/80 dark:bg-gray-700/80 rounded-full overflow-hidden backdrop-blur-sm
        ${sizeClasses[size]}
        shadow-inner
      `}>
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10 rounded-full"></div>
        
        {/* Progress Fill */}
        <div
          className={`
            relative ${sizeClasses[size]} rounded-full overflow-hidden
            ${animated ? 'transition-all duration-1000 ease-out' : ''}
          `}
          style={{ width: `${clampedProgress}%` }}
        >
          {/* Main Progress Bar */}
          <div className={`
            absolute inset-0 ${progressColor} rounded-full
            ${animated ? 'animate-pulse' : ''}
          `}></div>
          
          {/* Animated Shine Effect */}
          {animated && clampedProgress > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
                          animate-shimmer rounded-full"></div>
          )}
          
          {/* Glow Effect */}
          <div className={`
            absolute inset-0 ${progressColor} rounded-full blur-sm opacity-50
            ${animated ? 'animate-pulse' : ''}
          `}></div>
        </div>

        {/* Progress Indicator Dot */}
        {clampedProgress > 0 && (
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-current transition-all duration-1000"
            style={{ 
              left: `calc(${clampedProgress}% - 6px)`,
              color: color === 'auto' ? getColorByProgress(clampedProgress).replace('bg-', '') : colorClasses[color]?.replace('bg-', '')
            }}
          ></div>
        )}
      </div>

      {/* Progress Text for Screen Readers */}
      <span className="sr-only">
        {label ? `${label}: ` : ''}Progress: {clampedProgress} percent
      </span>
    </div>
  );
};

export default ProgressBar;
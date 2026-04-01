import React, { useState, useEffect } from 'react';
import { StreakService } from '../services/streakService';

/**
 * Streak Display Component
 * Shows current streak with visual indicators
 */
const StreakDisplay = ({ studentId = 'default', compact = false }) => {
    const [streak, setStreak] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        loadStreak();
    }, [studentId]);

    const loadStreak = () => {
        const streakData = StreakService.getStreak(studentId);
        const statusData = StreakService.getStreakStatus(studentId);
        setStreak(streakData);
        setStatus(statusData);
    };

    if (!streak) return null;

    const getStreakIcon = () => {
        if (streak.currentStreak === 0) return '📚';
        if (streak.currentStreak < 3) return '🔥';
        if (streak.currentStreak < 7) return '⚡';
        if (streak.currentStreak < 30) return '🌟';
        if (streak.currentStreak < 100) return '👑';
        return '🏆';
    };

    const getStreakColor = () => {
        if (status?.status === 'active') return 'text-green-600 dark:text-green-400';
        if (status?.status === 'at-risk') return 'text-orange-600 dark:text-orange-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    if (compact) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-2xl animate-pulse">{getStreakIcon()}</span>
                <div>
                    <div className={`text-lg font-bold ${getStreakColor()}`}>
                        {streak.currentStreak} days
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Daily Study Streak
                </h3>
                <span className="text-4xl animate-bounce">{getStreakIcon()}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                    <div className={`text-3xl font-bold ${getStreakColor()}`}>
                        {streak.currentStreak}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Current</div>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {streak.longestStreak}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Longest</div>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {streak.totalActivities}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                </div>
            </div>

            {status && (
                <div className={`text-center p-3 rounded-lg ${
                    status.status === 'active' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                        : status.status === 'at-risk'
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                }`}>
                    <p className="font-semibold">{status.message}</p>
                </div>
            )}
        </div>
    );
};

export default StreakDisplay;

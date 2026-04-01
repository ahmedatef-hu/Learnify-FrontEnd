import React, { useState, useEffect } from 'react';
import { StreakService } from '../services/streakService';

/**
 * Streak History Component
 * Shows activity history and streak timeline
 */
const StreakHistory = ({ studentId = 'default' }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadHistory();
    }, [studentId]);

    const loadHistory = () => {
        const historyData = StreakService.getHistory(studentId);
        setHistory(historyData.reverse().slice(0, 30)); // Last 30 activities
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'exam': return '📝';
            case 'revision': return '📖';
            case 'study': return '📚';
            default: return '✅';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    if (history.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">No activity history yet. Start learning!</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Activity History
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{getActivityIcon(item.activityType)}</span>
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white capitalize">
                                    {item.activityType} Completed
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(item.date)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-orange-500">🔥</span>
                            <span className="font-bold text-gray-800 dark:text-white">
                                {item.streakCount}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StreakHistory;

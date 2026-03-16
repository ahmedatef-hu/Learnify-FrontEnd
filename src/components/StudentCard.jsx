import React from 'react';
import { formatDate, getAvatarColor } from '../utils/helpers';

/**
 * Student Card Component
 * Displays a student profile card with skills overview
 */
const StudentCard = ({ student, index, onViewProfile, onDelete }) => {
    const avatarColor = getAvatarColor(index);

    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
            onClick={onViewProfile}
        >
            <div className="relative">
                <div className="h-24 bg-gradient-to-r from-teal-400 to-blue-400"></div>
                <div className="absolute -bottom-12 left-6">
                    <div
                        className={`${avatarColor} w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden`}
                    >
                        {student.avatar ? (
                            <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            student.name.charAt(0).toUpperCase()
                        )}
                    </div>
                </div>
            </div>
            <div className="pt-16 px-6 pb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{student.name}</h3>
                <p className="text-sm text-gray-500 mb-4">📅 Joined {formatDate(student.date)}</p>

                <div className="mb-3">
                    <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">✅ Can teach:</p>
                    <div className="flex flex-wrap gap-1">
                        {student.know.slice(0, 3).map((s, i) => (
                            <span
                                key={i}
                                className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs"
                            >
                                {s}
                            </span>
                        ))}
                        {student.know.length > 3 && (
                            <span className="text-xs text-gray-500">+{student.know.length - 3} more</span>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">📚 Wants to learn:</p>
                    <div className="flex flex-wrap gap-1">
                        {student.want.slice(0, 3).map((s, i) => (
                            <span
                                key={i}
                                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs"
                            >
                                {s}
                            </span>
                        ))}
                        {student.want.length > 3 && (
                            <span className="text-xs text-gray-500">+{student.want.length - 3} more</span>
                        )}
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewProfile();
                    }}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg text-sm font-semibold transition"
                >
                    View Full Profile
                </button>
            </div>
        </div>
    );
};

export default StudentCard;

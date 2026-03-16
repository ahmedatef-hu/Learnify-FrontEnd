import React from 'react';
import { formatDate, getDaysSince, getAvatarColor } from '../utils/helpers';

/**
 * Student Modal Component
 * Displays detailed student profile in a modal
 */
const StudentModal = ({ student, index, onClose, onDelete }) => {
    const avatarColor = getAvatarColor(index);

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative">
                    <div className="h-32 bg-gradient-to-r from-teal-400 via-blue-400 to-indigo-400"></div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white dark:bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        ✕
                    </button>
                    <div className="absolute -bottom-16 left-8">
                        <div
                            className={`${avatarColor} w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl font-bold border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden`}
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

                <div className="pt-20 px-8 pb-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{student.name}</h2>
                    {student.bio && (
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{student.bio}</p>
                    )}
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        📅 Member since {formatDate(student.date)}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">✅</span>
                                <h3 className="text-xl font-bold text-green-800 dark:text-green-400">Can Teach</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {student.know.map((s, i) => (
                                    <span
                                        key={i}
                                        className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-semibold"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                            <p className="text-sm text-green-600 dark:text-green-400 mt-3">
                                {student.know.length} skill{student.know.length > 1 ? 's' : ''} available
                            </p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">📚</span>
                                <h3 className="text-xl font-bold text-blue-800 dark:text-blue-400">Wants to Learn</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {student.want.map((s, i) => (
                                    <span
                                        key={i}
                                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-semibold"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-3">
                                {student.want.length} skill{student.want.length > 1 ? 's' : ''} wanted
                            </p>
                        </div>
                    </div>

                    <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6 mb-6">
                        <h3 className="text-lg font-bold text-teal-800 dark:text-teal-400 mb-3">📊 Profile Stats</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                                    {student.know.length}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Skills</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                                    {student.want.length}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Learning</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                                    {getDaysSince(student.date)}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Days</div>
                            </div>
                        </div>
                    </div>

                    {(student.email || student.phone) && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-bold text-blue-800 dark:text-blue-400 mb-4">
                                📞 Contact Information
                            </h3>
                            <div className="space-y-3">
                                {student.email && (
                                    <a
                                        href={`mailto:${student.email}`}
                                        className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg hover:shadow-md transition group"
                                    >
                                        <span className="text-2xl">📧</span>
                                        <div className="flex-1">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                                            <div className="font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                                                {student.email}
                                            </div>
                                        </div>
                                    </a>
                                )}
                                {student.phone && (
                                    <a
                                        href={`tel:${student.phone}`}
                                        className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg hover:shadow-md transition group"
                                    >
                                        <span className="text-2xl">📱</span>
                                        <div className="flex-1">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                                            <div className="font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                                                {student.phone}
                                            </div>
                                        </div>
                                    </a>
                                )}
                                {student.phone && (
                                    <a
                                        href={`https://wa.me/${student.phone.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition"
                                    >
                                        <span className="text-2xl">💬</span>
                                        <div className="flex-1">
                                            <div className="font-semibold">WhatsApp</div>
                                            <div className="text-sm opacity-90">Send a message</div>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => {
                                onDelete();
                            }}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
                        >
                            🗑️ Delete Profile
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentModal;

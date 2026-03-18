import React, { useState, useEffect } from 'react';
import { Storage } from '../utils/storage';
import { calculateStudyTime, getGradeColor } from '../utils/helpers';

/**
 * Dashboard Page Component
 * Displays overview of user's skills, subjects, and exam results
 */
const Dashboard = () => {
    const [skills, setSkills] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [exams, setExams] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setSkills(Storage.getSkills());
        setSubjects(Storage.getSubjects());
        setExams(Storage.getExams());
    };

    return (
        <div className="pt-20 pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                    📊 Your Dashboard
                </h1>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gradient-to-br from-teal-500 to-teal-700 text-white p-6 rounded-2xl shadow-lg">
                        <div className="text-3xl mb-2">🤝</div>
                        <div className="text-4xl font-bold mb-1">{skills.length}</div>
                        <div className="text-teal-100">Skills Added</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-2xl shadow-lg">
                        <div className="text-3xl mb-2">📚</div>
                        <div className="text-4xl font-bold mb-1">{subjects.length}</div>
                        <div className="text-green-100">Subjects Tracked</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white p-6 rounded-2xl shadow-lg">
                        <div className="text-3xl mb-2">📝</div>
                        <div className="text-4xl font-bold mb-1">{exams.length}</div>
                        <div className="text-orange-100">Exams Taken</div>
                    </div>
                </div>

                {/* Skills and Study Overview */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Skills Overview */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Your Skills</h2>
                        {skills.length === 0 ? (
                            <p className="text-gray-500">No skills added yet.</p>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        Latest Entry: {skills[skills.length - 1].name}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {skills[skills.length - 1].know.slice(0, 3).map((s, i) => (
                                            <span
                                                key={i}
                                                className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm"
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <a
                                    href="/skill-exchange"
                                    className="inline-block text-teal-600 dark:text-teal-400 hover:underline"
                                >
                                    View all →
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Study Overview */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Study Progress</h2>
                        {subjects.length === 0 ? (
                            <p className="text-gray-500">No subjects added yet.</p>
                        ) : (
                            <div className="space-y-3">
                                <div className="bg-teal-50 dark:bg-teal-900/30 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Study Time Today</p>
                                    <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                                        {subjects.reduce((sum, s) => {
                                            return (
                                                sum +
                                                calculateStudyTime(s.grade, s.completed, s.total)
                                            );
                                        }, 0)}{' '}
                                        min
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    {subjects.slice(0, 3).map((s, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{s.name}</span>
                                            <span className={`text-sm font-semibold ${getGradeColor(s.grade)}`}>
                                                {s.grade}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <a
                                    href="/study-planner"
                                    className="inline-block text-teal-600 dark:text-teal-400 hover:underline"
                                >
                                    View all →
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Exam Results */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Recent Exam Results</h2>
                    {exams.length === 0 ? (
                        <p className="text-gray-500">No exams taken yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {exams
                                .slice(-5)
                                .reverse()
                                .map((exam, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white">
                                                Score: {exam.score}/{exam.total}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(exam.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div
                                            className={`text-2xl font-bold ${
                                                exam.percentage >= 80
                                                    ? 'text-green-600'
                                                    : exam.percentage >= 60
                                                    ? 'text-yellow-600'
                                                    : 'text-red-600'
                                            }`}
                                        >
                                            {exam.percentage}%
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* New Features Quick Access */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
                        🚀 New Features
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Progress Dashboard Card */}
                        <a
                            href="/progress-dashboard"
                            className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📊</div>
                            <h3 className="text-2xl font-bold mb-2">Progress Tracking</h3>
                            <p className="text-blue-100 mb-4">
                                Track your learning progress across all skills with detailed analytics and insights.
                            </p>
                            <div className="flex items-center text-blue-200">
                                <span>Explore Progress →</span>
                            </div>
                        </a>

                        {/* Session Review Card */}
                        <a
                            href="/session-review/session_001"
                            className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">⭐</div>
                            <h3 className="text-2xl font-bold mb-2">Rating & Reviews</h3>
                            <p className="text-yellow-100 mb-4">
                                Rate your learning sessions and provide feedback to improve your experience.
                            </p>
                            <div className="flex items-center text-yellow-200">
                                <span>Start Reviewing →</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

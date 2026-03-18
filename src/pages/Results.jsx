import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Storage } from '../utils/storage';
import { getGradeColor, getGradeText, updateStudyTimeByQuizScore } from '../utils/helpers';

/**
 * Results Page Component
 * Displays exam results and detailed answer review
 */
const Results = () => {
    const [result, setResult] = useState(null);
    const [updateMessage, setUpdateMessage] = useState('');

    useEffect(() => {
        const lastResult = Storage.getLastResult();
        if (!lastResult) {
            setResult(null);
        } else {
            setResult(lastResult);
            
            // Update study planner if subject is available
            if (lastResult.subject) {
                updateStudyPlanner(lastResult.subject, lastResult.percentage);
            }
        }
    }, []);

    const updateStudyPlanner = (subjectName, percentage) => {
        // Use the new smart update function
        const updateResult = updateStudyTimeByQuizScore(subjectName, percentage, percentage);
        
        if (updateResult) {
            setUpdateMessage(updateResult.message);
            
            // Additional message about time adjustment
            if (updateResult.oldTime !== updateResult.newTime) {
                const timeChange = updateResult.newTime - updateResult.oldTime;
                const changeText = timeChange > 0 ? `+${timeChange}` : `${timeChange}`;
                setUpdateMessage(prev => 
                    `${prev} Study time adjusted: ${updateResult.oldTime} → ${updateResult.newTime} min (${changeText} min)`
                );
            }
        } else {
            // Fallback to old logic if subject not found
            const subjects = Storage.getSubjects();
            const subjectIndex = subjects.findIndex(s => s.name === subjectName);
            
            if (subjectIndex !== -1) {
                const subject = subjects[subjectIndex];
                
                // Update based on score
                if (percentage === 100) {
                    // Perfect score - mark as done
                    subject.completed = subject.total;
                    subject.grade = 100;
                    setUpdateMessage(`🎉 Perfect score! ${subjectName} is now marked as complete!`);
                } else if (percentage >= 80) {
                    // Good score - advance progress
                    const lessonsToAdd = Math.min(2, subject.total - subject.completed);
                    subject.completed = Math.min(subject.total, subject.completed + lessonsToAdd);
                    subject.grade = percentage;
                    setUpdateMessage(`✅ Great job! Advanced ${lessonsToAdd} lessons in ${subjectName}`);
                } else if (percentage >= 60) {
                    // Average score - small progress
                    const lessonsToAdd = Math.min(1, subject.total - subject.completed);
                    subject.completed = Math.min(subject.total, subject.completed + lessonsToAdd);
                    subject.grade = percentage;
                    setUpdateMessage(`👍 Good effort! Advanced ${lessonsToAdd} lesson in ${subjectName}`);
                } else {
                    // Low score - review needed
                    subject.grade = percentage;
                    setUpdateMessage(`📚 Keep practicing ${subjectName}! Review the materials and try again.`);
                }
                
                subject.lastQuizDate = new Date().toISOString();
                
                // Save updated subject
                subjects[subjectIndex] = subject;
                localStorage.setItem('subjects', JSON.stringify(subjects));
            }
        }
    };

    if (!result) {
        return (
            <div className="pt-20 pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="container mx-auto px-6 py-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Exam Results</h1>
                            <p className="text-gray-500">No results available.</p>
                            <Link
                                to="/pdf-exam"
                                className="inline-block mt-6 bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
                            >
                                Take an Exam
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 pb-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-5xl mx-auto">
                    {/* Main Results Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-8 text-white">
                            <h1 className="text-4xl font-bold text-center mb-2">
                                🎓 Exam Results
                            </h1>
                            {result.subject && (
                                <p className="text-center text-teal-100 text-lg">
                                    Subject: {result.subject}
                                </p>
                            )}
                        </div>

                        <div className="p-8">
                            {/* Score Display with Animation */}
                            <div className="mb-12 text-center">
                                <div className="relative inline-block">
                                    {/* Circular Progress */}
                                    <div className="relative w-48 h-48 mx-auto mb-6">
                                        <svg className="transform -rotate-90 w-48 h-48">
                                            <circle
                                                cx="96"
                                                cy="96"
                                                r="88"
                                                stroke="currentColor"
                                                strokeWidth="12"
                                                fill="none"
                                                className="text-gray-200 dark:text-gray-700"
                                            />
                                            <circle
                                                cx="96"
                                                cy="96"
                                                r="88"
                                                stroke="currentColor"
                                                strokeWidth="12"
                                                fill="none"
                                                strokeDasharray={`${2 * Math.PI * 88}`}
                                                strokeDashoffset={`${2 * Math.PI * 88 * (1 - result.percentage / 100)}`}
                                                className={`${
                                                    result.percentage >= 80
                                                        ? 'text-green-500'
                                                        : result.percentage >= 60
                                                        ? 'text-yellow-500'
                                                        : 'text-red-500'
                                                } transition-all duration-1000 ease-out`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className="text-5xl font-bold text-gray-800 dark:text-white">
                                                {result.percentage}%
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {result.score}/{result.total}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Grade Badge */}
                                <div className={`inline-block px-8 py-3 rounded-full text-2xl font-bold ${
                                    result.percentage >= 90
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : result.percentage >= 80
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                        : result.percentage >= 70
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        : result.percentage >= 60
                                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>
                                    {getGradeText(result.percentage)}
                                </div>
                                
                                {/* Update Message */}
                                {updateMessage && (
                                    <div className="mt-8 mx-auto max-w-2xl">
                                        <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/30 dark:to-teal-900/30 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-700 shadow-lg">
                                            <p className="text-xl font-semibold text-blue-800 dark:text-blue-200 text-center">
                                                {updateMessage}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center border-2 border-green-200 dark:border-green-800">
                                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                        {result.questions.filter((q, i) => result.userAnswers[i] === q.correct).length}
                                    </div>
                                    <div className="text-sm text-green-700 dark:text-green-300 font-medium mt-1">
                                        ✅ Correct
                                    </div>
                                </div>
                                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center border-2 border-red-200 dark:border-red-800">
                                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                                        {result.questions.filter((q, i) => result.userAnswers[i] !== q.correct).length}
                                    </div>
                                    <div className="text-sm text-red-700 dark:text-red-300 font-medium mt-1">
                                        ❌ Incorrect
                                    </div>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center border-2 border-blue-200 dark:border-blue-800">
                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                        {result.total}
                                    </div>
                                    <div className="text-sm text-blue-700 dark:text-blue-300 font-medium mt-1">
                                        📝 Total
                                    </div>
                                </div>
                            </div>

                            {/* Answers Review */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                                    <span>📋</span> Answer Review
                                </h2>
                                <div className="space-y-4">
                                    {result.questions.map((q, index) => {
                                        const userAnswer = result.userAnswers[index];
                                        const isCorrect = userAnswer === q.correct;

                                        return (
                                            <div
                                                key={index}
                                                className={`rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg ${
                                                    isCorrect
                                                        ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10'
                                                        : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'
                                                }`}
                                            >
                                                <div className="p-5">
                                                    <div className="flex items-start gap-4">
                                                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                                                            isCorrect
                                                                ? 'bg-green-200 dark:bg-green-800'
                                                                : 'bg-red-200 dark:bg-red-800'
                                                        }`}>
                                                            {isCorrect ? '✅' : '❌'}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <p className="font-bold text-lg text-gray-800 dark:text-white">
                                                                    Question {index + 1}
                                                                </p>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                                    isCorrect
                                                                        ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                                                                        : 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                                                                }`}>
                                                                    {isCorrect ? 'Correct' : 'Incorrect'}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                                                {q.question}
                                                            </p>
                                                            
                                                            <div className="space-y-2">
                                                                <div className={`p-3 rounded-lg ${
                                                                    isCorrect
                                                                        ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700'
                                                                        : 'bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700'
                                                                }`}>
                                                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                                                        Your answer:
                                                                    </span>
                                                                    <p className={`font-bold mt-1 ${
                                                                        isCorrect
                                                                            ? 'text-green-700 dark:text-green-300'
                                                                            : 'text-red-700 dark:text-red-300'
                                                                    }`}>
                                                                        {q.options[userAnswer] || 'Not answered'}
                                                                    </p>
                                                                </div>
                                                                
                                                                {!isCorrect && (
                                                                    <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700">
                                                                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                                                            Correct answer:
                                                                        </span>
                                                                        <p className="font-bold text-green-700 dark:text-green-300 mt-1">
                                                                            {q.options[q.correct]}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 justify-center flex-wrap pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                                {result.subject && (
                                    <Link
                                        to="/study-planner"
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    >
                                        📚 View Study Plan
                                    </Link>
                                )}
                                <Link
                                    to="/pdf-exam"
                                    className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-4 rounded-xl font-bold hover:from-teal-700 hover:to-teal-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    🔄 Take Another Exam
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl font-bold hover:from-gray-700 hover:to-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    🏠 Go to Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;

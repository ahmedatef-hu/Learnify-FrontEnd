import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Storage } from '../utils/storage';
import { StreakService } from '../services/streakService';
import StreakNotification from '../components/StreakNotification';

/**
 * Exam Page Component
 * Displays exam questions and handles user answers
 * With strict anti-cheating system
 */
const Exam = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [cheatingDetected, setCheatingDetected] = useState(false);
    const [streakNotification, setStreakNotification] = useState({ show: false, message: '' });

    useEffect(() => {
        // Check if exam was in progress (refresh detection)
        const examStarted = localStorage.getItem('examInProgress');
        const examStartTime = localStorage.getItem('examStartTime');
        const now = Date.now();
        
        // If exam was started more than 3 seconds ago, it's a refresh
        if (examStarted === 'true' && examStartTime && (now - parseInt(examStartTime)) > 3000) {
            // Get exam from storage
            const currentExam = Storage.getCurrentExam();
            
            if (currentExam.length > 0) {
                // This is a refresh - terminate exam
                const result = {
                    score: 0,
                    total: currentExam.length,
                    percentage: 0,
                    questions: currentExam,
                    userAnswers: new Array(currentExam.length).fill(null),
                    date: new Date().toISOString(),
                    subject: sessionStorage.getItem('currentExamSubject') || null,
                    cheating: true,
                    reason: 'Page refresh detected'
                };
                
                Storage.setLastResult(result);
                Storage.saveExam(result);
                sessionStorage.removeItem('currentExamSubject');
                localStorage.removeItem('examInProgress');
                localStorage.removeItem('examStartTime');
                
                // Set questions and show cheating screen (DON'T clear exam yet)
                setQuestions(currentExam);
                setCheatingDetected(true);
                return;
            }
        }
        
        const currentExam = Storage.getCurrentExam();
        if (currentExam.length === 0) {
            navigate('/pdf-exam');
            return;
        }
        
        // Mark as started
        localStorage.setItem('examInProgress', 'true');
        localStorage.setItem('examStartTime', now.toString());
        
        setQuestions(currentExam);
        setUserAnswers(new Array(currentExam.length).fill(null));
    }, [navigate]);

    // Strict Anti-cheating system - Terminates on first violation
    useEffect(() => {
        if (questions.length === 0 || cheatingDetected) return;

        const terminateExam = (reason) => {
            const result = {
                score: 0,
                total: questions.length,
                percentage: 0,
                questions,
                userAnswers: new Array(questions.length).fill(null),
                date: new Date().toISOString(),
                subject: sessionStorage.getItem('currentExamSubject') || null,
                cheating: true,
                reason
            };
            
            Storage.setLastResult(result);
            Storage.saveExam(result);
            Storage.clearCurrentExam();
            sessionStorage.removeItem('currentExamSubject');
            localStorage.removeItem('examInProgress');
            localStorage.removeItem('examStartTime');
            
            setCheatingDetected(true);
        };

        // Detect tab switching / window blur - INSTANT TERMINATION
        const handleVisibilityChange = () => {
            if (document.hidden) {
                terminateExam('Tab switching detected');
            }
        };

        // Detect right-click
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        // Detect keyboard shortcuts (Ctrl+C, Ctrl+V, etc.)
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
                e.preventDefault();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [questions, cheatingDetected]);

    const handleAnswerSelect = (optionIndex) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestion] = optionIndex;
        setUserAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = () => {
        // Clear exam started flag before submitting
        localStorage.removeItem('examInProgress');
        localStorage.removeItem('examStartTime');
        
        let score = 0;
        questions.forEach((q, i) => {
            if (userAnswers[i] === q.correct) {
                score++;
            }
        });

        const percentage = Math.round((score / questions.length) * 100);

        const result = {
            score,
            total: questions.length,
            percentage,
            questions,
            userAnswers,
            date: new Date().toISOString(),
            subject: sessionStorage.getItem('currentExamSubject') || null,
        };

        Storage.setLastResult(result);
        Storage.saveExam(result);
        Storage.clearCurrentExam();
        sessionStorage.removeItem('currentExamSubject');

        // Record streak activity
        const streakResult = StreakService.recordActivity('exam');
        if (streakResult.streakIncreased) {
            setStreakNotification({
                show: true,
                message: streakResult.message
            });
        }

        setShowResults(true);
        setTimeout(() => {
            navigate('/results');
        }, 1500);
    };

    if (questions.length === 0 && !cheatingDetected) {
        return (
            <div className="pt-20 pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Loading exam...</p>
                </div>
            </div>
        );
    }

    // Show cheating detected screen
    if (cheatingDetected) {
        return (
            <div className="pt-20 pb-20 bg-red-50 dark:bg-red-900/20 min-h-screen flex items-center justify-center">
                <div className="text-center max-w-2xl mx-auto px-6">
                    <div className="text-8xl mb-6 animate-bounce">🚫</div>
                    <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">
                        Exam Terminated
                    </h1>
                    <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                        Cheating detected - Exam automatically closed
                    </p>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Your exam has been automatically submitted with a score of 0 due to cheating detection.
                        </p>
                        <button
                            onClick={() => {
                                Storage.clearCurrentExam();
                                navigate('/results');
                            }}
                            className="mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                        >
                            View Results
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const question = questions[currentQuestion];
    const isAnswered = userAnswers[currentQuestion] !== null;
    const allAnswered = userAnswers.every((a) => a !== null);

    return (
        <div className="pt-20 pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <StreakNotification 
                message={streakNotification.message}
                show={streakNotification.show}
                onClose={() => setStreakNotification({ show: false, message: '' })}
            />
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Question {currentQuestion + 1} of {questions.length}
                            </span>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-teal-600 h-2 rounded-full transition-all"
                                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                            {question.question}
                        </h2>

                        {/* Options */}
                        <div className="space-y-3">
                            {question.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(index)}
                                    className={`w-full p-4 rounded-lg border-2 transition text-left font-semibold ${
                                        userAnswers[currentQuestion] === index
                                            ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200'
                                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:border-teal-400'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                userAnswers[currentQuestion] === index
                                                    ? 'border-teal-600 bg-teal-600'
                                                    : 'border-gray-400'
                                            }`}
                                        >
                                            {userAnswers[currentQuestion] === index && (
                                                <span className="text-white text-sm">✓</span>
                                            )}
                                        </div>
                                        {option}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col gap-4">
                        {/* Question Numbers - Scrollable on mobile */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {questions.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentQuestion(index)}
                                    className={`min-w-[40px] h-10 rounded-lg font-semibold transition flex-shrink-0 ${
                                        index === currentQuestion
                                            ? 'bg-teal-600 text-white'
                                            : userAnswers[index] !== null
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        {/* Previous/Next Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                ← Previous
                            </button>

                            {currentQuestion === questions.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!allAnswered}
                                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition disabled:cursor-not-allowed text-sm sm:text-base"
                                >
                                    Submit Exam
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="flex-1 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition text-sm sm:text-base"
                                >
                                    Next →
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Answer Status */}
                    <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        {isAnswered ? (
                            <span className="text-green-600 dark:text-green-400">✓ Question answered</span>
                        ) : (
                            <span className="text-orange-600 dark:text-orange-400">⚠ Please select an answer</span>
                        )}
                    </div>

                    {/* Show Results Message */}
                    {showResults && (
                        <div className="mt-8 text-center">
                            <div className="inline-block animate-bounce">
                                <div className="text-4xl mb-2">✅</div>
                                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                    Exam submitted! Redirecting...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Exam;

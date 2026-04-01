import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Storage } from '../utils/storage';
import { extractPdfText, generateQuestions } from '../utils/helpers';
import apiClient from '../services/apiClient';

/**
 * PDF Exam Page Component
 * Allows users to upload PDFs and generate practice exams
 */
const PdfExam = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [subjectName, setSubjectName] = useState('');
    const [materials, setMaterials] = useState([]);
    const [useAI, setUseAI] = useState(true);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [pendingExamQuestions, setPendingExamQuestions] = useState(null);

    // Initialize PDF.js worker and load materials if coming from StudyPlanner
    useEffect(() => {
        if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        // Check if coming from StudyPlanner with subject
        const subject = searchParams.get('subject');
        if (subject) {
            setSubjectName(subject);
            const subjectMaterials = Storage.getMaterials(subject);
            if (subjectMaterials && subjectMaterials.length > 0) {
                setMaterials(subjectMaterials);
                setFileName(`Loaded ${subjectMaterials.length} materials from ${subject}`);
            }
        }
    }, [searchParams]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(`Selected: ${file.name}`);

        try {
            const text = await extractPdfText(file);
            setExtractedText(text);
        } catch (error) {
            console.error('Error extracting PDF:', error);
            alert('Error reading PDF. Please try another file.');
            setFileName('');
            setExtractedText('');
        }
    };

    const handleGenerateExam = async () => {
        // Check if we have materials from StudyPlanner or uploaded PDF
        const hasMaterials = materials.length > 0;
        const hasExtractedText = extractedText.trim().length > 0;

        if (!hasMaterials && !hasExtractedText) {
            alert('Please upload a PDF or add study materials first!');
            return;
        }

        setLoading(true);

        try {
            let questions;

            if (useAI && hasMaterials) {
                // Use AI to generate exam from materials
                console.log('Generating AI exam from materials...');
                const response = await apiClient.generateExam(materials, subjectName);

                if (response.success && response.questions) {
                    questions = response.questions;
                } else {
                    throw new Error('Invalid response from AI');
                }
            } else if (hasExtractedText) {
                // Use AI to generate exam from PDF text
                console.log('Generating AI exam from PDF...');
                
                // Convert PDF text to material format for AI
                const pdfMaterial = [{
                    lessonNumber: 1,
                    title: fileName || 'Uploaded PDF',
                    type: 'pdf',
                    content: extractedText
                }];
                
                const response = await apiClient.generateExam(pdfMaterial, subjectName || 'General');
                
                if (response.success && response.questions) {
                    questions = response.questions;
                } else {
                    throw new Error('Invalid response from AI');
                }
            } else {
                throw new Error('No content available for exam generation');
            }

            // Save exam with subject name and navigate
            Storage.setCurrentExam(questions);
            if (subjectName) {
                sessionStorage.setItem('currentExamSubject', subjectName);
            }
            
            // Show warning modal before starting exam
            setPendingExamQuestions(questions);
            setShowWarningModal(true);
        } catch (error) {
            console.error('Error generating exam:', error);
            alert('Failed to generate AI exam. Please try again or check your internet connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleStartExam = () => {
        setShowWarningModal(false);
        // Clear any previous exam flags
        localStorage.removeItem('examInProgress');
        navigate('/exam');
    };

    const handleCancelExam = () => {
        setShowWarningModal(false);
        Storage.clearCurrentExam();
        sessionStorage.removeItem('currentExamSubject');
        setPendingExamQuestions(null);
    };

    const handleGenerateTestExam = () => {
        // Generate a simple test exam for testing anti-cheating
        const testQuestions = [
            {
                question: "What is 2 + 2?",
                options: ["3", "4", "5", "6"],
                correct: 1
            },
            {
                question: "What color is the sky?",
                options: ["Red", "Blue", "Green", "Yellow"],
                correct: 1
            },
            {
                question: "How many days in a week?",
                options: ["5", "6", "7", "8"],
                correct: 2
            }
        ];
        
        Storage.setCurrentExam(testQuestions);
        sessionStorage.setItem('currentExamSubject', 'Test Exam');
        setPendingExamQuestions(testQuestions);
        setShowWarningModal(true);
    };

    return (
        <div className="pt-20 pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                    📝 AI Exam Generator
                </h1>

                {/* Upload Section */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                            {subjectName ? `Generate Exam for ${subjectName}` : 'Upload PDF'}
                        </h2>

                        {/* Materials Info */}
                        {materials.length > 0 && (
                            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                                        📚 Study Materials Loaded
                                    </h3>
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                                        {materials.length} items
                                    </span>
                                </div>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {materials.map((material, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <span className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">
                                                Lesson {material.lessonNumber}
                                            </span>
                                            <span className="font-medium">{material.title}</span>
                                            <span className="text-gray-500">({material.type})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload Section */}
                        <div className="border-4 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center">
                            <div className="text-6xl mb-4">📄</div>
                            <p className="text-gray-600 dark:text-gray-300 mb-2 font-semibold">
                                {materials.length > 0 
                                    ? 'Or upload additional PDF material' 
                                    : 'Upload your study material'}
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                                🤖 AI will generate questions from your PDF content
                            </p>
                            <input
                                type="file"
                                id="pdfFile"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button
                                onClick={() => document.getElementById('pdfFile').click()}
                                className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
                            >
                                Choose PDF File
                            </button>
                            {fileName && <p className="mt-4 text-sm text-gray-500">{fileName}</p>}
                        </div>
                        <button
                            onClick={handleGenerateExam}
                            disabled={(!extractedText && materials.length === 0) || loading}
                            className="w-full mt-6 bg-gradient-to-r from-teal-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-teal-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading ? '⏳ Generating...' : '🤖 Generate AI Exam'}
                        </button>
                        {loading && (
                            <div className="mt-6 text-center">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent mb-4"></div>
                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                    🤖 AI is analyzing your content...
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    This may take 10-30 seconds
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Warning Modal */}
                {showWarningModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                            <div className="text-center mb-4">
                                <div className="text-5xl mb-3">⚠️</div>
                                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                                    Anti-Cheating Warning
                                </h2>
                            </div>

                            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-xl p-4 mb-4">
                                <h3 className="font-bold text-red-800 dark:text-red-200 mb-3">
                                    🚫 Exam Rules:
                                </h3>
                                <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                                    <li>• Do NOT switch tabs or windows</li>
                                    <li>• Do NOT refresh the page</li>
                                    <li>• Do NOT copy or paste</li>
                                </ul>
                            </div>

                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-xl p-4 mb-4">
                                <p className="text-yellow-800 dark:text-yellow-200 font-bold text-sm text-center">
                                    ⚡ Any violation = Instant termination with 0 score
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleCancelExam}
                                    className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStartExam}
                                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                                >
                                    I Understand
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PdfExam;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Storage } from '../utils/storage';
import { calculateStudyTime, getGradeColor } from '../utils/helpers';
import MaterialUpload from '../components/MaterialUpload';
import AddMaterialForm from '../components/AddMaterialForm';

/**
 * Study Planner Page Component
 * Allows users to add subjects and get personalized study recommendations
 */
const StudyPlanner = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [formData, setFormData] = useState({
        subjectName: '',
        subjectGrade: '',
        lessonsCompleted: '',
        totalLessons: '',
        difficulty: 'medium',
    });
    const [materials, setMaterials] = useState([]);
    const [showMaterialForm, setShowMaterialForm] = useState(false);

    // Initialize demo subjects on mount
    useEffect(() => {
        initializeDemoSubjects();
        loadSubjects();
    }, []);

    const initializeDemoSubjects = () => {
        const existingSubjects = Storage.getSubjects();
        if (existingSubjects.length === 0) {
            const demoSubjects = [
                {
                    name: 'Mathematics',
                    grade: 75,
                    completed: 12,
                    total: 20,
                    difficulty: 'hard',
                    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    name: 'Physics',
                    grade: 85,
                    completed: 18,
                    total: 20,
                    difficulty: 'medium',
                    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    name: 'Chemistry',
                    grade: 65,
                    completed: 8,
                    total: 20,
                    difficulty: 'easy',
                    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                },
            ];

            demoSubjects.forEach((subject) => Storage.saveSubject(subject));
        }
    };

    const loadSubjects = () => {
        const loadedSubjects = Storage.getSubjects();
        setSubjects(loadedSubjects);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const subject = {
            name: formData.subjectName.trim(),
            grade: parseInt(formData.subjectGrade),
            completed: parseInt(formData.lessonsCompleted),
            total: parseInt(formData.totalLessons),
            difficulty: formData.difficulty,
            date: new Date().toISOString(),
        };

        if (subject.completed > subject.total) {
            alert('Completed lessons cannot exceed total lessons!');
            return;
        }

        // Save subject
        Storage.saveSubject(subject);
        
        // Save materials if added
        if (materials.length > 0) {
            Storage.saveMaterials(subject.name, materials);
        }

        // Reset form
        setFormData({
            subjectName: '',
            subjectGrade: '',
            lessonsCompleted: '',
            totalLessons: '',
            difficulty: 'medium',
        });
        setMaterials([]);
        setShowMaterialForm(false);
        
        loadSubjects();
        alert('Subject added successfully!');
    };

    const addMaterial = (material) => {
        console.log('Adding material:', material);
        const newMaterial = {
            ...material,
            id: Date.now().toString(),
            dateAdded: new Date().toISOString()
        };
        
        setMaterials(prev => {
            const updatedMaterials = [...prev, newMaterial];
            console.log('Updated materials:', updatedMaterials);
            return updatedMaterials;
        });
        
        console.log('Material added successfully to state');
    };

    const removeMaterial = (materialId) => {
        setMaterials(prev => prev.filter(m => m.id !== materialId));
    };

    const deleteSubject = (index) => {
        if (confirm('Are you sure you want to delete this subject?')) {
            Storage.deleteSubject(index);
            loadSubjects();
        }
    };

    return (
        <div className="pt-20 pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                    📚 Smart Study Planner
                </h1>

                {/* Add Subject Form */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Subject</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Subject Name
                                </label>
                                <input
                                    type="text"
                                    name="subjectName"
                                    value={formData.subjectName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., Mathematics"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Your Current Grade (0-100)
                                </label>
                                <input
                                    type="number"
                                    name="subjectGrade"
                                    value={formData.subjectGrade}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    max="100"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                        Lessons Completed
                                    </label>
                                    <input
                                        type="number"
                                        name="lessonsCompleted"
                                        value={formData.lessonsCompleted}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                        Total Lessons
                                    </label>
                                    <input
                                        type="number"
                                        name="totalLessons"
                                        value={formData.totalLessons}
                                        onChange={handleInputChange}
                                        required
                                        min="1"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none"
                                    />
                                </div>
                            </div>
                            
                            {/* Difficulty Level */}
                            <div className="mb-6">
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Difficulty Level
                                </label>
                                <select
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none"
                                >
                                    <option value="easy">😊 Easy (Less study time)</option>
                                    <option value="medium">📚 Medium (Standard time)</option>
                                    <option value="hard">🔥 Hard (More study time)</option>
                                </select>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    This affects your recommended daily study time
                                </p>
                            </div>

                            {/* Materials Section */}
                            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                        Study Materials ({materials.length})
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowMaterialForm(!showMaterialForm)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                                    >
                                        {showMaterialForm ? 'Hide' : 'Add Materials'}
                                    </button>
                                </div>

                                {/* Materials List */}
                                {materials.length > 0 && (
                                    <div className="mb-4 space-y-2">
                                        {materials
                                            .sort((a, b) => a.lessonNumber - b.lessonNumber)
                                            .map((material) => (
                                                <div
                                                    key={material.id}
                                                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
                                                            Lesson {material.lessonNumber}
                                                        </span>
                                                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                                                            {material.title}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            ({material.type})
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMaterial(material.id)}
                                                        className="text-red-500 hover:text-red-700 transition"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                )}

                                {/* Add Material Form */}
                                {showMaterialForm && (
                                    <AddMaterialForm onAddMaterial={addMaterial} />
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
                            >
                                Add Subject
                            </button>
                        </form>
                    </div>
                </div>

                {/* Study Plan */}
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white text-center">
                        Your Study Plan
                    </h2>
                    {subjects.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            <p className="text-xl">No subjects added yet. Add your first subject to get started!</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subjects.map((subject, index) => {
                                const progress = (subject.completed / subject.total) * 100;
                                const studyTime = calculateStudyTime(
                                    subject.grade,
                                    subject.completed,
                                    subject.total,
                                    subject.difficulty || 'medium'
                                );
                                
                                // Difficulty badge
                                const difficultyConfig = {
                                    easy: { emoji: '😊', label: 'Easy', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
                                    medium: { emoji: '📚', label: 'Medium', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
                                    hard: { emoji: '🔥', label: 'Hard', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
                                };
                                const diffInfo = difficultyConfig[subject.difficulty || 'medium'];

                                return (
                                    <div
                                        key={index}
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                                    {subject.name}
                                                </h3>
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${diffInfo.color}`}>
                                                    {diffInfo.emoji} {diffInfo.label}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => deleteSubject(index)}
                                                className="text-red-500 hover:text-red-700 transition"
                                            >
                                                🗑️
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600 dark:text-gray-400">Grade</span>
                                                    <span
                                                        className={`font-semibold ${getGradeColor(subject.grade)}`}
                                                    >
                                                        {subject.grade}%
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                                    <span className="font-semibold text-gray-800 dark:text-white">
                                                        {subject.completed}/{subject.total} lessons
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-teal-600 h-2 rounded-full transition-all"
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className="bg-teal-50 dark:bg-teal-900/30 rounded-lg p-4 mt-4">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                    Recommended Study Time
                                                </p>
                                                <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                                                    {studyTime} min
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">per day</p>
                                            </div>

                                            <MaterialUpload 
                                                subjectName={subject.name}
                                                onMaterialAdded={() => {
                                                    // Additional logic when material is added
                                                }}
                                            />

                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={() => navigate(`/revision/${subject.name}`)}
                                                    className="flex-1 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition"
                                                >
                                                    💬 Revise
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        // Get materials for this subject
                                                        const materials = Storage.getMaterials(subject.name);
                                                        if (materials && materials.length > 0) {
                                                            // Navigate to exam generator with subject data
                                                            navigate(`/pdf-exam?subject=${encodeURIComponent(subject.name)}`);
                                                        } else {
                                                            alert('Please add study materials first to generate an AI exam!');
                                                        }
                                                    }}
                                                    className="flex-1 bg-green-600 text-white text-sm py-2 rounded-lg hover:bg-green-700 transition"
                                                >
                                                    📝 Quiz
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudyPlanner;

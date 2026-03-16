import React, { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useStudents } from '../hooks/useStudents';
import { findMatches, getMatchingSkills, getTeachingSkills, getDaysSince, getAvatarColor } from '../utils/helpers';
import StudentCard from '../components/StudentCard';
import StudentModal from '../components/StudentModal';

/**
 * Skill Exchange Page Component
 * Displays all students and finds perfect matches for skill exchange
 */
const SkillExchange = () => {
    const { profile } = useProfile();
    const { students, deleteStudent } = useStudents();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [matches, setMatches] = useState([]);

    // Filter students based on search
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredStudents(students);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = students.filter(
                (s) =>
                    s.name.toLowerCase().includes(term) ||
                    s.know.some((k) => k.toLowerCase().includes(term)) ||
                    s.want.some((w) => w.toLowerCase().includes(term))
            );
            setFilteredStudents(filtered);
        }
    }, [searchTerm, students]);

    // Calculate matches when profile changes
    useEffect(() => {
        if (profile) {
            const foundMatches = findMatches(profile, students);
            setMatches(foundMatches);
        }
    }, [profile, students]);

    const handleDeleteStudent = (index) => {
        if (confirm('Are you sure you want to delete this student profile?')) {
            deleteStudent(index);
        }
    };

    return (
        <div className="pt-20 pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                    🤝 Skill Exchange System
                </h1>

                {/* My Profile Card */}
                {profile && (
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-white">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="bg-white text-teal-600 w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg flex-shrink-0 overflow-hidden">
                                    {profile.avatar ? (
                                        <img
                                            src={profile.avatar}
                                            alt={profile.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        profile.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold mb-1">{profile.name}</h2>
                                    {profile.bio && <p className="text-white/90">{profile.bio}</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                                    <p className="text-sm opacity-90 mb-2">✅ Can Teach ({profile.know.length})</p>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.know.slice(0, 4).map((s, i) => (
                                            <span key={i} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                                {s}
                                            </span>
                                        ))}
                                        {profile.know.length > 4 && (
                                            <span className="text-sm opacity-75">+{profile.know.length - 4} more</span>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                                    <p className="text-sm opacity-90 mb-2">📚 Want to Learn ({profile.want.length})</p>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.want.slice(0, 4).map((s, i) => (
                                            <span key={i} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                                {s}
                                            </span>
                                        ))}
                                        {profile.want.length > 4 && (
                                            <span className="text-sm opacity-75">+{profile.want.length - 4} more</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create Profile CTA */}
                {!profile && (
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl shadow-lg p-8 text-center text-white">
                            <div className="text-6xl mb-4">👤</div>
                            <h2 className="text-3xl font-bold mb-4">Create Your Profile</h2>
                            <p className="text-lg mb-6 opacity-90">
                                Set up your profile to find perfect skill exchange matches!
                            </p>
                            <a
                                href="/my-profile"
                                className="inline-block bg-white text-teal-600 px-8 py-3 rounded-full font-bold text-lg hover:shadow-xl transition"
                            >
                                Create Profile Now
                            </a>
                        </div>
                    </div>
                )}

                {/* All Students Section */}
                <div className="max-w-6xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
                        All Students
                    </h2>

                    {/* Search */}
                    <div className="mb-6 max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="🔍 Search by name or skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none text-lg"
                        />
                    </div>

                    {/* Students Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStudents.length === 0 ? (
                            <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
                                <p className="text-xl">
                                    {searchTerm
                                        ? 'No students found matching your search.'
                                        : 'No students yet. Be the first to add your skills!'}
                                </p>
                            </div>
                        ) : (
                            filteredStudents.map((student, index) => (
                                <StudentCard
                                    key={index}
                                    student={student}
                                    index={index}
                                    onViewProfile={() => setSelectedStudent({ student, index })}
                                    onDelete={() => handleDeleteStudent(index)}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Matches Section */}
                {profile && (
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white text-center">
                            🎯 Your Perfect Matches
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {matches.length === 0 ? (
                                <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
                                    <p className="text-xl">Add your skills above to find matches!</p>
                                </div>
                            ) : (
                                matches.map((match, index) => {
                                    const matchingSkills = getMatchingSkills(profile.want, match.know);
                                    const teachingSkills = getTeachingSkills(profile.know, match.want);

                                    return (
                                        <div
                                            key={index}
                                            className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 border-2 border-teal-300 dark:border-teal-600"
                                        >
                                            <div className="flex items-start gap-4 mb-4">
                                                <div
                                                    className={`${getAvatarColor(index)} w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0`}
                                                >
                                                    {match.avatar ? (
                                                        <img
                                                            src={match.avatar}
                                                            alt={match.name}
                                                            className="w-full h-full object-cover rounded-full"
                                                        />
                                                    ) : (
                                                        match.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                                        {match.name}
                                                    </h3>
                                                    <p className="text-sm text-teal-600 dark:text-teal-400 font-semibold">
                                                        🎯 Perfect Match!
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3">
                                                <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">
                                                    ✅ They can teach you:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {matchingSkills.map((s, i) => (
                                                        <span
                                                            key={i}
                                                            className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold"
                                                        >
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                                                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
                                                    📚 You can teach them:
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {teachingSkills.map((s, i) => (
                                                        <span
                                                            key={i}
                                                            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold"
                                                        >
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Student Modal */}
            {selectedStudent && (
                <StudentModal
                    student={selectedStudent.student}
                    index={selectedStudent.index}
                    onClose={() => setSelectedStudent(null)}
                    onDelete={() => {
                        handleDeleteStudent(selectedStudent.index);
                        setSelectedStudent(null);
                    }}
                />
            )}
        </div>
    );
};

export default SkillExchange;

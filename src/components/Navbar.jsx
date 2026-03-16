import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../hooks/useProfile';

/**
 * Navigation Bar Component
 * Displays navigation links and theme toggle
 */
const Navbar = () => {
    const { isDark, toggleTheme } = useTheme();
    const { profile } = useProfile();

    const getAvatarDisplay = () => {
        if (!profile) {
            return '👤';
        }

        if (profile.avatar) {
            return (
                <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                />
            );
        }

        return profile.name.charAt(0).toUpperCase();
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-lg fixed w-full z-50">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                        🎓 Learnify
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-6 items-center">
                        <Link
                            to="/"
                            className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition"
                        >
                            Home
                        </Link>
                        <Link
                            to="/skill-exchange"
                            className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition"
                        >
                            Skill Exchange
                        </Link>
                        <Link
                            to="/study-planner"
                            className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition"
                        >
                            Study Planner
                        </Link>
                        <Link
                            to="/pdf-exam"
                            className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition"
                        >
                            Exam Generator
                        </Link>
                        <Link
                            to="/dashboard"
                            className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition"
                        >
                            Dashboard
                        </Link>
                    </div>

                    {/* Right Side Controls - Desktop Only */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                            aria-label="Toggle theme"
                        >
                            <span className="dark:hidden">🌙</span>
                            <span className="hidden dark:inline">☀️</span>
                        </button>

                        {/* Profile Avatar */}
                        <Link
                            to="/my-profile"
                            className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold hover:ring-2 hover:ring-teal-400 transition cursor-pointer overflow-hidden shadow-lg"
                            title={profile?.name || 'Create Profile'}
                        >
                            {getAvatarDisplay()}
                        </Link>
                    </div>

                    {/* Mobile Right Side - Theme Toggle Only */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                            aria-label="Toggle theme"
                        >
                            <span className="dark:hidden">🌙</span>
                            <span className="hidden dark:inline">☀️</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

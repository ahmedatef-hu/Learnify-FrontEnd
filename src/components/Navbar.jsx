import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../hooks/useProfile';

/**
 * Navigation Bar Component
 * Responsive navigation with hamburger menu
 */
const Navbar = () => {
    const { isDark, toggleTheme } = useTheme();
    const { profile } = useProfile();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                    <Link to="/" className="flex items-center">
                        <img 
                            src="/learnify-logo.png" 
                            alt="Learnify" 
                            className="h-12 w-auto object-contain"
                        />
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
                        <Link
                            to="/progress-dashboard"
                            className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition"
                        >
                            Progress
                        </Link>
                        <Link
                            to="/session-review/session_001"
                            className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition"
                        >
                            Reviews
                        </Link>
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                            aria-label="Toggle theme"
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>

                        {/* Profile Avatar - Desktop Only */}
                        <Link
                            to="/my-profile"
                            className="hidden md:flex w-10 h-10 rounded-full bg-teal-600 items-center justify-center text-white font-bold hover:ring-2 hover:ring-teal-400 transition cursor-pointer overflow-hidden shadow-lg"
                            title={profile?.name || 'Create Profile'}
                        >
                            {getAvatarDisplay()}
                        </Link>

                        {/* Hamburger Menu Button - Mobile Only */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                            aria-label="Toggle menu"
                        >
                            <div className="w-6 h-5 flex flex-col justify-center">
                                <span className={`block h-0.5 w-full bg-gray-600 dark:bg-gray-300 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                                <span className={`block h-0.5 w-full bg-gray-600 dark:bg-gray-300 mt-1 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block h-0.5 w-full bg-gray-600 dark:bg-gray-300 mt-1 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Mobile Sidebar Menu */}
            <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}>
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black bg-opacity-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
                
                {/* Sidebar */}
                <div className={`absolute top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-teal-600 dark:text-teal-400">Menu</h2>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                aria-label="Close menu"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <nav className="flex flex-col space-y-4">
                            <Link
                                to="/"
                                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/skill-exchange"
                                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Skill Exchange
                            </Link>
                            <Link
                                to="/study-planner"
                                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Study Planner
                            </Link>
                            <Link
                                to="/pdf-exam"
                                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Exam Generator
                            </Link>
                            <Link
                                to="/dashboard"
                                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/progress-dashboard"
                                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Progress
                            </Link>
                            <Link
                                to="/session-review/session_001"
                                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Reviews
                            </Link>
                            
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                                <Link
                                    to="/my-profile"
                                    className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold overflow-hidden shadow-lg">
                                        {getAvatarDisplay()}
                                    </div>
                                    <span>{profile?.name || 'Create Profile'}</span>
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

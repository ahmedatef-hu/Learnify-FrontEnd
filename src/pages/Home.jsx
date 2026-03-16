import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

/**
 * Home Page Component
 * Landing page with hero section and features overview
 */
const Home = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    return (
        <div className="pt-20">
            {/* Hero Section */}
            <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-6">
                <div className="container mx-auto max-w-4xl text-center" data-aos="fade-up">
                    <div className="mb-8">
                        <div className="text-7xl mb-6">🎓</div>
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
                            Welcome to Learnify
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                            The ultimate student-to-student skill exchange and smart study assistant platform
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/skill-exchange"
                            className="px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white"
                        >
                            🤝 Start Skill Exchange
                        </Link>
                        <Link
                            to="/study-planner"
                            className="px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                        >
                            📚 Plan Your Study
                        </Link>
                    </div>
                    <div className="mt-16">
                        <a href="#features" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition inline-block">
                            <div className="text-4xl animate-bounce">↓</div>
                            <div className="text-sm mt-2 font-semibold">Explore Features</div>
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6 bg-white dark:bg-gray-800">
                <div className="container mx-auto">
                    <h2
                        className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white"
                        data-aos="fade-up"
                    >
                        Core Features
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 mx-auto px-8">
                        {/* Feature 1 */}
                        <div
                            className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl shadow-lg"
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            <div className="text-5xl mb-4">🤝</div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                                Skill Exchange
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Match with students who have the skills you want and want the skills you have
                            </p>
                            <Link
                                to="/skill-exchange"
                                className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                            >
                                Get Started →
                            </Link>
                        </div>

                        {/* Feature 2 */}
                        <div
                            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl shadow-lg"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <div className="text-5xl mb-4">📚</div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                                Smart Study Planner
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Get personalized study time recommendations based on your grades and progress
                            </p>
                            <Link
                                to="/study-planner"
                                className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                            >
                                Plan Now →
                            </Link>
                        </div>

                        {/* Feature 3 */}
                        <div
                            className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-2xl shadow-lg"
                            data-aos="fade-up"
                            data-aos-delay="300"
                        >
                            <div className="text-5xl mb-4">📝</div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                                AI Exam Generator
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Upload PDFs and generate practice exams automatically with instant results
                            </p>
                            <Link
                                to="/pdf-exam"
                                className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                            >
                                Create Exam →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto">
                    <h2
                        className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white"
                        data-aos="fade-up"
                    >
                        How It Works
                    </h2>
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="flex items-start gap-6" data-aos="fade-right">
                            <div className="bg-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                1
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                                    Create Your Profile
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Add the skills you know and the skills you want to learn
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-6" data-aos="fade-right" data-aos-delay="100">
                            <div className="bg-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                2
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                                    Get Matched
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Our system finds perfect matches for skill exchange
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-6" data-aos="fade-right" data-aos-delay="200">
                            <div className="bg-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                3
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                                    Plan & Practice
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Use smart study planner and exam generator to excel
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { QuizProvider } from './context/QuizContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import MyProfile from './pages/MyProfile';
import SkillExchange from './pages/SkillExchange';
import StudyPlanner from './pages/StudyPlanner';
import Dashboard from './pages/Dashboard';
import PdfExam from './pages/PdfExam';
import Exam from './pages/Exam';
import Results from './pages/Results';
import RevisionPage from './pages/RevisionPage';
import ModernSessionReview from './pages/ModernSessionReview';
import ModernProgressDashboard from './pages/ModernProgressDashboard';

/**
 * Main App Component
 * Sets up routing and global providers
 */
function App() {
    return (
        <ThemeProvider>
            <QuizProvider>
                <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
                        <Navbar />
                        <main className="flex-grow">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/my-profile" element={<MyProfile />} />
                                <Route path="/skill-exchange" element={<SkillExchange />} />
                                <Route path="/study-planner" element={<StudyPlanner />} />
                                <Route path="/revision/:topicId" element={<RevisionPage />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/pdf-exam" element={<PdfExam />} />
                                <Route path="/exam" element={<Exam />} />
                                <Route path="/results" element={<Results />} />
                                <Route path="/progress-dashboard" element={<ModernProgressDashboard />} />
                                <Route path="/session-review/:sessionId" element={<ModernSessionReview />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </Router>
            </QuizProvider>
        </ThemeProvider>
    );
}

export default App;

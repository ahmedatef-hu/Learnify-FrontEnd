/**
 * Modern Progress Dashboard Page
 * Enhanced with modern design and animations
 */

import React, { useState, useEffect } from 'react';
import SkillCard from '../components/SkillCard';
import ProgressBar from '../components/ProgressBar';

const ModernProgressDashboard = () => {
  console.log('ModernProgressDashboard component rendering...');
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('all');
  
  // Mock student ID - in production, get from auth context
  const currentStudentId = 'student_123';

  // Demo data - always available
  const getDemoData = () => {
    return {
      overview: {
        totalSkills: 6,
        completedSkills: 2,
        averageProgress: 67,
        skillLevels: {
          Beginner: 2,
          Intermediate: 2,
          Advanced: 2
        }
      },
      allProgress: [
        {
          id: 1,
          skillName: 'React Development',
          completedSessions: 8,
          totalSessions: 10,
          progressPercentage: 80,
          skillLevel: 'Advanced',
          lastUpdated: new Date().toISOString(),
          studentId: 'student_123'
        },
        {
          id: 2,
          skillName: 'JavaScript Fundamentals',
          completedSessions: 10,
          totalSessions: 10,
          progressPercentage: 100,
          skillLevel: 'Advanced',
          lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          studentId: 'student_123'
        }
      ]
    };
  };

  const loadDashboard = () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading demo data for Modern Progress Dashboard...');
      
      const demoData = getDemoData();
      
      // Add more demo skills
      demoData.allProgress.push(
        {
          id: 3,
          skillName: 'Node.js Backend',
          completedSessions: 6,
          totalSessions: 12,
          progressPercentage: 50,
          skillLevel: 'Intermediate',
          lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          studentId: 'student_123'
        },
        {
          id: 4,
          skillName: 'Database Design',
          completedSessions: 4,
          totalSessions: 8,
          progressPercentage: 50,
          skillLevel: 'Intermediate',
          lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          studentId: 'student_123'
        },
        {
          id: 5,
          skillName: 'UI/UX Design',
          completedSessions: 2,
          totalSessions: 10,
          progressPercentage: 20,
          skillLevel: 'Beginner',
          lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          studentId: 'student_123'
        },
        {
          id: 6,
          skillName: 'Python Programming',
          completedSessions: 3,
          totalSessions: 15,
          progressPercentage: 20,
          skillLevel: 'Beginner',
          lastUpdated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          studentId: 'student_123'
        }
      );
      
      // Group skills by level
      demoData.skillsByLevel = {
        Beginner: demoData.allProgress.filter(s => s.skillLevel === 'Beginner'),
        Intermediate: demoData.allProgress.filter(s => s.skillLevel === 'Intermediate'),
        Advanced: demoData.allProgress.filter(s => s.skillLevel === 'Advanced')
      };
      
      // Set recent activity
      demoData.recentActivity = [...demoData.allProgress]
        .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
      
      console.log('Demo data loaded:', demoData);
      setDashboardData(demoData);
      
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('ModernProgressDashboard component mounted');
    loadDashboard();
  }, []);

  const handleUpdateProgress = (studentId, skillName, completedSessions, totalSessions) => {
    console.log('Updating progress:', { studentId, skillName, completedSessions, totalSessions });
    
    setDashboardData(prevData => {
      if (!prevData) return prevData;
      
      const updatedProgress = prevData.allProgress.map(skill => {
        if (skill.skillName === skillName) {
          const newProgress = Math.round((completedSessions / totalSessions) * 100);
          let newLevel = 'Beginner';
          if (newProgress >= 80) newLevel = 'Advanced';
          else if (newProgress >= 50) newLevel = 'Intermediate';
          
          return {
            ...skill,
            completedSessions,
            totalSessions,
            progressPercentage: newProgress,
            skillLevel: newLevel,
            lastUpdated: new Date().toISOString()
          };
        }
        return skill;
      });
      
      // Recalculate overview
      const totalSkills = updatedProgress.length;
      const completedSkills = updatedProgress.filter(s => s.progressPercentage === 100).length;
      const averageProgress = Math.round(
        updatedProgress.reduce((sum, s) => sum + s.progressPercentage, 0) / totalSkills
      );
      
      const skillLevels = {
        Beginner: updatedProgress.filter(s => s.skillLevel === 'Beginner').length,
        Intermediate: updatedProgress.filter(s => s.skillLevel === 'Intermediate').length,
        Advanced: updatedProgress.filter(s => s.skillLevel === 'Advanced').length
      };
      
      return {
        ...prevData,
        allProgress: updatedProgress,
        overview: {
          ...prevData.overview,
          totalSkills,
          completedSkills,
          averageProgress,
          skillLevels
        },
        skillsByLevel: {
          Beginner: updatedProgress.filter(s => s.skillLevel === 'Beginner'),
          Intermediate: updatedProgress.filter(s => s.skillLevel === 'Intermediate'),
          Advanced: updatedProgress.filter(s => s.skillLevel === 'Advanced')
        },
        recentActivity: [...updatedProgress].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      };
    });
  };
  const handleDeleteProgress = (progressId, studentId) => {
    if (!confirm('Are you sure you want to delete this progress record?')) {
      return;
    }

    console.log('Deleting progress:', { progressId, studentId });
    
    setDashboardData(prevData => {
      if (!prevData) return prevData;
      
      const updatedProgress = prevData.allProgress.filter(skill => skill.id !== progressId);
      
      // Recalculate overview
      const totalSkills = updatedProgress.length;
      const completedSkills = updatedProgress.filter(s => s.progressPercentage === 100).length;
      const averageProgress = totalSkills > 0 ? Math.round(
        updatedProgress.reduce((sum, s) => sum + s.progressPercentage, 0) / totalSkills
      ) : 0;
      
      const skillLevels = {
        Beginner: updatedProgress.filter(s => s.skillLevel === 'Beginner').length,
        Intermediate: updatedProgress.filter(s => s.skillLevel === 'Intermediate').length,
        Advanced: updatedProgress.filter(s => s.skillLevel === 'Advanced').length
      };
      
      return {
        ...prevData,
        allProgress: updatedProgress,
        overview: {
          ...prevData.overview,
          totalSkills,
          completedSkills,
          averageProgress,
          skillLevels
        },
        skillsByLevel: {
          Beginner: updatedProgress.filter(s => s.skillLevel === 'Beginner'),
          Intermediate: updatedProgress.filter(s => s.skillLevel === 'Intermediate'),
          Advanced: updatedProgress.filter(s => s.skillLevel === 'Advanced')
        },
        recentActivity: [...updatedProgress].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      };
    });
  };
  const handleAddNewSkill = () => {
    const skillName = prompt('Enter skill name:');
    if (!skillName) return;

    const totalSessions = parseInt(prompt('Enter total sessions:', '10'));
    if (!totalSessions || totalSessions < 1) return;

    console.log('Adding new skill:', { skillName, totalSessions });
    
    setDashboardData(prevData => {
      if (!prevData) return prevData;
      
      const newSkill = {
        id: Math.max(...prevData.allProgress.map(s => s.id)) + 1,
        skillName: skillName.trim(),
        completedSessions: 0,
        totalSessions,
        progressPercentage: 0,
        skillLevel: 'Beginner',
        lastUpdated: new Date().toISOString(),
        studentId: currentStudentId
      };
      
      const updatedProgress = [...prevData.allProgress, newSkill];
      
      // Recalculate overview
      const totalSkills = updatedProgress.length;
      const completedSkills = updatedProgress.filter(s => s.progressPercentage === 100).length;
      const averageProgress = Math.round(
        updatedProgress.reduce((sum, s) => sum + s.progressPercentage, 0) / totalSkills
      );
      
      const skillLevels = {
        Beginner: updatedProgress.filter(s => s.skillLevel === 'Beginner').length,
        Intermediate: updatedProgress.filter(s => s.skillLevel === 'Intermediate').length,
        Advanced: updatedProgress.filter(s => s.skillLevel === 'Advanced').length
      };
      
      return {
        ...prevData,
        allProgress: updatedProgress,
        overview: {
          ...prevData.overview,
          totalSkills,
          completedSkills,
          averageProgress,
          skillLevels
        },
        skillsByLevel: {
          Beginner: updatedProgress.filter(s => s.skillLevel === 'Beginner'),
          Intermediate: updatedProgress.filter(s => s.skillLevel === 'Intermediate'),
          Advanced: updatedProgress.filter(s => s.skillLevel === 'Advanced')
        },
        recentActivity: [...updatedProgress].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      };
    });
  };
  const getFilteredSkills = () => {
    if (!dashboardData) return [];
    
    if (selectedLevel === 'all') {
      return dashboardData.allProgress;
    }
    
    return dashboardData.skillsByLevel[selectedLevel] || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-6 py-12">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl w-1/2 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-3xl"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-3xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-6 py-12">
            <div className="text-center">
              <div className="text-red-600 dark:text-red-400 mb-4">
                <p className="text-xl">Error loading dashboard</p>
                <p>{error}</p>
              </div>
              <button
                onClick={loadDashboard}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredSkills = getFilteredSkills();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative pt-20 pb-20">
        <div className="container mx-auto px-6 py-12">
          {/* Modern Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl animate-float">
              <span className="text-3xl">📊</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
              Progress Dashboard
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Track your learning journey with detailed insights and beautiful visualizations
            </p>
            
            {/* Action Button */}
            <button
              onClick={handleAddNewSkill}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">✨</span>
              <span className="relative z-10">Add New Skill</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            </button>
          </div>
          {/* Modern Skills Grid */}
          {filteredSkills.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 rounded-3xl blur opacity-20"></div>
                <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-12 border border-white/20 dark:border-gray-700/50 shadow-2xl max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <span className="text-4xl">📚</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No Skills Found</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    Start tracking your learning progress by adding your first skill!
                  </p>
                  <button
                    onClick={handleAddNewSkill}
                    className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10">✨</span>
                    <span className="relative z-10">Add Your First Skill</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSkills.map((skill, index) => (
                <div key={skill.id} className="stagger-animation" style={{ animationDelay: `${index * 100}ms` }}>
                  <SkillCard
                    skill={skill}
                    onUpdateProgress={handleUpdateProgress}
                    onDeleteProgress={handleDeleteProgress}
                    currentStudentId={currentStudentId}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernProgressDashboard;
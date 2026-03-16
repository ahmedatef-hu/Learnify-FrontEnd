import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';

/**
 * Mobile Bottom Navigation Component
 * Fixed bottom navigation for mobile devices
 */
const MobileBottomNav = () => {
    const location = useLocation();
    const { profile } = useProfile();

    const navItems = [
        {
            path: '/',
            icon: '🏠',
            label: 'Home',
            activeIcon: '🏠'
        },
        {
            path: '/skill-exchange',
            icon: '🤝',
            label: 'Exchange',
            activeIcon: '🤝'
        },
        {
            path: '/study-planner',
            icon: '📚',
            label: 'Planner',
            activeIcon: '📚'
        },
        {
            path: '/pdf-exam',
            icon: '📄',
            label: 'Exam',
            activeIcon: '📄'
        },
        {
            path: '/my-profile',
            icon: profile?.avatar ? (
                <img
                    src={profile.avatar}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                />
            ) : (profile?.name ? profile.name.charAt(0).toUpperCase() : '👤'),
            label: 'Profile',
            activeIcon: profile?.avatar ? (
                <img
                    src={profile.avatar}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                />
            ) : (profile?.name ? profile.name.charAt(0).toUpperCase() : '👤')
        }
    ];

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
            <div className="flex items-center justify-around py-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 ${
                            isActive(item.path)
                                ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20'
                                : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400'
                        }`}
                    >
                        <div className={`text-xl mb-1 ${isActive(item.path) ? 'scale-110' : ''} transition-transform`}>
                            {isActive(item.path) ? item.activeIcon : item.icon}
                        </div>
                        <span className={`text-xs font-medium ${isActive(item.path) ? 'font-semibold' : ''}`}>
                            {item.label}
                        </span>
                        {isActive(item.path) && (
                            <div className="absolute -top-1 w-1 h-1 bg-teal-600 dark:bg-teal-400 rounded-full"></div>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MobileBottomNav;
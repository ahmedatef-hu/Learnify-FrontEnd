import React, { useEffect, useState } from 'react';

/**
 * Streak Notification Component
 * Shows animated notification when streak increases
 */
const StreakNotification = ({ message, show, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(onClose, 300);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className={`fixed top-24 right-6 z-50 transition-all duration-300 ${
            visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
                <span className="text-3xl">🔥</span>
                <div>
                    <p className="font-bold text-lg">{message}</p>
                    <p className="text-sm opacity-90">Keep up the great work!</p>
                </div>
            </div>
        </div>
    );
};

export default StreakNotification;

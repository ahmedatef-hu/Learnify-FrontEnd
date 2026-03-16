import React, { createContext, useContext, useEffect, useState } from 'react';
import { Storage } from '../utils/storage';

/**
 * Theme Context
 * Manages dark/light mode state across the application
 */
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = Storage.getTheme();
        return savedTheme === 'dark';
    });

    // Update HTML class and localStorage when theme changes
    useEffect(() => {
        const html = document.documentElement;
        if (isDark) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        Storage.setTheme(isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark((prev) => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

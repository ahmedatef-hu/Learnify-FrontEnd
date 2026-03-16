import React from 'react';

/**
 * Footer Component
 * Displays footer information
 */
const Footer = () => {
    return (
        <footer className="hidden md:block bg-gray-800 dark:bg-gray-950 text-white py-8 px-6 mt-20">
            <div className="container mx-auto text-center">
                <p className="text-gray-400">© 2024 Learnify. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;

/**
 * Helper Functions
 * Utility functions used across the application
 */

/**
 * Calculate recommended study time based on grade, progress, and difficulty
 * 
 * EQUATION BREAKDOWN:
 * ===================
 * Base Time = 30 minutes
 * 
 * 1. Grade Factor (0-30 min):
 *    - Lower grade = more time needed
 *    - Formula: ((100 - grade) / 100) × 30
 *    - Example: Grade 60 → (40/100) × 30 = 12 min
 * 
 * 2. Progress Factor (0-20 min):
 *    - Less progress = more time needed
 *    - Formula: (1 - (completed/total)) × 20
 *    - Example: 5/20 completed → (1 - 0.25) × 20 = 15 min
 * 
 * 3. Difficulty Factor (multiplier):
 *    - Easy: ×0.8 (reduce time by 20%)
 *    - Medium: ×1.0 (no change)
 *    - Hard: ×1.3 (increase time by 30%)
 * 
 * FINAL FORMULA:
 * Total Time = (Base + Grade Factor + Progress Factor) × Difficulty Multiplier
 * Range: 5-120 minutes
 * 
 * @param {number} grade - Student's current grade (0-100)
 * @param {number} completed - Number of lessons completed
 * @param {number} total - Total number of lessons
 * @param {string} difficulty - Difficulty level: 'easy', 'medium', 'hard'
 * @returns {number} Recommended study time in minutes
 */
export const calculateStudyTime = (grade, completed, total, difficulty = 'medium') => {
    let baseTime = 30; // Base minutes

    // Grade factor (lower grade = more time)
    const gradeFactor = (100 - grade) / 100;
    const gradeTime = gradeFactor * 30;

    // Progress factor (less progress = more time)
    const progress = completed / total;
    const progressFactor = 1 - progress;
    const progressTime = progressFactor * 20;

    // Calculate base total
    let totalTime = baseTime + gradeTime + progressTime;

    // Apply difficulty multiplier
    const difficultyMultipliers = {
        easy: 0.8,    // 20% less time
        medium: 1.0,  // No change
        hard: 1.3     // 30% more time
    };
    
    const multiplier = difficultyMultipliers[difficulty] || 1.0;
    totalTime = totalTime * multiplier;

    // Round and constrain between 5-120 minutes
    return Math.max(5, Math.min(Math.round(totalTime), 120));
};

/**
 * Find matching students based on skill exchange
 * @param {object} student - Current student profile
 * @param {array} allStudents - Array of all other students
 * @returns {array} Array of matching students
 */
export const findMatches = (student, allStudents) => {
    return allStudents.filter((other) => {
        if (other.name === student.name) return false;

        // Check if other knows what student wants AND other wants what student knows
        const knowMatch = student.want.some((w) => other.know.includes(w));
        const wantMatch = student.know.some((k) => other.want.includes(k));

        return knowMatch && wantMatch;
    });
};

/**
 * Get matching skills between two students
 * @param {array} studentWants - Skills the student wants to learn
 * @param {array} otherKnows - Skills the other student can teach
 * @returns {array} Array of matching skills
 */
export const getMatchingSkills = (studentWants, otherKnows) => {
    return studentWants.filter((skill) => otherKnows.includes(skill));
};

/**
 * Get teaching skills between two students
 * @param {array} studentKnows - Skills the student can teach
 * @param {array} otherWants - Skills the other student wants to learn
 * @returns {array} Array of teaching skills
 */
export const getTeachingSkills = (studentKnows, otherWants) => {
    return studentKnows.filter((skill) => otherWants.includes(skill));
};

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Get days since date
 * @param {string} dateString - ISO date string
 * @returns {number} Number of days
 */
export const getDaysSince = (dateString) => {
    const date = new Date(dateString);
    return Math.floor((Date.now() - date) / (1000 * 60 * 60 * 24));
};

/**
 * Get grade color based on percentage
 * @param {number} grade - Grade percentage
 * @returns {string} Tailwind color class
 */
export const getGradeColor = (grade) => {
    if (grade >= 80) return 'text-green-600';
    if (grade >= 60) return 'text-yellow-600';
    return 'text-red-600';
};

/**
 * Get grade text based on percentage
 * @param {number} grade - Grade percentage
 * @returns {string} Grade text
 */
export const getGradeText = (grade) => {
    if (grade >= 80) return 'Excellent!';
    if (grade >= 60) return 'Good Job!';
    return 'Needs Improvement';
};

/**
 * Generate random avatar color
 * @param {number} index - Index for consistent color selection
 * @returns {string} Tailwind color class
 */
export const getAvatarColor = (index) => {
    const colors = [
        'bg-purple-500',
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-red-500',
        'bg-pink-500',
        'bg-indigo-500',
    ];
    return colors[index % colors.length];
};

/**
 * Extract text from PDF file
 * @param {File} file - PDF file
 * @returns {Promise<string>} Extracted text
 */
export const extractPdfText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
    let extractedText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' ');
        extractedText += pageText + ' ';
    }

    return extractedText;
};

/**
 * Validate Egyptian phone number
 * @param {string} phone - Phone number to validate
 * @returns {object} Validation result with isValid and message
 */
export const validateEgyptianPhone = (phone) => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Egyptian phone number patterns:
    // 01xxxxxxxxx (11 digits starting with 01)
    // +2001xxxxxxxxx (13 digits starting with +20)
    // 2001xxxxxxxxx (12 digits starting with 20)
    
    const egyptianPhoneRegex = /^(01[0-2,5]{1}[0-9]{8})$/;
    
    if (!phone.trim()) {
        return { isValid: true, message: '' }; // Empty is allowed
    }
    
    if (cleanPhone.length === 11 && egyptianPhoneRegex.test(cleanPhone)) {
        return { isValid: true, message: '' };
    }
    
    if (cleanPhone.length === 13 && cleanPhone.startsWith('2001')) {
        const localNumber = cleanPhone.substring(2); // Remove '20'
        if (egyptianPhoneRegex.test(localNumber)) {
            return { isValid: true, message: '' };
        }
    }
    
    if (cleanPhone.length === 12 && cleanPhone.startsWith('201')) {
        const localNumber = '0' + cleanPhone.substring(2); // Add '0' and remove '20'
        if (egyptianPhoneRegex.test(localNumber)) {
            return { isValid: true, message: '' };
        }
    }
    
    return {
        isValid: false,
        message: 'Phone number must be Egyptian (11 digits starting with 01)'
    };
};

/**
 * Format Egyptian phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatEgyptianPhone = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 11 && cleanPhone.startsWith('01')) {
        return `+20 ${cleanPhone.substring(1, 4)} ${cleanPhone.substring(4, 7)} ${cleanPhone.substring(7)}`;
    }
    
    return phone; // Return as-is if not standard format
};

/**
 * Generate questions from extracted text
 * @param {string} text - Extracted text from PDF
 * @returns {array} Array of generated questions
 */
export const generateQuestions = (text) => {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20);
    const questions = [];

    // Generate 10 questions (5 multiple choice, 5 true/false)

    // Multiple Choice Questions
    for (let i = 0; i < 5 && i < sentences.length; i++) {
        const sentence = sentences[i].trim();
        const sentenceWords = sentence.split(/\s+/);

        if (sentenceWords.length > 5) {
            const keyword = sentenceWords[Math.floor(Math.random() * sentenceWords.length)];

            questions.push({
                type: 'multiple',
                question: `What is mentioned about "${keyword}" in the text?`,
                options: [
                    sentence.substring(0, 50) + '...',
                    'This is not mentioned in the text',
                    'The opposite is stated',
                    'No information provided',
                ].sort(() => Math.random() - 0.5),
                correct: 0,
            });
        }
    }

    // True/False Questions
    for (let i = 0; i < 5 && i < sentences.length; i++) {
        const sentence = sentences[Math.floor(Math.random() * sentences.length)].trim();
        const isTrue = Math.random() > 0.5;

        questions.push({
            type: 'boolean',
            question: isTrue
                ? sentence
                : `The text states that ${sentence.toLowerCase()} (This is false)`,
            options: ['True', 'False'],
            correct: isTrue ? 0 : 1,
        });
    }

    return questions.slice(0, 10);
};

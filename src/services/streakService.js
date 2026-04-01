/**
 * Daily Study Streak Service
 * Manages student learning streaks and activity tracking
 */

export class StreakService {
    static STORAGE_KEY = 'studyStreak';
    static HISTORY_KEY = 'streakHistory';

    /**
     * Get current streak data for a student
     */
    static getStreak(studentId = 'default') {
        const data = localStorage.getItem(`${this.STORAGE_KEY}_${studentId}`);
        if (!data) {
            return {
                currentStreak: 0,
                longestStreak: 0,
                lastActivityDate: null,
                totalActivities: 0
            };
        }
        return JSON.parse(data);
    }

    /**
     * Check if activity was completed today
     */
    static hasActivityToday(studentId = 'default') {
        const streak = this.getStreak(studentId);
        if (!streak.lastActivityDate) return false;
        
        const today = new Date().toDateString();
        const lastActivity = new Date(streak.lastActivityDate).toDateString();
        return today === lastActivity;
    }

    /**
     * Calculate days between two dates
     */
    static daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        const d1 = new Date(date1).setHours(0, 0, 0, 0);
        const d2 = new Date(date2).setHours(0, 0, 0, 0);
        return Math.round(Math.abs((d1 - d2) / oneDay));
    }

    /**
     * Record a learning activity and update streak
     */
    static recordActivity(activityType, studentId = 'default') {
        const streak = this.getStreak(studentId);
        const now = new Date();
        const today = now.toDateString();

        // Check if already recorded today
        if (this.hasActivityToday(studentId)) {
            // Just increment total activities
            streak.totalActivities++;
            this.saveStreak(streak, studentId);
            return {
                streakIncreased: false,
                currentStreak: streak.currentStreak,
                message: 'Activity recorded! Keep going!'
            };
        }

        // Check if streak should continue or reset
        if (streak.lastActivityDate) {
            const daysSinceLastActivity = this.daysBetween(now, new Date(streak.lastActivityDate));
            
            if (daysSinceLastActivity === 1) {
                // Continue streak
                streak.currentStreak++;
            } else if (daysSinceLastActivity > 1) {
                // Missed days - reset streak
                streak.currentStreak = 1;
            }
        } else {
            // First activity ever
            streak.currentStreak = 1;
        }

        // Update longest streak
        if (streak.currentStreak > streak.longestStreak) {
            streak.longestStreak = streak.currentStreak;
        }

        // Update last activity date and total
        streak.lastActivityDate = now.toISOString();
        streak.totalActivities++;

        // Save streak
        this.saveStreak(streak, studentId);

        // Save to history
        this.addToHistory(activityType, streak.currentStreak, studentId);

        return {
            streakIncreased: true,
            currentStreak: streak.currentStreak,
            message: this.getEncouragementMessage(streak.currentStreak)
        };
    }

    /**
     * Save streak data
     */
    static saveStreak(streak, studentId = 'default') {
        localStorage.setItem(`${this.STORAGE_KEY}_${studentId}`, JSON.stringify(streak));
    }

    /**
     * Add activity to history
     */
    static addToHistory(activityType, streakCount, studentId = 'default') {
        const history = this.getHistory(studentId);
        history.push({
            date: new Date().toISOString(),
            activityType,
            streakCount,
            timestamp: Date.now()
        });

        // Keep only last 90 days
        const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
        const filtered = history.filter(h => h.timestamp > ninetyDaysAgo);

        localStorage.setItem(`${this.HISTORY_KEY}_${studentId}`, JSON.stringify(filtered));
    }

    /**
     * Get streak history
     */
    static getHistory(studentId = 'default') {
        const data = localStorage.getItem(`${this.HISTORY_KEY}_${studentId}`);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Get encouragement message based on streak
     */
    static getEncouragementMessage(streak) {
        if (streak === 1) return '🎉 Great start! Your streak begins!';
        if (streak === 3) return '🔥 3 days! You\'re on fire!';
        if (streak === 7) return '⭐ One week streak! Amazing!';
        if (streak === 14) return '💪 Two weeks! You\'re unstoppable!';
        if (streak === 30) return '🏆 30 days! Incredible dedication!';
        if (streak === 50) return '👑 50 days! You\'re a legend!';
        if (streak === 100) return '🎊 100 DAYS! Absolutely phenomenal!';
        if (streak % 10 === 0) return `🌟 ${streak} days! Keep it up!`;
        return `🔥 ${streak} day streak! Keep going!`;
    }

    /**
     * Get streak status (for checking if at risk)
     */
    static getStreakStatus(studentId = 'default') {
        const streak = this.getStreak(studentId);
        if (!streak.lastActivityDate) {
            return { status: 'none', message: 'Start your streak today!' };
        }

        const daysSince = this.daysBetween(new Date(), new Date(streak.lastActivityDate));
        
        if (daysSince === 0) {
            return { status: 'active', message: '✅ Streak active today!' };
        } else if (daysSince === 1) {
            return { status: 'at-risk', message: '⚠️ Complete an activity today to keep your streak!' };
        } else {
            return { status: 'lost', message: '❌ Streak lost. Start a new one!' };
        }
    }

    /**
     * Reset streak (for testing or user request)
     */
    static resetStreak(studentId = 'default') {
        localStorage.removeItem(`${this.STORAGE_KEY}_${studentId}`);
        localStorage.removeItem(`${this.HISTORY_KEY}_${studentId}`);
    }
}

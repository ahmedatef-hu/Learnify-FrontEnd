import { useState, useEffect } from 'react';
import { Storage } from '../utils/storage';

/**
 * Custom hook for managing user profile
 * Handles loading, saving, and updating profile data
 */
export const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load profile on mount
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = () => {
        const skills = Storage.getSkills();
        const myProfile = skills.find((s) => s.isMyProfile) || null;
        setProfile(myProfile);
        setLoading(false);
    };

    const saveProfile = (profileData) => {
        // Remove old profile if exists
        if (profile) {
            const skills = Storage.getSkills();
            const index = skills.findIndex((s) => s.isMyProfile);
            if (index !== -1) {
                Storage.deleteSkill(index);
            }
        }

        // Save new profile
        const newProfile = {
            ...profileData,
            isMyProfile: true,
            date: profile ? profile.date : new Date().toISOString(),
        };

        Storage.saveSkill(newProfile);
        setProfile(newProfile);
        return newProfile;
    };

    const updateProfile = (updates) => {
        const updatedProfile = { ...profile, ...updates };
        saveProfile(updatedProfile);
    };

    const clearProfile = () => {
        if (profile) {
            const skills = Storage.getSkills();
            const index = skills.findIndex((s) => s.isMyProfile);
            if (index !== -1) {
                Storage.deleteSkill(index);
            }
        }
        setProfile(null);
    };

    return {
        profile,
        loading,
        saveProfile,
        updateProfile,
        clearProfile,
        hasProfile: !!profile,
    };
};

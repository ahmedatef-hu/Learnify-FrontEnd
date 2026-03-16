import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { validateEgyptianPhone, formatEgyptianPhone } from '../utils/helpers';

/**
 * My Profile Page Component
 * Allows users to create and edit their profile with skills
 */
const MyProfile = () => {
    const navigate = useNavigate();
    const { profile, saveProfile } = useProfile();

    const [formData, setFormData] = useState({
        fullName: '',
        bio: '',
        email: '',
        phone: '',
    });

    const [skillsKnow, setSkillsKnow] = useState([]);
    const [skillsWant, setSkillsWant] = useState([]);
    const [newSkillKnow, setNewSkillKnow] = useState('');
    const [newSkillWant, setNewSkillWant] = useState('');
    const [avatarImage, setAvatarImage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [phoneError, setPhoneError] = useState('');

    // Load existing profile
    useEffect(() => {
        if (profile) {
            setFormData({
                fullName: profile.name || '',
                bio: profile.bio || '',
                email: profile.email || '',
                phone: profile.phone || '',
            });
            setSkillsKnow(profile.know || []);
            setSkillsWant(profile.want || []);
            setAvatarImage(profile.avatar || null);
        }
    }, [profile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Special handling for phone number
        if (name === 'phone') {
            const validation = validateEgyptianPhone(value);
            setPhoneError(validation.isValid ? '' : validation.message);
        }
        
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Image size should be less than 2MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatarImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addSkillKnow = () => {
        const skill = newSkillKnow.trim();
        if (skill && !skillsKnow.includes(skill)) {
            setSkillsKnow([...skillsKnow, skill]);
            setNewSkillKnow('');
        }
    };

    const addSkillWant = () => {
        const skill = newSkillWant.trim();
        if (skill && !skillsWant.includes(skill)) {
            setSkillsWant([...skillsWant, skill]);
            setNewSkillWant('');
        }
    };

    const removeSkillKnow = (index) => {
        setSkillsKnow(skillsKnow.filter((_, i) => i !== index));
    };

    const removeSkillWant = (index) => {
        setSkillsWant(skillsWant.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.fullName.trim()) {
            alert('Please enter your name!');
            return;
        }

        // Validate phone number if provided
        if (formData.phone.trim()) {
            const phoneValidation = validateEgyptianPhone(formData.phone);
            if (!phoneValidation.isValid) {
                alert(phoneValidation.message);
                return;
            }
        }

        if (skillsKnow.length === 0) {
            alert('Please add at least one skill you can teach!');
            return;
        }

        if (skillsWant.length === 0) {
            alert('Please add at least one skill you want to learn!');
            return;
        }

        const profileData = {
            name: formData.fullName,
            bio: formData.bio,
            email: formData.email,
            phone: formData.phone.trim() ? formatEgyptianPhone(formData.phone) : '',
            know: skillsKnow,
            want: skillsWant,
            avatar: avatarImage,
        };

        saveProfile(profileData);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const getAvatarDisplay = () => {
        if (avatarImage) {
            return (
                <img
                    src={avatarImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                />
            );
        }
        return formData.fullName.charAt(0).toUpperCase() || '?';
    };

    return (
        <div className="pt-20 pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                {/* Profile Header */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="bg-gradient-to-r from-teal-600 to-orange-600 rounded-3xl p-8 text-white text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundImage:
                                        'url("data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%221%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                                }}
                            ></div>
                        </div>
                        <div className="relative">
                            <div className="relative inline-block">
                                <div className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl font-bold border-4 border-white shadow-2xl bg-white text-teal-600 overflow-hidden">
                                    {getAvatarDisplay()}
                                </div>
                                <label
                                    htmlFor="avatarInput"
                                    className="absolute bottom-4 right-0 bg-white text-teal-600 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition cursor-pointer"
                                >
                                    📷
                                </label>
                                <input
                                    type="file"
                                    id="avatarInput"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>
                            <h1 className="text-4xl font-bold mb-2">
                                {formData.fullName || 'Create Your Profile'}
                            </h1>
                            <p className="text-white/90">
                                {profile ? 'Update your profile' : 'Join Learnify today!'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="max-w-4xl mx-auto mb-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                        <span className="text-2xl">✅</span>
                        <div>
                            <div className="font-bold">Profile Saved!</div>
                            <div className="text-sm">Your profile has been updated successfully</div>
                        </div>
                    </div>
                )}

                {/* Profile Form */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
                            {profile ? 'Edit Your Profile' : 'Create Your Profile'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            {/* Personal Information */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
                                    <span>👤</span> Personal Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Ahmed Hassan"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                            Bio/Title
                                        </label>
                                        <input
                                            type="text"
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            placeholder="Front-end Developer"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                                    <span>📞</span> Contact Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="your.email@example.com"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                            Phone (WhatsApp)
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="01012345678"
                                            className={`w-full px-4 py-3 rounded-lg border ${
                                                phoneError 
                                                    ? 'border-red-500 focus:ring-red-500' 
                                                    : 'border-gray-300 dark:border-gray-600 focus:ring-teal-600'
                                            } dark:bg-gray-700 dark:text-white focus:ring-2 outline-none`}
                                        />
                                        {phoneError && (
                                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                <span>⚠️</span>
                                                {phoneError}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Skills I Know */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                                    <span>✅</span> Skills I Can Teach
                                </h3>
                                <div id="skillsKnowContainer" className="mb-4">
                                    {skillsKnow.length === 0 ? (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            No skills added yet. Add your first skill below.
                                        </p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {skillsKnow.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-semibold"
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkillKnow(index)}
                                                        className="hover:text-red-600 transition"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newSkillKnow}
                                        onChange={(e) => setNewSkillKnow(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSkillKnow();
                                            }
                                        }}
                                        placeholder="Add a skill (e.g., React, Python)"
                                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={addSkillKnow}
                                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                                    >
                                        + Add
                                    </button>
                                </div>
                            </div>

                            {/* Skills I Want */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                                    <span>📚</span> Skills I Want to Learn
                                </h3>
                                <div id="skillsWantContainer" className="mb-4">
                                    {skillsWant.length === 0 ? (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            No skills added yet. Add your first skill below.
                                        </p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {skillsWant.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-semibold"
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkillWant(index)}
                                                        className="hover:text-red-600 transition"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newSkillWant}
                                        onChange={(e) => setNewSkillWant(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSkillWant();
                                            }
                                        }}
                                        placeholder="Add a skill (e.g., Node.js, Design)"
                                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-600 outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={addSkillWant}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                                    >
                                        + Add
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white py-4 rounded-lg font-bold text-lg transition shadow-lg"
                                >
                                    💾 Save Profile
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/skill-exchange')}
                                    className="px-8 bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold transition"
                                >
                                    🎯 Find Matches
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;

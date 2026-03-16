import { useState, useEffect } from 'react';
import { Storage } from '../utils/storage';

/**
 * Custom hook for managing students data
 * Handles loading, filtering, and searching students
 */
export const useStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load students on mount
    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = () => {
        Storage.initializeDemoStudents();
        const skills = Storage.getSkills();
        const otherStudents = skills.filter((s) => !s.isMyProfile);
        setStudents(otherStudents);
        setLoading(false);
    };

    const searchStudents = (searchTerm) => {
        if (!searchTerm.trim()) {
            return students;
        }

        const term = searchTerm.toLowerCase();
        return students.filter(
            (s) =>
                s.name.toLowerCase().includes(term) ||
                s.know.some((k) => k.toLowerCase().includes(term)) ||
                s.want.some((w) => w.toLowerCase().includes(term))
        );
    };

    const deleteStudent = (index) => {
        Storage.deleteSkill(index);
        loadStudents();
    };

    const addStudent = (student) => {
        Storage.saveSkill(student);
        loadStudents();
    };

    return {
        students,
        loading,
        searchStudents,
        deleteStudent,
        addStudent,
        refreshStudents: loadStudents,
    };
};

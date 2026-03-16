/**
 * LocalStorage Helper Functions
 * Manages all data persistence for the application
 */

export const Storage = {
    // ============ Skills Management ============
    getSkills() {
        return JSON.parse(localStorage.getItem('skills') || '[]');
    },

    saveSkill(skill) {
        const skills = this.getSkills();
        skills.push(skill);
        localStorage.setItem('skills', JSON.stringify(skills));
    },

    updateSkill(index, skill) {
        const skills = this.getSkills();
        skills[index] = skill;
        localStorage.setItem('skills', JSON.stringify(skills));
    },

    deleteSkill(index) {
        const skills = this.getSkills();
        skills.splice(index, 1);
        localStorage.setItem('skills', JSON.stringify(skills));
    },

    // ============ Demo Data Initialization ============
    initializeDemoStudents() {
        const skills = this.getSkills();
        if (skills.length === 0) {
            const demoStudents = [
                {
                    name: 'Ahmed Hassan',
                    know: ['Front-end', 'React', 'JavaScript', 'HTML/CSS'],
                    want: ['Back-end', 'Node.js', 'Python'],
                    email: 'ahmed.hassan@email.com',
                    phone: '+20 100 123 4567',
                    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    name: 'Sara Mohamed',
                    know: ['Back-end', 'Python', 'Django', 'SQL'],
                    want: ['Front-end', 'React', 'UI/UX Design'],
                    email: 'sara.mohamed@email.com',
                    phone: '+20 101 234 5678',
                    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    name: 'Omar Ali',
                    know: ['UI/UX Design', 'Figma', 'Adobe XD', 'Photoshop'],
                    want: ['Front-end', 'JavaScript', 'Animation'],
                    email: 'omar.ali@email.com',
                    phone: '+20 102 345 6789',
                    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    name: 'Nour Ibrahim',
                    know: ['Mobile Development', 'Flutter', 'Dart', 'Firebase'],
                    want: ['Back-end', 'API Development', 'Cloud'],
                    email: 'nour.ibrahim@email.com',
                    phone: '+20 103 456 7890',
                    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    name: 'Youssef Khaled',
                    know: ['Data Science', 'Machine Learning', 'Python', 'TensorFlow'],
                    want: ['Web Development', 'JavaScript', 'React'],
                    email: 'youssef.khaled@email.com',
                    phone: '+20 104 567 8901',
                    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                    name: 'Menna Adel',
                    know: ['Digital Marketing', 'SEO', 'Content Writing', 'Social Media'],
                    want: ['Web Design', 'Graphic Design', 'Video Editing'],
                    email: 'menna.adel@email.com',
                    phone: '+20 105 678 9012',
                    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                },
            ];

            demoStudents.forEach((student) => this.saveSkill(student));
        }
    },

    // ============ Subjects Management ============
    getSubjects() {
        return JSON.parse(localStorage.getItem('subjects') || '[]');
    },

    saveSubject(subject) {
        const subjects = this.getSubjects();
        subjects.push(subject);
        localStorage.setItem('subjects', JSON.stringify(subjects));
    },

    deleteSubject(index) {
        const subjects = this.getSubjects();
        subjects.splice(index, 1);
        localStorage.setItem('subjects', JSON.stringify(subjects));
    },

    // ============ Exams Management ============
    getExams() {
        return JSON.parse(localStorage.getItem('exams') || '[]');
    },

    saveExam(exam) {
        const exams = this.getExams();
        exams.push(exam);
        localStorage.setItem('exams', JSON.stringify(exams));
    },

    // ============ Current Exam (Temporary) ============
    setCurrentExam(questions) {
        localStorage.setItem('currentExam', JSON.stringify(questions));
    },

    getCurrentExam() {
        return JSON.parse(localStorage.getItem('currentExam') || '[]');
    },

    clearCurrentExam() {
        localStorage.removeItem('currentExam');
    },

    // ============ Results Management ============
    setLastResult(result) {
        localStorage.setItem('lastResult', JSON.stringify(result));
    },

    getLastResult() {
        return JSON.parse(localStorage.getItem('lastResult') || 'null');
    },

    // ============ Materials Management ============
    getMaterials(subjectName) {
        try {
            const materials = JSON.parse(localStorage.getItem(`materials_${subjectName}`) || '[]');
            return Array.isArray(materials) ? materials : [];
        } catch (error) {
            console.error('Error loading materials:', error);
            return [];
        }
    },

    saveMaterials(subjectName, materials) {
        try {
            if (!Array.isArray(materials)) {
                console.error('Materials must be an array');
                return false;
            }
            localStorage.setItem(`materials_${subjectName}`, JSON.stringify(materials));
            return true;
        } catch (error) {
            console.error('Error saving materials:', error);
            return false;
        }
    },

    getAllMaterials() {
        const allMaterials = {};
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('materials_')) {
                    const subjectName = key.replace('materials_', '');
                    allMaterials[subjectName] = this.getMaterials(subjectName);
                }
            }
        } catch (error) {
            console.error('Error loading all materials:', error);
        }
        return allMaterials;
    },

    // ============ Theme Management ============
    getTheme() {
        return localStorage.getItem('theme') || 'light';
    },

    setTheme(theme) {
        localStorage.setItem('theme', theme);
    },
};

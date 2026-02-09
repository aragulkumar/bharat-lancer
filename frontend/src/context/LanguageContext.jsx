import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Tamil translations for common UI elements
const translations = {
    en: {
        // Navigation
        jobs: 'Jobs',
        postJob: 'Post Job',
        applications: 'Applications',
        skillPassport: 'Skill Passport',
        chat: 'Chat',
        profile: 'Profile',
        logout: 'Logout',

        // Common
        login: 'Login',
        register: 'Register',
        search: 'Search',
        apply: 'Apply',
        accept: 'Accept',
        reject: 'Reject',
        send: 'Send',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',

        // Job related
        budget: 'Budget',
        duration: 'Duration',
        location: 'Location',
        skills: 'Skills',
        description: 'Description',
        applyForJob: 'Apply for this Job',

        // Messages
        welcome: 'Welcome to Bharat Lancer',
        noJobs: 'No jobs available',
        loading: 'Loading...',
    },
    ta: {
        // Navigation (Tamil)
        jobs: 'வேலைகள்',
        postJob: 'வேலை இடுகை',
        applications: 'விண்ணப்பங்கள்',
        skillPassport: 'திறன் பாஸ்போர்ட்',
        chat: 'அரட்டை',
        profile: 'சுயவிவரம்',
        logout: 'வெளியேறு',

        // Common
        login: 'உள்நுழைய',
        register: 'பதிவு செய்க',
        search: 'தேடு',
        apply: 'விண்ணப்பிக்க',
        accept: 'ஏற்றுக்கொள்',
        reject: 'நிராகரி',
        send: 'அனுப்பு',
        cancel: 'ரத்து செய்',
        save: 'சேமி',
        delete: 'நீக்கு',
        edit: 'திருத்து',

        // Job related
        budget: 'பட்ஜெட்',
        duration: 'காலம்',
        location: 'இடம்',
        skills: 'திறன்கள்',
        description: 'விளக்கம்',
        applyForJob: 'இந்த வேலைக்கு விண்ணப்பிக்கவும்',

        // Messages
        welcome: 'பாரத் லான்சருக்கு வரவேற்கிறோம்',
        noJobs: 'வேலைகள் இல்லை',
        loading: 'ஏற்றுகிறது...',
    }
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        // Get language from localStorage or default to English
        const savedLang = localStorage.getItem('language');
        return savedLang || 'en';
    });

    useEffect(() => {
        // Save language preference
        localStorage.setItem('language', language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'ta' : 'en');
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    const value = {
        language,
        toggleLanguage,
        t,
        isTamil: language === 'ta'
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

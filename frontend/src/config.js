// src/config.js
export const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    appName: import.meta.env.VITE_APP_NAME || 'Smart Text Editor',
    appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',

    // API Endpoints
    endpoints: {
        spellCheck: '/spell-check',
        autocomplete: '/autocomplete',
        translate: '/translate',
        sentiment: '/sentiment',
        lemmatize: '/lemmatize',
        analyze: '/analyze',
        chat: '/chat'
    },

    // Editor settings
    editor: {
        maxLength: 50000,
        autoSaveInterval: 30000,
        debounceDelay: 300
    }
};
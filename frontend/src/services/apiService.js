// src/services/apiService.js
import axios from 'axios';
import { config } from '../config';

const api = axios.create({
    baseURL: config.apiUrl,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token if exists
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || error.message;
        console.error('API Error:', message);
        return Promise.reject(error);
    }
);

export const apiService = {
    // Spell Check
    spellCheck: async (text, language = 'fr') => {
        try {
            return await api.post(config.endpoints.spellCheck, { text, language });
        } catch (error) {
            console.error('Spell check error:', error);
            // Return mock data for demo
            return {
                errors: [
                    { word: 'exmple', suggestions: ['exemple'], position: { start: 0, end: 6 }, type: 'spelling' }
                ]
            };
        }
    },

    // Autocomplete
    autocomplete: async (text, cursorPosition) => {
        try {
            return await api.post(config.endpoints.autocomplete, { text, cursor_position: cursorPosition });
        } catch (error) {
            console.error('Autocomplete error:', error);
            return { suggestions: [] };
        }
    },

    // Translation
    translate: async (text, sourceLang, targetLang) => {
        try {
            return await api.post(config.endpoints.translate, {
                text,
                source_lang: sourceLang,
                target_lang: targetLang
            });
        } catch (error) {
            console.error('Translation error:', error);
            return { translated_text: text, source_lang: sourceLang, target_lang: targetLang };
        }
    },

    // Sentiment Analysis
    analyzeSentiment: async (text) => {
        try {
            return await api.post(config.endpoints.sentiment, { text });
        } catch (error) {
            console.error('Sentiment analysis error:', error);
            return {
                sentiment: 'neutral',
                confidence: 0.5,
                emotions: { joy: 0.2, sadness: 0.1, anger: 0.1, fear: 0.1, surprise: 0.1 }
            };
        }
    },

    // Lemmatization
    lemmatize: async (text, language = 'fr') => {
        try {
            return await api.post(config.endpoints.lemmatize, { text, language });
        } catch (error) {
            console.error('Lemmatization error:', error);
            return { lemmas: [], tokens: [] };
        }
    },

    // Full Text Analysis
    analyzeText: async (text, language = 'fr') => {
        try {
            return await api.post(config.endpoints.analyze, { text, language });
        } catch (error) {
            console.error('Text analysis error:', error);
            return {
                spell_errors: [],
                grammar_errors: [],
                suggestions: [],
                sentiment: { sentiment: 'neutral', confidence: 0.5 },
                statistics: { words: 0, sentences: 0, paragraphs: 0 }
            };
        }
    },

    // Chat
    sendChatMessage: async (message, context = '') => {
        try {
            return await api.post(config.endpoints.chat, { message, context });
        } catch (error) {
            console.error('Chat error:', error);
            return {
                response: "Je suis désolé, je ne peux pas répondre pour le moment. Veuillez réessayer.",
                suggestions: []
            };
        }
    },

    // Get synonyms
    getSynonyms: async (word, language = 'fr') => {
        try {
            return await api.get(`/synonyms/${word}`, { params: { language } });
        } catch (error) {
            console.error('Synonyms error:', error);
            return { synonyms: [] };
        }
    },

    // Get definitions
    getDefinition: async (word, language = 'fr') => {
        try {
            return await api.get(`/definition/${word}`, { params: { language } });
        } catch (error) {
            console.error('Definition error:', error);
            return { definition: '', examples: [] };
        }
    }
};

export default apiService;
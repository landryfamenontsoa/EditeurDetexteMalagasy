// src/services/apiService.js
import axios from 'axios';

// Configuration de base d'Axios
const API_BASE_URL = 'http://127.0.0.1:5000/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour le débogage (optionnel)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.warn('API Error:', error.response ? error.response.data : error.message);
        return Promise.reject(error);
    }
);

export const apiService = {
    // ----------------------------------------
    // AUTOCOMPLETE
    // ----------------------------------------
    async autocomplete(text) {
        try {
            const response = await axiosInstance.post('/autocomplete', { text });
            return {
                suggestions: response.data.suggestions || [],
                text: response.data.text
            };
        } catch (error) {
            console.error('Autocomplete error:', error);
            // Retourne un tableau vide pour ne pas casser l'UI
            return { suggestions: [], text: text };
        }
    },

    // ----------------------------------------
    // SPELLCHECK (Mot unique)
    // ----------------------------------------
    // Note: Gardé en minuscule interne ou pour usage spécifique
    async checkWord(word) {
        try {
            const response = await axiosInstance.get('/spellcheck', {
                params: { word }
            });
            return {
                word: response.data.word,
                correct: response.data.correct,
                suggestion: response.data.suggestion?.replace(/[",]/g, ''),
                confidence: response.data.confidence
            };
        } catch (error) {
            // En cas d'erreur API, on suppose que le mot est correct pour éviter de tout souligner en rouge
            return { word, correct: true, suggestion: null, confidence: 0 };
        }
    },

    // ----------------------------------------
    // SPELLCHECK (Texte complet - C'est celle-ci qui posait problème)
    // ----------------------------------------
    // J'ai renommé 'spellcheckText' en 'spellCheck' pour correspondre à votre hook useSpellCheck
    async spellCheck(text) {
        try {
            if (!text) return [];

            // Découpage du texte en mots
            const words = text.split(/\s+/).filter(word => word.length > 0);

            // Analyse mot par mot en parallèle
            const results = await Promise.all(
                words.map(async (word, index) => {
                    // Nettoie le mot des ponctuations basiques pour l'envoi à l'API
                    const cleanWord = word.replace(/[.,!?;:'"()[\]{}]/g, '');
                    if (cleanWord.length < 2) return null;

                    try {
                        // Appel de la fonction interne checkWord
                        const result = await this.checkWord(cleanWord);

                        if (!result.correct) {
                            // Calcule la position dans le texte pour le soulignement
                            const position = this.findWordPosition(text, word, index);
                            return {
                                word: cleanWord,
                                type: 'spelling',
                                message: `"${cleanWord}" semble incorrect`,
                                suggestions: result.suggestion ? [result.suggestion] : [],
                                confidence: result.confidence,
                                position
                            };
                        }
                        return null;
                    } catch (e) {
                        return null;
                    }
                })
            );

            return results.filter(Boolean);
        } catch (error) {
            console.error('SpellCheck error:', error);
            return [];
        }
    },

    // ----------------------------------------
    // Helper pour trouver la position d'un mot
    // ----------------------------------------
    findWordPosition(text, word, wordIndex) {
        let currentIndex = 0;
        // Une logique simplifiée pour trouver l'index approximatif
        // Pour une vraie prod, il faudrait un algo plus robuste gérant les occurrences multiples
        const words = text.split(/\s+/);

        // On avance dans le texte jusqu'au mot désiré
        for (let i = 0; i < wordIndex && i < words.length; i++) {
            const w = words[i];
            const foundAt = text.indexOf(w, currentIndex);
            if (foundAt !== -1) {
                currentIndex = foundAt + w.length;
            }
        }

        const start = text.indexOf(word, currentIndex);
        // Si non trouvé (cas rare), fallback sur index 0
        const safeStart = start !== -1 ? start : 0;

        return {
            start: safeStart,
            end: safeStart + word.length
        };
    },

    // ----------------------------------------
    // SENTIMENT ANALYSIS
    // ----------------------------------------
    async analyzeSentiment(text) {
        try {
            // Simulation si le texte est trop court ou vide
            if (!text || text.length < 5) {
                return { label: 'neutral', confidence: 0.5, score: 0 };
            }

            const response = await axiosInstance.post('/sentiment', { text });

            const sentimentMap = {
                'Positif': 'positive',
                'Négatif': 'negative',
                'Neutre': 'neutral',
                'Très positif': 'very_positive',
                'Très négatif': 'very_negative'
            };

            const score = response.data.score || 0;
            let label = sentimentMap[response.data.sentiment] || 'neutral';

            if (score > 0.5) label = 'very_positive';
            else if (score > 0) label = 'positive';
            else if (score < -0.5) label = 'very_negative';
            else if (score < 0) label = 'negative';

            return {
                label,
                score,
                sentiment: response.data.sentiment,
                confidence: Math.min(Math.abs(score) + 0.5, 1)
            };
        } catch (error) {
            console.error('Sentiment error:', error);
            return { label: 'neutral', confidence: 0, score: 0 };
        }
    },

    // ----------------------------------------
    // TRANSLATION
    // ----------------------------------------
    async translate(text, sourceLang, targetLang) {
        try {
            // Simulation (à remplacer par votre endpoint réel)
            await new Promise(resolve => setTimeout(resolve, 800));
            return {
                translated_text: `[Traduction ${targetLang}] ${text}`,
                source_lang: sourceLang,
                target_lang: targetLang
            };
        } catch (error) {
            console.error('Translation error:', error);
            throw new Error('Erreur de traduction');
        }
    },

    // ----------------------------------------
    // GET SUGGESTIONS
    // ----------------------------------------
    async getSuggestions(text) {
        try {
            if (!text || text.trim().length < 2) return [];

            const words = text.trim().split(/\s+/);
            const lastWord = words[words.length - 1];

            if (lastWord.length < 2) return [];

            const result = await this.autocomplete(lastWord);

            return (result.suggestions || []).map(s => ({
                text: s.word,
                score: s.score,
                type: 'completion'
            }));
        } catch (error) {
            return [];
        }
    },

    // ----------------------------------------
    // FULL TEXT ANALYSIS (Global Wrapper)
    // ----------------------------------------
    async analyzeText(text) {
        try {
            // Appelle spellCheck (ex-spellcheckText) et analyzeSentiment en parallèle
            const [spellErrors, sentiment] = await Promise.all([
                this.spellCheck(text),
                this.analyzeSentiment(text)
            ]);

            return {
                spellErrors,
                grammarErrors: [],
                sentiment,
                suggestions: []
            };
        } catch (error) {
            console.error('Analyze text error:', error);
            // Retourne une structure vide en cas d'erreur fatale
            return { spellErrors: [], grammarErrors: [], sentiment: null };
        }
    }
};

export default apiService;
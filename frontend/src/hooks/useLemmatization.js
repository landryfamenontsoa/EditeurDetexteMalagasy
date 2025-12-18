// src/hooks/useLemmatization.js
import { useState, useCallback } from 'react';
import { apiService } from '../services/apiService';

export function useLemmatization(language = 'fr') {
    const [lemmas, setLemmas] = useState([]);
    const [tokens, setTokens] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const lemmatize = useCallback(async (text) => {
        if (!text || text.trim().length < 2) {
            setLemmas([]);
            setTokens([]);
            return;
        }

        setIsProcessing(true);
        try {
            const result = await apiService.lemmatize(text, language);
            setLemmas(result.lemmas || []);
            setTokens(result.tokens || []);
            return result;
        } catch (error) {
            console.error('Lemmatization failed:', error);
            return { lemmas: [], tokens: [] };
        } finally {
            setIsProcessing(false);
        }
    }, [language]);

    const getLemmaForWord = useCallback((word) => {
        const index = tokens.findIndex(t => t.toLowerCase() === word.toLowerCase());
        return index >= 0 ? lemmas[index] : word;
    }, [lemmas, tokens]);

    const clear = useCallback(() => {
        setLemmas([]);
        setTokens([]);
    }, []);

    return {
        lemmas,
        tokens,
        isProcessing,
        lemmatize,
        getLemmaForWord,
        clear
    };
}

export default useLemmatization;
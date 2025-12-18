// src/hooks/useTextAnalysis.js
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { apiService } from '../services/apiService';

export function useTextAnalysis(language = 'fr') {
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);

    const analyzeText = useCallback(
        debounce(async (text) => {
            if (!text || text.trim().length < 10) {
                setAnalysis(null);
                return;
            }

            setIsAnalyzing(true);
            setError(null);

            try {
                const result = await apiService.analyzeText(text, language);
                setAnalysis(result);
            } catch (err) {
                setError(err.message);
                console.error('Text analysis failed:', err);
            } finally {
                setIsAnalyzing(false);
            }
        }, 1000),
        [language]
    );

    const getStatistics = useCallback((text) => {
        if (!text) {
            return {
                characters: 0,
                charactersNoSpaces: 0,
                words: 0,
                sentences: 0,
                paragraphs: 0,
                readingTime: 0
            };
        }

        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
        const readingTime = Math.ceil(words / 200); // Average reading speed

        return {
            characters,
            charactersNoSpaces,
            words,
            sentences,
            paragraphs,
            readingTime
        };
    }, []);

    const clearAnalysis = useCallback(() => {
        setAnalysis(null);
        setError(null);
    }, []);

    return {
        analysis,
        isAnalyzing,
        error,
        analyzeText,
        getStatistics,
        clearAnalysis
    };
}

export default useTextAnalysis;
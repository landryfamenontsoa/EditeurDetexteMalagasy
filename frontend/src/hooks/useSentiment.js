// src/hooks/useSentiment.js
import { useState, useCallback } from 'react';
import { apiService } from '../services/apiService';

export function useSentiment() {
    const [sentiment, setSentiment] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const analyzeSentiment = useCallback(async (text) => {
        if (!text || text.trim().length < 10) {
            setSentiment(null);
            return;
        }

        setIsAnalyzing(true);
        try {
            const result = await apiService.analyzeSentiment(text);
            setSentiment(result);
            return result;
        } catch (error) {
            console.error('Sentiment analysis failed:', error);
            setSentiment({
                label: 'neutral',
                confidence: 0.5,
                score: 0
            });
        } finally {
            setIsAnalyzing(false);
        }
    }, []);

    const clearSentiment = useCallback(() => {
        setSentiment(null);
    }, []);

    return {
        sentiment,
        analyzeSentiment,
        clearSentiment,
        isAnalyzing
    };
}
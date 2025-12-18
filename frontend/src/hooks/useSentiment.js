import { useState, useCallback } from 'react';
import { sentimentAPI } from '@services/api';
import useEditorStore from '@store/editorStore';

export const useSentiment = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const setSentimentScore = useEditorStore((state) => state.setSentimentScore);

    const analyzeSentiment = useCallback(async (text) => {
        if (!text || text.trim() === '') return null;

        setIsAnalyzing(true);
        try {
            const result = await sentimentAPI.analyze(text);
            setSentimentScore(result);
            return result;
        } catch (error) {
            console.error('Sentiment analysis error:', error);
            return null;
        } finally {
            setIsAnalyzing(false);
        }
    }, [setSentimentScore]);

    return {
        isAnalyzing,
        analyzeSentiment,
    };
};
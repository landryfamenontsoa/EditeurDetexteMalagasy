// src/hooks/useSentiment.js
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { apiService } from '../services/apiService';

export function useSentiment() {
    const [sentiment, setSentiment] = useState(null);
    const [emotions, setEmotions] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const analyzeSentiment = useCallback(
        debounce(async (text) => {
            if (!text || text.trim().length < 10) {
                setSentiment(null);
                setEmotions(null);
                return;
            }

            setIsAnalyzing(true);
            try {
                const result = await apiService.analyzeSentiment(text);
                setSentiment({
                    label: result.sentiment,
                    confidence: result.confidence,
                    score: getSentimentScore(result.sentiment)
                });
                setEmotions(result.emotions);
            } catch (error) {
                console.error('Sentiment analysis failed:', error);
            } finally {
                setIsAnalyzing(false);
            }
        }, 1000),
        []
    );

    const getSentimentScore = (label) => {
        const scores = {
            'very_positive': 1,
            'positive': 0.5,
            'neutral': 0,
            'negative': -0.5,
            'very_negative': -1
        };
        return scores[label] || 0;
    };

    const getSentimentColor = useCallback((label) => {
        const colors = {
            'very_positive': '#10b981',
            'positive': '#34d399',
            'neutral': '#6b7280',
            'negative': '#f59e0b',
            'very_negative': '#ef4444'
        };
        return colors[label] || '#6b7280';
    }, []);

    const getSentimentEmoji = useCallback((label) => {
        const emojis = {
            'very_positive': '😄',
            'positive': '🙂',
            'neutral': '😐',
            'negative': '😕',
            'very_negative': '😢'
        };
        return emojis[label] || '😐';
    }, []);

    const clear = useCallback(() => {
        setSentiment(null);
        setEmotions(null);
    }, []);

    return {
        sentiment,
        emotions,
        isAnalyzing,
        analyzeSentiment,
        getSentimentColor,
        getSentimentEmoji,
        clear
    };
}

export default useSentiment;
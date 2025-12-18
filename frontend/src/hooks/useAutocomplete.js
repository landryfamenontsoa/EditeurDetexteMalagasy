import { useState, useCallback } from 'react';

export const useAutocomplete = () => {
    const [predictions, setPredictions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getPredictions = useCallback(async (context, position) => {
        setIsLoading(true);
        try {
            // const result = await autocompleteAPI.predict(context, position);
            // setPredictions(result.predictions || []);
            return context;
        } catch (error) {
            console.error('Autocomplete error:', error);
            setPredictions([]);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearPredictions = useCallback(() => {
        setPredictions([]);
    }, []);

    return {
        predictions,
        isLoading,
        getPredictions,
        clearPredictions,
    };
};
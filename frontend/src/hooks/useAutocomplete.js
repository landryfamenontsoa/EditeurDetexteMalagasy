// src/hooks/useAutocomplete.js
import { useState, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { apiService } from '../services/apiService';

export function useAutocomplete() {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const abortControllerRef = useRef(null);

    const getSuggestions = useCallback(
        debounce(async (text, cursorPosition) => {
            if (!text || cursorPosition < 1) {
                setSuggestions([]);
                return;
            }

            // Get the current word being typed
            const textBeforeCursor = text.substring(0, cursorPosition);
            const words = textBeforeCursor.split(/\s+/);
            const currentWord = words[words.length - 1];

            if (currentWord.length < 2) {
                setSuggestions([]);
                return;
            }

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            setIsLoading(true);
            try {
                const result = await apiService.autocomplete(text, cursorPosition);
                setSuggestions(result.suggestions || []);
                setSelectedIndex(-1);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Autocomplete failed:', error);
                }
            } finally {
                setIsLoading(false);
            }
        }, 300),
        []
    );

    const selectNext = useCallback(() => {
        setSelectedIndex(prev =>
            prev < suggestions.length - 1 ? prev + 1 : 0
        );
    }, [suggestions.length]);

    const selectPrevious = useCallback(() => {
        setSelectedIndex(prev =>
            prev > 0 ? prev - 1 : suggestions.length - 1
        );
    }, [suggestions.length]);

    const getSelectedSuggestion = useCallback(() => {
        return selectedIndex >= 0 ? suggestions[selectedIndex] : null;
    }, [selectedIndex, suggestions]);

    const clearSuggestions = useCallback(() => {
        setSuggestions([]);
        setSelectedIndex(-1);
    }, []);

    return {
        suggestions,
        isLoading,
        selectedIndex,
        getSuggestions,
        selectNext,
        selectPrevious,
        getSelectedSuggestion,
        clearSuggestions
    };
}

export default useAutocomplete;
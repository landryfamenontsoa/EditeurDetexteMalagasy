// src/hooks/useSpellCheck.js
import { useState, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { apiService } from '../services/apiService';

export function useSpellCheck(language = 'fr') {
    const [errors, setErrors] = useState([]);
    const [isChecking, setIsChecking] = useState(false);
    const abortControllerRef = useRef(null);

    const checkSpelling = useCallback(
        debounce(async (text) => {
            if (!text || text.trim().length < 2) {
                setErrors([]);
                return;
            }

            // Cancel previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            setIsChecking(true);
            try {
                const result = await apiService.spellCheck(text, language);
                setErrors(result.errors || []);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Spell check failed:', error);
                }
            } finally {
                setIsChecking(false);
            }
        }, 500),
        [language]
    );

    const applySuggestion = useCallback((error, suggestion, text) => {
        const before = text.substring(0, error.position.start);
        const after = text.substring(error.position.end);
        return before + suggestion + after;
    }, []);

    const ignoreError = useCallback((errorWord) => {
        setErrors(prev => prev.filter(e => e.word !== errorWord));
    }, []);

    const clearErrors = useCallback(() => {
        setErrors([]);
    }, []);

    return {
        errors,
        isChecking,
        checkSpelling,
        applySuggestion,
        ignoreError,
        clearErrors
    };
}

export default useSpellCheck;
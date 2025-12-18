import { useState, useCallback } from 'react';
// import { spellCheckAPI } from '@services/api';
import useEditorStore from '../store/editorStore';

export const useSpellCheck = () => {
    const [isChecking, setIsChecking] = useState(false);
    const setSpellErrors = useEditorStore((state) => state.setSpellErrors);

    const checkSpelling = useCallback(async (text) => {
        if (!text || text.trim() === '') return;

        setIsChecking(true);
        try {
            // const result = await spellCheckAPI.check(text);
            // setSpellErrors(result.errors || []);
            return text;
        } catch (error) {
            console.error('Spell check error:', error);
            return { errors: [] };
        } finally {
            setIsChecking(false);
        }
    }, [setSpellErrors]);

    const getSuggestions = useCallback(async (word) => {
        try {
            // const result = await spellCheckAPI.getSuggestions(word);
            return word;
        } catch (error) {
            console.error('Get suggestions error:', error);
            return [];
        }
    }, []);

    return {
        isChecking,
        checkSpelling,
        getSuggestions,
    };
};
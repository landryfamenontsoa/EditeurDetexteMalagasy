// src/contexts/EditorContext.jsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';

const EditorContext = createContext();

const initialState = {
    content: '',
    htmlContent: '',
    selectedText: '',
    spellErrors: [],
    grammarErrors: [],
    sentiment: { label: 'neutral', confidence: 0.5, score: 0 },
    
    // Stats initiales
    stats: {
        words: 0,
        characters: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0
    },

    // États manquants ajoutés pour corriger les erreurs
    cursorPosition: { line: 1, column: 1, index: 0 },
    contextMenu: { isOpen: false, x: 0, y: 0, data: null },
    spellCheckPopup: { isOpen: false, x: 0, y: 0, error: null },
    
    isLoading: false,
    sidebarOpen: false,
    activeTab: 'corrections',
    language: 'fr', // Langue par défaut
    autoCorrect: true // Auto-correction par défaut
};

function editorReducer(state, action) {
    switch (action.type) {
        case 'SET_CONTENT':
            // Note: Editor.jsx calcule aussi les stats, mais on garde une logique par défaut ici
            const words = action.payload.content.split(/\s+/).filter(Boolean).length;
            const characters = action.payload.content.length;
            const sentences = action.payload.content.split(/[.!?]+/).filter(Boolean).length;
            const paragraphs = action.payload.content.split(/\n\n+/).filter(Boolean).length;
            const readingTime = Math.ceil(words / 200);

            return {
                ...state,
                content: action.payload.content,
                htmlContent: action.payload.htmlContent,
                stats: { words, characters, sentences, paragraphs, readingTime }
            };
        
        // Cas ajouté pour corriger "updateStats is not a function"
        case 'UPDATE_STATS':
            return { ...state, stats: { ...state.stats, ...action.payload } };

        case 'SET_SELECTED_TEXT':
            return { ...state, selectedText: action.payload };
        
        // Cas ajouté pour corriger "setCursorPosition is not a function"
        case 'SET_CURSOR_POSITION':
            return { ...state, cursorPosition: action.payload };

        case 'SET_SPELL_ERRORS':
            return { ...state, spellErrors: action.payload };
        case 'SET_GRAMMAR_ERRORS':
            return { ...state, grammarErrors: action.payload };
        case 'SET_SENTIMENT':
            return { ...state, sentiment: action.payload };
        
        // Cas ajoutés pour corriger "openContextMenu is not a function"
        case 'OPEN_CONTEXT_MENU':
            return { 
                ...state, 
                contextMenu: { 
                    isOpen: true, 
                    x: action.payload.x, 
                    y: action.payload.y, 
                    data: action.payload 
                } 
            };
        case 'CLOSE_CONTEXT_MENU':
            return { ...state, contextMenu: { ...state.contextMenu, isOpen: false } };

        // Cas ajoutés pour corriger "openSpellCheckPopup is not a function"
        case 'OPEN_SPELL_POPUP':
            return {
                ...state,
                spellCheckPopup: {
                    isOpen: true,
                    x: action.payload.x,
                    y: action.payload.y,
                    error: action.payload.error
                }
            };
        case 'CLOSE_SPELL_POPUP':
            return { ...state, spellCheckPopup: { ...state.spellCheckPopup, isOpen: false } };

        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_SIDEBAR_OPEN':
            return { ...state, sidebarOpen: action.payload };
        case 'SET_ACTIVE_TAB':
            return { ...state, activeTab: action.payload, sidebarOpen: true };
            
        default:
            return state;
    }
}

export function EditorProvider({ children }) {
    const [state, dispatch] = useReducer(editorReducer, initialState);

    const setContent = useCallback((content, htmlContent) => {
        dispatch({ type: 'SET_CONTENT', payload: { content, htmlContent } });
    }, []);

    // Fonction manquante ajoutée
    const updateStats = useCallback((stats) => {
        dispatch({ type: 'UPDATE_STATS', payload: stats });
    }, []);

    const setSelectedText = useCallback((text) => {
        dispatch({ type: 'SET_SELECTED_TEXT', payload: text });
    }, []);

    // Fonction manquante ajoutée
    const setCursorPosition = useCallback((position) => {
        dispatch({ type: 'SET_CURSOR_POSITION', payload: position });
    }, []);

    const setSpellErrors = useCallback((errors) => {
        dispatch({ type: 'SET_SPELL_ERRORS', payload: errors });
    }, []);

    const setGrammarErrors = useCallback((errors) => {
        dispatch({ type: 'SET_GRAMMAR_ERRORS', payload: errors });
    }, []);

    const setSentiment = useCallback((sentiment) => {
        dispatch({ type: 'SET_SENTIMENT', payload: sentiment });
    }, []);

    // Fonction manquante ajoutée
    const openContextMenu = useCallback((data) => {
        dispatch({ type: 'OPEN_CONTEXT_MENU', payload: data });
    }, []);

    // Fonction manquante ajoutée (utile si vous l'utilisez plus tard)
    const closeContextMenu = useCallback(() => {
        dispatch({ type: 'CLOSE_CONTEXT_MENU' });
    }, []);

    // Fonction manquante ajoutée
    const openSpellCheckPopup = useCallback((data) => {
        dispatch({ type: 'OPEN_SPELL_POPUP', payload: data });
    }, []);

    const setLoading = useCallback((loading) => {
        dispatch({ type: 'SET_LOADING', payload: loading });
    }, []);

    const setSidebarOpen = useCallback((open) => {
        dispatch({ type: 'SET_SIDEBAR_OPEN', payload: open });
    }, []);

    const setActiveTab = useCallback((tab) => {
        dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
    }, []);

    const value = {
        state,
        setContent,
        updateStats,         // Ajouté
        setSelectedText,
        setCursorPosition,   // Ajouté
        setSpellErrors,
        setGrammarErrors,
        setSentiment,
        openContextMenu,     // Ajouté
        closeContextMenu,    // Ajouté
        openSpellCheckPopup, // Ajouté
        setLoading,
        setSidebarOpen,
        setActiveTab
    };

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
}

export function useEditor() {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
}

export default EditorContext;
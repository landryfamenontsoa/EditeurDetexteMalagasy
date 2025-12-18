// src/context/EditorContext.jsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';

const EditorContext = createContext(null);

const initialState = {
    content: '',
    htmlContent: '',
    selectedText: '',
    cursorPosition: null,

    // Analysis results
    spellErrors: [],
    grammarErrors: [],
    suggestions: [],
    sentiment: null,

    // UI State
    isLoading: false,
    isSidebarOpen: true,
    isChatOpen: false,
    activeTab: 'corrections',

    // Popups
    contextMenu: { open: false, x: 0, y: 0, text: '' },
    spellCheckPopup: { open: false, error: null, x: 0, y: 0 },
    translationPopup: { open: false, text: '', x: 0, y: 0 },

    // Statistics
    stats: {
        characters: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0
    },

    // History
    history: [],
    historyIndex: -1,

    // Settings
    language: 'fr',
    autoCorrect: true,
    showSuggestions: true
};

function editorReducer(state, action) {
    switch (action.type) {
        case 'SET_CONTENT':
            return {
                ...state,
                content: action.payload.text,
                htmlContent: action.payload.html || action.payload.text
            };

        case 'SET_SELECTED_TEXT':
            return { ...state, selectedText: action.payload };

        case 'SET_CURSOR_POSITION':
            return { ...state, cursorPosition: action.payload };

        case 'SET_SPELL_ERRORS':
            return { ...state, spellErrors: action.payload };

        case 'SET_GRAMMAR_ERRORS':
            return { ...state, grammarErrors: action.payload };

        case 'SET_SUGGESTIONS':
            return { ...state, suggestions: action.payload };

        case 'SET_SENTIMENT':
            return { ...state, sentiment: action.payload };

        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };

        case 'TOGGLE_SIDEBAR':
            return { ...state, isSidebarOpen: !state.isSidebarOpen };

        case 'SET_SIDEBAR_OPEN':
            return { ...state, isSidebarOpen: action.payload };

        case 'TOGGLE_CHAT':
            return { ...state, isChatOpen: !state.isChatOpen };

        case 'SET_CHAT_OPEN':
            return { ...state, isChatOpen: action.payload };

        case 'SET_ACTIVE_TAB':
            return { ...state, activeTab: action.payload };

        case 'OPEN_CONTEXT_MENU':
            return {
                ...state,
                contextMenu: { open: true, ...action.payload }
            };

        case 'CLOSE_CONTEXT_MENU':
            return {
                ...state,
                contextMenu: { ...state.contextMenu, open: false }
            };

        case 'OPEN_SPELL_CHECK_POPUP':
            return {
                ...state,
                spellCheckPopup: { open: true, ...action.payload }
            };

        case 'CLOSE_SPELL_CHECK_POPUP':
            return {
                ...state,
                spellCheckPopup: { ...state.spellCheckPopup, open: false }
            };

        case 'OPEN_TRANSLATION_POPUP':
            return {
                ...state,
                translationPopup: { open: true, ...action.payload }
            };

        case 'CLOSE_TRANSLATION_POPUP':
            return {
                ...state,
                translationPopup: { ...state.translationPopup, open: false }
            };

        case 'UPDATE_STATS':
            return { ...state, stats: action.payload };

        case 'SET_LANGUAGE':
            return { ...state, language: action.payload };

        case 'TOGGLE_AUTO_CORRECT':
            return { ...state, autoCorrect: !state.autoCorrect };

        case 'TOGGLE_SUGGESTIONS':
            return { ...state, showSuggestions: !state.showSuggestions };

        case 'ADD_TO_HISTORY':
            const newHistory = state.history.slice(0, state.historyIndex + 1);
            newHistory.push(action.payload);
            return {
                ...state,
                history: newHistory,
                historyIndex: newHistory.length - 1
            };

        case 'UNDO':
            if (state.historyIndex > 0) {
                return {
                    ...state,
                    historyIndex: state.historyIndex - 1,
                    content: state.history[state.historyIndex - 1]
                };
            }
            return state;

        case 'REDO':
            if (state.historyIndex < state.history.length - 1) {
                return {
                    ...state,
                    historyIndex: state.historyIndex + 1,
                    content: state.history[state.historyIndex + 1]
                };
            }
            return state;

        case 'RESET':
            return initialState;

        default:
            return state;
    }
}

export function EditorProvider({ children }) {
    const [state, dispatch] = useReducer(editorReducer, initialState);

    const actions = {
        setContent: useCallback((text, html) => {
            dispatch({ type: 'SET_CONTENT', payload: { text, html } });
        }, []),

        setSelectedText: useCallback((text) => {
            dispatch({ type: 'SET_SELECTED_TEXT', payload: text });
        }, []),

        setCursorPosition: useCallback((position) => {
            dispatch({ type: 'SET_CURSOR_POSITION', payload: position });
        }, []),

        setSpellErrors: useCallback((errors) => {
            dispatch({ type: 'SET_SPELL_ERRORS', payload: errors });
        }, []),

        setGrammarErrors: useCallback((errors) => {
            dispatch({ type: 'SET_GRAMMAR_ERRORS', payload: errors });
        }, []),

        setSuggestions: useCallback((suggestions) => {
            dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions });
        }, []),

        setSentiment: useCallback((sentiment) => {
            dispatch({ type: 'SET_SENTIMENT', payload: sentiment });
        }, []),

        setLoading: useCallback((loading) => {
            dispatch({ type: 'SET_LOADING', payload: loading });
        }, []),

        toggleSidebar: useCallback(() => {
            dispatch({ type: 'TOGGLE_SIDEBAR' });
        }, []),

        setSidebarOpen: useCallback((open) => {
            dispatch({ type: 'SET_SIDEBAR_OPEN', payload: open });
        }, []),

        toggleChat: useCallback(() => {
            dispatch({ type: 'TOGGLE_CHAT' });
        }, []),

        setChatOpen: useCallback((open) => {
            dispatch({ type: 'SET_CHAT_OPEN', payload: open });
        }, []),

        setActiveTab: useCallback((tab) => {
            dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
        }, []),

        openContextMenu: useCallback((data) => {
            dispatch({ type: 'OPEN_CONTEXT_MENU', payload: data });
        }, []),

        closeContextMenu: useCallback(() => {
            dispatch({ type: 'CLOSE_CONTEXT_MENU' });
        }, []),

        openSpellCheckPopup: useCallback((data) => {
            dispatch({ type: 'OPEN_SPELL_CHECK_POPUP', payload: data });
        }, []),

        closeSpellCheckPopup: useCallback(() => {
            dispatch({ type: 'CLOSE_SPELL_CHECK_POPUP' });
        }, []),

        openTranslationPopup: useCallback((data) => {
            dispatch({ type: 'OPEN_TRANSLATION_POPUP', payload: data });
        }, []),

        closeTranslationPopup: useCallback(() => {
            dispatch({ type: 'CLOSE_TRANSLATION_POPUP' });
        }, []),

        updateStats: useCallback((stats) => {
            dispatch({ type: 'UPDATE_STATS', payload: stats });
        }, []),

        setLanguage: useCallback((lang) => {
            dispatch({ type: 'SET_LANGUAGE', payload: lang });
        }, []),

        toggleAutoCorrect: useCallback(() => {
            dispatch({ type: 'TOGGLE_AUTO_CORRECT' });
        }, []),

        toggleSuggestions: useCallback(() => {
            dispatch({ type: 'TOGGLE_SUGGESTIONS' });
        }, []),

        addToHistory: useCallback((content) => {
            dispatch({ type: 'ADD_TO_HISTORY', payload: content });
        }, []),

        undo: useCallback(() => {
            dispatch({ type: 'UNDO' });
        }, []),

        redo: useCallback(() => {
            dispatch({ type: 'REDO' });
        }, []),

        reset: useCallback(() => {
            dispatch({ type: 'RESET' });
        }, [])
    };

    return (
        <EditorContext.Provider value={{ state, ...actions }}>
            {children}
        </EditorContext.Provider>
    );
}

export function useEditor() {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within EditorProvider');
    }
    return context;
}

export default EditorContext;
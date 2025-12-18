// src/store/editorStore.js
import { create } from 'zustand';

const useEditorStore = create((set, get) => ({
    // --- ÉTAT DU CONTENU ---
    content: '',
    htmlContent: '',
    selectedText: '',
    cursorPosition: { line: 1, column: 1, index: 0 },
    language: 'fr',

    // --- ÉTAT DE L'ANALYSE ---
    isLoading: false,
    spellErrors: [],
    grammarErrors: [],
    sentiment: { label: 'neutral', confidence: 0.5 },
    stats: {
        words: 0,
        characters: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0
    },

    // --- ÉTAT DE L'INTERFACE (UI) ---
    isSidebarOpen: true,
    isChatOpen: false,
    activeTab: 'corrections',

    // --- ÉTAT DES POPUPS ---
    contextMenu: { open: false, x: 0, y: 0, text: '' },
    translationPopup: { open: false, text: '', x: 0, y: 0 },
    spellCheckPopup: { open: false, error: null, x: 0, y: 0 },

    // --- ACTIONS ---

    // Mise à jour du texte et calcul auto des stats simples
    setContent: (text, html) => {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const characters = text.length;
        const readingTime = Math.ceil(words / 200);

        set((state) => ({
            content: text,
            htmlContent: html || text,
            stats: {
                ...state.stats,
                words,
                characters,
                readingTime
            }
        }));
    },

    setSelectedText: (text) => set({ selectedText: text }),

    setCursorPosition: (pos) => set({ cursorPosition: pos }),

    setLoading: (loading) => set({ isLoading: loading }),

    setErrors: (spell, grammar) => set({
        spellErrors: spell || [],
        grammarErrors: grammar || []
    }),

    setSentiment: (sentiment) => set({ sentiment }),

    setLanguage: (lang) => set({ language: lang }),

    // Actions UI
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (open) => set({ isSidebarOpen: open }),

    toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
    setChatOpen: (open) => set({ isChatOpen: open }),

    setActiveTab: (tab) => set({ activeTab: tab }),

    // Actions Popups
    openContextMenu: (data) => set({
        contextMenu: { ...data, open: true }
    }),
    closeContextMenu: () => set((state) => ({
        contextMenu: { ...state.contextMenu, open: false }
    })),

    openTranslationPopup: (data) => set({
        translationPopup: { ...data, open: true }
    }),
    closeTranslationPopup: () => set((state) => ({
        translationPopup: { ...state.translationPopup, open: false }
    })),

    openSpellCheckPopup: (data) => set({
        spellCheckPopup: { ...data, open: true }
    }),
    closeSpellCheckPopup: () => set((state) => ({
        spellCheckPopup: { ...state.spellCheckPopup, open: false }
    })),

    // Réinitialisation
    resetStore: () => set({
        content: '',
        htmlContent: '',
        spellErrors: [],
        grammarErrors: [],
        stats: { words: 0, characters: 0, sentences: 0, paragraphs: 0, readingTime: 0 }
    })
}));

export default useEditorStore;
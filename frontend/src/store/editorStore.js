import { create } from 'zustand';

const useEditorStore = create((set, get) => ({
    // État de l'éditeur
    content: '',
    cursorPosition: 0,
    selectedText: '',

    // Résultats d'analyse
    spellErrors: [],
    suggestions: [],
    sentimentScore: null,
    entities: [],
    lemmatization: [],

    // UI State
    isSidebarOpen: true,
    isChatbotOpen: false,
    isLoading: false,
    activeTab: 'suggestions',

    // Actions
    setContent: (content) => set({ content }),
    setCursorPosition: (position) => set({ cursorPosition: position }),
    setSelectedText: (text) => set({ selectedText: text }),

    setSpellErrors: (errors) => set({ spellErrors: errors }),
    setSuggestions: (suggestions) => set({ suggestions }),
    setSentimentScore: (score) => set({ sentimentScore: score }),
    setEntities: (entities) => set({ entities }),
    setLemmatization: (lemmas) => set({ lemmatization: lemmas }),

    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    toggleChatbot: () => set((state) => ({ isChatbotOpen: !state.isChatbotOpen })),
    setLoading: (loading) => set({ isLoading: loading }),
    setActiveTab: (tab) => set({ activeTab: tab }),

    // Reset
    reset: () => set({
        content: '',
        cursorPosition: 0,
        selectedText: '',
        spellErrors: [],
        suggestions: [],
        sentimentScore: null,
        entities: [],
        lemmatization: [],
    }),
}));

export default useEditorStore;
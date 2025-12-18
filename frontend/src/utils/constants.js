// src/utils/constants.js
export const LANGUAGES = {
    fr: { code: 'fr', name: 'Français', flag: '🇫🇷' },
    en: { code: 'en', name: 'English', flag: '🇬🇧' },
    es: { code: 'es', name: 'Español', flag: '🇪🇸' },
    de: { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    it: { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    pt: { code: 'pt', name: 'Português', flag: '🇵🇹' },
    ar: { code: 'ar', name: 'العربية', flag: '🇸🇦' }
};

export const ERROR_TYPES = {
    SPELLING: 'spelling',
    GRAMMAR: 'grammar',
    STYLE: 'style',
    PUNCTUATION: 'punctuation'
};

export const ERROR_COLORS = {
    spelling: '#ef4444',
    grammar: '#f59e0b',
    style: '#6366f1',
    punctuation: '#8b5cf6'
};

export const SENTIMENT_LABELS = {
    very_positive: 'Très positif',
    positive: 'Positif',
    neutral: 'Neutre',
    negative: 'Négatif',
    very_negative: 'Très négatif'
};

export const TOOLBAR_ACTIONS = {
    BOLD: 'bold',
    ITALIC: 'italic',
    UNDERLINE: 'underline',
    STRIKE: 'strike',
    HEADING_1: 'header-1',
    HEADING_2: 'header-2',
    BULLET_LIST: 'bullet',
    NUMBER_LIST: 'ordered',
    QUOTE: 'blockquote',
    CODE: 'code-block',
    LINK: 'link',
    IMAGE: 'image',
    UNDO: 'undo',
    REDO: 'redo',
    SPELL_CHECK: 'spell-check',
    TRANSLATE: 'translate'
};

export const KEYBOARD_SHORTCUTS = {
    SAVE: 'ctrl+s',
    UNDO: 'ctrl+z',
    REDO: 'ctrl+y',
    BOLD: 'ctrl+b',
    ITALIC: 'ctrl+i',
    UNDERLINE: 'ctrl+u',
    SPELL_CHECK: 'f7',
    TRANSLATE: 'ctrl+shift+t'
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ACCEPTED_FILE_TYPES = [
    '.txt',
    '.doc',
    '.docx',
    '.rtf',
    '.odt',
    '.md'
];
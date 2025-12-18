// src/utils/textUtils.js
export const textUtils = {
    // Count words in text
    countWords: (text) => {
        if (!text) return 0;
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    },

    // Count characters
    countCharacters: (text, includeSpaces = true) => {
        if (!text) return 0;
        return includeSpaces ? text.length : text.replace(/\s/g, '').length;
    },

    // Count sentences
    countSentences: (text) => {
        if (!text) return 0;
        return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    },

    // Count paragraphs
    countParagraphs: (text) => {
        if (!text) return 0;
        return text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
    },

    // Calculate reading time in minutes
    calculateReadingTime: (text, wordsPerMinute = 200) => {
        const words = textUtils.countWords(text);
        return Math.ceil(words / wordsPerMinute);
    },

    // Get word at position
    getWordAtPosition: (text, position) => {
        if (!text || position < 0) return null;

        let start = position;
        let end = position;

        // Find start of word
        while (start > 0 && /\w/.test(text[start - 1])) {
            start--;
        }

        // Find end of word
        while (end < text.length && /\w/.test(text[end])) {
            end++;
        }

        if (start === end) return null;

        return {
            word: text.substring(start, end),
            start,
            end
        };
    },

    // Get sentence at position
    getSentenceAtPosition: (text, position) => {
        if (!text || position < 0) return null;

        const sentenceEnders = /[.!?]/;
        let start = position;
        let end = position;

        // Find start of sentence
        while (start > 0 && !sentenceEnders.test(text[start - 1])) {
            start--;
        }

        // Find end of sentence
        while (end < text.length && !sentenceEnders.test(text[end])) {
            end++;
        }

        // Include the sentence ender
        if (end < text.length) end++;

        return {
            sentence: text.substring(start, end).trim(),
            start,
            end
        };
    },

    // Replace text at position
    replaceAt: (text, start, end, replacement) => {
        return text.substring(0, start) + replacement + text.substring(end);
    },

    // Highlight text
    highlightText: (text, positions, className) => {
        if (!positions || positions.length === 0) return text;

        // Sort positions by start index (descending to avoid offset issues)
        const sorted = [...positions].sort((a, b) => b.start - a.start);

        let result = text;
        for (const pos of sorted) {
            const before = result.substring(0, pos.start);
            const highlighted = result.substring(pos.start, pos.end);
            const after = result.substring(pos.end);
            result = `${before}<span class="${className}">${highlighted}</span>${after}`;
        }

        return result;
    },

    // Escape HTML
    escapeHtml: (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Strip HTML tags
    stripHtml: (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    },

    // Truncate text
    truncate: (text, maxLength, suffix = '...') => {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength - suffix.length) + suffix;
    },

    // Capitalize first letter
    capitalize: (text) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    },

    // Title case
    toTitleCase: (text) => {
        if (!text) return '';
        return text.replace(/\w\S*/g, (txt) =>
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }
};

export default textUtils;
// src/utils/highlighter.js
import { ERROR_COLORS } from './constants';

export const highlighter = {
    // Create underline styles for errors
    createErrorStyles: (errors, containerElement) => {
        if (!errors || !containerElement) return [];

        const styles = errors.map(error => {
            const range = document.createRange();
            const textNode = findTextNode(containerElement, error.position.start, error.position.end);

            if (!textNode) return null;

            const rect = getRangeRect(range, textNode, error.position.start, error.position.end);

            return {
                id: `error-${error.position.start}-${error.position.end}`,
                type: error.type,
                color: ERROR_COLORS[error.type] || ERROR_COLORS.spelling,
                rect,
                error
            };
        }).filter(Boolean);

        return styles;
    },

    // Render error underlines
    renderUnderlines: (errors, editorRef) => {
        if (!editorRef.current) return null;

        const container = editorRef.current;
        const containerRect = container.getBoundingClientRect();

        return errors.map(error => {
            const words = container.querySelectorAll('[data-word]');

            return {
                ...error,
                style: {
                    position: 'absolute',
                    left: error.rect?.left - containerRect.left || 0,
                    top: (error.rect?.bottom - containerRect.top || 0) - 2,
                    width: error.rect?.width || 50,
                    height: 3,
                    background: `repeating-linear-gradient(
            90deg,
            ${error.color},
            ${error.color} 2px,
            transparent 2px,
            transparent 4px
          )`,
                    pointerEvents: 'none'
                }
            };
        });
    },

    // Apply highlight class to text
    applyHighlightClass: (element, start, end, className) => {
        if (!element) return;

        const text = element.textContent;
        const before = text.substring(0, start);
        const highlighted = text.substring(start, end);
        const after = text.substring(end);

        element.innerHTML = `${before}<span class="${className}">${highlighted}</span>${after}`;
    },

    // Remove all highlights
    removeAllHighlights: (element) => {
        if (!element) return;

        const highlights = element.querySelectorAll('.error-spelling, .error-grammar, .error-style');
        highlights.forEach(span => {
            const parent = span.parentNode;
            parent.replaceChild(document.createTextNode(span.textContent), span);
            parent.normalize();
        });
    },

    // Get error at position
    getErrorAtPosition: (errors, position) => {
        return errors.find(error =>
            position >= error.position.start && position <= error.position.end
        );
    }
};

// Helper functions
function findTextNode(container, start, end) {
    const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let currentPos = 0;
    let node;

    while (node = walker.nextNode()) {
        const nodeLength = node.textContent.length;
        if (currentPos + nodeLength >= start) {
            return node;
        }
        currentPos += nodeLength;
    }

    return null;
}

function getRangeRect(range, textNode, start, end) {
    try {
        range.setStart(textNode, Math.min(start, textNode.textContent.length));
        range.setEnd(textNode, Math.min(end, textNode.textContent.length));
        return range.getBoundingClientRect();
    } catch (e) {
        return null;
    }
}

export default highlighter;
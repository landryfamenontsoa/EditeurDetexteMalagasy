import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Paper,
    Box,
    CircularProgress,
} from '@mui/material';
import { Icon } from '@iconify/react';
import useEditorStore from '../../store/editorStore';
import { useSpellCheck } from '../../hooks/useSpellCheck';
import { useAutocomplete } from '../../hooks/useAutocomplete';
import EditorToolbar from './EditorToolbar';
import {
    SpellCheckPopover,
    AutocompleteDropdown,
    ContextMenu
} from '../../components/Popups';

const TextEditor = () => {
    const editorRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedWord, setSelectedWord] = useState('');
    const [contextMenu, setContextMenu] = useState(null);
    const [autocompleteAnchor, setAutocompleteAnchor] = useState(null);

    const { content, setContent, spellErrors, isLoading } = useEditorStore();
    const { checkSpelling } = useSpellCheck();
    const { predictions, getPredictions, clearPredictions } = useAutocomplete();

    // Vérification orthographique avec debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (content) {
                checkSpelling(content);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [content, checkSpelling]);

    // Gestion du changement de texte
    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);

        // Autocomplétion
        const cursorPos = e.target.selectionStart;
        const textBeforeCursor = newContent.slice(0, cursorPos);
        const lastWord = textBeforeCursor.split(/\s+/).pop();

        if (lastWord && lastWord.length > 2) {
            getPredictions(newContent, cursorPos);
            setAutocompleteAnchor(e.target);
        } else {
            clearPredictions();
            setAutocompleteAnchor(null);
        }
    };

    // Gestion du clic sur un mot avec erreur
    const handleWordClick = (e) => {
        const selection = window.getSelection();
        const word = selection.toString().trim();

        if (word && spellErrors.some(err => err.word === word)) {
            setSelectedWord(word);
            setAnchorEl(e.currentTarget);
        }
    };

    // Menu contextuel
    const handleContextMenu = (e) => {
        e.preventDefault();
        const selection = window.getSelection();
        const word = selection.toString().trim();

        setContextMenu({
            mouseX: e.clientX,
            mouseY: e.clientY,
            word: word || '',
        });
    };

    // Mise en évidence des erreurs
    const renderHighlightedText = () => {
        if (!spellErrors || spellErrors.length === 0) {
            return content;
        }

        // Cette fonction sera améliorée pour vraiment surligner
        return content;
    };

    return (
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <EditorToolbar />

            <Paper
                elevation={2}
                sx={{
                    flex: 1,
                    mt: 2,
                    p: 3,
                    position: 'relative',
                    overflow: 'auto',
                }}
            >
                {isLoading && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 1,
                        }}
                    >
                        <CircularProgress size={24} />
                    </Box>
                )}

                <Box
                    ref={editorRef}
                    component="textarea"
                    value={content}
                    onChange={handleContentChange}
                    onClick={handleWordClick}
                    onContextMenu={handleContextMenu}
                    placeholder="Commencez à écrire en Malagasy..."
                    sx={{
                        width: '100%',
                        minHeight: '500px',
                        border: 'none',
                        outline: 'none',
                        fontSize: '16px',
                        lineHeight: 1.8,
                        fontFamily: 'inherit',
                        resize: 'none',
                        '&::placeholder': {
                            color: 'text.disabled',
                        },
                    }}
                />
            </Paper>

            {/* Popover corrections orthographiques */}
            <SpellCheckPopover
                anchorEl={anchorEl}
                word={selectedWord}
                onClose={() => setAnchorEl(null)}
            />

            {/* Dropdown autocomplétion */}
            <AutocompleteDropdown
                anchorEl={autocompleteAnchor}
                predictions={predictions}
                onSelect={(prediction) => {
                    // Insérer la prédiction
                    clearPredictions();
                    setAutocompleteAnchor(null);
                }}
                onClose={() => {
                    clearPredictions();
                    setAutocompleteAnchor(null);
                }}
            />

            {/* Menu contextuel */}
            <ContextMenu
                contextMenu={contextMenu}
                onClose={() => setContextMenu(null)}
            />
        </Box>
    );
};

export default TextEditor;
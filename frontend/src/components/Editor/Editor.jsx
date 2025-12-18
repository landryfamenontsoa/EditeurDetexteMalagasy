// src/components/Editor/Editor.jsx (Version améliorée)
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Box, Paper, useTheme, alpha, Popper, Fade } from '@mui/material';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Toolbar from './Toolbar';
import { useEditor } from '../../contexts/EditorContext';
import { useSpellCheck } from '../../hooks/useSpellCheck';
import { useTextAnalysis } from '../../hooks/useTextAnalysis';
import { useSentiment } from '../../hooks/useSentiment';
import SuggestionTooltip from '../Popups/SuggestionTooltip';
import { apiService } from '../../services/apiService';
import './Editor.css';

const modules = {
    toolbar: false,
    history: {
        delay: 1000,
        maxStack: 100,
        userOnly: true
    },
    clipboard: {
        matchVisual: false
    }
};

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'blockquote', 'code-block',
    'align'
];

export function Editor() {
    const theme = useTheme();
    const quillRef = useRef(null);
    const containerRef = useRef(null);
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipAnchorEl, setTooltipAnchorEl] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [lastCheckedText, setLastCheckedText] = useState('');
    const [lastCursorPosition, setLastCursorPosition] = useState(null);

    const {
        state,
        setContent,
        setSelectedText,
        setCursorPosition,
        updateStats,
        setSpellErrors,
        setGrammarErrors,
        setSentiment
    } = useEditor();

    const { errors: spellErrors, checkSpelling, isChecking } = useSpellCheck(state.language);
    const { getStatistics, analyzeText } = useTextAnalysis(state.language);
    const { analyzeSentiment } = useSentiment();

    // Fonction pour obtenir le mot actuel sous le curseur
    const getCurrentWordAtCursor = useCallback(() => {
        const editor = quillRef.current?.getEditor();
        if (!editor) return { word: '', range: null };

        const selection = editor.getSelection();
        if (!selection) return { word: '', range: null };

        const text = editor.getText();

        // Trouver les limites du mot actuel
        let start = selection.index;
        let end = selection.index;

        // Reculer jusqu'au début du mot
        while (start > 0 && !/\s/.test(text[start - 1])) {
            start--;
        }

        // Avancer jusqu'à la fin du mot
        while (end < text.length && !/\s/.test(text[end])) {
            end++;
        }

        const word = text.substring(start, end).trim();
        const range = { index: start, length: end - start };

        return { word, range };
    }, []);

    // Fonction pour obtenir la position du curseur dans l'éditeur
    const getCursorPosition = useCallback(() => {
        const editor = quillRef.current?.getEditor();
        if (!editor) return null;

        const selection = editor.getSelection();
        if (!selection) return null;

        const bounds = editor.getBounds(selection.index);
        const editorContainer = editor.container;
        const rect = editorContainer.getBoundingClientRect();

        return {
            x: rect.left + bounds.left,
            y: rect.top + bounds.top + bounds.height,
            index: selection.index
        };
    }, []);

    // Fonction pour vérifier le mot actuel
    const checkCurrentWord = useCallback(async () => {
        const { word, range } = getCurrentWordAtCursor();

        if (!word || word.length < 2 || word === lastCheckedText) return;

        setLastCheckedText(word);

        try {
            // Nettoyer le mot de la ponctuation
            const cleanWord = word.replace(/[.,!?;:'"()[\]{}]/g, '');
            if (cleanWord.length < 2) return;

            const result = await apiService.checkWord(cleanWord);

            if (!result.correct && result.suggestion) {
                const position = getCursorPosition();
                if (position) {
                    // Créer un élément temporaire pour servir d'ancre
                    const tempAnchor = document.createElement('div');
                    tempAnchor.style.position = 'absolute';
                    tempAnchor.style.left = `${position.x}px`;
                    tempAnchor.style.top = `${position.y}px`;
                    document.body.appendChild(tempAnchor);

                    setTooltipAnchorEl(tempAnchor);
                    setTooltipData({
                        word: cleanWord,
                        suggestion: result.suggestion,
                        confidence: result.confidence,
                        range: range
                    });

                    // Nettoyer l'élément après un délai
                    setTimeout(() => {
                        if (document.body.contains(tempAnchor)) {
                            document.body.removeChild(tempAnchor);
                        }
                    }, 100);
                }
            } else {
                setTooltipData(null);
                setTooltipAnchorEl(null);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification:', error);
        }
    }, [getCurrentWordAtCursor, getCursorPosition, lastCheckedText]);

    // Fonction pour gérer les changements de contenu
    const handleChange = useCallback((content, delta, source, editor) => {
        const text = editor.getText();
        const html = editor.getHTML();

        setContent(text, html);

        // Mettre à jour les statistiques
        const stats = getStatistics(text);
        updateStats(stats);

        // Indiquer que l'utilisateur est en train de taper
        setIsTyping(true);

        // Effacer le timeout précédent
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Définir un nouveau timeout
        const timeout = setTimeout(() => {
            setIsTyping(false);
            checkCurrentWord();

            // Vérification orthographique complète pour la liste d'erreurs
            if (state.autoCorrect && text.trim().length > 0) {
                checkSpelling(text);
            }

            // Analyser le sentiment pour les textes plus longs
            if (text.length > 50) {
                analyzeSentiment(text);
            }
        }, 500);

        setTypingTimeout(timeout);
    }, [state.autoCorrect, checkCurrentWord, getStatistics, updateStats, setContent, checkSpelling, analyzeSentiment, typingTimeout]);

    // Gérer l'acceptation d'une suggestion
    const handleAcceptSuggestion = useCallback((suggestion) => {
        const editor = quillRef.current?.getEditor();
        if (!editor || !tooltipData || !tooltipData.range) return;

        // Remplacer le mot par la suggestion
        editor.deleteText(tooltipData.range.index, tooltipData.range.length);
        editor.insertText(tooltipData.range.index, suggestion);

        // Repositionner le curseur après le mot
        editor.setSelection(tooltipData.range.index + suggestion.length);

        // Fermer le tooltip
        setTooltipData(null);
        setTooltipAnchorEl(null);
        setLastCheckedText(suggestion);
    }, [tooltipData]);

    // Gérer l'ignorance d'une suggestion
    const handleIgnoreSuggestion = useCallback(() => {
        setTooltipData(null);
        setTooltipAnchorEl(null);
    }, []);

    // Gérer les changements de sélection
    const handleSelectionChange = useCallback((range, source, editor) => {
        if (range) {
            const text = editor.getText();
            const selectedText = range.length > 0
                ? text.substring(range.index, range.index + range.length)
                : '';

            setSelectedText(selectedText);

            // Calculer la ligne et la colonne
            const textBeforeCursor = text.substring(0, range.index);
            const lines = textBeforeCursor.split('\n');
            const line = lines.length;
            const column = lines[lines.length - 1].length + 1;

            setCursorPosition({ line, column, index: range.index });

            // Stocker la position du curseur
            const cursorPos = getCursorPosition();
            if (cursorPos && (!lastCursorPosition ||
                cursorPos.index !== lastCursorPosition.index)) {
                setLastCursorPosition(cursorPos);

                // Vérifier le mot actuel après un court délai
                setTimeout(() => {
                    if (!isTyping) {
                        checkCurrentWord();
                    }
                }, 100);
            }
        }
    }, [getCursorPosition, lastCursorPosition, isTyping, checkCurrentWord, setSelectedText, setCursorPosition]);

    // Nettoyer les timeouts lors du démontage
    useEffect(() => {
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [typingTimeout]);

    return (
        <Box
            ref={containerRef}
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                p: { xs: 2, sm: 3 },
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: 'hidden',
                        bgcolor: theme.palette.background.paper,
                        boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`
                    }}
                >
                    {/* Toolbar */}
                    <Toolbar quillRef={quillRef} isChecking={isChecking} />

                    {/* Editor Area */}
                    <Box
                        sx={{
                            flex: 1,
                            overflow: 'auto',
                            position: 'relative',
                            '& .ql-container': {
                                border: 'none',
                                fontSize: '1rem',
                                fontFamily: theme.typography.fontFamily
                            },
                            '& .ql-editor': {
                                minHeight: '100%',
                                padding: { xs: 2, sm: 3 },
                                lineHeight: 1.8,
                                color: theme.palette.text.primary,
                                '&.ql-blank::before': {
                                    color: theme.palette.text.secondary,
                                    fontStyle: 'normal',
                                    left: { xs: 16, sm: 24 }
                                }
                            },
                            '& .ql-editor p': {
                                marginBottom: '0.5em'
                            }
                        }}
                    >
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={state.htmlContent}
                            onChange={handleChange}
                            onChangeSelection={handleSelectionChange}
                            modules={modules}
                            formats={formats}
                            placeholder="Commencez à écrire votre texte ici..."
                        />
                    </Box>
                </Paper>
            </motion.div>

            {/* Tooltip de suggestion centré */}
            <Popper
                open={!!tooltipData && !!tooltipAnchorEl}
                anchorEl={tooltipAnchorEl}
                placement="bottom"          // bottom-center
                transition
                disablePortal={false}
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 8], // distance verticale
                        },
                    },
                    {
                        name: 'preventOverflow',
                        options: {
                            padding: 8,
                        },
                    },
                    {
                        name: 'flip',
                        options: {
                            fallbackPlacements: ['top', 'right', 'left'],
                        },
                    },
                    {
                        name: 'computeStyles',
                        options: {
                            adaptive: true,
                        },
                    },
                ]}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            {tooltipData && (
                                <SuggestionTooltip
                                    word={tooltipData.word}
                                    suggestion={tooltipData.suggestion}
                                    confidence={tooltipData.confidence}
                                    onAccept={handleAcceptSuggestion}
                                    onIgnore={handleIgnoreSuggestion}
                                />
                            )}
                        </div>
                    </Fade>
                )}
            </Popper>

        </Box>
    );
}

export default Editor;
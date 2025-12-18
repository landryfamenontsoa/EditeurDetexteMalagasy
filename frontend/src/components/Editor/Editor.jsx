// src/components/Editor/Editor.jsx (Complet)
import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import { Box, Paper, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Toolbar from './Toolbar';
import { useEditor } from '../../contexts/EditorContext';
import { useSpellCheck } from '../../hooks/useSpellCheck';
import { useTextAnalysis } from '../../hooks/useTextAnalysis';
import { useSentiment } from '../../hooks/useSentiment';
import { textUtils } from '../../utils/textUtils';
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

    const {
        state,
        setContent,
        setSelectedText,
        setCursorPosition,
        updateStats,
        setSpellErrors,
        setGrammarErrors,
        setSentiment,
        openContextMenu,
        openSpellCheckPopup
    } = useEditor();

    const { errors: spellErrors, checkSpelling, isChecking } = useSpellCheck(state.language);
    const { getStatistics, analyzeText } = useTextAnalysis(state.language);
    const { analyzeSentiment, sentiment } = useSentiment();

    // Handle content change
    const handleChange = useCallback((content, delta, source, editor) => {
        const text = editor.getText();
        const html = editor.getHTML();

        setContent(text, html);

        // Update statistics
        const stats = getStatistics(text);
        updateStats(stats);

        // Trigger spell check
        if (state.autoCorrect && text.trim().length > 0) {
            checkSpelling(text);
        }

        // Analyze sentiment for longer texts
        if (text.length > 50) {
            analyzeSentiment(text);
        }
    }, [state.autoCorrect, state.language]);

    // Handle selection change
    const handleSelectionChange = useCallback((range, source, editor) => {
        if (range) {
            const text = editor.getText();
            const selectedText = range.length > 0
                ? text.substring(range.index, range.index + range.length)
                : '';

            setSelectedText(selectedText);

            // Calculate line and column
            const textBeforeCursor = text.substring(0, range.index);
            const lines = textBeforeCursor.split('\n');
            const line = lines.length;
            const column = lines[lines.length - 1].length + 1;

            setCursorPosition({ line, column, index: range.index });
        }
    }, []);

    // Handle right-click context menu
    const handleContextMenu = useCallback((event) => {
        event.preventDefault();

        const editor = quillRef.current?.getEditor();
        if (!editor) return;

        const selection = editor.getSelection();
        const text = editor.getText();

        let selectedText = '';
        let wordAtCursor = null;

        if (selection) {
            if (selection.length > 0) {
                selectedText = text.substring(selection.index, selection.index + selection.length);
            } else {
                wordAtCursor = textUtils.getWordAtPosition(text, selection.index);
                selectedText = wordAtCursor?.word || '';
            }
        }

        // Check if there's an error at this position
        const errorAtPosition = spellErrors.find(err => {
            if (selection) {
                return selection.index >= err.position.start && selection.index <= err.position.end;
            }
            return false;
        });

        openContextMenu({
            x: event.clientX,
            y: event.clientY,
            text: selectedText,
            error: errorAtPosition,
            position: selection?.index || 0
        });
    }, [spellErrors, openContextMenu]);

    // Handle click on error
    const handleErrorClick = useCallback((event, error) => {
        openSpellCheckPopup({
            error,
            x: event.clientX,
            y: event.clientY
        });
    }, [openSpellCheckPopup]);

    // Update errors in state
    useEffect(() => {
        setSpellErrors(spellErrors);
    }, [spellErrors, setSpellErrors]);

    // Update sentiment in state
    useEffect(() => {
        if (sentiment) {
            setSentiment(sentiment);
        }
    }, [sentiment, setSentiment]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl+S - Save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                console.log('Save document');
            }

            // F7 - Spell check
            if (e.key === 'F7') {
                e.preventDefault();
                const editor = quillRef.current?.getEditor();
                if (editor) {
                    checkSpelling(editor.getText());
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [checkSpelling]);

    return (
        <Box
            ref={containerRef}
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                p: { xs: 2, sm: 3 },
                overflow: 'hidden'
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
                        onContextMenu={handleContextMenu}
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

                        {/* Error Highlights Overlay */}
                        <ErrorHighlights
                            errors={spellErrors}
                            quillRef={quillRef}
                            onErrorClick={handleErrorClick}
                        />
                    </Box>
                </Paper>
            </motion.div>
        </Box>
    );
}

// Error Highlights Component
function ErrorHighlights({ errors, quillRef, onErrorClick }) {
    const theme = useTheme();

    if (!errors || errors.length === 0) return null;

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                overflow: 'hidden'
            }}
        >
            {errors.map((error, index) => (
                <Box
                    key={`${error.word}-${index}`}
                    sx={{
                        position: 'absolute',
                        pointerEvents: 'auto',
                        cursor: 'pointer',
                        borderBottom: `2px wavy ${error.type === 'spelling'
                            ? theme.palette.error.main
                            : theme.palette.warning.main
                            }`,
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.1)
                        }
                    }}
                    onClick={(e) => onErrorClick(e, error)}
                />
            ))}
        </Box>
    );
}

export default Editor;
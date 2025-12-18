// src/components/Editor/Toolbar.jsx
import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Divider,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    ToggleButton,
    ToggleButtonGroup,
    Select,
    FormControl,
    useTheme,
    alpha,
    Badge,
    CircularProgress
} from '@mui/material';
import {
    FormatBold,
    FormatItalic,
    FormatUnderlined,
    FormatStrikethrough,
    FormatListBulleted,
    FormatListNumbered,
    FormatQuote,
    Code,
    Undo,
    Redo,
    Spellcheck,
    Translate,
    AutoFixHigh,
    ContentCopy,
    ContentCut,
    ContentPaste,
    SelectAll,
    FindReplace,
    SaveAlt,
    Print,
    MoreVert,
    TextFields,
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
    FormatAlignJustify,
    Link,
    Image,
    InsertEmoticon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Tooltip from '../UI/Tooltip';
import { useEditor } from '../../contexts/EditorContext';

const FONT_SIZES = [
    { value: 'small', label: 'Petit' },
    { value: 'normal', label: 'Normal' },
    { value: 'large', label: 'Grand' },
    { value: 'huge', label: 'Très grand' }
];

const HEADINGS = [
    { value: '', label: 'Paragraphe' },
    { value: '1', label: 'Titre 1' },
    { value: '2', label: 'Titre 2' },
    { value: '3', label: 'Titre 3' }
];

export function Toolbar({ quillRef, isChecking }) {
    const theme = useTheme();
    const { state, toggleSidebar, toggleChat } = useEditor();
    const [moreAnchor, setMoreAnchor] = useState(null);
    const [alignment, setAlignment] = useState('left');
    const [heading, setHeading] = useState('');
    const [fontSize, setFontSize] = useState('normal');

    const getEditor = () => quillRef.current?.getEditor();

    // Format handlers
    const handleFormat = (format, value = true) => {
        const editor = getEditor();
        if (editor) {
            const currentFormat = editor.getFormat();
            editor.format(format, currentFormat[format] ? false : value);
        }
    };

    const handleHeading = (event) => {
        const value = event.target.value;
        setHeading(value);
        const editor = getEditor();
        if (editor) {
            editor.format('header', value || false);
        }
    };

    const handleAlignment = (event, newAlignment) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
            const editor = getEditor();
            if (editor) {
                editor.format('align', newAlignment === 'left' ? false : newAlignment);
            }
        }
    };

    const handleUndo = () => {
        const editor = getEditor();
        if (editor) editor.history.undo();
    };

    const handleRedo = () => {
        const editor = getEditor();
        if (editor) editor.history.redo();
    };

    const handleCopy = () => {
        document.execCommand('copy');
    };

    const handleCut = () => {
        document.execCommand('cut');
    };

    const handlePaste = () => {
        navigator.clipboard.readText().then(text => {
            const editor = getEditor();
            if (editor) {
                const range = editor.getSelection();
                if (range) {
                    editor.insertText(range.index, text);
                }
            }
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSave = () => {
        const editor = getEditor();
        if (editor) {
            const content = editor.getContents();
            const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'document.json';
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const errorCount = state.spellErrors.length + state.grammarErrors.length;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                p: 1.5,
                borderBottom: `1px solid ${theme.palette.divider}`,
                flexWrap: 'wrap',
                bgcolor: alpha(theme.palette.background.default, 0.5)
            }}
        >
            {/* Undo/Redo */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Annuler (Ctrl+Z)">
                    <IconButton size="small" onClick={handleUndo}>
                        <Undo fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Rétablir (Ctrl+Y)">
                    <IconButton size="small" onClick={handleRedo}>
                        <Redo fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Heading Selector */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                    value={heading}
                    onChange={handleHeading}
                    displayEmpty
                    sx={{
                        fontSize: '0.875rem',
                        '& .MuiSelect-select': {
                            py: 0.75
                        }
                    }}
                >
                    {HEADINGS.map(h => (
                        <MenuItem key={h.value} value={h.value}>
                            {h.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Text Formatting */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Gras (Ctrl+B)">
                    <IconButton size="small" onClick={() => handleFormat('bold')}>
                        <FormatBold fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Italique (Ctrl+I)">
                    <IconButton size="small" onClick={() => handleFormat('italic')}>
                        <FormatItalic fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Souligné (Ctrl+U)">
                    <IconButton size="small" onClick={() => handleFormat('underline')}>
                        <FormatUnderlined fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Barré">
                    <IconButton size="small" onClick={() => handleFormat('strike')}>
                        <FormatStrikethrough fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Alignment */}
            <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleAlignment}
                size="small"
            >
                <ToggleButton value="left">
                    <Tooltip title="Aligner à gauche">
                        <FormatAlignLeft fontSize="small" />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="center">
                    <Tooltip title="Centrer">
                        <FormatAlignCenter fontSize="small" />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="right">
                    <Tooltip title="Aligner à droite">
                        <FormatAlignRight fontSize="small" />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="justify">
                    <Tooltip title="Justifier">
                        <FormatAlignJustify fontSize="small" />
                    </Tooltip>
                </ToggleButton>
            </ToggleButtonGroup>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Lists */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Liste à puces">
                    <IconButton size="small" onClick={() => handleFormat('list', 'bullet')}>
                        <FormatListBulleted fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Liste numérotée">
                    <IconButton size="small" onClick={() => handleFormat('list', 'ordered')}>
                        <FormatListNumbered fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Citation">
                    <IconButton size="small" onClick={() => handleFormat('blockquote')}>
                        <FormatQuote fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Code">
                    <IconButton size="small" onClick={() => handleFormat('code-block')}>
                        <Code fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Insert */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Insérer un lien">
                    <IconButton size="small">
                        <Link fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Insérer une image">
                    <IconButton size="small">
                        <Image fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Spacer */}
            <Box sx={{ flex: 1 }} />

            {/* AI Tools */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Vérification orthographique (F7)">
                    <IconButton
                        size="small"
                        onClick={toggleSidebar}
                        sx={{
                            color: errorCount > 0 ? theme.palette.error.main : 'inherit'
                        }}
                    >
                        <Badge badgeContent={errorCount} color="error" max={99}>
                            {isChecking ? (
                                <CircularProgress size={18} />
                            ) : (
                                <Spellcheck fontSize="small" />
                            )}
                        </Badge>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Traduction">
                    <IconButton size="small" onClick={toggleSidebar}>
                        <Translate fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Assistant IA">
                    <IconButton
                        size="small"
                        onClick={toggleChat}
                        sx={{
                            background: state.isChatOpen
                                ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                                : 'transparent',
                            color: state.isChatOpen ? '#fff' : 'inherit',
                            '&:hover': {
                                background: state.isChatOpen
                                    ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
                                    : alpha(theme.palette.action.hover, 0.1)
                            }
                        }}
                    >
                        <AutoFixHigh fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* More Options */}
            <Tooltip title="Plus d'options">
                <IconButton size="small" onClick={(e) => setMoreAnchor(e.currentTarget)}>
                    <MoreVert fontSize="small" />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={moreAnchor}
                open={Boolean(moreAnchor)}
                onClose={() => setMoreAnchor(null)}
                PaperProps={{
                    sx: { minWidth: 200, mt: 1 }
                }}
            >
                <MenuItem onClick={() => { handleCopy(); setMoreAnchor(null); }}>
                    <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                    <ListItemText>Copier</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { handleCut(); setMoreAnchor(null); }}>
                    <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                    <ListItemText>Couper</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { handlePaste(); setMoreAnchor(null); }}>
                    <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                    <ListItemText>Coller</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => { handleSave(); setMoreAnchor(null); }}>
                    <ListItemIcon><SaveAlt fontSize="small" /></ListItemIcon>
                    <ListItemText>Enregistrer</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { handlePrint(); setMoreAnchor(null); }}>
                    <ListItemIcon><Print fontSize="small" /></ListItemIcon>
                    <ListItemText>Imprimer</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );
}

export default Toolbar;
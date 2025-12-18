// src/components/Popups/ContextMenu.jsx
import React, { useState } from 'react';
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    Box,
    useTheme,
    alpha
} from '@mui/material';
import {
    ContentCopy as CopyIcon,
    ContentCut as CutIcon,
    ContentPaste as PasteIcon,
    Spellcheck as SpellcheckIcon,
    Translate as TranslateIcon,
    AutoFixHigh as AutoFixIcon,
    FormatQuote as QuoteIcon,
    TextFields as TextFieldsIcon,
    Psychology as PsychologyIcon,
    Summarize as SummarizeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor } from '../../contexts/EditorContext';

const ContextMenu = ({
    open = false,
    position = null,
    onClose,
    selectedText = '',
    onAction
}) => {
    const theme = useTheme();
    const { dispatch } = useEditor();

    const handleAction = (action) => {
        if (onAction) {
            onAction(action, selectedText);
        }
        if (onClose) {
            onClose();
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(selectedText);
            handleAction('copy');
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const handleCut = async () => {
        try {
            await navigator.clipboard.writeText(selectedText);
            handleAction('cut');
        } catch (err) {
            console.error('Cut failed:', err);
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            handleAction('paste', text);
        } catch (err) {
            console.error('Paste failed:', err);
        }
    };

    const menuItems = [
        {
            id: 'copy',
            label: 'Copier',
            icon: <CopyIcon fontSize="small" />,
            action: handleCopy,
            disabled: !selectedText,
            shortcut: 'Ctrl+C'
        },
        {
            id: 'cut',
            label: 'Couper',
            icon: <CutIcon fontSize="small" />,
            action: handleCut,
            disabled: !selectedText,
            shortcut: 'Ctrl+X'
        },
        {
            id: 'paste',
            label: 'Coller',
            icon: <PasteIcon fontSize="small" />,
            action: handlePaste,
            shortcut: 'Ctrl+V'
        },
        { divider: true },
        {
            id: 'spellcheck',
            label: 'Vérifier l\'orthographe',
            icon: <SpellcheckIcon fontSize="small" />,
            action: () => handleAction('spellcheck'),
            disabled: !selectedText
        },
        {
            id: 'translate',
            label: 'Traduire',
            icon: <TranslateIcon fontSize="small" />,
            action: () => handleAction('translate'),
            disabled: !selectedText
        },
        {
            id: 'improve',
            label: 'Améliorer le texte',
            icon: <AutoFixIcon fontSize="small" />,
            action: () => handleAction('improve'),
            disabled: !selectedText
        },
        { divider: true },
        {
            id: 'summarize',
            label: 'Résumer',
            icon: <SummarizeIcon fontSize="small" />,
            action: () => handleAction('summarize'),
            disabled: !selectedText || selectedText.length < 50
        },
        {
            id: 'analyze',
            label: 'Analyser le sentiment',
            icon: <PsychologyIcon fontSize="small" />,
            action: () => handleAction('analyze'),
            disabled: !selectedText
        },
        { divider: true },
        {
            id: 'uppercase',
            label: 'MAJUSCULES',
            icon: <TextFieldsIcon fontSize="small" />,
            action: () => handleAction('uppercase'),
            disabled: !selectedText
        },
        {
            id: 'lowercase',
            label: 'minuscules',
            icon: <TextFieldsIcon fontSize="small" sx={{ transform: 'scaleY(-1)' }} />,
            action: () => handleAction('lowercase'),
            disabled: !selectedText
        },
        {
            id: 'quote',
            label: 'Mettre entre guillemets',
            icon: <QuoteIcon fontSize="small" />,
            action: () => handleAction('quote'),
            disabled: !selectedText
        }
    ];

    // Valeur par défaut sécurisée pour anchorPosition
    const safePosition = position && position.x !== undefined && position.y !== undefined
        ? { top: position.y, left: position.x }
        : { top: 0, left: 0 };

    // Ne rendre que si open est vrai ET position est valide
    if (!open || !position) return null;

    return (
        <Menu
            open={open}
            onClose={onClose}
            anchorReference="anchorPosition"
            anchorPosition={safePosition}
            TransitionComponent={motion.div}
            TransitionProps={{
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.9 },
                transition: { duration: 0.15 }
            }}
            PaperProps={{
                elevation: 8,
                sx: {
                    minWidth: 220,
                    borderRadius: 2,
                    overflow: 'hidden',
                    bgcolor: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.95)
                        : theme.palette.background.paper,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    '& .MuiMenuItem-root': {
                        py: 1,
                        px: 2,
                        borderRadius: 1,
                        mx: 0.5,
                        my: 0.25,
                        transition: 'all 0.2s',
                        '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            transform: 'translateX(4px)'
                        }
                    }
                }
            }}
        >
            {/* En-tête avec texte sélectionné */}
            {selectedText && (
                <Box
                    sx={{
                        px: 2,
                        py: 1.5,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        Texte sélectionné :
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            mt: 0.5,
                            fontStyle: 'italic',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        "{selectedText.substring(0, 30)}{selectedText.length > 30 ? '...' : ''}"
                    </Typography>
                </Box>
            )}

            {/* Items du menu */}
            {menuItems.map((item, index) => {
                if (item.divider) {
                    return <Divider key={`divider-${index}`} sx={{ my: 0.5 }} />;
                }

                return (
                    <MenuItem
                        key={item.id}
                        onClick={item.action}
                        disabled={item.disabled}
                        sx={{
                            opacity: item.disabled ? 0.5 : 1
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: item.disabled ? 'text.disabled' : 'primary.main',
                                minWidth: 36
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                                variant: 'body2'
                            }}
                        />
                        {item.shortcut && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ ml: 2 }}
                            >
                                {item.shortcut}
                            </Typography>
                        )}
                    </MenuItem>
                );
            })}
        </Menu>
    );
};

export default ContextMenu;
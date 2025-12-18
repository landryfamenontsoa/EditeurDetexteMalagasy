import React, { useState, useEffect } from 'react';
import {
    Popover,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    Box,
    Divider,
    IconButton,
    Chip,
    CircularProgress,
} from '@mui/material';
import {
    Close,
    CheckCircle,
    Error,
    Lightbulb,
} from '@mui/icons-material';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useSpellCheck } from '../../hooks/useSpellCheck';
import useEditorStore from '../../store/editorStore';

const SpellCheckPopover = ({ anchorEl, word, onClose }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { getSuggestions } = useSpellCheck();
    const { content, setContent } = useEditorStore();

    const open = Boolean(anchorEl);

    useEffect(() => {
        if (word && open) {
            loadSuggestions();
        }
    }, [word, open]);

    const loadSuggestions = async () => {
        setIsLoading(true);
        try {
            const result = await getSuggestions(word);
            setSuggestions(result);
        } catch (error) {
            console.error('Error loading suggestions:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReplace = (suggestion) => {
        if (!content || !word) return;

        // Remplacer le mot dans le contenu
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        const newContent = content.replace(regex, suggestion);
        setContent(newContent);
        onClose();
    };

    const handleIgnore = () => {
        // Ajouter au dictionnaire personnel (à implémenter)
        onClose();
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            PaperProps={{
                component: motion.div,
                initial: { opacity: 0, y: -10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -10 },
                transition: { duration: 0.2 },
            }}
        >
            <Paper sx={{ width: 320, maxHeight: 400 }}>
                {/* Header */}
                <Box
                    sx={{
                        p: 2,
                        bgcolor: 'error.light',
                        color: 'error.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Error fontSize="small" />
                        <Typography variant="subtitle2">Erreur orthographique</Typography>
                    </Box>
                    <IconButton size="small" onClick={onClose} sx={{ color: 'inherit' }}>
                        <Close fontSize="small" />
                    </IconButton>
                </Box>

                {/* Mot avec erreur */}
                <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                        Mot incorrect :
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            color: 'error.main',
                            textDecoration: 'line-through',
                        }}
                    >
                        {word}
                    </Typography>
                </Box>

                <Divider />

                {/* Suggestions */}
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Lightbulb fontSize="small" color="primary" />
                        <Typography variant="subtitle2">Suggestions :</Typography>
                    </Box>

                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : suggestions.length > 0 ? (
                        <List dense disablePadding>
                            {suggestions.map((suggestion, index) => (
                                <ListItem key={index} disablePadding>
                                    <ListItemButton
                                        onClick={() => handleReplace(suggestion.word)}
                                        sx={{
                                            borderRadius: 1,
                                            mb: 0.5,
                                            '&:hover': {
                                                bgcolor: 'primary.light',
                                                color: 'primary.contrastText',
                                            },
                                        }}
                                    >
                                        <ListItemText
                                            primary={suggestion.word}
                                            secondary={
                                                suggestion.similarity && (
                                                    <Chip
                                                        label={`${(suggestion.similarity * 100).toFixed(0)}% similaire`}
                                                        size="small"
                                                        sx={{ mt: 0.5 }}
                                                    />
                                                )
                                            }
                                            primaryTypographyProps={{
                                                fontWeight: 500,
                                            }}
                                        />
                                        <CheckCircle fontSize="small" color="success" />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                            Aucune suggestion disponible
                        </Typography>
                    )}
                </Box>

                <Divider />

                {/* Actions */}
                <Box sx={{ p: 1.5, display: 'flex', gap: 1 }}>
                    <ListItemButton
                        onClick={handleIgnore}
                        sx={{
                            borderRadius: 1,
                            flex: 1,
                            justifyContent: 'center',
                            border: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <Typography variant="caption">Ignorer</Typography>
                    </ListItemButton>
                    <ListItemButton
                        onClick={() => {
                            // Ajouter au dictionnaire
                            handleIgnore();
                        }}
                        sx={{
                            borderRadius: 1,
                            flex: 1,
                            justifyContent: 'center',
                            border: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <Typography variant="caption">Ajouter au dico</Typography>
                    </ListItemButton>
                </Box>
            </Paper>
        </Popover>
    );
};

export default SpellCheckPopover;
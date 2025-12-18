import React, { useEffect, useState } from 'react';
import {
    Popper,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
    Box,
    Chip,
    ClickAwayListener,
} from '@mui/material';
import { AutoAwesome, TrendingUp } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const AutocompleteDropdown = ({ anchorEl, predictions, onSelect, onClose }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const open = Boolean(anchorEl) && predictions && predictions.length > 0;

    useEffect(() => {
        setSelectedIndex(0);
    }, [predictions]);

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev < predictions.length - 1 ? prev + 1 : prev
                    );
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (predictions[selectedIndex]) {
                        onSelect(predictions[selectedIndex]);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    onClose();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, selectedIndex, predictions, onSelect, onClose]);

    if (!open) return null;

    return (
        <Popper
            open={open}
            anchorEl={anchorEl}
            placement="bottom-start"
            style={{ zIndex: 1300 }}
            modifiers={[
                {
                    name: 'offset',
                    options: {
                        offset: [0, 8],
                    },
                },
            ]}
        >
            <ClickAwayListener onClickAway={onClose}>
                <Paper
                    component={motion.div}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    sx={{
                        width: 300,
                        maxHeight: 300,
                        overflow: 'auto',
                        boxShadow: 3,
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            p: 1.5,
                            bgcolor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <AutoAwesome fontSize="small" />
                        <Typography variant="caption" fontWeight={600}>
                            Suggestions automatiques
                        </Typography>
                    </Box>

                    {/* Liste des prédictions */}
                    <List dense disablePadding>
                        <AnimatePresence>
                            {predictions.map((prediction, index) => (
                                <ListItem
                                    key={index}
                                    disablePadding
                                    component={motion.div}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <ListItemButton
                                        selected={index === selectedIndex}
                                        onClick={() => onSelect(prediction)}
                                        sx={{
                                            '&.Mui-selected': {
                                                bgcolor: 'primary.light',
                                                color: 'primary.contrastText',
                                                '&:hover': {
                                                    bgcolor: 'primary.main',
                                                },
                                            },
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        {prediction.word}
                                                    </Typography>
                                                    {prediction.probability && (
                                                        <Chip
                                                            label={`${(prediction.probability * 100).toFixed(0)}%`}
                                                            size="small"
                                                            color={index === selectedIndex ? 'default' : 'primary'}
                                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            secondary={prediction.context}
                                            secondaryTypographyProps={{
                                                variant: 'caption',
                                                sx: {
                                                    color: index === selectedIndex ? 'inherit' : 'text.secondary',
                                                    opacity: 0.8,
                                                },
                                            }}
                                        />
                                        {prediction.trending && (
                                            <TrendingUp fontSize="small" color="warning" />
                                        )}
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </AnimatePresence>
                    </List>

                    {/* Footer avec raccourcis */}
                    <Box
                        sx={{
                            p: 1,
                            bgcolor: 'grey.50',
                            borderTop: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            <kbd>↑↓</kbd> Naviguer • <kbd>Enter</kbd> Sélectionner • <kbd>Esc</kbd> Fermer
                        </Typography>
                    </Box>
                </Paper>
            </ClickAwayListener>
        </Popper>
    );
};

export default AutocompleteDropdown;
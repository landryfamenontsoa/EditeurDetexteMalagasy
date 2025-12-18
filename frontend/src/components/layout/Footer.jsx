// src/components/Layout/Footer.jsx
import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Chip,
    useTheme,
    alpha
} from '@mui/material';
import {
    CheckCircle,
    Error,
    Warning,
    Sync
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor } from '../../contexts/EditorContext';

export function Footer() {
    const theme = useTheme();
    const { state } = useEditor();

    const getStatusIcon = () => {
        if (state.isLoading) {
            return (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                    <Sync fontSize="small" sx={{ color: theme.palette.primary.main }} />
                </motion.div>
            );
        }

        const errorCount = state.spellErrors.length + state.grammarErrors.length;
        if (errorCount === 0) {
            return <CheckCircle fontSize="small" sx={{ color: theme.palette.success.main }} />;
        }
        if (errorCount <= 5) {
            return <Warning fontSize="small" sx={{ color: theme.palette.warning.main }} />;
        }
        return <Error fontSize="small" sx={{ color: theme.palette.error.main }} />;
    };

    const getStatusText = () => {
        if (state.isLoading) return 'Analyse en cours...';

        const errorCount = state.spellErrors.length + state.grammarErrors.length;
        if (errorCount === 0) return 'Aucune erreur détectée';
        return `${errorCount} erreur${errorCount > 1 ? 's' : ''} détectée${errorCount > 1 ? 's' : ''}`;
    };

    return (
        <Box
            component="footer"
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: 36,
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
                borderTop: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                zIndex: 1000
            }}
        >
            {/* Left - Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getStatusIcon()}
                <Typography variant="caption" color="text.secondary">
                    {getStatusText()}
                </Typography>
            </Box>

            {/* Center - Quick Stats */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AnimatePresence mode="wait">
                    {state.spellErrors.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <Chip
                                size="small"
                                label={`${state.spellErrors.length} orthographe`}
                                sx={{
                                    height: 22,
                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                    color: theme.palette.error.main,
                                    fontSize: '0.7rem'
                                }}
                            />
                        </motion.div>
                    )}
                    {state.grammarErrors.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <Chip
                                size="small"
                                label={`${state.grammarErrors.length} grammaire`}
                                sx={{
                                    height: 22,
                                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                                    color: theme.palette.warning.main,
                                    fontSize: '0.7rem'
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>

            {/* Right - Position */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    Ln {state.cursorPosition?.line || 1}, Col {state.cursorPosition?.column || 1}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {state.language.toUpperCase()}
                </Typography>
            </Box>
        </Box>
    );
}

export default Footer;
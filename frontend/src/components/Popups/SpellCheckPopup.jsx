// src/components/Popups/SpellCheckPopup.jsx
import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Chip,
    Button,
    Fade,
    Popper,
    useTheme,
    alpha
} from '@mui/material';
import {
    Close as CloseIcon,
    CheckCircle as CheckIcon,
    AutoFixHigh as AutoFixIcon,
    Lightbulb as LightbulbIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

export function SpellCheckPopup({
    word,
    suggestion,
    confidence,
    position,
    onAccept,
    onIgnore,
    onClose,
    anchorEl
}) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    // Nettoyer la suggestion
    const cleanSuggestion = suggestion?.replace(/[",]/g, '').trim();

    useEffect(() => {
        setOpen(Boolean(word && suggestion && anchorEl));
    }, [word, suggestion, anchorEl]);

    const handleAccept = () => {
        if (onAccept) {
            onAccept(cleanSuggestion);
        }
        setOpen(false);
    };

    const handleIgnore = () => {
        if (onIgnore) {
            onIgnore(word);
        }
        setOpen(false);
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
        setOpen(false);
    };

    if (!word || !cleanSuggestion) return null;

    return (
        <Popper
            open={open}
            anchorEl={anchorEl}
            placement="bottom-start"
            transition
            style={{ zIndex: 9999 }}
            modifiers={[
                {
                    name: 'offset',
                    enabled: true,
                    options: {
                        offset: [0, 8],
                    },
                },
                {
                    name: 'preventOverflow',
                    enabled: true,
                    options: {
                        boundary: 'viewport',
                        padding: 8
                    }
                }
            ]}
        >
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={200}>
                    <Paper
                        elevation={8}
                        sx={{
                            minWidth: 250,
                            maxWidth: 350,
                            borderRadius: 3,
                            overflow: 'hidden',
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            bgcolor: theme.palette.mode === 'dark'
                                ? alpha(theme.palette.background.paper, 0.98)
                                : theme.palette.background.paper,
                            backdropFilter: 'blur(20px)'
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Header */}
                            <Box
                                sx={{
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)}, ${alpha(theme.palette.error.light, 0.05)})`,
                                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    px: 2,
                                    py: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LightbulbIcon
                                        sx={{
                                            color: theme.palette.warning.main,
                                            fontSize: 20
                                        }}
                                    />
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        Suggestion orthographique
                                    </Typography>
                                </Box>
                                <IconButton
                                    size="small"
                                    onClick={handleClose}
                                    sx={{
                                        p: 0.5,
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.error.main, 0.1),
                                            color: theme.palette.error.main
                                        }
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            {/* Content */}
                            <Box sx={{ p: 2 }}>
                                {/* Mot original */}
                                <Box sx={{ mb: 2 }}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: 'block', mb: 0.5 }}
                                    >
                                        Mot saisi :
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'inline-block',
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 2,
                                            bgcolor: alpha(theme.palette.error.main, 0.1),
                                            border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: theme.palette.error.main,
                                                fontWeight: 500,
                                                textDecoration: 'line-through'
                                            }}
                                        >
                                            {word}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Suggestion avec flèche */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        mb: 2
                                    }}
                                >
                                    <motion.div
                                        animate={{ x: [0, 10, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <Typography sx={{ color: theme.palette.text.secondary }}>
                                            →
                                        </Typography>
                                    </motion.div>
                                    <Box>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ display: 'block', mb: 0.5 }}
                                        >
                                            Suggestion :
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'inline-block',
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                                border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: theme.palette.success.main,
                                                    fontWeight: 600,
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                {cleanSuggestion}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Niveau de confiance */}
                                {confidence !== undefined && (
                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Confiance :
                                            </Typography>
                                            <Chip
                                                size="small"
                                                label={`${Math.round(confidence)}%`}
                                                color={confidence > 70 ? 'success' : confidence > 40 ? 'warning' : 'default'}
                                                sx={{ height: 20, fontSize: '0.7rem' }}
                                            />
                                        </Box>
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: 4,
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.grey[300], 0.3),
                                                mt: 1,
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${confidence}%` }}
                                                transition={{ duration: 0.5 }}
                                                style={{
                                                    height: '100%',
                                                    background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
                                                    borderRadius: 2
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                )}

                                {/* Actions */}
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="small"
                                        startIcon={<CheckIcon />}
                                        onClick={handleAccept}
                                        sx={{
                                            background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
                                            boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.3)}`,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            '&:hover': {
                                                background: `linear-gradient(135deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`
                                            }
                                        }}
                                    >
                                        Accepter
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        onClick={handleIgnore}
                                        sx={{
                                            textTransform: 'none',
                                            borderColor: alpha(theme.palette.divider, 0.3),
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.grey[500], 0.05)
                                            }
                                        }}
                                    >
                                        Ignorer
                                    </Button>
                                </Box>
                            </Box>
                        </motion.div>
                    </Paper>
                </Fade>
            )}
        </Popper>
    );
}

export default SpellCheckPopup;
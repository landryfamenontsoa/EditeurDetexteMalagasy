// src/components/Popups/SuggestionTooltip.jsx
import React from 'react';
import {
    Paper,
    Typography,
    IconButton,
    Box,
    Divider,
    useTheme,
    alpha
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const SuggestionTooltip = ({ word, suggestion, confidence, onAccept, onIgnore }) => {
    const theme = useTheme();

    // Formater le niveau de confiance
    const confidencePercent = Math.round(confidence * 100);

    // Déterminer la couleur de soulignement en fonction du niveau de confiance
    const getUnderlineColor = () => {
        if (confidencePercent >= 80) return theme.palette.success.main;
        if (confidencePercent >= 50) return theme.palette.warning.main;
        return theme.palette.error.main;
    };

    return (
        <Paper
            elevation={2}
            sx={{
                maxWidth: 200,
                borderRadius: 1,
                overflow: 'hidden',
                border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                boxShadow: `0 2px 6px ${alpha(theme.palette.common.black, 0.1)}`
            }}
        >
            {/* Suggestion */}
            <Box
                sx={{
                    p: 0.75,
                    pl: 1.5,
                    pr: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `2px solid ${getUnderlineColor()}`
                }}
            >
                <Typography
                    variant="body2"
                    fontWeight="medium"
                    sx={{
                        fontSize: '0.85rem',
                        color: theme.palette.text.primary
                    }}
                >
                    {suggestion}
                </Typography>

                <IconButton
                    size="small"
                    onClick={() => onAccept(suggestion)}
                    sx={{
                        p: 0.5,
                        ml: 0.5,
                        color: theme.palette.primary.main,
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1)
                        }
                    }}
                >
                    <CheckIcon fontSize="small" sx={{ fontSize: '1rem' }} />
                </IconButton>
            </Box>

            {/* Séparateur */}
            <Divider sx={{ m: 0 }} />

            {/* Bouton ignorer */}
            <Box
                sx={{
                    p: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    backgroundColor: alpha(theme.palette.background.default, 0.6)
                }}
            >
                <IconButton
                    size="small"
                    onClick={onIgnore}
                    sx={{
                        p: 0.5,
                        color: theme.palette.text.secondary,
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.action.hover, 0.1)
                        }
                    }}
                >
                    <CloseIcon fontSize="small" sx={{ fontSize: '0.9rem' }} />
                </IconButton>
            </Box>
        </Paper>
    );
};

export default SuggestionTooltip;
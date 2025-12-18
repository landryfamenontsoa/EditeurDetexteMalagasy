// src/components/Popups/SuggestionTooltip.jsx
import React from 'react';
import {
    Paper,
    Typography,
    IconButton,
    Box,
    useTheme,
    alpha
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const SuggestionTooltip = ({ word, suggestion, confidence, onAccept, onIgnore }) => {
    const theme = useTheme();

    // Formater le niveau de confiance
    const confidencePercent = Math.round(confidence * 100);

    // Déterminer la couleur en fonction du niveau de confiance
    const getConfidenceColor = () => {
        if (confidencePercent >= 80) return theme.palette.success.main;
        if (confidencePercent >= 50) return theme.palette.warning.main;
        return theme.palette.error.main;
    };

    return (
        <Paper
            elevation={2}
            sx={{
                mt: 20,
                ml: 50,
                width: 180,
                borderRadius: 1,
                overflow: 'hidden',
                border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                boxShadow: `0 2px 6px ${alpha(theme.palette.common.black, 0.1)}`
            }}
        >
            {/* Suggestion centrée */}
            <Box
                sx={{
                    py: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: `2px solid ${getConfidenceColor()}`
                }}
            >
                <Typography
                    variant="body2"
                    fontWeight="medium"
                    sx={{
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        color: theme.palette.text.primary
                    }}
                >
                    {suggestion}
                </Typography>
            </Box>

            {/* Boutons d'action */}
            <Box
                sx={{
                    py: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(theme.palette.background.default, 0.4)
                }}
            >
                <IconButton
                    size="small"
                    onClick={() => onAccept(suggestion)}
                    sx={{
                        p: 0.5,
                        mx: 1,
                        color: theme.palette.success.main
                    }}
                    aria-label="Accepter la suggestion"
                >
                    <CheckIcon fontSize="small" />
                </IconButton>

                <IconButton
                    size="small"
                    onClick={onIgnore}
                    sx={{
                        p: 0.5,
                        mx: 1,
                        color: theme.palette.grey[600]
                    }}
                    aria-label="Ignorer la suggestion"
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
        </Paper>
    );
};

export default SuggestionTooltip;
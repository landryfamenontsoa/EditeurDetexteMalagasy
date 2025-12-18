import React, { useState, useEffect } from 'react';
import {
    Popover,
    Paper,
    Box,
    Typography,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    IconButton,
} from '@mui/material';
import { Close, AccountTree } from '@mui/icons-material';
import { Icon } from '@iconify/react';

const LemmatizationPopover = ({ anchorEl, word, onClose }) => {
    const [lemma, setLemma] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const open = Boolean(anchorEl);

    useEffect(() => {
        if (word && open) {
            loadLemma();
        }
    }, [word, open]);

    const loadLemma = async () => {
        setIsLoading(true);
        try {
            // const result = await lemmatizationAPI.lemmatize(word);
            // setLemma(result);
        } catch (error) {
            console.error('Lemmatization error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <Paper sx={{ width: 320 }}>
                {/* Header */}
                <Box
                    sx={{
                        p: 2,
                        bgcolor: 'success.light',
                        color: 'success.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Icon icon="mdi:book-alphabet" width="20" />
                        <Typography variant="subtitle2">Lemmatisation</Typography>
                    </Box>
                    <IconButton size="small" onClick={onClose} sx={{ color: 'inherit' }}>
                        <Close fontSize="small" />
                    </IconButton>
                </Box>

                <Box sx={{ p: 2 }}>
                    {/* Mot original */}
                    <Typography variant="caption" color="text.secondary">
                        Mot analysé :
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        {word}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : lemma ? (
                        <>
                            {/* Racine */}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Racine (Lemme) :
                                </Typography>
                                <Typography variant="h5" fontWeight={600} color="primary">
                                    {lemma.root}
                                </Typography>
                            </Box>

                            {/* Affixes */}
                            {(lemma.prefixes || lemma.suffixes) && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary" gutterBottom>
                                        Affixes détectés :
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                                        {lemma.prefixes?.map((prefix, index) => (
                                            <Chip
                                                key={`prefix-${index}`}
                                                label={`Préfixe: ${prefix}`}
                                                size="small"
                                                color="info"
                                                variant="outlined"
                                            />
                                        ))}
                                        {lemma.suffixes?.map((suffix, index) => (
                                            <Chip
                                                key={`suffix-${index}`}
                                                label={`Suffixe: ${suffix}`}
                                                size="small"
                                                color="warning"
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Structure */}
                            {lemma.structure && (
                                <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                                    <Typography variant="caption" color="text.secondary" gutterBottom>
                                        Structure morphologique :
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        {lemma.structure}
                                    </Typography>
                                </Box>
                            )}
                        </>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Impossible d'analyser ce mot
                        </Typography>
                    )}
                </Box>
            </Paper>
        </Popover>
    );
};

export default LemmatizationPopover;
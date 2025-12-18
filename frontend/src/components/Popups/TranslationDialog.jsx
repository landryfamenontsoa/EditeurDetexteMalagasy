import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Chip,
    IconButton,
    Divider,
    Paper,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import {
    Close,
    Translate,
    SwapHoriz,
    ContentCopy,
    VolumeUp,
} from '@mui/icons-material';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

const TranslationDialog = ({ open, onClose, word, translation }) => {
    const [sourceLang, setSourceLang] = useState('mg');
    const [targetLang, setTargetLang] = useState('fr');

    const handleSwapLanguages = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                component: motion.div,
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.9 },
            }}
        >
            {/* Header */}
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Translate />
                        <Typography variant="h6">Traduction</Typography>
                    </Box>
                    <IconButton onClick={onClose} sx={{ color: 'white' }}>
                        <Close />
                    </IconButton>
                </Box>

                {/* Sélecteur de langues */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                    <Chip
                        label="Malagasy"
                        icon={<Icon icon="twemoji:flag-madagascar" width="20" />}
                        color={sourceLang === 'mg' ? 'secondary' : 'default'}
                        sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}
                    />
                    <IconButton onClick={handleSwapLanguages} sx={{ color: 'white' }} size="small">
                        <SwapHoriz />
                    </IconButton>
                    <Chip
                        label="Français"
                        icon={<Icon icon="twemoji:flag-france" width="20" />}
                        color={targetLang === 'fr' ? 'secondary' : 'default'}
                        sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}
                    />
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                {/* Mot source */}
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                        Texte original :
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h5" fontWeight={600}>
                            {word}
                        </Typography>
                        <Box>
                            <IconButton size="small" onClick={() => handleCopy(word)}>
                                <ContentCopy fontSize="small" />
                            </IconButton>
                            <IconButton size="small">
                                <VolumeUp fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </Paper>

                <Divider sx={{ my: 2 }} />

                {/* Traduction */}
                {translation ? (
                    <>
                        <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                            <Typography variant="caption" gutterBottom sx={{ opacity: 0.8 }}>
                                Traduction :
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h5" fontWeight={600}>
                                    {translation.translation}
                                </Typography>
                                <Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleCopy(translation.translation)}
                                        sx={{ color: 'inherit' }}
                                    >
                                        <ContentCopy fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" sx={{ color: 'inherit' }}>
                                        <VolumeUp fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Paper>

                        {/* Définitions */}
                        {translation.definitions && translation.definitions.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Définitions :
                                </Typography>
                                <List dense>
                                    {translation.definitions.map((def, index) => (
                                        <ListItem key={index} sx={{ pl: 0 }}>
                                            <ListItemText
                                                primary={`${index + 1}. ${def}`}
                                                primaryTypographyProps={{ variant: 'body2' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}

                        {/* Exemples */}
                        {translation.examples && translation.examples.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Exemples :
                                </Typography>
                                <List dense>
                                    {translation.examples.map((example, index) => (
                                        <ListItem key={index} sx={{ pl: 0 }}>
                                            <Paper sx={{ p: 1.5, width: '100%', bgcolor: 'grey.50' }}>
                                                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                                    {example}
                                                </Typography>
                                            </Paper>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}

                        {/* Synonymes */}
                        {translation.synonyms && translation.synonyms.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Synonymes :
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {translation.synonyms.map((synonym, index) => (
                                        <Chip key={index} label={synonym} size="small" variant="outlined" />
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Fermer</Button>
                <Button variant="contained" onClick={() => handleCopy(translation?.translation)}>
                    Copier la traduction
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TranslationDialog;
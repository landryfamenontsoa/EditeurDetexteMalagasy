import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    LinearProgress,
    Chip,
    Paper,
    IconButton,
} from '@mui/material';
import {
    Close,
    SentimentVerySatisfied,
    SentimentVeryDissatisfied,
    SentimentNeutral,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const SentimentDialog = ({ open, onClose, sentiment }) => {
    const getSentimentIcon = () => {
        if (!sentiment) return <SentimentNeutral />;
        if (sentiment.score > 0.3) return <SentimentVerySatisfied />;
        if (sentiment.score < -0.3) return <SentimentVeryDissatisfied />;
        return <SentimentNeutral />;
    };

    const getSentimentColor = () => {
        if (!sentiment) return 'grey';
        if (sentiment.score > 0.3) return 'success';
        if (sentiment.score < -0.3) return 'error';
        return 'warning';
    };

    const getSentimentLabel = () => {
        if (!sentiment) return 'Neutre';
        if (sentiment.score > 0.5) return 'Très positif';
        if (sentiment.score > 0.2) return 'Positif';
        if (sentiment.score < -0.5) return 'Très négatif';
        if (sentiment.score < -0.2) return 'Négatif';
        return 'Neutre';
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: `${getSentimentColor()}.light`, color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getSentimentIcon()}
                        <Typography variant="h6">Analyse de sentiment</Typography>
                    </Box>
                    <IconButton onClick={onClose} sx={{ color: 'white' }}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                {sentiment && (
                    <Box>
                        {/* Score principal */}
                        <Paper sx={{ p: 3, mb: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                            <Typography variant="h3" fontWeight={600} color={`${getSentimentColor()}.main`}>
                                {(sentiment.score * 100).toFixed(0)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Score de sentiment
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Chip
                                    label={getSentimentLabel()}
                                    color={getSentimentColor()}
                                    sx={{ fontWeight: 600 }}
                                />
                            </Box>
                        </Paper>

                        {/* Barre de progression */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption">Négatif</Typography>
                                <Typography variant="caption">Neutre</Typography>
                                <Typography variant="caption">Positif</Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={((sentiment.score + 1) / 2) * 100}
                                color={getSentimentColor()}
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                        </Box>

                        {/* Détails */}
                        {sentiment.details && (
                            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Détails de l'analyse :
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2">Mots positifs :</Typography>
                                        <Typography variant="body2" fontWeight={600} color="success.main">
                                            {sentiment.details.positiveWords || 0}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2">Mots négatifs :</Typography>
                                        <Typography variant="body2" fontWeight={600} color="error.main">
                                            {sentiment.details.negativeWords || 0}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2">Mots neutres :</Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            {sentiment.details.neutralWords || 0}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Fermer</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SentimentDialog;
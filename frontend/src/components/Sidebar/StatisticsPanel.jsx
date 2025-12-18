import React, { useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    LinearProgress,
    Divider,
} from '@mui/material';
import { Icon } from '@iconify/react';
import useEditorStore from '../../store/editorStore';

const StatCard = ({ icon, label, value, color = 'primary.main' }) => (
    <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Icon icon={icon} width="24" style={{ marginRight: 8, color }} />
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {value}
        </Typography>
    </Paper>
);

const StatisticsPanel = () => {
    const { content, spellErrors } = useEditorStore();

    const stats = useMemo(() => {
        const words = content.split(/\s+/).filter(Boolean);
        const chars = content.length;
        const charsNoSpaces = content.replace(/\s/g, '').length;
        const sentences = content.split(/[.!?]+/).filter(Boolean).length;
        const paragraphs = content.split(/\n\n+/).filter(Boolean).length;

        const avgWordLength = words.length > 0
            ? (charsNoSpaces / words.length).toFixed(1)
            : 0;

        const readingTime = Math.ceil(words.length / 200); // 200 mots/min

        return {
            words: words.length,
            chars,
            charsNoSpaces,
            sentences,
            paragraphs,
            avgWordLength,
            readingTime,
            errorCount: spellErrors.length,
            errorRate: words.length > 0
                ? ((spellErrors.length / words.length) * 100).toFixed(1)
                : 0,
        };
    }, [content, spellErrors]);

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                Statistiques du document
            </Typography>

            <StatCard
                icon="mdi:text"
                label="Mots"
                value={stats.words}
                color="#1976d2"
            />

            <StatCard
                icon="mdi:format-letter-case"
                label="Caractères"
                value={stats.chars}
                color="#2e7d32"
            />

            <StatCard
                icon="mdi:format-paragraph"
                label="Paragraphes"
                value={stats.paragraphs}
                color="#ed6c02"
            />

            <StatCard
                icon="mdi:format-text"
                label="Phrases"
                value={stats.sentences}
                color="#9c27b0"
            />

            <Divider sx={{ my: 2 }} />

            <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                    Temps de lecture estimé
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {stats.readingTime} min
                </Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                    Longueur moyenne des mots
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {stats.avgWordLength} caractères
                </Typography>
            </Paper>

            <Divider sx={{ my: 2 }} />

            <Paper sx={{ p: 2, bgcolor: stats.errorCount > 0 ? 'error.light' : 'success.light' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" fontWeight={600}>
                        Erreurs détectées
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                        {stats.errorCount}
                    </Typography>
                </Box>

                <LinearProgress
                    variant="determinate"
                    value={Math.min(parseFloat(stats.errorRate), 100)}
                    color={stats.errorRate > 5 ? 'error' : 'success'}
                    sx={{ mb: 1 }}
                />

                <Typography variant="caption" color="text.secondary">
                    Taux d'erreur: {stats.errorRate}%
                </Typography>
            </Paper>
        </Box>
    );
};

export default StatisticsPanel;
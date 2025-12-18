// src/components/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    IconButton,
    useTheme,
    alpha,
    Chip,
    LinearProgress
} from '@mui/material';
import {
    Spellcheck,
    Lightbulb,
    Psychology,
    Translate,
    Close,
    ExpandMore,
    ExpandLess
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor } from '../../contexts/EditorContext';
import Suggestions from './Suggestions';

function TabPanel({ children, value, index, ...other }) {
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`sidebar-tabpanel-${index}`}
            {...other}
            sx={{ flex: 1, overflow: 'auto', p: 2 }}
        >
            {value === index && children}
        </Box>
    );
}

export function Sidebar({ onClose }) {
    const theme = useTheme();
    const { state, setActiveTab, setSidebarOpen } = useEditor();
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        const tabs = ['corrections', 'suggestions', 'sentiment', 'translate'];
        setActiveTab(tabs[newValue]);
    };

    const handleClose = () => {
        setSidebarOpen(false);
        onClose?.();
    };

    const errorCount = state.spellErrors.length + state.grammarErrors.length;

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: theme.palette.background.paper,
                borderLeft: `1px solid ${theme.palette.divider}`
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`
                }}
            >
                <Typography variant="h6" fontWeight={600}>
                    Assistant
                </Typography>
                <IconButton size="small" onClick={handleClose}>
                    <Close fontSize="small" />
                </IconButton>
            </Box>

            {/* Tabs */}
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '& .MuiTab-root': {
                        minHeight: 56,
                        textTransform: 'none',
                        fontWeight: 500
                    }
                }}
            >
                <Tab
                    icon={
                        <Badge count={errorCount}>
                            <Spellcheck fontSize="small" />
                        </Badge>
                    }
                    label="Corrections"
                    iconPosition="start"
                />
                <Tab
                    icon={<Lightbulb fontSize="small" />}
                    label="Suggestions"
                    iconPosition="start"
                />
                <Tab
                    icon={<Psychology fontSize="small" />}
                    label="Analyse"
                    iconPosition="start"
                />
                <Tab
                    icon={<Translate fontSize="small" />}
                    label="Traduction"
                    iconPosition="start"
                />
            </Tabs>

            {/* Loading indicator */}
            {state.isLoading && (
                <LinearProgress sx={{ height: 2 }} />
            )}

            {/* Tab Panels */}
            <TabPanel value={tabValue} index={0}>
                <CorrectionsPanel />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <Suggestions />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <AnalysisPanel />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
                <TranslationPanel />
            </TabPanel>
        </Box>
    );
}

// Badge component for tab
function Badge({ count, children }) {
    const theme = useTheme();

    if (!count || count === 0) return children;

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            {children}
            <Box
                sx={{
                    position: 'absolute',
                    top: -4,
                    right: -8,
                    minWidth: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: theme.palette.error.main,
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {count > 99 ? '99+' : count}
            </Box>
        </Box>
    );
}

// Corrections Panel
function CorrectionsPanel() {
    const theme = useTheme();
    const { state, setContent } = useEditor();
    const [expandedError, setExpandedError] = useState(null);

    const allErrors = [...state.spellErrors, ...state.grammarErrors];

    const handleApplyCorrection = (error, suggestion) => {
        const newContent = state.content.substring(0, error.position.start) +
            suggestion +
            state.content.substring(error.position.end);
        setContent(newContent, newContent);
    };

    if (allErrors.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 6,
                    textAlign: 'center'
                }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2
                        }}
                    >
                        <Spellcheck sx={{ fontSize: 40, color: theme.palette.success.main }} />
                    </Box>
                </motion.div>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Aucune erreur détectée
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Votre texte semble correct. Continuez ainsi !
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
                {allErrors.length} erreur{allErrors.length > 1 ? 's' : ''} détectée{allErrors.length > 1 ? 's' : ''}
            </Typography>

            <AnimatePresence>
                {allErrors.map((error, index) => (
                    <motion.div
                        key={`${error.word}-${index}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <ErrorCard
                            error={error}
                            expanded={expandedError === index}
                            onToggle={() => setExpandedError(expandedError === index ? null : index)}
                            onApply={(suggestion) => handleApplyCorrection(error, suggestion)}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </Box>
    );
}

// Error Card Component
function ErrorCard({ error, expanded, onToggle, onApply }) {
    const theme = useTheme();
    const isSpelling = error.type === 'spelling';

    return (
        <Box
            sx={{
                bgcolor: alpha(
                    isSpelling ? theme.palette.error.main : theme.palette.warning.main,
                    0.05
                ),
                border: `1px solid ${alpha(
                    isSpelling ? theme.palette.error.main : theme.palette.warning.main,
                    0.2
                )}`,
                borderRadius: 2,
                overflow: 'hidden'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    cursor: 'pointer'
                }}
                onClick={onToggle}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: isSpelling ? theme.palette.error.main : theme.palette.warning.main
                        }}
                    />
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 600,
                                color: isSpelling ? theme.palette.error.main : theme.palette.warning.main
                            }}
                        >
                            {error.word}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {isSpelling ? 'Orthographe' : 'Grammaire'}
                        </Typography>
                    </Box>
                </Box>
                <IconButton size="small">
                    {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </Box>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Box sx={{ px: 2, pb: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                Suggestions :
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {error.suggestions?.map((suggestion, idx) => (
                                    <Chip
                                        key={idx}
                                        label={suggestion}
                                        size="small"
                                        onClick={() => onApply(suggestion)}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                bgcolor: theme.palette.primary.main,
                                                color: '#fff'
                                            }
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
}

// Analysis Panel
function AnalysisPanel() {
    const theme = useTheme();
    const { state } = useEditor();

    const sentimentData = state.sentiment || {
        label: 'neutral',
        confidence: 0.5
    };

    const getSentimentInfo = (label) => {
        const info = {
            very_positive: { emoji: '😄', text: 'Très positif', color: theme.palette.success.main },
            positive: { emoji: '🙂', text: 'Positif', color: theme.palette.success.light },
            neutral: { emoji: '😐', text: 'Neutre', color: theme.palette.grey[500] },
            negative: { emoji: '😕', text: 'Négatif', color: theme.palette.warning.main },
            very_negative: { emoji: '😢', text: 'Très négatif', color: theme.palette.error.main }
        };
        return info[label] || info.neutral;
    };

    const sentimentInfo = getSentimentInfo(sentimentData.label);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Sentiment Analysis */}
            <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Analyse du sentiment
                </Typography>
                <Box
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: alpha(sentimentInfo.color, 0.1),
                        border: `1px solid ${alpha(sentimentInfo.color, 0.3)}`,
                        textAlign: 'center'
                    }}
                >
                    <Typography sx={{ fontSize: '3rem', mb: 1 }}>
                        {sentimentInfo.emoji}
                    </Typography>
                    <Typography variant="h6" fontWeight={600} sx={{ color: sentimentInfo.color }}>
                        {sentimentInfo.text}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Confiance: {Math.round(sentimentData.confidence * 100)}%
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={sentimentData.confidence * 100}
                        sx={{
                            mt: 2,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: alpha(sentimentInfo.color, 0.2),
                            '& .MuiLinearProgress-bar': {
                                bgcolor: sentimentInfo.color,
                                borderRadius: 3
                            }
                        }}
                    />
                </Box>
            </Box>

            {/* Text Statistics */}
            <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Statistiques du texte
                </Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 2
                    }}
                >
                    <StatCard
                        label="Mots"
                        value={state.stats.words}
                        color={theme.palette.primary.main}
                    />
                    <StatCard
                        label="Caractères"
                        value={state.stats.characters}
                        color={theme.palette.secondary.main}
                    />
                    <StatCard
                        label="Phrases"
                        value={state.stats.sentences}
                        color={theme.palette.success.main}
                    />
                    <StatCard
                        label="Paragraphes"
                        value={state.stats.paragraphs}
                        color={theme.palette.warning.main}
                    />
                </Box>
            </Box>

            {/* Reading Time */}
            <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Temps de lecture estimé
                </Typography>
                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Typography sx={{ fontSize: '2rem' }}>📖</Typography>
                    <Box>
                        <Typography variant="h5" fontWeight={600}>
                            {state.stats.readingTime || 0} min
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            À 200 mots/minute
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

// Stat Card Component
function StatCard({ label, value, color }) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(color, 0.1),
                border: `1px solid ${alpha(color, 0.2)}`
            }}
        >
            <Typography variant="h4" fontWeight={700} sx={{ color }}>
                {value.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
        </Box>
    );
}

// Translation Panel
function TranslationPanel() {
    const theme = useTheme();
    const { state } = useEditor();
    const [targetLang, setTargetLang] = useState('en');
    const [translation, setTranslation] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);

    const languages = [
        { code: 'en', name: 'Anglais', flag: '🇬🇧' },
        { code: 'es', name: 'Espagnol', flag: '🇪🇸' },
        { code: 'de', name: 'Allemand', flag: '🇩🇪' },
        { code: 'it', name: 'Italien', flag: '🇮🇹' },
        { code: 'pt', name: 'Portugais', flag: '🇵🇹' },
        { code: 'ar', name: 'Arabe', flag: '🇸🇦' }
    ];

    const handleTranslate = async () => {
        if (!state.selectedText && !state.content) return;

        setIsTranslating(true);
        try {
            const textToTranslate = state.selectedText || state.content;
            // Call translation API
            const result = await import('../../services/apiService').then(m =>
                m.apiService.translate(textToTranslate, state.language, targetLang)
            );
            setTranslation(result.translated_text || textToTranslate);
        } catch (error) {
            console.error('Translation error:', error);
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Traduire vers
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {languages.map(lang => (
                        <Chip
                            key={lang.code}
                            label={`${lang.flag} ${lang.name}`}
                            onClick={() => setTargetLang(lang.code)}
                            variant={targetLang === lang.code ? 'filled' : 'outlined'}
                            color={targetLang === lang.code ? 'primary' : 'default'}
                            sx={{ cursor: 'pointer' }}
                        />
                    ))}
                </Box>
            </Box>

            <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Texte source
                </Typography>
                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.grey[500], 0.1),
                        border: `1px solid ${theme.palette.divider}`,
                        maxHeight: 150,
                        overflow: 'auto'
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        {state.selectedText || state.content || 'Sélectionnez du texte ou écrivez quelque chose...'}
                    </Typography>
                </Box>
            </Box>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTranslate}
                disabled={isTranslating}
                style={{
                    padding: '12px 24px',
                    borderRadius: 10,
                    border: 'none',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: '#fff',
                    fontWeight: 600,
                    cursor: isTranslating ? 'not-allowed' : 'pointer',
                    opacity: isTranslating ? 0.7 : 1
                }}
            >
                {isTranslating ? 'Traduction en cours...' : 'Traduire'}
            </motion.button>

            {translation && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Traduction
                    </Typography>
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
                        }}
                    >
                        <Typography variant="body2">
                            {translation}
                        </Typography>
                    </Box>
                </motion.div>
            )}
        </Box>
    );
}

export default Sidebar;
// src/components/Sidebar/Suggestions.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Chip,
    IconButton,
    Collapse,
    useTheme,
    alpha,
    Skeleton
} from '@mui/material';
import {
    Lightbulb,
    ContentCopy,
    Check,
    ExpandMore,
    ExpandLess,
    AutoAwesome
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor } from '../../contexts/EditorContext';
import { apiService } from '../../services/apiService';

export function Suggestions() {
    const theme = useTheme();
    const { state, setContent } = useEditor();
    const [suggestions, setSuggestions] = useState([]);
    const [synonyms, setSynonyms] = useState({});
    const [loading, setLoading] = useState(false);
    const [expandedSuggestion, setExpandedSuggestion] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);

    // Fetch suggestions when content changes
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (state.content.length < 20) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                // Generate style suggestions
                const styleSuggestions = generateStyleSuggestions(state.content);
                setSuggestions(styleSuggestions);
            } catch (error) {
                console.error('Failed to fetch suggestions:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 1000);
        return () => clearTimeout(debounceTimer);
    }, [state.content]);

    // Fetch synonyms for selected word
    useEffect(() => {
        const fetchSynonyms = async () => {
            if (!state.selectedText || state.selectedText.includes(' ')) {
                setSynonyms({});
                return;
            }

            try {
                const result = await apiService.getSynonyms(state.selectedText, state.language);
                setSynonyms({ [state.selectedText]: result.synonyms || [] });
            } catch (error) {
                console.error('Failed to fetch synonyms:', error);
            }
        };

        fetchSynonyms();
    }, [state.selectedText, state.language]);

    const handleApplySuggestion = (suggestion) => {
        if (suggestion.replacement && suggestion.original) {
            const newContent = state.content.replace(suggestion.original, suggestion.replacement);
            setContent(newContent, newContent);
        }
    };

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleReplaceSynonym = (original, synonym) => {
        const newContent = state.content.replace(new RegExp(`\\b${original}\\b`, 'gi'), synonym);
        setContent(newContent, newContent);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rounded" height={80} />
                ))}
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Synonyms Section */}
            {state.selectedText && synonyms[state.selectedText]?.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                        }}
                    >
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Synonymes pour "{state.selectedText}"
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {synonyms[state.selectedText].map((synonym, idx) => (
                                <Chip
                                    key={idx}
                                    label={synonym}
                                    size="small"
                                    onClick={() => handleReplaceSynonym(state.selectedText, synonym)}
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

            {/* Style Suggestions */}
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <AutoAwesome fontSize="small" color="primary" />
                    <Typography variant="subtitle2" fontWeight={600}>
                        Suggestions de style
                    </Typography>
                </Box>

                {suggestions.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 4,
                            color: 'text.secondary'
                        }}
                    >
                        <Lightbulb sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                        <Typography variant="body2">
                            Continuez à écrire pour recevoir des suggestions d'amélioration
                        </Typography>
                    </Box>
                ) : (
                    <AnimatePresence>
                        {suggestions.map((suggestion, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <SuggestionCard
                                    suggestion={suggestion}
                                    index={index}
                                    expanded={expandedSuggestion === index}
                                    onToggle={() => setExpandedSuggestion(
                                        expandedSuggestion === index ? null : index
                                    )}
                                    onApply={() => handleApplySuggestion(suggestion)}
                                    onCopy={() => handleCopy(suggestion.replacement, index)}
                                    copied={copiedIndex === index}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </Box>

            {/* Writing Tips */}
            <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Conseils d'écriture
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {getWritingTips(state.stats).map((tip, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1.5,
                                p: 1.5,
                                borderRadius: 1.5,
                                bgcolor: alpha(theme.palette.grey[500], 0.08)
                            }}
                        >
                            <Typography sx={{ fontSize: '1.2rem' }}>{tip.emoji}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {tip.text}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

// Suggestion Card Component
function SuggestionCard({ suggestion, index, expanded, onToggle, onApply, onCopy, copied }) {
    const theme = useTheme();

    const typeColors = {
        clarity: theme.palette.info.main,
        concision: theme.palette.warning.main,
        style: theme.palette.primary.main,
        grammar: theme.palette.error.main
    };

    return (
        <Box
            sx={{
                mb: 2,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden',
                bgcolor: theme.palette.background.paper
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                        bgcolor: alpha(theme.palette.action.hover, 0.05)
                    }
                }}
                onClick={onToggle}
            >
                <Box
                    sx={{
                        width: 4,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: typeColors[suggestion.type] || theme.palette.primary.main,
                        mr: 2
                    }}
                />
                <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                        {suggestion.title}
                    </Typography>
                    <Chip
                        label={suggestion.type}
                        size="small"
                        sx={{
                            mt: 0.5,
                            height: 20,
                            fontSize: '0.65rem',
                            bgcolor: alpha(typeColors[suggestion.type], 0.1),
                            color: typeColors[suggestion.type]
                        }}
                    />
                </Box>
                <IconButton size="small">
                    {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </Box>

            <Collapse in={expanded}>
                <Box sx={{ px: 2, pb: 2 }}>
                    {suggestion.original && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                Original:
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    textDecoration: 'line-through',
                                    color: 'text.secondary',
                                    mt: 0.5
                                }}
                            >
                                {suggestion.original}
                            </Typography>
                        </Box>
                    )}

                    {suggestion.replacement && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                Suggestion:
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.success.main,
                                    fontWeight: 500,
                                    mt: 0.5
                                }}
                            >
                                {suggestion.replacement}
                            </Typography>
                        </Box>
                    )}

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {suggestion.explanation}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onApply}
                            style={{
                                flex: 1,
                                padding: '8px 16px',
                                borderRadius: 8,
                                border: 'none',
                                background: theme.palette.primary.main,
                                color: '#fff',
                                fontWeight: 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6
                            }}
                        >
                            <Check fontSize="small" />
                            Appliquer
                        </motion.button>
                        <IconButton
                            size="small"
                            onClick={onCopy}
                            sx={{
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2
                            }}
                        >
                            {copied ? <Check color="success" fontSize="small" /> : <ContentCopy fontSize="small" />}
                        </IconButton>
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
}

// Helper function to generate style suggestions
function generateStyleSuggestions(text) {
    const suggestions = [];

    // Check for passive voice (simplified)
    const passivePatterns = [
        { pattern: /est fait/gi, suggestion: 'fait' },
        { pattern: /a été créé/gi, suggestion: 'a créé' },
        { pattern: /sera effectué/gi, suggestion: 'effectuera' }
    ];

    passivePatterns.forEach(({ pattern, suggestion }) => {
        if (pattern.test(text)) {
            suggestions.push({
                type: 'clarity',
                title: 'Voix passive détectée',
                original: text.match(pattern)?.[0],
                replacement: suggestion,
                explanation: 'La voix active rend le texte plus dynamique et direct.'
            });
        }
    });

    // Check for redundant phrases
    const redundantPhrases = [
        { phrase: 'actuellement en cours', better: 'en cours' },
        { phrase: 'tout à fait', better: '' },
        { phrase: 'absolument parfait', better: 'parfait' }
    ];

    redundantPhrases.forEach(({ phrase, better }) => {
        if (text.toLowerCase().includes(phrase)) {
            suggestions.push({
                type: 'concision',
                title: 'Expression redondante',
                original: phrase,
                replacement: better || '(supprimer)',
                explanation: 'Simplifiez votre expression pour plus de clarté.'
            });
        }
    });

    // Check sentence length
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const longSentences = sentences.filter(s => s.split(' ').length > 30);

    if (longSentences.length > 0) {
        suggestions.push({
            type: 'style',
            title: 'Phrases longues détectées',
            explanation: `${longSentences.length} phrase(s) contiennent plus de 30 mots. Essayez de les diviser pour améliorer la lisibilité.`
        });
    }

    return suggestions;
}

// Helper function to get writing tips based on stats
function getWritingTips(stats) {
    const tips = [];

    if (stats.words < 100) {
        tips.push({
            emoji: '✍️',
            text: 'Continuez à développer vos idées. Un texte plus long permet d\'approfondir le sujet.'
        });
    }

    if (stats.sentences > 0 && stats.words / stats.sentences > 25) {
        tips.push({
            emoji: '📝',
            text: 'Vos phrases sont assez longues. Essayez de varier la longueur pour un meilleur rythme.'
        });
    }

    if (stats.paragraphs === 1 && stats.words > 200) {
        tips.push({
            emoji: '📄',
            text: 'Pensez à diviser votre texte en paragraphes pour faciliter la lecture.'
        });
    }

    if (tips.length === 0) {
        tips.push({
            emoji: '👍',
            text: 'Votre texte a une bonne structure. Continuez ainsi !'
        });
    }

    return tips;
}

export default Suggestions;
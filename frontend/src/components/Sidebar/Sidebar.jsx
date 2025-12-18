// src/components/Sidebar/Sidebar.jsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    useTheme,
    alpha,
    Chip,
    LinearProgress,
    Tooltip,
    Fade,
    Slide,
    Collapse,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    useMediaQuery,
    SwipeableDrawer,
    Skeleton,
    Alert,
    Snackbar,
    CircularProgress
} from '@mui/material';
import {
    Spellcheck,
    Lightbulb,
    Psychology,
    Translate,
    Close,
    ExpandMore,
    ExpandLess,
    CheckCircle,
    AutoFixHigh,
    ContentCopy,
    Refresh,
    VolumeUp,
    SwapHoriz,
    TrendingUp,
    Schedule,
    TextFields,
    FormatListNumbered,
    KeyboardArrowRight,
    Done,
    Warning,
    Error as ErrorIcon,
    Info,
    Sync
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor } from '../../contexts/EditorContext';
import { apiService } from '../../services/apiService';

// ============================================
// ANIMATIONS & VARIANTS
// ============================================
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
};

const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity }
};

// ============================================
// STYLED TAB BUTTON COMPONENT
// ============================================
function TabButton({ icon, label, isActive, onClick, badge, color, isLoading }) {
    const theme = useTheme();

    return (
        <Tooltip title={label} placement="bottom" arrow>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClick}
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    padding: '12px 8px',
                    border: 'none',
                    borderRadius: 12,
                    cursor: 'pointer',
                    position: 'relative',
                    background: isActive
                        ? `linear-gradient(135deg, ${alpha(color || theme.palette.primary.main, 0.15)}, ${alpha(color || theme.palette.primary.main, 0.05)})`
                        : 'transparent',
                    color: isActive ? (color || theme.palette.primary.main) : theme.palette.text.secondary,
                    transition: 'all 0.3s ease',
                    outline: 'none'
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    {isLoading ? (
                        <CircularProgress size={20} sx={{ color: color || theme.palette.primary.main }} />
                    ) : (
                        icon
                    )}
                    {badge > 0 && !isLoading && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                                position: 'absolute',
                                top: -6,
                                right: -10,
                                minWidth: 18,
                                height: 18,
                                borderRadius: 9,
                                backgroundColor: theme.palette.error.main,
                                color: '#fff',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.4)}`
                            }}
                        >
                            {badge > 99 ? '99+' : badge}
                        </motion.div>
                    )}
                </Box>
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.7rem',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {label}
                </Typography>
                {isActive && (
                    <motion.div
                        layoutId="activeTab"
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: '20%',
                            right: '20%',
                            height: 3,
                            borderRadius: 3,
                            background: `linear-gradient(90deg, ${color || theme.palette.primary.main}, ${theme.palette.secondary.main})`
                        }}
                    />
                )}
            </motion.button>
        </Tooltip>
    );
}

// ============================================
// MAIN SIDEBAR COMPONENT
// ============================================
export function Sidebar({ onClose }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { state, setActiveTab, setSidebarOpen, setSpellErrors, setGrammarErrors, setSentiment } = useEditor();
    const [tabValue, setTabValue] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [tabLoading, setTabLoading] = useState({
        corrections: false,
        suggestions: false,
        sentiment: false,
        translate: false
    });

    // Analyse automatique du texte
    useEffect(() => {
        const analyzeContent = async () => {
            if (!state.content || state.content.trim().length < 3) {
                setSpellErrors([]);
                setSentiment({ label: 'neutral', confidence: 0.5 });
                return;
            }

            setIsAnalyzing(true);
            setTabLoading(prev => ({ ...prev, corrections: true, sentiment: true }));

            try {
                const analysis = await apiService.analyzeText(state.content);

                setSpellErrors(analysis.spellErrors || []);
                setGrammarErrors(analysis.grammarErrors || []);

                if (analysis.sentiment) {
                    setSentiment(analysis.sentiment);
                }
            } catch (error) {
                console.error('Analysis error:', error);
                showSnackbar('Erreur lors de l\'analyse', 'error');
            } finally {
                setIsAnalyzing(false);
                setTabLoading(prev => ({ ...prev, corrections: false, sentiment: false }));
            }
        };

        // Debounce l'analyse
        const timeoutId = setTimeout(analyzeContent, 1000);
        return () => clearTimeout(timeoutId);
    }, [state.content, setSpellErrors, setGrammarErrors, setSentiment]);

    const handleTabChange = useCallback((newValue) => {
        setTabValue(newValue);
        const tabs = ['corrections', 'suggestions', 'sentiment', 'translate'];
        setActiveTab(tabs[newValue]);
    }, [setActiveTab]);

    const handleClose = useCallback(() => {
        setSidebarOpen(false);
        onClose?.();
    }, [setSidebarOpen, onClose]);

    const errorCount = useMemo(() =>
        state.spellErrors.length + state.grammarErrors.length,
        [state.spellErrors, state.grammarErrors]
    );

    const showSnackbar = useCallback((message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const handleRefreshAnalysis = useCallback(async () => {
        if (!state.content) return;

        setIsAnalyzing(true);
        setTabLoading(prev => ({ ...prev, corrections: true, sentiment: true }));

        try {
            const analysis = await apiService.analyzeText(state.content);
            setSpellErrors(analysis.spellErrors || []);
            setGrammarErrors(analysis.grammarErrors || []);
            if (analysis.sentiment) {
                setSentiment(analysis.sentiment);
            }
            showSnackbar('Analyse actualisée', 'success');
        } catch (error) {
            showSnackbar('Erreur lors de l\'analyse', 'error');
        } finally {
            setIsAnalyzing(false);
            setTabLoading(prev => ({ ...prev, corrections: false, sentiment: false }));
        }
    }, [state.content, setSpellErrors, setGrammarErrors, setSentiment, showSnackbar]);

    const tabs = [
        { icon: <Spellcheck />, label: 'Corrections', badge: errorCount, color: theme.palette.error.main, loading: tabLoading.corrections },
        { icon: <Lightbulb />, label: 'Suggestions', badge: 0, color: theme.palette.warning.main, loading: tabLoading.suggestions },
        { icon: <Psychology />, label: 'Analyse', badge: 0, color: theme.palette.info.main, loading: tabLoading.sentiment },
        { icon: <Translate />, label: 'Traduction', badge: 0, color: theme.palette.success.main, loading: tabLoading.translate }
    ];

    const SidebarContent = (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.95)
                    : theme.palette.background.paper,
                backdropFilter: 'blur(20px)',
                borderLeft: isMobile ? 'none' : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                overflow: 'hidden'
            }}
        >
            {/* Header avec gradient */}
            <Box
                sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    p: 2.5,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Background decoration */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 150,
                        height: 150,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`,
                        pointerEvents: 'none'
                    }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <motion.div animate={isAnalyzing ? { rotate: 360 } : pulseAnimation} transition={isAnalyzing ? { duration: 1, repeat: Infinity, ease: 'linear' } : undefined}>
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`
                                }}
                            >
                                {isAnalyzing ? (
                                    <Sync sx={{ color: '#fff', fontSize: 22 }} />
                                ) : (
                                    <AutoFixHigh sx={{ color: '#fff', fontSize: 22 }} />
                                )}
                            </Box>
                        </motion.div>
                        <Box>
                            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                                Assistant IA
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {isAnalyzing ? 'Analyse en cours...' : 'Votre aide à la rédaction'}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Actualiser l'analyse" arrow>
                            <IconButton
                                size="small"
                                onClick={handleRefreshAnalysis}
                                disabled={isAnalyzing}
                                sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.2)
                                    }
                                }}
                            >
                                <Refresh fontSize="small" sx={{ animation: isAnalyzing ? 'spin 1s linear infinite' : 'none', '@keyframes spin': { '100%': { transform: 'rotate(360deg)' } } }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Fermer" arrow>
                            <IconButton
                                size="small"
                                onClick={handleClose}
                                sx={{
                                    bgcolor: alpha(theme.palette.grey[500], 0.1),
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                        color: theme.palette.error.main
                                    }
                                }}
                            >
                                <Close fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>

            {/* Navigation Tabs */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 0.5,
                    p: 1.5,
                    bgcolor: alpha(theme.palette.grey[500], 0.03),
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}
            >
                {tabs.map((tab, index) => (
                    <TabButton
                        key={index}
                        icon={tab.icon}
                        label={tab.label}
                        isActive={tabValue === index}
                        onClick={() => handleTabChange(index)}
                        badge={tab.badge}
                        color={tab.color}
                        isLoading={tab.loading}
                    />
                ))}
            </Box>

            {/* Loading indicator */}
            <AnimatePresence>
                {(state.isLoading || isAnalyzing) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <LinearProgress
                            sx={{
                                height: 3,
                                background: alpha(theme.palette.primary.main, 0.1),
                                '& .MuiLinearProgress-bar': {
                                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                                }
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content Area */}
            <Box sx={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={tabValue}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{ height: '100%' }}
                    >
                        {tabValue === 0 && <CorrectionsPanel showSnackbar={showSnackbar} isLoading={tabLoading.corrections} />}
                        {tabValue === 1 && <SuggestionsPanel showSnackbar={showSnackbar} />}
                        {tabValue === 2 && <AnalysisPanel isLoading={tabLoading.sentiment} />}
                        {tabValue === 3 && <TranslationPanel showSnackbar={showSnackbar} setLoading={(loading) => setTabLoading(prev => ({ ...prev, translate: loading }))} />}
                    </motion.div>
                </AnimatePresence>
            </Box>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ borderRadius: 2 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );

    // Responsive: Drawer pour mobile, Box pour desktop
    if (isMobile) {
        return (
            <SwipeableDrawer
                anchor="right"
                open={state.sidebarOpen}
                onClose={handleClose}
                onOpen={() => { }}
                PaperProps={{
                    sx: {
                        width: '100%',
                        maxWidth: 400,
                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20
                    }
                }}
            >
                {SidebarContent}
            </SwipeableDrawer>
        );
    }

    return SidebarContent;
}

// ============================================
// CORRECTIONS PANEL
// ============================================
function CorrectionsPanel({ showSnackbar, isLoading }) {
    const theme = useTheme();
    const { state, setContent } = useEditor();
    const [expandedError, setExpandedError] = useState(null);
    const [fixedErrors, setFixedErrors] = useState(new Set());
    const [localLoading, setLocalLoading] = useState(false);

    const allErrors = useMemo(() =>
        [...state.spellErrors, ...state.grammarErrors],
        [state.spellErrors, state.grammarErrors]
    );

    // Reset fixed errors when content changes
    useEffect(() => {
        setFixedErrors(new Set());
    }, [state.content]);

    const handleApplyCorrection = useCallback((error, suggestion, index) => {
        const newContent = state.content.substring(0, error.position.start) +
            suggestion +
            state.content.substring(error.position.end);
        setContent(newContent, newContent);
        setFixedErrors(prev => new Set([...prev, index]));
        showSnackbar?.(`Correction appliquée: "${suggestion}"`, 'success');
    }, [state.content, setContent, showSnackbar]);

    const handleFixAll = useCallback(async () => {
        setLocalLoading(true);

        try {
            let newContent = state.content;
            let offset = 0;

            allErrors.forEach((error) => {
                if (error.suggestions?.[0]) {
                    const start = error.position.start + offset;
                    const end = error.position.end + offset;
                    newContent = newContent.substring(0, start) + error.suggestions[0] + newContent.substring(end);
                    offset += error.suggestions[0].length - (error.position.end - error.position.start);
                }
            });

            setContent(newContent, newContent);
            setFixedErrors(new Set(allErrors.map((_, i) => i)));
            showSnackbar?.(`${allErrors.length} corrections appliquées`, 'success');
        } catch (error) {
            showSnackbar?.('Erreur lors de la correction', 'error');
        } finally {
            setLocalLoading(false);
        }
    }, [allErrors, state.content, setContent, showSnackbar]);

    // Loading skeleton
    if (isLoading) {
        return (
            <Box sx={{ p: 2 }}>
                <Skeleton variant="rounded" height={80} sx={{ mb: 2, borderRadius: 3 }} />
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} variant="rounded" height={60} sx={{ mb: 1.5, borderRadius: 2 }} />
                ))}
            </Box>
        );
    }

    if (allErrors.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                    height: '100%',
                    textAlign: 'center'
                }}
            >
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                    <Box
                        sx={{
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.2)}, ${alpha(theme.palette.success.light, 0.1)})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            boxShadow: `0 10px 40px ${alpha(theme.palette.success.main, 0.2)}`
                        }}
                    >
                        <CheckCircle sx={{ fontSize: 50, color: theme.palette.success.main }} />
                    </Box>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                        Parfait ! 🎉
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 250 }}>
                        Aucune erreur détectée dans votre texte. Continuez votre excellent travail !
                    </Typography>
                </motion.div>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Header avec stats et action */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)}, ${alpha(theme.palette.warning.main, 0.05)})`,
                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
                }}
            >
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        Erreurs détectées
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="error.main">
                        {allErrors.length - fixedErrors.size}
                    </Typography>
                </Box>
                <Tooltip title="Corriger tout automatiquement" arrow>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={localLoading ? <CircularProgress size={16} color="inherit" /> : <AutoFixHigh />}
                            onClick={handleFixAll}
                            disabled={localLoading || fixedErrors.size === allErrors.length}
                            sx={{
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            {localLoading ? 'Correction...' : 'Tout corriger'}
                        </Button>
                    </motion.div>
                </Tooltip>
            </Box>

            {/* Liste des erreurs */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {allErrors.map((error, index) => (
                    <motion.div
                        key={`${error.word}-${index}`}
                        variants={itemVariants}
                        layout
                    >
                        <ErrorCard
                            error={error}
                            index={index}
                            expanded={expandedError === index}
                            isFixed={fixedErrors.has(index)}
                            onToggle={() => setExpandedError(expandedError === index ? null : index)}
                            onApply={(suggestion) => handleApplyCorrection(error, suggestion, index)}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </Box>
    );
}

// ============================================
// ERROR CARD COMPONENT
// ============================================
function ErrorCard({ error, index, expanded, isFixed, onToggle, onApply }) {
    const theme = useTheme();
    const isSpelling = error.type === 'spelling';
    const color = isSpelling ? theme.palette.error.main : theme.palette.warning.main;

    if (isFixed) {
        return (
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 0.3 }}
            >
                <Box
                    sx={{
                        mb: 1.5,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                    }}
                >
                    <Done sx={{ color: theme.palette.success.main }} />
                    <Typography sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                        {error.word}
                    </Typography>
                    <Typography sx={{ color: theme.palette.success.main, fontWeight: 600 }}>
                        ✓ Corrigé
                    </Typography>
                </Box>
            </motion.div>
        );
    }

    return (
        <Box
            sx={{
                mb: 1.5,
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: alpha(color, 0.05),
                border: `1px solid ${alpha(color, 0.2)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: `0 4px 20px ${alpha(color, 0.15)}`,
                    transform: 'translateY(-2px)'
                }
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            bgcolor: alpha(color, 0.15),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {isSpelling ? (
                            <ErrorIcon sx={{ color, fontSize: 20 }} />
                        ) : (
                            <Warning sx={{ color, fontSize: 20 }} />
                        )}
                    </Box>
                    <Box>
                        <Typography fontWeight={600} sx={{ color }}>
                            {error.word}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {isSpelling ? 'Faute d\'orthographe' : 'Erreur grammaticale'}
                            {error.confidence && ` • ${Math.round(error.confidence)}% confiance`}
                        </Typography>
                    </Box>
                </Box>

                <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
                    <IconButton size="small">
                        <ExpandMore />
                    </IconButton>
                </motion.div>
            </Box>

            <Collapse in={expanded}>
                <Box sx={{ px: 2, pb: 2 }}>
                    <Divider sx={{ mb: 2 }} />

                    {error.message && (
                        <Alert
                            severity="info"
                            sx={{ mb: 2, borderRadius: 2 }}
                            icon={<Info fontSize="small" />}
                        >
                            {error.message}
                        </Alert>
                    )}

                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
                        Suggestions de correction :
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {error.suggestions?.length > 0 ? (
                            error.suggestions.map((suggestion, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Chip
                                        label={suggestion}
                                        onClick={() => onApply(suggestion)}
                                        icon={idx === 0 ? <AutoFixHigh fontSize="small" /> : undefined}
                                        sx={{
                                            cursor: 'pointer',
                                            fontWeight: idx === 0 ? 600 : 400,
                                            bgcolor: idx === 0 ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                                            border: `1px solid ${idx === 0 ? theme.palette.primary.main : theme.palette.divider}`,
                                            '&:hover': {
                                                bgcolor: theme.palette.primary.main,
                                                color: '#fff',
                                                '& .MuiChip-icon': {
                                                    color: '#fff'
                                                }
                                            }
                                        }}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <Typography variant="caption" color="text.secondary" fontStyle="italic">
                                Aucune suggestion disponible
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
}

// ============================================
// SUGGESTIONS PANEL
// ============================================
function SuggestionsPanel({ showSnackbar }) {
    const theme = useTheme();
    const { state, setContent } = useEditor();
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Récupérer les suggestions d'autocomplétion
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!state.content || state.content.trim().length < 3) {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            try {
                const result = await apiService.getSuggestions(state.content);
                setSuggestions(result);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 500);
        return () => clearTimeout(timeoutId);
    }, [state.content]);

    const handleApplySuggestion = useCallback((suggestion) => {
        const words = state.content.trim().split(/\s+/);
        words[words.length - 1] = suggestion.text;
        const newContent = words.join(' ') + ' ';
        setContent(newContent, newContent);
        showSnackbar?.(`"${suggestion.text}" ajouté`, 'success');
    }, [state.content, setContent, showSnackbar]);

    const handleCopySuggestion = useCallback((text) => {
        navigator.clipboard.writeText(text);
        showSnackbar?.('Copié dans le presse-papiers', 'success');
    }, [showSnackbar]);

    if (isLoading) {
        return (
            <Box sx={{ p: 2 }}>
                <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} variant="rounded" height={50} sx={{ mb: 1.5, borderRadius: 2 }} />
                ))}
            </Box>
        );
    }

    if (suggestions.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                    height: '100%',
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
                            background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.2)}, ${alpha(theme.palette.warning.light, 0.1)})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2
                        }}
                    >
                        <Lightbulb sx={{ fontSize: 40, color: theme.palette.warning.main }} />
                    </Box>
                </motion.div>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Suggestions d'écriture
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 250 }}>
                    Commencez à écrire pour recevoir des suggestions d'autocomplétion intelligentes.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Lightbulb fontSize="small" color="warning" />
                Suggestions ({suggestions.length})
            </Typography>

            <motion.div variants={containerVariants} initial="hidden" animate="visible">
                {suggestions.map((suggestion, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <Box
                            sx={{
                                mb: 1.5,
                                p: 2,
                                borderRadius: 3,
                                bgcolor: alpha(theme.palette.warning.main, 0.05),
                                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                                    transform: 'translateX(5px)'
                                }
                            }}
                            onClick={() => handleApplySuggestion(suggestion)}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography fontWeight={600}>
                                    {suggestion.text}
                                </Typography>
                                <Chip
                                    label={`${Math.round(suggestion.score * 100)}%`}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.65rem',
                                        bgcolor: alpha(theme.palette.success.main, 0.1),
                                        color: theme.palette.success.main
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <Tooltip title="Copier" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopySuggestion(suggestion.text);
                                        }}
                                    >
                                        <ContentCopy fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <KeyboardArrowRight fontSize="small" color="action" />
                            </Box>
                        </Box>
                    </motion.div>
                ))}
            </motion.div>
        </Box>
    );
}

// ============================================
// ANALYSIS PANEL
// ============================================
function AnalysisPanel({ isLoading }) {
    const theme = useTheme();
    const { state } = useEditor();

    const sentimentData = state.sentiment || { label: 'neutral', confidence: 0.5, score: 0 };

    const getSentimentInfo = useCallback((label) => {
        const info = {
            very_positive: { emoji: '😄', text: 'Très positif', color: theme.palette.success.main, gradient: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.light})` },
            positive: { emoji: '🙂', text: 'Positif', color: theme.palette.success.light, gradient: `linear-gradient(135deg, ${theme.palette.success.light}, ${theme.palette.success.main})` },
            neutral: { emoji: '😐', text: 'Neutre', color: theme.palette.grey[500], gradient: `linear-gradient(135deg, ${theme.palette.grey[400]}, ${theme.palette.grey[600]})` },
            negative: { emoji: '😕', text: 'Négatif', color: theme.palette.warning.main, gradient: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})` },
            very_negative: { emoji: '😢', text: 'Très négatif', color: theme.palette.error.main, gradient: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})` }
        };
        return info[label] || info.neutral;
    }, [theme]);

    const sentimentInfo = getSentimentInfo(sentimentData.label);

    const stats = [
        { icon: <TextFields />, label: 'Mots', value: state.stats.words, color: theme.palette.primary.main },
        { icon: <FormatListNumbered />, label: 'Caractères', value: state.stats.characters, color: theme.palette.secondary.main },
        { icon: <TrendingUp />, label: 'Phrases', value: state.stats.sentences, color: theme.palette.success.main },
        { icon: <Schedule />, label: 'Paragraphes', value: state.stats.paragraphs, color: theme.palette.warning.main }
    ];

    if (isLoading) {
        return (
            <Box sx={{ p: 2 }}>
                <Skeleton variant="rounded" height={200} sx={{ mb: 3, borderRadius: 4 }} />
                <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} variant="rounded" height={80} sx={{ borderRadius: 3 }} />
                    ))}
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Sentiment Analysis Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Box
                    sx={{
                        p: 3,
                        borderRadius: 4,
                        background: `linear-gradient(135deg, ${alpha(sentimentInfo.color, 0.15)}, ${alpha(sentimentInfo.color, 0.05)})`,
                        border: `1px solid ${alpha(sentimentInfo.color, 0.3)}`,
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Decorative circles */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -30,
                            right: -30,
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            bgcolor: alpha(sentimentInfo.color, 0.1)
                        }}
                    />

                    <Typography variant="overline" color="text.secondary" fontWeight={600}>
                        Analyse du sentiment
                    </Typography>

                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Typography sx={{ fontSize: '4rem', my: 2 }}>
                            {sentimentInfo.emoji}
                        </Typography>
                    </motion.div>

                    <Typography variant="h5" fontWeight={700} sx={{ color: sentimentInfo.color, mb: 1 }}>
                        {sentimentInfo.text}
                    </Typography>

                    {sentimentData.sentiment && (
                        <Typography variant="caption" color="text.secondary">
                            API: {sentimentData.sentiment} (score: {sentimentData.score})
                        </Typography>
                    )}

                    <Box sx={{ mt: 2, px: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                                Confiance
                            </Typography>
                            <Typography variant="caption" fontWeight={600}>
                                {Math.round(sentimentData.confidence * 100)}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={sentimentData.confidence * 100}
                            sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: alpha(sentimentInfo.color, 0.2),
                                '& .MuiLinearProgress-bar': {
                                    background: sentimentInfo.gradient,
                                    borderRadius: 4
                                }
                            }}
                        />
                    </Box>
                </Box>
            </motion.div>

            {/* Statistics Grid */}
            <Box>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp fontSize="small" />
                    Statistiques du texte
                </Typography>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 1.5
                    }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <StatCard {...stat} />
                        </motion.div>
                    ))}
                </Box>
            </Box>

            {/* Reading Time */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Box
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)}, ${alpha(theme.palette.info.light, 0.05)})`,
                        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Box
                        sx={{
                            width: 50,
                            height: 50,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.info.main, 0.15),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Schedule sx={{ color: theme.palette.info.main, fontSize: 28 }} />
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            Temps de lecture estimé
                        </Typography>
                        <Typography variant="h5" fontWeight={700} color="info.main">
                            {state.stats.readingTime || 0} min
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Basé sur 200 mots/minute
                        </Typography>
                    </Box>
                </Box>
            </motion.div>
        </Box>
    );
}

// ============================================
// STAT CARD COMPONENT
// ============================================
function StatCard({ icon, label, value, color }) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: alpha(color, 0.08),
                border: `1px solid ${alpha(color, 0.15)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: `0 8px 25px ${alpha(color, 0.2)}`
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ color: alpha(color, 0.7) }}>
                    {React.cloneElement(icon, { fontSize: 'small' })}
                </Box>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {label}
                </Typography>
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ color }}>
                {(value || 0).toLocaleString()}
            </Typography>
        </Box>
    );
}

// ============================================
// TRANSLATION PANEL
// ============================================
function TranslationPanel({ showSnackbar, setLoading }) {
    const theme = useTheme();
    const { state } = useEditor();
    const [sourceLang, setSourceLang] = useState('mg'); // Malagasy par défaut
    const [targetLang, setTargetLang] = useState('fr');
    const [translation, setTranslation] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);

    const languages = [
        { code: 'mg', name: 'Malagasy', flag: '🇲🇬' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'Anglais', flag: '🇬🇧' },
        { code: 'es', name: 'Espagnol', flag: '🇪🇸' },
        { code: 'de', name: 'Allemand', flag: '🇩🇪' },
        { code: 'it', name: 'Italien', flag: '🇮🇹' },
        { code: 'pt', name: 'Portugais', flag: '🇵🇹' },
        { code: 'ar', name: 'Arabe', flag: '🇸🇦' },
        { code: 'zh', name: 'Chinois', flag: '🇨🇳' },
        { code: 'ja', name: 'Japonais', flag: '🇯🇵' }
    ];

    const handleSwapLanguages = () => {
        const temp = sourceLang;
        setSourceLang(targetLang);
        setTargetLang(temp);
        if (translation) {
            // Swap les textes aussi si une traduction existe
            setTranslation('');
        }
    };

    const handleTranslate = async () => {
        const textToTranslate = state.selectedText || state.content;

        if (!textToTranslate || textToTranslate.trim().length === 0) {
            showSnackbar?.('Veuillez saisir du texte à traduire', 'warning');
            return;
        }

        setIsTranslating(true);
        setLoading?.(true);

        try {
            const result = await apiService.translate(textToTranslate, sourceLang, targetLang);
            setTranslation(result.translated_text || textToTranslate);
            showSnackbar?.('Traduction terminée', 'success');
        } catch (error) {
            console.error('Translation error:', error);
            showSnackbar?.('Erreur lors de la traduction', 'error');
        } finally {
            setIsTranslating(false);
            setLoading?.(false);
        }
    };

    const handleCopyTranslation = () => {
        if (translation) {
            navigator.clipboard.writeText(translation);
            showSnackbar?.('Traduction copiée !', 'success');
        }
    };

    const textToTranslate = state.selectedText || state.content || '';

    return (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Language Selector */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 2,
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.grey[500], 0.05),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}
            >
                <FormControl size="small" sx={{ flex: 1 }}>
                    <Select
                        value={sourceLang}
                        onChange={(e) => setSourceLang(e.target.value)}
                        sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            bgcolor: theme.palette.background.paper
                        }}
                    >
                        {languages.map(lang => (
                            <MenuItem key={lang.code} value={lang.code}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span>{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Tooltip title="Inverser les langues" arrow>
                    <IconButton
                        onClick={handleSwapLanguages}
                        sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                                transform: 'rotate(180deg)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <SwapHoriz />
                    </IconButton>
                </Tooltip>

                <FormControl size="small" sx={{ flex: 1 }}>
                    <Select
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            bgcolor: theme.palette.background.paper
                        }}
                    >
                        {languages.map(lang => (
                            <MenuItem key={lang.code} value={lang.code}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span>{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Source Text */}
            <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    📝 Texte source
                    {textToTranslate && (
                        <Chip
                            label={`${textToTranslate.split(/\s+/).filter(Boolean).length} mots`}
                            size="small"
                            sx={{ ml: 'auto', height: 20, fontSize: '0.65rem' }}
                        />
                    )}
                </Typography>
                <Box
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.grey[500], 0.05),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        maxHeight: 150,
                        overflow: 'auto',
                        minHeight: 80
                    }}
                >
                    <Typography
                        variant="body2"
                        color={textToTranslate ? 'text.primary' : 'text.secondary'}
                        sx={{ fontStyle: textToTranslate ? 'normal' : 'italic' }}
                    >
                        {textToTranslate || 'Sélectionnez du texte ou écrivez quelque chose...'}
                    </Typography>
                </Box>
            </Box>

            {/* Translate Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleTranslate}
                    disabled={isTranslating || !textToTranslate}
                    startIcon={
                        isTranslating ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            <Translate />
                        )
                    }
                    sx={{
                        py: 1.5,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1rem',
                        '&:disabled': {
                            background: theme.palette.grey[300]
                        }
                    }}
                >
                    {isTranslating ? 'Traduction en cours...' : 'Traduire'}
                </Button>
            </motion.div>

            {/* Translation Result */}
            <AnimatePresence>
                {translation && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: 20, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="subtitle2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    ✨ Traduction
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Tooltip title="Écouter" arrow>
                                        <IconButton size="small">
                                            <VolumeUp fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Copier" arrow>
                                        <IconButton size="small" onClick={handleCopyTranslation}>
                                            <ContentCopy fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.success.light, 0.05)})`,
                                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                                }}
                            >
                                <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                                    {translation}
                                </Typography>
                            </Box>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Language Chips */}
            <Box>
                <Typography variant="caption" color="text.secondary" gutterBottom sx={{ display: 'block' }}>
                    Langues populaires
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {languages.slice(0, 6).map(lang => (
                        <motion.div key={lang.code} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Chip
                                label={`${lang.flag} ${lang.name}`}
                                size="small"
                                onClick={() => setTargetLang(lang.code)}
                                variant={targetLang === lang.code ? 'filled' : 'outlined'}
                                color={targetLang === lang.code ? 'primary' : 'default'}
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontWeight: targetLang === lang.code ? 600 : 400
                                }}
                            />
                        </motion.div>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default Sidebar;
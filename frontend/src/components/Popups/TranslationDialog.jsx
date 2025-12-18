// src/components/Popups/TranslationDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Paper,
  Divider,
  Chip,
  Alert,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Close as CloseIcon,
  Translate as TranslateIcon,
  ContentCopy as CopyIcon,
  SwapHoriz as SwapIcon,
  VolumeUp as VolumeUpIcon,
  History as HistoryIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor } from '../../contexts/EditorContext';
import apiService from '../../services/apiService';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
];

const TranslationDialog = ({ open = false, onClose, selectedText = '' }) => {
  const theme = useTheme();
  const { state } = useEditor();
  
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState(null);

  // Initialiser avec le texte sélectionné
  useEffect(() => {
    if (selectedText) {
      setSourceText(selectedText);
    }
  }, [selectedText]);

  // Traduction automatique avec debounce
  useEffect(() => {
    if (!sourceText.trim() || !open) return;

    const timeoutId = setTimeout(() => {
      handleTranslate();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [sourceText, targetLanguage, sourceLanguage]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);
    setError(null);

    try {
      const result = await apiService.translate(
        sourceText,
        sourceLanguage === 'auto' ? null : sourceLanguage,
        targetLanguage
      );

      setTranslatedText(result.translatedText || result.translation || 'Traduction non disponible');
      
      if (result.detectedLanguage) {
        setDetectedLanguage(result.detectedLanguage);
      }

      // Ajouter à l'historique
      const newEntry = {
        id: Date.now(),
        source: sourceText,
        translated: result.translatedText || result.translation,
        from: sourceLanguage,
        to: targetLanguage,
        timestamp: new Date()
      };
      setHistory(prev => [newEntry, ...prev.slice(0, 9)]);

    } catch (err) {
      console.error('Translation error:', err);
      setError('Erreur lors de la traduction. Veuillez réessayer.');
      
      // Traduction de secours simulée
      setTranslatedText(`[Traduction simulée] ${sourceText}`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLanguage !== 'auto') {
      const temp = sourceLanguage;
      setSourceLanguage(targetLanguage);
      setTargetLanguage(temp);
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleSpeak = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  const handleHistorySelect = (entry) => {
    setSourceText(entry.source);
    setTranslatedText(entry.translated);
    setSourceLanguage(entry.from);
    setTargetLanguage(entry.to);
    setShowHistory(false);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Ne pas rendre si pas ouvert
  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)',
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: alpha(theme.palette.primary.main, 0.1),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TranslateIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Traduction
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Historique">
            <IconButton
              size="small"
              onClick={() => setShowHistory(!showHistory)}
              sx={{
                bgcolor: showHistory ? alpha(theme.palette.primary.main, 0.2) : 'transparent'
              }}
            >
              <HistoryIcon />
            </IconButton>
          </Tooltip>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <AnimatePresence mode="wait">
          {showHistory ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Historique des traductions
              </Typography>
              {history.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                  Aucune traduction récente
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {history.map((entry) => (
                    <Paper
                      key={entry.id}
                      onClick={() => handleHistorySelect(entry)}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          transform: 'translateX(4px)'
                        }
                      }}
                    >
                      <Typography variant="body2" noWrap>
                        {entry.source}
                      </Typography>
                      <Typography variant="body2" color="primary" noWrap>
                        → {entry.translated}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {languages.find(l => l.code === entry.from)?.flag || '🌐'} →{' '}
                        {languages.find(l => l.code === entry.to)?.flag}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="translator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Sélecteurs de langue */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3
                }}
              >
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Langue source</InputLabel>
                  <Select
                    value={sourceLanguage}
                    onChange={(e) => setSourceLanguage(e.target.value)}
                    label="Langue source"
                  >
                    <MenuItem value="auto">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        🌐 Détecter
                      </Box>
                    </MenuItem>
                    {languages.map((lang) => (
                      <MenuItem key={lang.code} value={lang.code}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {lang.flag} {lang.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <IconButton
                  onClick={handleSwapLanguages}
                  disabled={sourceLanguage === 'auto'}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      transform: 'rotate(180deg)'
                    },
                    transition: 'all 0.3s'
                  }}
                >
                  <SwapIcon />
                </IconButton>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Langue cible</InputLabel>
                  <Select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    label="Langue cible"
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang.code} value={lang.code}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {lang.flag} {lang.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {detectedLanguage && sourceLanguage === 'auto' && (
                  <Chip
                    size="small"
                    label={`Détecté: ${languages.find(l => l.code === detectedLanguage)?.name || detectedLanguage}`}
                    color="info"
                    variant="outlined"
                  />
                )}
              </Box>

              {/* Zones de texte */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 2
                }}
              >
                {/* Texte source */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.background.default, 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Texte original
                    </Typography>
                    <Tooltip title="Écouter">
                      <IconButton
                        size="small"
                        onClick={() => handleSpeak(sourceText, sourceLanguage)}
                        disabled={!sourceText}
                      >
                        <VolumeUpIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder="Entrez le texte à traduire..."
                    variant="standard"
                    InputProps={{
                      disableUnderline: true
                    }}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: '1rem',
                        lineHeight: 1.6
                      }
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', textAlign: 'right', mt: 1 }}
                  >
                    {sourceText.length} caractères
                  </Typography>
                </Paper>

                {/* Texte traduit */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    borderRadius: 2,
                    position: 'relative'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Traduction
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Écouter">
                        <IconButton
                          size="small"
                          onClick={() => handleSpeak(translatedText, targetLanguage)}
                          disabled={!translatedText}
                        >
                          <VolumeUpIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={copied ? 'Copié !' : 'Copier'}>
                        <IconButton
                          size="small"
                          onClick={handleCopy}
                          disabled={!translatedText}
                          color={copied ? 'success' : 'default'}
                        >
                          {copied ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {isTranslating ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 150
                      }}
                    >
                      <CircularProgress size={32} />
                    </Box>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: '1rem',
                        lineHeight: 1.6,
                        minHeight: 150,
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {translatedText || (
                        <Box component="span" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                          La traduction apparaîtra ici...
                        </Box>
                      )}
                    </Typography>
                  )}
                </Paper>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Button onClick={handleClose} color="inherit">
          Fermer
        </Button>
        <Button
          variant="contained"
          onClick={handleTranslate}
          disabled={!sourceText.trim() || isTranslating}
          startIcon={isTranslating ? <CircularProgress size={16} color="inherit" /> : <TranslateIcon />}
        >
          Traduire
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TranslationDialog;
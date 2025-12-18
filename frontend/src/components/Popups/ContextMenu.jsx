import React, { useState } from 'react';
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    CircularProgress,
} from '@mui/material';
import {
    Translate,
    ContentCut,
    ContentCopy,    
    ContentPaste,
    Spellcheck,
    Psychology,
    VolumeUp,
    BookmarkAdd,
    Search,
} from '@mui/icons-material';
import { Icon } from '@iconify/react';
// import { translationAPI, ttsAPI } from '@services/api';
import TranslationDialog from './TranslationDialog';

const ContextMenu = ({ contextMenu, onClose }) => {
    const [translationDialogOpen, setTranslationDialogOpen] = useState(false);
    const [translation, setTranslation] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);

    const open = contextMenu !== null;

    const handleTranslate = async () => {
        if (!contextMenu?.word) return;

        setIsTranslating(true);
        try {
            // const result = await translationAPI.translate(contextMenu.word);
            // setTranslation(result);
            setTranslationDialogOpen(true);
        } catch (error) {
            console.error('Translation error:', error);
        } finally {
            setIsTranslating(false);
        }
    };

    const handleSpeak = async () => {
        if (!contextMenu?.word) return;

        try {
            // const audioBlob = await ttsAPI.synthesize(contextMenu.word);
            // const audioUrl = URL.createObjectURL(audioBlob);
            // const audio = new Audio(audioUrl);
            // audio.play();
        } catch (error) {
            console.error('TTS error:', error);
        }
        onClose();
    };

    const handleCopy = () => {
        if (contextMenu?.word) {
            navigator.clipboard.writeText(contextMenu.word);
        }
        onClose();
    };

    const handleCut = () => {
        if (contextMenu?.word) {
            navigator.clipboard.writeText(contextMenu.word);
            // Supprimer le texte sélectionné (à implémenter)
        }
        onClose();
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            // Coller le texte (à implémenter)
        } catch (error) {
            console.error('Paste error:', error);
        }
        onClose();
    };

    const handleSearch = () => {
        if (contextMenu?.word) {
            window.open(
                `https://www.google.com/search?q=${encodeURIComponent(contextMenu.word)}+malagasy`,
                '_blank'
            );
        }
        onClose();
    };

    return (
        <>
            <Menu
                open={open}
                onClose={onClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
                slotProps={{
                    paper: {
                        sx: {
                            width: 280,
                            boxShadow: 3,
                        },
                    },
                }}
            >
                {/* Mot sélectionné */}
                {contextMenu?.word && (
                    <>
                        <MenuItem disabled sx={{ opacity: 1 }}>
                            <Typography variant="body2" fontWeight={600} color="primary">
                                "{contextMenu.word}"
                            </Typography>
                        </MenuItem>
                        <Divider />
                    </>
                )}

                {/* Traduction */}
                <MenuItem onClick={handleTranslate} disabled={isTranslating}>
                    <ListItemIcon>
                        {isTranslating ? (
                            <CircularProgress size={20} />
                        ) : (
                            <Translate fontSize="small" />
                        )}
                    </ListItemIcon>
                    <ListItemText>Traduire en français</ListItemText>
                </MenuItem>

                {/* Synthèse vocale */}
                <MenuItem onClick={handleSpeak}>
                    <ListItemIcon>
                        <VolumeUp fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Lire à haute voix</ListItemText>
                </MenuItem>

                {/* Lemmatisation */}
                <MenuItem onClick={onClose}>
                    <ListItemIcon>
                        <Icon icon="mdi:book-alphabet" width="20" />
                    </ListItemIcon>
                    <ListItemText>Trouver la racine</ListItemText>
                </MenuItem>

                {/* Analyse sémantique */}
                <MenuItem onClick={onClose}>
                    <ListItemIcon>
                        <Psychology fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Mots similaires</ListItemText>
                </MenuItem>

                <Divider />

                {/* Actions standard */}
                <MenuItem onClick={handleCut}>
                    <ListItemIcon>
                        <ContentCut fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Couper</ListItemText>
                    <Typography variant="caption" color="text.secondary">
                        Ctrl+X
                    </Typography>
                </MenuItem>

                <MenuItem onClick={handleCopy}>
                    <ListItemIcon>
                        <ContentCopy fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copier</ListItemText>
                    <Typography variant="caption" color="text.secondary">
                        Ctrl+C
                    </Typography>
                </MenuItem>

                <MenuItem onClick={handlePaste}>
                    <ListItemIcon>
                        <ContentPaste fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Coller</ListItemText>
                    <Typography variant="caption" color="text.secondary">
                        Ctrl+V
                    </Typography>
                </MenuItem>

                <Divider />

                {/* Vérifier l'orthographe */}
                <MenuItem onClick={onClose}>
                    <ListItemIcon>
                        <Spellcheck fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Vérifier l'orthographe</ListItemText>
                </MenuItem>

                {/* Ajouter au dictionnaire */}
                <MenuItem onClick={onClose}>
                    <ListItemIcon>
                        <BookmarkAdd fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Ajouter au dictionnaire</ListItemText>
                </MenuItem>

                <Divider />

                {/* Rechercher en ligne */}
                <MenuItem onClick={handleSearch}>
                    <ListItemIcon>
                        <Search fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Rechercher sur Google</ListItemText>
                </MenuItem>
            </Menu>

            {/* Dialog de traduction */}
            <TranslationDialog
                open={translationDialogOpen}
                onClose={() => setTranslationDialogOpen(false)}
                word={contextMenu?.word || ''}
                translation={translation}
            />
        </>
    );
};

export default ContextMenu;
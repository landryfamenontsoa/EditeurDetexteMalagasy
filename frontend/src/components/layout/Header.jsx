import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Tooltip,
    Button,
    Chip,
} from '@mui/material';
import {
    Menu as MenuIcon,
    SmartToy,
    Save,
    Upload,
    Download,
    Settings,
    Brightness4,
    Brightness7,
} from '@mui/icons-material';
import { Icon } from '@iconify/react';
import useEditorStore from '../../store/editorStore';

const Header = () => {
    const { toggleSidebar, toggleChatbot, content } = useEditorStore();
    const [darkMode, setDarkMode] = React.useState(false);

    const wordCount = content.split(/\s+/).filter(Boolean).length;

    return (
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main' }}>
            <Toolbar>
                <Icon icon="twemoji:flag-madagascar" width="32" style={{ marginRight: 12 }} />

                <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
                    Éditeur Malagasy Intelligent
                </Typography>

                {/* Actions principales */}
                <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
                    <Tooltip title="Nouveau document">
                        <IconButton color="inherit" size="small">
                            <Icon icon="mdi:file-plus-outline" width="20" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Ouvrir">
                        <IconButton color="inherit" size="small">
                            <Upload fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Enregistrer">
                        <IconButton color="inherit" size="small">
                            <Save fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Télécharger">
                        <IconButton color="inherit" size="small">
                            <Download fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Statistiques */}
                <Chip
                    label={`${wordCount} mots`}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mr: 2 }}
                />

                {/* Actions secondaires */}
                <Tooltip title="Chatbot Assistant">
                    <IconButton color="inherit" onClick={toggleChatbot}>
                        <SmartToy />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Basculer le thème">
                    <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
                        {darkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                </Tooltip>

                <Tooltip title="Paramètres">
                    <IconButton color="inherit">
                        <Settings />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Afficher/Masquer le panneau">
                    <IconButton color="inherit" onClick={toggleSidebar}>
                        <MenuIcon />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
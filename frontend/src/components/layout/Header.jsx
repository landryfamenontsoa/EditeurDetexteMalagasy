// src/components/Layout/Header.jsx
import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Chip,
    Menu,
    MenuItem,
    useTheme,
    alpha,
    Avatar
} from '@mui/material';
import {
    Menu as MenuIcon,
    DarkMode,
    LightMode,
    Translate,
    Settings,
    Help,
    KeyboardArrowDown
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useEditor } from '../../contexts/EditorContext';
import { LANGUAGES } from '../../utils/constants';
import Tooltip from '../UI/Tooltip';

export function Header({ toggleTheme, currentMode, onMenuClick }) {
    const theme = useTheme();
    const { state, setLanguage } = useEditor();
    const [langAnchor, setLangAnchor] = React.useState(null);

    const handleLanguageClick = (event) => {
        setLangAnchor(event.currentTarget);
    };

    const handleLanguageSelect = (langCode) => {
        setLanguage(langCode);
        setLangAnchor(null);
    };

    const currentLang = LANGUAGES[state.language] || LANGUAGES.fr;

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(20px)',
                borderBottom: `1px solid ${theme.palette.divider}`,
                color: theme.palette.text.primary
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
                {/* Left Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                        onClick={onMenuClick}
                        sx={{ display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
                                    S
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        lineHeight: 1.2
                                    }}
                                >
                                    Smart Editor
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontSize: '0.65rem' }}
                                >
                                    Éditeur intelligent
                                </Typography>
                            </Box>
                        </Box>
                    </motion.div>
                </Box>

                {/* Center Section - Stats */}
                <Box
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Chip
                        size="small"
                        label={`${state.stats.words} mots`}
                        sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 500
                        }}
                    />
                    <Chip
                        size="small"
                        label={`${state.stats.characters} caractères`}
                        sx={{
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                            color: theme.palette.secondary.main,
                            fontWeight: 500
                        }}
                    />
                    {state.stats.readingTime > 0 && (
                        <Chip
                            size="small"
                            label={`~${state.stats.readingTime} min de lecture`}
                            sx={{
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                color: theme.palette.success.main,
                                fontWeight: 500
                            }}
                        />
                    )}
                </Box>

                {/* Right Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Language Selector */}
                    <Tooltip title="Changer la langue">
                        <Chip
                            icon={<span style={{ fontSize: '1rem' }}>{currentLang.flag}</span>}
                            label={currentLang.code.toUpperCase()}
                            deleteIcon={<KeyboardArrowDown fontSize="small" />}
                            onDelete={handleLanguageClick}
                            onClick={handleLanguageClick}
                            sx={{
                                cursor: 'pointer',
                                '& .MuiChip-deleteIcon': {
                                    color: 'inherit'
                                }
                            }}
                        />
                    </Tooltip>
                    <Menu
                        anchorEl={langAnchor}
                        open={Boolean(langAnchor)}
                        onClose={() => setLangAnchor(null)}
                        PaperProps={{
                            sx: { mt: 10, minWidth: 150 }
                        }}
                    >
                        {Object.values(LANGUAGES).map((lang) => (
                            <MenuItem
                                key={lang.code}
                                onClick={() => handleLanguageSelect(lang.code)}
                                selected={state.language === lang.code}
                            >
                                <span style={{ marginRight: 8 }}>{lang.flag}</span>
                                {lang.name}
                            </MenuItem>
                        ))}
                    </Menu>

                    {/* Theme Toggle */}
                    <Tooltip title={currentMode === 'light' ? 'Mode sombre' : 'Mode clair'}>
                        <IconButton onClick={toggleTheme} color="inherit">
                            <motion.div
                                initial={false}
                                animate={{ rotate: currentMode === 'light' ? 0 : 180 }}
                                transition={{ duration: 0.3 }}
                            >
                                {currentMode === 'light' ? <DarkMode /> : <LightMode />}
                            </motion.div>
                        </IconButton>
                    </Tooltip>

                    {/* Help */}
                    <Tooltip title="Aide">
                        <IconButton color="inherit">
                            <Help />
                        </IconButton>
                    </Tooltip>

                    {/* Settings */}
                    <Tooltip title="Paramètres">
                        <IconButton color="inherit">
                            <Settings />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
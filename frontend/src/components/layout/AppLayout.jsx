// src/components/Layout/AppLayout.jsx
import React, { useState } from 'react';
import { Box, Drawer, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import Editor from '../Editor/Editor';
import Sidebar from '../Sidebar/Sidebar';
import Chatbot from '../Chatbot/Chatbot';
import ContextMenu from '../Popups/ContextMenu';
import SpellCheckPopover from '../Popups/SpellCheckPopover';
import TranslationDialog from '../Popups/TranslationDialog';
import { useEditor } from '../../contexts/EditorContext';

const HEADER_HEIGHT = 64;
const FOOTER_HEIGHT = 36;
const SIDEBAR_WIDTH = 340;

export function AppLayout({ toggleTheme, currentMode }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { state, toggleSidebar, toggleChat } = useEditor();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: theme.palette.background.default,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Header */}
            <Header
                toggleTheme={toggleTheme}
                currentMode={currentMode}
                onMenuClick={() => setMobileMenuOpen(true)}
            />

            {/* Main Content */}
            <Box
                sx={{
                    display: 'flex',
                    flex: 1,
                    mt: `${HEADER_HEIGHT}px`,
                    mb: `${FOOTER_HEIGHT}px`,
                    overflow: 'hidden'
                }}
            >
                {/* Editor Area */}
                <Box
                    component={motion.main}
                    layout
                    sx={{
                        mt: 2,
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        transition: theme.transitions.create(['margin'], {
                            duration: theme.transitions.duration.standard
                        }),
                        mr: {
                            xs: 0,
                            md: state.isSidebarOpen ? `${SIDEBAR_WIDTH}px` : 0
                        }
                    }}
                >
                    <Editor />
                </Box>

                {/* Sidebar - Desktop */}
                <AnimatePresence mode="wait">
                    {!isMobile && state.isSidebarOpen && (
                        <motion.div
                            initial={{ x: SIDEBAR_WIDTH, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: SIDEBAR_WIDTH, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            style={{
                                position: 'fixed',
                                right: 0,
                                top: HEADER_HEIGHT,
                                bottom: FOOTER_HEIGHT,
                                width: SIDEBAR_WIDTH,
                                zIndex: 100
                            }}
                        >
                            <Sidebar />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sidebar - Mobile Drawer */}
                <Drawer
                    anchor="right"
                    open={isMobile && mobileMenuOpen}
                    onClose={() => setMobileMenuOpen(false)}
                    PaperProps={{
                        sx: {
                            width: '100%',
                            maxWidth: SIDEBAR_WIDTH,
                            bgcolor: theme.palette.background.paper
                        }
                    }}
                >
                    <Box sx={{ pt: 2 }}>
                        <Sidebar onClose={() => setMobileMenuOpen(false)} />
                    </Box>
                </Drawer>
            </Box>

            {/* Footer */}
            <Footer />

            {/* Chatbot */}
            <AnimatePresence>
                {state.isChatOpen && <Chatbot />}
            </AnimatePresence>

            {/* Popups */}
            <ContextMenu />
            <SpellCheckPopover />
            <TranslationDialog />
        </Box>
    );
}

export default AppLayout;
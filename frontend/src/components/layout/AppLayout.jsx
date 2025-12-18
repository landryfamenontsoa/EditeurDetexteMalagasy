import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import Sidebar from '../Sidebar/Sidebar';
import ChatbotDrawer from '../Chatbot/ChatbotDrawer';
import useEditorStore from '../../store/editorStore';

const AppLayout = ({ children }) => {
    const isSidebarOpen = useEditorStore((state) => state.isSidebarOpen);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Header />

            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Contenu principal */}
                <Box
                    component={motion.div}
                    animate={{
                        marginRight: isSidebarOpen ? 320 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    {children}
                </Box>

                {/* Sidebar */}
                <Sidebar />
            </Box>

            {/* Chatbot Drawer */}
            <ChatbotDrawer />

            <Footer />
        </Box>
    );
};

export default AppLayout;
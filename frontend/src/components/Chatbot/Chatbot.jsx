// src/components/Chatbot/Chatbot.jsx
import React from 'react';
import { Box, Paper, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import ChatWindow from './ChatWindow';

export function Chatbot() {
    const theme = useTheme();

    return (
        <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
                position: 'fixed',
                bottom: 80,
                right: 24,
                zIndex: 1200
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    width: { xs: 'calc(100vw - 48px)', sm: 380 },
                    height: { xs: 500, sm: 550 },
                    borderRadius: 4,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: `0 25px 50px -12px ${alpha(theme.palette.common.black, 0.25)}`
                }}
            >
                <ChatWindow />
            </Paper>
        </motion.div>
    );
}

export default Chatbot;
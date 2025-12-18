// src/components/UI/LoadingSpinner.jsx
import React from 'react';
import { Box, CircularProgress, Typography, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';

export function LoadingSpinner({
    size = 40,
    message = '',
    fullScreen = false,
    overlay = false
}) {
    const theme = useTheme();

    const content = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
            }}
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
                <CircularProgress
                    size={size}
                    thickness={4}
                    sx={{
                        color: theme.palette.primary.main,
                        '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round'
                        }
                    }}
                />
            </motion.div>
            {message && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );

    if (fullScreen) {
        return (
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: overlay
                        ? alpha(theme.palette.background.default, 0.8)
                        : theme.palette.background.default,
                    zIndex: 9999,
                    backdropFilter: overlay ? 'blur(4px)' : 'none'
                }}
            >
                {content}
            </Box>
        );
    }

    return content;
}

export default LoadingSpinner;
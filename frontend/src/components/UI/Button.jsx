// src/components/UI/Button.jsx
import React from 'react';
import { Button as MuiButton, CircularProgress, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';

const MotionButton = motion(MuiButton);

export function Button({
    children,
    variant = 'contained',
    color = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    startIcon,
    endIcon,
    fullWidth = false,
    onClick,
    sx = {},
    ...props
}) {
    const theme = useTheme();

    const getGradient = () => {
        if (variant !== 'contained') return {};

        const gradients = {
            primary: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            secondary: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
            success: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
            error: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`
        };

        return {
            background: gradients[color] || gradients.primary,
            '&:hover': {
                background: gradients[color] || gradients.primary,
                filter: 'brightness(1.1)'
            }
        };
    };

    return (
        <MotionButton
            variant={variant}
            color={color}
            size={size}
            disabled={disabled || loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : startIcon}
            endIcon={endIcon}
            fullWidth={fullWidth}
            onClick={onClick}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            sx={{
                ...getGradient(),
                position: 'relative',
                overflow: 'hidden',
                ...sx
            }}
            {...props}
        >
            {children}
        </MotionButton>
    );
}

export default Button;
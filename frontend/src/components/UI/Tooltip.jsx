// src/components/UI/Tooltip.jsx
import React from 'react';
import { Tooltip as MuiTooltip, useTheme, alpha, Zoom } from '@mui/material';

export function Tooltip({
    children,
    title,
    placement = 'top',
    arrow = true,
    enterDelay = 200,
    leaveDelay = 0,
    ...props
}) {
    const theme = useTheme();

    if (!title) return children;

    return (
        <MuiTooltip
            title={title}
            placement={placement}
            arrow={arrow}
            enterDelay={enterDelay}
            leaveDelay={leaveDelay}
            TransitionComponent={Zoom}
            componentsProps={{
                tooltip: {
                    sx: {
                        bgcolor: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.grey[800], 0.95)
                            : alpha(theme.palette.grey[900], 0.92),
                        color: '#fff',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        padding: '8px 14px',
                        borderRadius: 2,
                        boxShadow: theme.shadows[4],
                        maxWidth: 300,
                        '& .MuiTooltip-arrow': {
                            color: theme.palette.mode === 'dark'
                                ? alpha(theme.palette.grey[800], 0.95)
                                : alpha(theme.palette.grey[900], 0.92)
                        }
                    }
                }
            }}
            {...props}
        >
            {children}
        </MuiTooltip>
    );
}

export default Tooltip;
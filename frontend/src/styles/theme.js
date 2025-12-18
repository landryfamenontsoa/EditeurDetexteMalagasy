// src/styles/theme.js
import { createTheme, alpha } from '@mui/material/styles';

export const createAppTheme = (mode) => createTheme({
    palette: {
        mode,
        primary: {
            main: '#6366f1',
            light: '#818cf8',
            dark: '#4f46e5',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#ec4899',
            light: '#f472b6',
            dark: '#db2777'
        },
        success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669'
        },
        warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706'
        },
        error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626'
        },
        background: {
            default: mode === 'light' ? '#f8fafc' : '#0f172a',
            paper: mode === 'light' ? '#ffffff' : '#1e293b',
            elevated: mode === 'light' ? '#f1f5f9' : '#334155'
        },
        text: {
            primary: mode === 'light' ? '#1e293b' : '#f1f5f9',
            secondary: mode === 'light' ? '#64748b' : '#94a3b8'
        },
        divider: mode === 'light' ? '#e2e8f0' : '#334155'
    },
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        h1: { fontWeight: 700, fontSize: '2.5rem' },
        h2: { fontWeight: 600, fontSize: '2rem' },
        h3: { fontWeight: 600, fontSize: '1.5rem' },
        h4: { fontWeight: 600, fontSize: '1.25rem' },
        h5: { fontWeight: 500, fontSize: '1.125rem' },
        h6: { fontWeight: 500, fontSize: '1rem' },
        body1: { fontSize: '1rem', lineHeight: 1.7 },
        body2: { fontSize: '0.875rem', lineHeight: 1.6 },
        button: { textTransform: 'none', fontWeight: 500 },
        code: { fontFamily: '"JetBrains Mono", monospace' }
    },
    shape: {
        borderRadius: 12
    },
    shadows: [
        'none',
        `0 1px 2px 0 ${alpha('#000', 0.05)}`,
        `0 1px 3px 0 ${alpha('#000', 0.1)}, 0 1px 2px -1px ${alpha('#000', 0.1)}`,
        `0 4px 6px -1px ${alpha('#000', 0.1)}, 0 2px 4px -2px ${alpha('#000', 0.1)}`,
        `0 10px 15px -3px ${alpha('#000', 0.1)}, 0 4px 6px -4px ${alpha('#000', 0.1)}`,
        `0 20px 25px -5px ${alpha('#000', 0.1)}, 0 8px 10px -6px ${alpha('#000', 0.1)}`,
        `0 25px 50px -12px ${alpha('#000', 0.25)}`,
        ...Array(18).fill('none')
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '10px 20px',
                    fontWeight: 500,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none'
                    }
                },
                contained: {
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                    }
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none'
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    border: mode === 'light' ? '1px solid #e2e8f0' : '1px solid #334155'
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500
                }
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: '0.8125rem'
                }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10
                }
            }
        }
    }
});
// src/styles/theme.js
import { createTheme, alpha } from '@mui/material/styles';

export const createAppTheme = (mode) =>
  createTheme({
    palette: {
      mode,

      /* === COULEURS PRINCIPALES (VERT / ROUGE / BLANC) === */
      primary: {
        main: '#16a34a',      // vert
        light: '#4ade80',
        dark: '#15803d',
        contrastText: '#ffffff',
      },

      secondary: {
        main: '#dc2626',      // rouge
        light: '#f87171',
        dark: '#b91c1c',
        contrastText: '#ffffff',
      },

      success: {
        main: '#16a34a',
        light: '#4ade80',
        dark: '#15803d',
      },

      error: {
        main: '#dc2626',
        light: '#f87171',
        dark: '#b91c1c',
      },

      warning: {
        main: '#f59e0b',
        light: '#fde047',
        dark: '#d97706',
      },

      background: {
        default: mode === 'light' ? '#ffffff' : '#0f172a',
        paper: mode === 'light' ? '#ffffff' : '#1e293b',
        elevated: mode === 'light' ? '#f8fafc' : '#334155',
      },

      text: {
        primary: mode === 'light' ? '#1f2937' : '#f1f5f9',
        secondary: mode === 'light' ? '#6b7280' : '#94a3b8',
      },

      divider: mode === 'light' ? '#e5e7eb' : '#334155',
    },

    typography: {
      fontFamily: '"Inter", system-ui, sans-serif',
      h1: { fontWeight: 700, fontSize: '2.5rem' },
      h2: { fontWeight: 600, fontSize: '2rem' },
      h3: { fontWeight: 600, fontSize: '1.5rem' },
      h4: { fontWeight: 600, fontSize: '1.25rem' },
      h5: { fontWeight: 500, fontSize: '1.125rem' },
      h6: { fontWeight: 500, fontSize: '1rem' },
      body1: { fontSize: '1rem', lineHeight: 1.7 },
      body2: { fontSize: '0.875rem', lineHeight: 1.6 },
      button: { textTransform: 'none', fontWeight: 600 },
    },

    shape: {
      borderRadius: 12,
    },

    shadows: [
      'none',
      `0 1px 2px ${alpha('#000', 0.05)}`,
      `0 2px 4px ${alpha('#000', 0.08)}`,
      `0 4px 8px ${alpha('#000', 0.1)}`,
      ...Array(21).fill('none'),
    ],

    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 20px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },

          /* Bouton principal → vert */
          containedPrimary: {
            backgroundColor: '#16a34a',
            '&:hover': {
              backgroundColor: '#15803d',
            },
          },

          /* Bouton secondaire → rouge */
          containedSecondary: {
            backgroundColor: '#dc2626',
            '&:hover': {
              backgroundColor: '#b91c1c',
            },
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border:
              mode === 'light'
                ? '1px solid #e5e7eb'
                : '1px solid #334155',
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: '0.8125rem',
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
    },
  });

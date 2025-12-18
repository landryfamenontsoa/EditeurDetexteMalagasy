import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

const baseTheme = {
    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
            color: 'inherit', // Hérite de la couleur du mode
        },
        h6: {
            fontWeight: 500,
            color: 'inherit', // Hérite de la couleur du mode
        },
        body1: {
            color: 'inherit', // Hérite de la couleur du mode
        },
        body2: {
            color: 'inherit', // Hérite de la couleur du mode
        },
        caption: {
            color: 'inherit', // Hérite de la couleur du mode
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    fontWeight: 500,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    borderRadius: 16,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: 'none',
                },
            },
        },
        // Styles globaux pour forcer la couleur de texte
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: 'inherit', // Hérite de la couleur du mode
                },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: 'inherit !important', // Force la couleur héritée
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: 'inherit !important', // Force la couleur héritée
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                icon: {
                    color: 'inherit !important', // Force la couleur héritée
                },
            },
        },
    },
};

export const createCustomTheme = (primaryColor = '#8D6E63') => {
    const adjustColor = (color, amount) => {
        return alpha(color, amount / 100);
    };

    const lightTheme = createTheme({
        ...baseTheme,
        palette: {
            mode: 'light',
            primary: {
                contrastText: '#ffffff',
                main: '#2E7D32', // Vert Madagascar
                light: '#4CAF50',
                dark: '#1B5E20',
            },
            secondary: {
                contrastText: '#000000',
                main: '#FF6B35', // Orange traditionnel
                light: '#FF8A65',
                dark: '#E64A19'
            },
            background: {
                default: '#FAFAFA',
                paper: '#FFFFFF',
            },
            text: {
                primary: '#000000', // Noir en mode clair
                secondary: '#000000', // Noir en mode clair
            },
            divider: '#EFEBE9',
            action: {
                hover: adjustColor(primaryColor, 10),
                selected: adjustColor(primaryColor, 20),
            },
            success: {
                main: '#4CAF50',
            },
            warning: {
                main: '#FF9800',
            },
            error: {
                main: '#F44336',
            },
        },
    });

    const darkTheme = createTheme({
        ...baseTheme,
        palette: {
            mode: 'dark',
            primary: {
                main: primaryColor,
                light: adjustColor(primaryColor, 30),
                dark: adjustColor(primaryColor, 70),
                contrastText: '#000000',
            },
            secondary: {
                main: '#FF8A80',
                light: '#FFCDD2',
                dark: '#F44336',
                contrastText: '#000000',
            },
            background: {
                default: '#1E1E1E',
                paper: '#2D2D2D',
            },
            text: {
                primary: '#FFFFFF', // Blanc en mode sombre
                secondary: '#FFFFFF', // Blanc en mode sombre
            },
            divider: '#424242',
            action: {
                hover: adjustColor(primaryColor, 20),
                selected: adjustColor(primaryColor, 30),
            },
            success: {
                main: '#66BB6A',
            },
            warning: {
                main: '#FFA726',
            },
            error: {
                main: '#EF5350',
            },
        },
    });

    return { lightTheme, darkTheme };
};

const { lightTheme, darkTheme } = createCustomTheme();

export { lightTheme, darkTheme };
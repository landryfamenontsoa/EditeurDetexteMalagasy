/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createCustomTheme } from '../theme/theme';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [themeSettings, setThemeSettings] = useState(() => {
        const savedSettings = localStorage.getItem('nexalove-theme-settings');
        return savedSettings
            ? JSON.parse(savedSettings)
            : {
                isDarkMode: false,
                primaryColor: '#8D6E63',
                colorIntensity: 70,
                language: 'fr'
            };
    });

    const { lightTheme, darkTheme } = createCustomTheme(
        themeSettings.primaryColor,
        themeSettings.colorIntensity
    );

    useEffect(() => {
        localStorage.setItem('nexalove-theme-settings', JSON.stringify(themeSettings));
    }, [themeSettings]);

    const toggleTheme = () => {
        setThemeSettings(prev => ({
            ...prev,
            isDarkMode: !prev.isDarkMode
        }));
    };

    const updatePrimaryColor = (color) => {
        setThemeSettings(prev => ({
            ...prev,
            primaryColor: color
        }));
    };

    const updateColorIntensity = (intensity) => {
        setThemeSettings(prev => ({
            ...prev,
            colorIntensity: intensity
        }));
    };

    const updateLanguage = (language) => {
        setThemeSettings(prev => ({
            ...prev,
            language: language
        }));
    };

    const theme = themeSettings.isDarkMode ? darkTheme : lightTheme;

    const value = {
        ...themeSettings,
        toggleTheme,
        updatePrimaryColor,
        updateColorIntensity,
        updateLanguage,
        theme,
    };

    return (
        <ThemeContext.Provider value={value}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
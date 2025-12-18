// src/App.jsx
import React, { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from './styles/theme';
import { EditorProvider } from './contexts/EditorContext';
import AppLayout from './components/layout/AppLayout';

function App() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EditorProvider>
        <AppLayout toggleTheme={toggleTheme} currentMode={mode} />
      </EditorProvider>
    </ThemeProvider>
  );
}

export default App;
import React, { createContext, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme, cyberTheme } from '../themes'; // Updated import

export const ThemeContext = createContext();

const getTheme = (themeName) => {
  switch (themeName) {
    case 'dark':
      return darkTheme;
    case 'cyber':
      return cyberTheme;
    default:
      return lightTheme;
  }
};

export const ThemeContextProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('light');

  const theme = useMemo(() => getTheme(themeName), [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
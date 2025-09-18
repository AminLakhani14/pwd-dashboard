import React, { createContext, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme, cyberTheme } from '../themes'; // Updated import

export interface ThemeContextType {
  themeName: string;
  setThemeName: (theme: string) => void;
}

export const ThemeContext = createContext<ThemeContextType>({ themeName: 'light', setThemeName: () => {} });

const getTheme = (themeName: string): any => {
  switch (themeName) {
    case 'dark':
      return darkTheme;
    case 'cyber':
      return cyberTheme;
    default:
      return lightTheme;
  }
};

export const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
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
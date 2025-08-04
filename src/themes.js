import { createTheme } from '@mui/material/styles';

// Light Theme - Clean and professional
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6c63ff', // A modern, friendly purple
    },
    secondary: {
      main: '#ff6584', // A complementary pink/coral
    },
    background: {
      default: '#f7f7f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#6c757d',
    }
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

// Dark Theme - Sleek and modern
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8a85ff',
    },
    secondary: {
      main: '#ff8b9e',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#adb5bd',
    }
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

// Cyber Theme - Futuristic and bold
export const cyberTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00f5d4', // A vibrant cyan
    },
    secondary: {
      main: '#ff00ff', // A vivid magenta for accents
    },
    background: {
      default: '#0a0a14', // Deep blue/black
      paper: 'rgba(20, 20, 30, 0.7)', // Semi-transparent with a blue tint
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0a0b5',
    }
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});
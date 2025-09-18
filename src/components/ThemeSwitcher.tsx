import React, { useContext } from 'react';
import { ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { ThemeContext } from '../context/ThemeContextProvider';

const ThemeSwitcher = () => {
  const { themeName, setThemeName } = useContext(ThemeContext);

  const handleThemeChange = (_event: React.MouseEvent<HTMLElement>, newTheme: string | null) => {
    if (newTheme !== null) {
      setThemeName(newTheme);
    }
  };

  return (
    <ToggleButtonGroup
      value={themeName}
      exclusive
      onChange={handleThemeChange}
      aria-label="Theme"
      sx={{
        backgroundColor: 'action.hover',
        borderRadius: '20px',
      }}
    >
      <Tooltip title="Light">
        <ToggleButton value="light" aria-label="light theme">
          <LightModeIcon fontSize="small"/>
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Dark">
        <ToggleButton value="dark" aria-label="dark theme">
          <DarkModeIcon fontSize="small"/>
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Cyber">
        <ToggleButton value="cyber" aria-label="cyber theme">
          <SmartToyIcon fontSize="small"/>
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
};

export default ThemeSwitcher;
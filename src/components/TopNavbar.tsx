import React from 'react';
import { AppBar, Toolbar, IconButton, Avatar, Badge, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../features/ui/uiSlice';
import ThemeSwitcher from './ThemeSwitcher';

const TopNavbar = () => {
  const dispatch = useDispatch();

  return (
    <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => dispatch(toggleSidebar())}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        {/* <ThemeSwitcher /> */}
        <Avatar alt="User Profile" src="https://i.pravatar.cc/150?img=3" sx={{ ml: 2, width: 40, height: 40 }} />
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
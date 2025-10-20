import React from 'react';
import { useAppSelector } from '../app/Hooks';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import LeftSidebar from './LeftSidebar';
import TopNavbar from './TopNavbar';

const Layout = () => {
  const { isSidebarOpen } = useAppSelector((state) => state.ui);
  const sidebarWidth = isSidebarOpen ? '260px' : '80px';

  return (
    <Box sx={{ display: 'flex' }}>
      {/* <LeftSidebar /> */}
      {/* <Box
        component="main"
        className="main-content"
        sx={{
          flexGrow: 1,
          marginLeft: { xs: 0, lg: sidebarWidth }, // Apply margin only on large screens
          width: { xs: '100%', lg: `calc(100% - ${sidebarWidth})` }
        }}
      > */}
        {/* <TopNavbar /> */}
        <Box component="div" p={{ xs: 2, sm: 3 }}>
           <Outlet />
        </Box>
      </Box>
    // </Box>
  );
};

export default Layout;
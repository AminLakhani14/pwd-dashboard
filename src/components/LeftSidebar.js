import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BarChartIcon from '@mui/icons-material/BarChart';

const LeftSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.ui);

  const navItems = [
    { to: '/', icon: <DashboardIcon />, text: 'Dashboard' },
    { to: '/reports', icon: <AssessmentIcon />, text: 'Reports' },
    { to: '/analytics', icon: <BarChartIcon />, text: 'Analytics' },
  ];

  return (
    <Box
      className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}
      sx={{ bgcolor: 'background.paper', borderRight: {xs: 0, lg: '1px solid'}, borderColor: 'divider' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center', p: 2, height: '64px' }}>
        {isSidebarOpen && (
            <Typography variant="h6" sx={{fontWeight: 600}}>My Dashboard</Typography>
        )}
        {/* <IconButton onClick={() => dispatch(toggleSidebar())}>
          <ChevronLeftIcon sx={{ transition: 'transform 0.3s', transform: isSidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}/>
        </IconButton> */}
      </Box>
      <Box component="nav" sx={{ p: 2 }}>
        {navItems.map((item) => (
          <Tooltip title={isSidebarOpen ? '' : item.text} placement="right" key={item.text}>
            <NavLink
              to={item.to}
              className="nav-link"
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? 'primary.main' : 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                marginBottom: '10px',
                borderRadius: '8px',
                fontWeight: isActive ? 600 : 400,
                backgroundColor: isActive ? 'action.hover' : 'transparent'
              })}
            >
              {item.icon}
              {isSidebarOpen && <span style={{ marginLeft: '16px' }}>{item.text}</span>}
            </NavLink>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default LeftSidebar;
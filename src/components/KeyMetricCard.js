import React from 'react';
import { Paper, Typography, Box, useTheme } from '@mui/material';

const KeyMetricCard = ({ title, value, icon, color }) => {
    const theme = useTheme();
    const iconColor = color || theme.palette.primary.main;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        height: '100%'
      }}
    >
      <Box>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {value}
        </Typography>
      </Box>
      <Box sx={{ color: iconColor }}>
        {icon}
      </Box>
    </Paper>
  );
};

export default KeyMetricCard;
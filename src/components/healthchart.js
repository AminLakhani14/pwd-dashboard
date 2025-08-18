import React from 'react';
import { Box, Typography, Paper, LinearProgress, useTheme } from '@mui/material';

const HealthMetricsCard = () => {
  const theme = useTheme();

  const metrics = [
    { name: 'All Reports', value: 100, target: 100 },
    { name: 'RHS-A', value: 92, target: 85 },
    { name: 'MSU', value: 76, target: 70 },
    { name: 'FWC', value: 68, target: 65 },
  ];

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: '12px',
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        height: '300px',
        display:'flex',
        flexDirection:'column',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1,
          color: theme.palette.text.primary,
        }}
      >
        Total Number of Visits 
      </Typography>

<div style={{    top: '13%',
    position: 'relative'}}>

      {metrics.map((metric, index) => {
        const progressValue = Math.min(metric.value, 100); 
        return (
          <Box key={index} sx={{ mb: 3, height: '20px', }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0 }}>
              <Typography variant="body1" sx={{ fontWeight: 300, fontSize: '15px',marginBottom:'0px'}}>
                {metric.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center',marginTop:'0px',marginBottom:'0px' }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: 'black',
                    // exceedsTarget ? theme.palette.success.main : theme.palette.error.main,
                  }}
                >
                  {metric.value}
                </Typography>
                {/* {exceedsTarget && <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: '1rem' }} />} */}
              </Box>
            </Box>

            <Box sx={{ position: 'relative', height: '8px' }}>
              <LinearProgress
                variant="determinate"
                value={progressValue}
                sx={{
                  height: '8px',
                  borderRadius: '4px',
                  backgroundColor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    borderRadius: '4px',
                    backgroundColor: 'black',
                    // exceedsTarget ? theme.palette.success.main : theme.palette.error.main,
                  },
                }}
              />
            </Box>
          </Box>
        );
      })}
      </div>
    </Paper>
  );
};

export default HealthMetricsCard;
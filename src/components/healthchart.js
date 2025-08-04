import React from 'react';
import { Box, Typography, Paper, LinearProgress, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const HealthMetricsCard = () => {
  const theme = useTheme();

  const metrics = [
    { name: 'Present', value: 87, target: 80 },
    { name: 'Absent', value: 92, target: 85 },
    { name: 'Leave', value: 76, target: 70 },
    { name: 'Vacant', value: 68, target: 65 },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: '12px',
        backgroundColor: theme.palette.background.paper,
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
        Women Medical Officer Dutie Schedule
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{
          mb: 3,
          color: theme.palette.text.secondary,
        }}
      >
        Achievement vs targets for key health metrics
      </Typography>

      {metrics.map((metric, index) => {
        const exceedsTarget = metric.value >= metric.target;
        const progressValue = Math.min(metric.value, 100); 
        return (
          <Box key={index} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {metric.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: exceedsTarget ? theme.palette.success.main : theme.palette.error.main,
                  }}
                >
                  {metric.value}%
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mx: 1 }}>
                  (Target: {metric.target}%)
                </Typography>
                {exceedsTarget && <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: '1rem' }} />}
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
                    backgroundColor: exceedsTarget ? theme.palette.success.main : theme.palette.error.main,
                  },
                }}
              />
            </Box>
          </Box>
        );
      })}
    </Paper>
  );
};

export default HealthMetricsCard;
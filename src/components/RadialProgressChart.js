import React from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { Paper, Typography } from '@mui/material';

const data = [
  { name: 'Feature A', value: 80, fill: '#8884d8' },
  { name: 'Feature B', value: 45, fill: '#83a6ed' },
  { name: 'Feature C', value: 70, fill: '#8dd1e1' },
  { name: 'Feature D', value: 90, fill: '#82ca9d' },
];

const RadialProgressChart = () => {

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1, sm: 2 }, borderRadius: '16px', border: '1px solid',
        borderColor: 'divider', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%'
      }}>
      <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: 'text.primary' }}>
        Project Completion
      </Typography>
      <ResponsiveContainer width="100%" height={350}>
        <RadialBarChart
          innerRadius="20%"
          outerRadius="80%"
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            clockWise
            dataKey="value"
          />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default RadialProgressChart;
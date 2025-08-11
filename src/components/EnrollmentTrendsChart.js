import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', enrollment: 320, active: 280 },
  { month: 'Feb', enrollment: 410, active: 360 },
  { month: 'Mar', enrollment: 380, active: 340 },
  { month: 'Apr', enrollment: 520, active: 480 },
  { month: 'May', enrollment: 610, active: 550 },
  { month: 'Jun', enrollment: 580, active: 540 },
  { month: 'Jul', enrollment: 720, active: 680 },
  { month: 'Aug', enrollment: 790, active: 740 },
  { month: 'Sep', enrollment: 680, active: 630 },
  { month: 'Oct', enrollment: 750, active: 710 },
  { month: 'Nov', enrollment: 820, active: 780 },
  { month: 'Dec', enrollment: 900, active: 850 }
];

const EnrollmentTrendsChart = () => {
  return (
    <Paper sx={{
      p: 3,
      borderRadius: '16px',
      background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <Typography variant="h6" sx={{ 
        mb: 1,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: 500,
        letterSpacing: '0.5px'
      }}>
        Enrollment & Retention Trends
      </Typography>
      <Typography variant="body2" sx={{ 
        mb: 3,
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.85rem'
      }}>
        Monthly enrollment vs active members
      </Typography>

      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorEnrollment" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6a3093" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6a3093" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4776E6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4776E6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255, 255, 255, 0.1)" 
              vertical={false}
            />
            <XAxis 
              dataKey="month" 
              tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            />
            <YAxis 
              tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              domain={[0, 1000]}
            />
            <Tooltip 
              contentStyle={{
                background: 'rgba(30, 30, 30, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value, name) => {
                if (name === 'enrollment') return [value, 'Enrollment'];
                return [value, 'Active Members'];
              }}
            />
            <Line 
              type="monotone" 
              dataKey="enrollment" 
              stroke="#6a3093"
              strokeWidth={2}
              dot={{ r: 3, fill: '#6a3093' }}
              activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="active" 
              stroke="#4776E6"
              strokeWidth={2}
              dot={{ r: 3, fill: '#4776E6' }}
              activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        mt: 2,
        gap: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            background: '#6a3093',
            mr: 1
          }} />
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Enrollment
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            background: '#4776E6',
            mr: 1
          }} />
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Active Members
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default EnrollmentTrendsChart;
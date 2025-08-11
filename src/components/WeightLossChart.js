import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', value: 3.2, target: 4 },
  { month: 'Feb', value: 4.1, target: 4.5 },
  { month: 'Mar', value: 5.0, target: 5 },
  { month: 'Apr', value: 5.8, target: 5.5 },
  { month: 'May', value: 6.5, target: 6 },
  { month: 'Jun', value: 7.2, target: 6.5 },
  { month: 'Jul', value: 8.1, target: 7 },
  { month: 'Aug', value: 8.9, target: 8 },
  { month: 'Sep', value: 9.5, target: 8.5 },
  { month: 'Oct', value: 10.2, target: 9 },
  { month: 'Nov', value: 11.0, target: 9.5 },
  { month: 'Dec', value: 11.8, target: 10 }
];

const WeightLossChart = () => {
  return (
    <Paper sx={{
      p: 3,
      borderRadius: '12px',
    //   background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <Typography variant="h6" sx={{ 
        mb: 2,
        color: 'rgba(0, 0, 0, 0.9)',
        fontWeight: 500,
        letterSpacing: '0.5px'
      }}>
        Weight Loss Performance
      </Typography>
      <Typography variant="body2" sx={{ 
        mb: 3,
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: '0.85rem'
      }}>
        Average weight loss percentage vs targets
      </Typography>

      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4e54c8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4e54c8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8f94fb" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8f94fb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255, 255, 255, 0.1)" 
              vertical={false} 
            />
            <XAxis 
              dataKey="month" 
              tick={{ fill: 'rgba(0, 0, 0, 0.6)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            />
            <YAxis 
              tick={{ fill: 'rgba(0, 0, 0, 0.6)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              domain={[0, 12]}
            />
            <Tooltip 
              contentStyle={{
                background: 'rgba(30, 30, 30, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'rgb(0, 201, 241)'
              }}
              formatter={(value, name) => {
                if (name === 'value') return [`${value}%`, 'Actual'];
                return [`${value}%`, 'Target'];
              }}
            />
            <Area 
              type="monotone" 
              dataKey="target" 
              stroke="#8f94fb"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fillOpacity={0.1}
              fill="url(#colorTarget)" 
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#4e54c8"
              strokeWidth={2}
              fillOpacity={0.3}
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      <Box sx={{ 
        mt: 3,
        p: 2,
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '8px',
        borderLeft: '3px solidrgb(200, 78, 169)'
      }}>
        <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.8)' }}>
          <strong>Aug</strong> • avgLoss: <strong style={{ color: '#4e54c8' }}>8.9%</strong> • target: <strong>8%</strong>
        </Typography>
      </Box>
    </Paper>
  );
};

export default WeightLossChart;
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Paper, Typography, useTheme } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Custom Theme with Teal and Orange Colors
const customTheme = createTheme({
  palette: {
    primary: { main: '#158aa7' },  // Teal
    // secondary: { main: '#FF7F50' }, // Coral/Orange
    // background: { paper: '#f5f5f5' },
    text: { primary: '#158aa7' },
  },
  typography: { fontFamily: 'Roboto, sans-serif' },
});

// Sample Data
const data = [
  { name: 'Badin', value: 50 },
  { name: 'Dad', value: 18 },
  { name: 'Hyderabad', value: 42 },
  { name: 'Jacobabad', etc: 35 },
  { name: 'Jamshoro', value: 28 },
  { name: 'Karachi Central', value: 32 },
  { name: 'Karachi East', value: 25 },
  { name: 'Karachi South', value: 30 },
  { name: 'Kashmore', value: 27 },
  { name: 'Khairpur', value: 26 },
  { name: 'Larkana', value: 29 },
  { name: 'Mirpurkhas', value: 22 },
  { name: 'Naushero Feroze', value: 20 },
  { name: 'Shaheed Benazirabad', value: 38 },
  { name: 'Sanghar', value: 45 },
  { name: 'Sukkur', value: 40 },
  { name: 'Tando Allahyar', value: 15 },
  { name: 'Tharparkar', value: 20 },
  { name: 'Umerkot', value: 25 },
];

const FuturisticGraph = () => {
  const theme = useTheme();

  return (
    <ThemeProvider theme={customTheme}>
      <Paper
        elevation={10}
        sx={{
          p: 3,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
          boxShadow: '0 0 20px rgba(0, 128, 128, 0.2)',
        }}
      >
        <Typography
          variant="h4"
          sx={{ 
            mb: 4, 
            color: 'primary.main', 
            textAlign: 'center', 
            fontWeight: 'bold',
            textShadow: '0 0 5px rgba(0, 128, 128, 0.2)'
          }}
        >
          Population Welfare Department - FWC
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis 
              dataKey="name" 
              stroke="#158aa7" 
              interval={0} 
              angle={-45} 
              textAnchor="end" 
              height={100} 
            />
            <YAxis stroke="#158aa7" />
            <Tooltip
              contentStyle={{
                background: '#ffffff',
                border: '1px solid #158aa7',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              }}
              itemStyle={{ color: '#158aa7' }}
            />
            <Bar dataKey="value" fill="url(#gradient)" />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                {/* <stop offset="5%" stopColor="#FF7F50" />  */}
                 {/* Orange */}
                <stop offset="95%" stopColor="#158aa7" /> {/* Teal */}
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </ThemeProvider>
  );
};

export default FuturisticGraph;
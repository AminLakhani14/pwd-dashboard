import * as React from 'react';
import { 
  Typography,
  CardContent,
  useTheme
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

const furnitureData = [
  { shortform: 'OT', fullForm: 'Office Table', good: 36, satisfactory: 8, poor: 4 }, 
  { shortform: 'OC', fullForm: 'Office Chairs', good: 30, satisfactory: 1, poor: 6 }, 
  { shortform: 'B', fullForm: 'Benches', good: 26, satisfactory: 5, poor: 4 }, 
  { shortform: 'ET', fullForm: 'Examination Table', good: 23, satisfactory: 4, poor: 2 }, 
  { shortform: 'IT', fullForm: 'Insertion Table', good: 35, satisfactory: 4, poor: 5 }, 
  { shortform: 'RS', fullForm: 'Revolving Stool', good: 41, satisfactory: 2, poor: 5 }, 
  { shortform: 'MC', fullForm: 'Medicine Cabinet', good: 48, satisfactory: 8, poor: 5 }, 
];

export default function StackBars() {
  const theme = useTheme();
  
  return (
   
      <CardContent >
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 800,
            mb: 1,
            color: theme.palette.text.primary,
            fontFamily: 'inherit',
            fontSize: 16
          }}
        >
          Furniture Position
        </Typography>
        
        <BarChart
          dataset={furnitureData}
          series={[
            { 
              dataKey: 'good', 
              label: 'Good',
              color: '#4CAF50',
              valueFormatter: (value) => `${value} items`
            },  
            { 
              dataKey: 'satisfactory', 
              label: 'Satisfactory',
              color: '#FFC107',
              valueFormatter: (value) => `${value} items`
            },   
            { 
              dataKey: 'poor', 
              label: 'Poor',
              color: '#F44336',
              valueFormatter: (value) => `${value} items`
            },
          ]}
          xAxis={[{ 
            dataKey: 'fullForm',
            scaleType: 'band',
            tickLabelStyle: { 
              fontSize: 6.7,
              angle: 12,
              // textAnchor: 'start',
              // fill: theme.palette.text.secondary
            },
          }]}
          height={142}
          margin={{ 
            left: 5, 
            right: 5, 
            top: 0.5, 
            bottom: 0.3 
          }}
          slotProps={{
            legend: {
              direction: 'row',
              // position: { vertical: 'bottom', horizontal: 'middle' },
              itemMarkWidth: 8,
              itemMarkHeight: 8,
              labelStyle: {
                fontSize: 4,
              },
            },
          }}
          colors={['#4CAF50', '#FFC107', '#F44336']}
          tooltip={{
            trigger: 'item',
            content: ({ series, dataIndex }) => {
              const item = furnitureData[dataIndex];
              const total = item.good + item.poor + item.satisfactory;
              return (
                <div style={{ 
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '8px',
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 10, fontFamily: 'inherit', }}>
                    {item.fullForm}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 10, fontFamily: 'inherit', }}>
                    Good: {item.good} ({(item.good/total*100).toFixed(0)}%)
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 10, fontFamily: 'inherit', }}>
                    Satisfactory: {item.satisfactory} ({(item.satisfactory/total*100).toFixed(0)}%)
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 10, fontFamily: 'inherit', }}>
                    Poor: {item.poor} ({(item.poor/total*100).toFixed(0)}%)
                  </Typography>
                </div>
              );
            },
          }}
        />
      </CardContent>
  );
}
import * as React from 'react';
import { 
  Typography,
  CardContent,
  useTheme
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { Padding } from '@mui/icons-material';

const furnitureData = [
  { shortform: 'OT', fullForm: 'Office Table', good: 133, satisfactory: 70, poor: 22 }, 
  { shortform: 'OC', fullForm: 'Office Chairs', good: 121, satisfactory: 74, poor: 29 }, 
  { shortform: 'B', fullForm: 'Benches', good: 132, satisfactory: 67, poor: 16 }, 
  { shortform: 'ET', fullForm: 'Examination Table', good: 117, satisfactory: 81, poor: 13 }, 
  { shortform: 'IT', fullForm: 'Insertion Table', good: 120, satisfactory: 68, poor: 13 }, 
  { shortform: 'RS', fullForm: 'Revolving Stool', good: 109, satisfactory: 54, poor: 19 }, 
  { shortform: 'MC', fullForm: 'Medicine Cabinet', good: 88, satisfactory: 85, poor: 30 }, 
];

export default function StackBars() {
  const theme = useTheme();
  
  return (
   
      <CardContent >
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 600,
            mb: 1,
            color: theme.palette.text.primary,
            fontFamily: 'inherit',
            fontSize: 16,
            // padding: 0,
            // margin: 1,
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
          height={150}
          margin={{ 
            left: -20, 
            right: 0, 
            top: 0.5, 
            bottom: 0.3 
          }}
          slotProps={{
            legend: {
              // direction: 'row',
              // position: { vertical: 'bottom', horizontal: 'middle' },
              itemMarkWidth: 8,
              itemMarkHeight: 8,
              labelStyle: {
                fontSize: 4,
                },
            },
          }}
          sx={{ "& .MuiChartsLabelMark-root.MuiChartsLabelMark-square": { borderRadius: "10px !important" }, }}
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
                  borderRadius: '20px',
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
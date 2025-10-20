import * as React from 'react';
import { 
  Typography,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

export default function StackBars() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const PWDdashboard = useSelector((state: RootState) => state.PWDINITSLICE);
  const furnitureData = PWDdashboard.furnitureData || [];
  
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
              fontSize: isMobile ? 8 : 6.7,
              angle: isMobile ? 0 : 12,
            },
          }]}
          height={isMobile ? 200 : 150}
          margin={{ 
            left: isMobile ? 40 : -20, 
            right: isMobile ? 10 : 0, 
            top: isMobile ? 10 : 0.5, 
            bottom: isMobile ? 40 : 0.3 
          }}
          slotProps={{
            legend: {
              sx: {
                '& .MuiChartsLegend-label': { fontSize: isMobile ? 10 : 8 },
              },
            },
          }}
          sx={{ 
            "& .MuiChartsLabelMark-root.MuiChartsLabelMark-square": { borderRadius: "10px !important" },
            width: "100%",
            overflow: "visible"
          }}
          colors={['#4CAF50', '#FFC107', '#F44336']}
          
        />
      </CardContent>
  );
}
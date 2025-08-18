import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import HealthMetricsCard from "./healthchart";
import { PieChart as PieChartMUI } from '@mui/x-charts/PieChart';
import StackBars from "./StackBars";

const COLORS = {
  present: "#4CAF50",
  absent: "#F44336",
  late: "#FFC107",
  leave: "#FF9800",
  notMarked: "#42A5F5",
  grey: "#E0E0E0",
};
const data2 = [
  { label: 'Branded', value: 700 },
  { label: 'Un Branded', value: 300 },
];
const data = [
  { name: "Present", value: 57.47, color: "#4caf50" },
  { name: "Absent", value: 14.51, color: "#f44336" },
  { name: "vacant", value: 7.23, color: "#2196f3" },
  { name: "Leave", value: 9.33, color: "#ff9800" },
];

const DonutWithCenterText = ({ value, color, label, size = 80 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const chartSize = isMobile ? Math.min(size, 70) : size;
  const outerRadius = chartSize / 2.5;
  const innerRadius = outerRadius * 0.7;

  return (
    <Box sx={{ textAlign: "center" }}>
      <ResponsiveContainer width={chartSize} height={chartSize}>
        <PieChart>
          <Pie
            data={[
              { value, color },
              { value: 100 - value, color: COLORS.grey },
            ]}
            dataKey="value"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={90}
            endAngle={-270}
          >
            <Cell fill={color} />
            <Cell fill={COLORS.grey} />
          </Pie>
          <text
            x="50%"
            y="50%"
            fill="#333"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={chartSize / (isMobile ? 6 : 8)}
            fontWeight="bold"
          >
            {value}%
          </text>
        </PieChart>
      </ResponsiveContainer>
      <Typography 
        style={{
          fontSize: chartSize / (isMobile ? 5 : 7),
          marginTop: isMobile ? 4 : 8
        }} 
        variant={size > 100 ? "subtitle1" : "subtitle2"}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default function KeyMetricCard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Box sx={{ 
      width: "100%", 
      p: isMobile ? 1 : 2,
      maxWidth: '100vw',
      overflowX: 'hidden'
    }}>
      <Grid 
        container 
        spacing={isMobile ? 1 : isTablet ? 2 : 3} 
        alignItems="stretch"
      >
        {/* Left Column (Health Metrics + Stack Bars) */}
        <Grid item xs={12} sm={12} md={4} lg={4} sx={{ order: { xs: 1, sm: 1, md: 1 } }}>
          <HealthMetricsCard />
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3, 
            height: "auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            marginTop: isMobile ? '10px' : '20px',
          }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <StackBars/>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Middle Column (Statistics + FWC Status) */}
        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ order: { xs: 3, sm: 3, md: 3 } }}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3, 
            height: isMobile ? "auto" : "300px",
            width: "100%",
            display: "flex",
            flexDirection: "column"
          }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom align="center">
                Statistics
              </Typography>

              <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "space-between",
                height: "calc(100% - 40px)"
              }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                  <DonutWithCenterText
                    value={data[0].value}
                    color={data[0].color}
                    label={data[0].name}
                    size={isMobile ? 80 : 100}
                  />
                </Box>

                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  gap: 1,
                  flexWrap: isMobile ? "wrap" : "nowrap"
                }}>
                  {data.slice(1).map((item, index) => (
                    <DonutWithCenterText
                      key={index}
                      value={item.value}
                      color={item.color}
                      label={item.name}
                      size={isMobile ? 60 : 70}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3, 
            height: "auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            marginTop: isMobile ? '10px' : '20px'
          }}>
            <CardContent sx={{flexGrow:1}}>
              <Typography variant="h6" fontWeight={600} gutterBottom align="center">
                Status Of FWC
              </Typography>
              <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "space-between",
                height: "215px"
              }}>
                <PieChartMUI
                  series={[
                    {
                      startAngle: -90,
                      endAngle: 90,
                      paddingAngle: 5,
                      innerRadius: 60,
                      outerRadius: 80,
                      cy: '75%',
                      data: data2,
                    },
                  ]}
                  width={isMobile ? 300 : 200}
                  height={150}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Right Column (Attendance Overview) - Always on right side */}
        <Grid item xs={12} sm={12} md={4} lg={4} sx={{ order: { xs: 3, sm: 3, md: 3 } }}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3, 
            height: "100%",
            width:  isMobile ? "100%" : "125%",
            display: "flex",
            flexDirection: "column",
          }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography 
                variant="h6" 
                sx={{
                  fontSize: isMobile ? "14px" : "16px", 
                  marginBottom: isMobile ? '15px' : '30px'
                }} 
                fontWeight={600} 
                gutterBottom 
                align="center"
              >
                Attendance Overview
              </Typography>

              <Grid container spacing={isMobile ? 1 : 2} sx={{ height: "auto", justifyContent: 'center' }}>
                <Grid item xs={12} sm={6} md={12}>
                  <Box sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: isMobile ? 1 : 2,
                    width:  isMobile ? "100%" : "150%",
                    height: "100%",
                    justifyContent: "space-between",
                  }}>
                    {[
                      { label: "All Staff", value: "1885", borderLeft: 'none' },
                      { label: "Present", value: "981", borderLeft: '5px solid green' },
                      { label: "Absent", value: "113", borderLeft: '5px solid red' },
                      { label: "Vacant", value: "57", borderLeft: '5px solid gray' },
                      { label: "Leave", value: "57", borderLeft: '5px solid #f39c12' },
                    ].map((item, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          display: "flex", 
                          flexDirection: "column",
                          gap: 1,
                          p: 1,
                          background: "rgba(255,255,255,0.7)",
                          borderRadius: 2,
                          boxShadow: "1px 1px 8px -1px rgb(160 160 160)",
                          borderLeft: item.borderLeft,
                        }}
                      >
                        <Typography variant={isMobile ? "body2" : "subtitle2"} align="center">
                          {item.label}
                        </Typography>
                        <Typography variant="h6" align="center" fontWeight="bold">
                          {item.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
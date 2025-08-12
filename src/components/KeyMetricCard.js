import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
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
  const chartSize = size;
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
            fontSize={chartSize / 8}
            fontWeight="bold"
          >
            {value}%
          </text>
        </PieChart>
      </ResponsiveContainer>
      <Typography style={{fontSize: size / 7}} variant={size > 100 ? "subtitle1" : "subtitle2"}>
        {label}
      </Typography>
    </Box>
  );
};

export default function KeyMetricCard() {
  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Grid container spacing={3} alignItems="stretch" >
        {/* Card 2 - Monthly Statistics (Smaller Height) */}
        <Grid item xs={12} md={4}>
           <HealthMetricsCard />
           <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3, 
            height: "auto", // Reduced height
            width: "auto",
            display: "flex",
            flexDirection: "column",
            marginTop:'20px',
          }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <StackBars/>
              </CardContent>
              </Card>
           
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3, 
            height: "300px", // Reduced height
            width: "369px",
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
                {/* Present - Centered at top */}
                <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                  <DonutWithCenterText
                    value={data[0].value}
                    color={data[0].color}
                    label={data[0].name}
                    size={100}
                  />
                </Box>

                {/* Bottom row - Absent, Late, Leave */}
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                  {data.slice(1).map((item, index) => (
                    <DonutWithCenterText
                      key={index}
                      value={item.value}
                      color={item.color}
                      label={item.name}
                      size={70}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3, 
            height: "auto", // Reduced height
            width: "369px",
            display: "flex",
            flexDirection: "column",
            marginTop: "20px"
          }}>
          <CardContent sx={{flexGrow:1}}>
            <Typography variant="h6" fontWeight={600} gutterBottom align="center">
                 Status Of FWC
              </Typography>
              <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "space-between",
                height: "auto"
              }}>
                {/* Present - Centered at top */}
                <PieChartMUI
                  series={[
                    {
                      startAngle: -90,
                      endAngle: 90,
                      paddingAngle: 5,
                      innerRadius: 60,
                      outerRadius: 80,
                      cy: '75%',
                      data:data2,
                    },
                  ]}
                  width={200}
                  height={150}
                  // hideLegend
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Card 3 - Attendance Overview (Taller Height) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3, 
            height: "auto",
            width: "250px",
            display: "flex",
            flexDirection: "column",
          }}>
            
            <CardContent sx={{ flexGrow: 1, }}>
              <Typography variant="h6" sx={{fontSize:"16px", marginBottom:'30px' }} fontWeight={600} gutterBottom align="center">
                Attendance Overview
              </Typography>

              <Grid container spacing={2} sx={{ height: "auto",justifyContent:'center' }}>
                {/* Left Column - Stats */}
                <Grid item xs={6}>
                  <Box sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: 2,
                    width:'100%',
                    height: "100%",
                    justifyContent: "space-between",
                  }}>

                    <Box sx={{ 
                      display: "flex", 
                      flexDirection: "column",
                      gap: 1,
                      width:'12vw',
                      p: 1,
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: 2,
                      boxShadow: "1px 1px 8px -1px rgb(160 160 160)",
                    }}>
                      <Typography variant="subtitle2" align="center">
                        All Staff
                      </Typography>
                      <Typography variant="h6" align="center" fontWeight="bold">
                        1885
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      display: "flex", 
                      flexDirection: "column",
                      gap: 1,
                      p: 1,
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: 2,
                      boxShadow: "1px 1px 8px -1px rgb(160 160 160)",
                      borderLeft: '5px solid green',
                    }}>
                      <Typography variant="subtitle2" align="center">
                      Present
                      </Typography>
                      <Typography variant="h6" align="center" fontWeight="bold">
                      981
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      display: "flex", 
                      flexDirection: "column",
                      gap: 1,
                      p: 1,
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: 2,
                      boxShadow: "1px 1px 8px -1px rgb(160 160 160)",
                      borderLeft: '5px solid red',
                    }}>
                      <Typography variant="subtitle2" align="center">
                      Absent
                      </Typography>
                      <Typography variant="h6" align="center" fontWeight="bold">
                      113
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      display: "flex", 
                      flexDirection: "column",
                      gap: 1,
                      p: 1,
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: 2,
                      boxShadow: "1px 1px 8px -1px rgb(160 160 160)",
                      borderLeft: '5px solid gray',
                    }}>
                      <Typography variant="subtitle2" align="center">
                      Vacant
                      </Typography>
                      <Typography variant="h6" align="center" fontWeight="bold">
                      57
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      display: "flex", 
                      flexDirection: "column",
                      gap: 1,
                      p: 1,
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: 2,
                      boxShadow: "1px 1px 8px -1px rgb(160 160 160)",
                      borderLeft: '5px solid #f39c12',
                    }}>
                      <Typography variant="subtitle2" align="center">
                      Leave
                      </Typography>
                      <Typography variant="h6" align="center" fontWeight="bold">
                      57
                      </Typography>
                    </Box>
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
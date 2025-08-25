import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useMediaQuery,
  useTheme,
  Tooltip
} from "@mui/material";
import HealthMetricsCard from "./healthchart";
import StackBars from "./StackBars";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts";
import '../index.css'

const COLORS = {
  present: "#4CAF50",
  absent: "#eeeeee45",
  late: "#FFC107",
  leave: "#4caf50",
  notMarked: "#42A5F5",
  grey: "#E0E0E0",
};
const data2 = [
  { label: 'Branded', value: 700 },
  { label: 'Un Branded', value: 300 },
];
const data = [
  { name: "Present", value: 57.47, color: "#4caf50" },
  { name: "Absent", value: 14.51, color: "#eeeeee45" },
  { name: "vacant", value: 7.23, color: "#2196f3" },
  { name: "Leave", value: 9.33, color: "#4caf50" },
];


// const DonutWithCenterText = ({ value, color, label, size = 80 }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
//   const chartSize = isMobile ? Math.min(size, 70) : size;
//   const outerRadius = chartSize / 2.5;
//   const innerRadius = outerRadius * 0.7;

//   return (
//     <Box sx={{ textAlign: "center" }}>
//       <ResponsiveContainer width={chartSize} height={chartSize}>
//         <PieChart>
//           <Pie
//             data={[
//               { value, color },
//               { value: 100 - value, color: COLORS.grey },
//             ]}
//             dataKey="value"
//             innerRadius={innerRadius}
//             outerRadius={outerRadius}
//             startAngle={90}
//             endAngle={-270}
//           >
//             <Cell fill={color} />
//             <Cell fill={COLORS.grey} />
//           </Pie>
//           <text
//             x="50%"
//             y="50%"
//             fill="#333"
//             textAnchor="middle"
//             dominantBaseline="middle"
//             fontSize={(isMobile ? 6 : 10)}
//             fontWeight= '600'
//           >
//             {value}%
//           </text>
//         </PieChart>
//       </ResponsiveContainer>
//       <Typography 
//         style={{
//           fontSize: (isMobile ? 5 : 13),
//           marginTop: isMobile ? 4 : 8,
//           fontWeight: '600',
//         }} 
//         variant={size > 100 ? "subtitle1" : "subtitle2"}
//       >
//         {label}
//       </Typography>
//     </Box>
//   );
// };

export default function KeyMetricCard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Box sx={{ 
      width: "100%", 
      p: isMobile ? 1 : '2px',
      maxWidth: '100%',
      overflowX: 'hidden',
      marginBottom: '20px'
    }}>
      <Grid 
        container 
        spacing={isMobile ? 1 : isTablet ? 2 : 3} 
        alignItems="stretch"
        sx={{flexWrap:'nowrap'}}
      >
        {/* Left Column (Health Metrics + Stack Bars) */}
        {/* <Grid item xs={12} sm={12} md={4} lg={4} sx={{ order: { xs: 1, sm: 1, md: 1 } }}> */}
        <Grid item xs={12} sm={12} md={4} lg={4} sx={{width:'40%'}}>
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
        {/* <Grid item xs={12} sm={12} md={6} lg={6} sx={{ order: { xs: 3, sm: 3, md: 3 } }}> */}
        <Grid item xs={12} sm={12} md={6} lg={6} sx={{width:'36.5%'}}>
       <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3, 
            height: isMobile ? "auto" : "300px",
            width: "100%",
            display: "flex",
            flexDirection: "column"
          }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom align="left" 
              sx={{
                fontWeight: 600,
                mb: 1,
                color: theme.palette.text.primary,
                fontFamily: 'inherit',
                fontSize: 16
              }}
              >
                Statistics
              </Typography>

              <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "space-between",
                height: "calc(100% - 40px)"
              }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2, flexDirection: "column", alignItems: "center" }}>
                  <PieChart
                    series={[
                      {
                        innerRadius: 35,
                        outerRadius: 60,
                        arcLabel: (item) => `${item.value}`, // Display the value
                        data: [
                          { label: "Available", value: 57.47, color: "#4caf50" },
                          { label: "Unavailable", value: 42.53, color: "#b3b3b3" },
                        ],
                      },
                    ]}
                    sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fontWeight: 'bold',
                          fontSize:'8px'
                        },
                      }}
                    margin={{ right: 5 }}
                    width={isMobile ? 80 : 120}
                    height={isMobile ? 80 : 120}
                    slotProps={{
                      legend: { hidden: true },
                    }}
                  >
                    <Tooltip
                      formatter={(value) => `${value}%`}
                      labelFormatter={(label) => label}
                      slotProps={{ tooltip: { sx: { fontSize: "0.7rem" } } }}
                    />
                  </PieChart>
                </Box>

                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  gap: 5,
                  flexWrap: isMobile ? "wrap" : "nowrap"
                }}>
                  <Box sx={{ textAlign: "center" }}>
                    <PieChart
                      series={[
                        {
                          startAngle: -90,
                          endAngle: 90,
                          paddingAngle: 5,
                          innerRadius: 30,
                          outerRadius: 52,
                          cy: '75%',
                          data: data2,
                        },
                      ]}
                      margin={{ right: 5 }}
                      width={isMobile ? 300 : 120}
                      height={90}
                      slotProps={{
                        legend: { hidden: true },
                      }}
                    >
                      <Tooltip
                        formatter={(value) => `${value}`}
                        labelFormatter={(label) => label}
                        slotProps={{ tooltip: { sx: { fontSize: "0.7rem" } } }}
                      />
                    </PieChart>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <PieChart
                      series={[
                        {
                          innerRadius: 17,
                          outerRadius: 33, // Slightly reduced to help with label size
                          arcLabel: (item) => `${item.value}`, // Display the value
                          data: [
                            { label: "Available", value: 97.23, color: "#4caf50" },
                            { label: "Unavailable", value: 92.77, color: "#b3b3b3" },
                          ],
                        },
                      ]}
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fontWeight: 'bold',
                          fontSize:'7px'
                        },
                      }}
                      margin={{ right: 5 }}
                      width={isMobile ? 60 : 70}
                      height={isMobile ? 60 : 70}
                      slotProps={{
                        legend: { hidden: true },
                      }}
                    >
                      <Tooltip
                        formatter={(value) => `${value}%`}
                        labelFormatter={(label) => label}
                        slotProps={{ tooltip: { sx: { fontSize: "0.7rem" } } }}
                      />
                    </PieChart>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <PieChart
                      series={[
                        {
                          innerRadius: 17,
                          outerRadius: 33, // Slightly reduced to help with label size
                          arcLabel: (item) => `${item.value}`, // Display the value
                          data: [
                            { label: "Available", value: 99.33, color: "#4caf50" },
                            { label: "Unavailable", value: 90.67, color: "#b3b3b3" },
                          ],
                        },
                      ]}
                       sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fontWeight: 'bold',
                          fontSize:'7px'
                        },
                      }}
                      margin={{ right: 5 }}
                      width={isMobile ? 60 : 70}
                      height={isMobile ? 60 : 70}
                      slotProps={{
                        legend: { hidden: true },
                      }}
                    >
                      <Tooltip
                        formatter={(value) => `${value}%`}
                        labelFormatter={(label) => label}
                        slotProps={{ tooltip: { sx: { fontSize: "0.7rem" } } }}
                      />
                    </PieChart>
                  </Box>
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
              <Typography variant="h6" fontWeight={600} gutterBottom align="left"
               sx={{ 
                fontWeight: 800,
                mb: 1,
                color: theme.palette.text.primary,
                fontFamily: 'inherit',
                fontSize: 16
              }}>
                Status Of FWC
              </Typography>
              <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "space-between",
                height: "215px"
              }}>
                <PieChart
                  series={[
                    {
                      startAngle: -90,
                      endAngle: 90,
                      paddingAngle: 5,
                      innerRadius: 60,
                      outerRadius: 110,
                      cy: '75%',
                      data: data2,
                    },
                  ]}
                  width={isMobile ? 300 : 220}
                  height={150}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Right Column (Attendance Overview) - Always on right side */}
        <Grid item xs={12} sm={12} md={4} lg={4} sx={{width:'23.5%'}}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3, 
            height: "100%",
            width:  isMobile ? "100%" : "100%",
            display: "flex",
            flexDirection: "column",
          }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography 
                variant="h6" 
                sx={{
                  fontSize: isMobile ? "14px" : "16px", 
                  marginBottom: isMobile ? '15px' : '30px',
                  fontFamily: 'inherit',
                }} 
                fontWeight={600} 
                gutterBottom 
                align="left"
              >
                Attendance Overview
              </Typography>

              <Grid container spacing={isMobile ? 1 : 2} sx={{ height: "auto", justifyContent: 'center',width:'100%' }}>
                <Grid item xs={12} sm={6} md={12} sx={{width:'100%'}}>
                  <Box sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: isMobile ? 1 : 3,
                    width:  isMobile ? "100%" : "100%",
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
                          width:'100%'
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
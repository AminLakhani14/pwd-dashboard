import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useMediaQuery,
  useTheme,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import HealthMetricsCard from "./healthchart";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts";
import "../index.css";
import Statisticscard from "./Statisticscard";

const dataset = [
  { month: "Iud kits Count", rainfall: 21, total: 1000 },
  { month: "B.P. Apparatus Count", rainfall: 28, total: 1000 },
  { month: "Stethoscope Count", rainfall: 41, total: 1000 },
  { month: "Thermometer Count", rainfall: 73, total: 1000 },
  { month: "Weighting Machine Count", rainfall: 99, total: 1000 },
  { month: "Stove Count", rainfall: 44, total: 1000 },
  { month: "Autoclave Count", rainfall: 100, total: 1000 },
  { month: "Sterlizer Count", rainfall: 80, total: 1000 },
  { month: "Screen Count", rainfall: 10, total: 1000 },
];

// Attendance data with both counts and percentages
const attendanceData = [
  {
    label: "All Staff",
    count: "1885",
    percentage: "100%",
    color: "#2196F3",
    borderLeft: "none",
  },
  {
    label: "Present",
    count: "1320",
    percentage: "70%",
    color: "#4CAF50",
    borderLeft: "5px solid #4CAF50",
  },
  {
    label: "Absent",
    count: "188",
    percentage: "10%",
    color: "#F44336",
    borderLeft: "5px solid #F44336",
  },
  {
    label: "Vacant",
    count: "377",
    percentage: "20%",
    color: "#9E9E9E",
    borderLeft: "5px solid #9E9E9E",
  },
  {
    label: "Leave",
    count: "0",
    percentage: "0%",
    color: "#FF9800",
    borderLeft: "5px solid #FF9800",
  },
];

export default function KeyMetricCard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Box
      sx={{
        width: "100%",
        p: isMobile ? 1 : "2px",
        maxWidth: "100%",
        overflowX: "hidden",
        marginBottom: "20px",
      }}
    >
      <Grid
        container
        spacing={isMobile ? 1 : isTablet ? 2 : 3}
        alignItems="stretch"
        sx={{ flexWrap: "nowrap" }}
      >
        <Grid item xs={12} sm={12} md={4} lg={4} sx={{ width: "40%" }}>
          <HealthMetricsCard />
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              height: "300px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              marginTop: isMobile ? "10px" : "20px",
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                align="left"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: theme.palette.text.primary,
                  fontFamily: "inherit",
                  fontSize: 16,
                }}
              >
                Equipment Position/Condition
              </Typography>

              <Box sx={{ height: 230, overflow: "auto" }}>
                {dataset.map((item, index) => (
                  <Box key={index} sx={{ mb: 0.3 }}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between", }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ width: 180, fontSize: "0.75rem", color: "gray",paddingTop:'7px' }}
                      >
                        {item.month}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "end",
                          justifyContent:'end',
                          // marginTop: "0px",
                          marginBottom: "2px",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: "black",
                            fontSize: "13px",
                            paddingTop: '7px',
                            // exceedsTarget ? theme.palette.success.main : theme.palette.error.main,
                          }}
                        >
                          {item.rainfall}%
                        </Typography>
                      </Box>
                    </Box>
                     <Box sx={{ position: "relative", height: "8px" }}>
                    <LinearProgress
                      variant="determinate"
                      value={item.rainfall}
                      sx={{
                        height: "8px",
                        borderRadius: "4px",
                        backgroundColor: theme.palette.grey[200],
                        "& .MuiLinearProgress-bar": {
                          borderRadius: "4px",
                          backgroundColor:'#4caf50'
                          // exceedsTarget ? theme.palette.success.main : theme.palette.error.main,
                        },
                      }}
                    />
                  </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ width: "36.5%" }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              height: isMobile ? "auto" : "300px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                align="left"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: theme.palette.text.primary,
                  fontFamily: "inherit",
                  fontSize: 16,
                }}
              >
                SDP's Availability
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "calc(100% - 40px)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 1,
                    flexDirection: "column",
                    alignItems: "center",
                    height: isMobile ? "140px" : "150px",
                    marginTop: "-10px",
                  }}
                >
                  <Statisticscard />
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: "10px", color: "gray" }}
                    >
                      Open / Close Status
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                    flexWrap: isMobile ? "wrap" : "nowrap",
                  }}
                >
                  <Box sx={{ textAlign: "center", marginRight: "18px" }}>
                    <PieChart
                      series={[
                        {
                          innerRadius: 17,
                          outerRadius: 33,
                          data: [
                            {
                              label: "Rented",
                              value: 33.33,
                              color: "#b3b3b3",
                            },
                            {
                              label: "Government",
                              value: 33.33,
                              color: "#0088FE",
                            },
                          ],
                        },
                      ]}
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fontWeight: "bold",
                          fontSize: "7px",
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
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="caption"
                        sx={{ fontSize: "10px", color: "gray" }}
                      >
                        FWC
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ textAlign: "center", marginRight: "18px" }}>
                    <PieChart
                      series={[
                        {
                          innerRadius: 17,
                          outerRadius: 33,
                          data: [
                            {
                              label: "Rented",
                              value: 33.33,
                              color: "#b3b3b3",
                            },
                            {
                              label: "Government",
                              value: 33.33,
                              color: "#FFBB28",
                            },
                          ],
                        },
                      ]}
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fontWeight: "bold",
                          fontSize: "7px",
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
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="caption"
                        sx={{ fontSize: "10px", color: "gray" }}
                      >
                        MSU
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <PieChart
                      series={[
                        {
                          innerRadius: 17,
                          outerRadius: 33,
                          data: [
                            {
                              label: "Unavailable",
                              value: 90.67,
                              color: "#b3b3b3",
                            },
                            {
                              label: "Available",
                              value: 99.33,
                              color: "#FF8042",
                            },
                          ],
                        },
                      ]}
                      sx={{
                        [`& .${pieArcLabelClasses.root}`]: {
                          fontWeight: "bold",
                          fontSize: "7px",
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
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="caption"
                        sx={{ fontSize: "10px", color: "gray" }}
                      >
                        RHS-A
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              height: "300px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              marginTop: isMobile ? "10px" : "20px",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: "text.primary",
                  textAlign: "left",
                  fontFamily: "inherit",
                  fontSize: 16,
                }}
              >
                Status of Building
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: 13 }}
                  >
                    Government
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: 13 }}
                  >
                    33.3%
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: 13 }}
                  >
                    Rented
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: 13 }}
                  >
                    33.3%
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: 13 }}
                  >
                    Pvt (Free Of Cost)
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: 13 }}
                  >
                    33.3%
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: 13 }}
                  >
                    Indication/ Sign Board (Installed)
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: 13 }}
                  >
                    60%
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: 13 }}
                  >
                    Electricity
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: 13 }}
                  >
                    89%
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: 13 }}
                  >
                    Gas
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: 13 }}
                  >
                    78%
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: 13 }}
                  >
                    Water
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: 13 }}
                  >
                    19%
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: 13 }}
                  >
                    Cleanlines
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: 13 }}
                  >
                    98%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={4} lg={4} sx={{ width: "23.5%" }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              height: "100%",
              width: isMobile ? "100%" : "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: isMobile ? "14px" : "16px",
                  marginBottom: isMobile ? "15px" : "20px",
                  fontFamily: "inherit",
                }}
                fontWeight={600}
                gutterBottom
                align="left"
              >
                Attendance Overview
              </Typography>

              <Grid
                container
                spacing={isMobile ? 1 : 2}
                sx={{ height: "auto", justifyContent: "center", width: "100%" }}
              >
                <Grid item xs={12} sm={6} md={12} sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: isMobile ? 1.5 : 2,
                      width: isMobile ? "100%" : "100%",
                      height: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    {attendanceData.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                          p: 1.5,
                          background: "rgba(255,255,255,0.7)",
                          borderRadius: 2,
                          boxShadow: "1px 1px 8px -1px rgb(160 160 160)",
                          borderLeft: item.borderLeft,
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant={isMobile ? "body2" : "subtitle2"}
                            sx={{ fontWeight: 600 }}
                          >
                            {item.label}
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ color: item.color }}
                          >
                            {item.percentage}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            Count: {item.count}
                          </Typography>
                          {item.label !== "All Staff" && (
                            <Box sx={{ width: "60%" }}>
                              <LinearProgress
                                variant="determinate"
                                value={parseInt(item.percentage)}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: theme.palette.grey[200],
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor: item.color,
                                    borderRadius: 3,
                                  },
                                }}
                              />
                            </Box>
                          )}
                        </Box>
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

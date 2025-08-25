import { Box, Card, MenuItem, Select, FormControl, Typography, useTheme, Paper, LinearProgress } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { useState } from "react";

const IecChart = () => {
    const theme = useTheme();
  
  const [chartType, setChartType] = useState("IEC Material");

  const chartData = {
    "IEC Material": [
      { id: 0, value: 10, label: "Material A" },
      { id: 1, value: 15, label: "Material B" },
    ],
    "MEC Wheel": [
      { id: 0, value: 12, label: "Wheel Type X" },
      { id: 1, value: 18, label: "Wheel Type Y" },
    ],
  };

  const handleChange = (event) => {
    setChartType(event.target.value);
  };

  const metrics = [
    { name: "All Reports", value: 100, target: 100 },
    { name: "RHS-A", value: 92, target: 85 },
    { name: "MSU", value: 76, target: 70 },
    { name: "FWC", value: 68, target: 65 },
  ];

  return (
    <>
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2,
        mb: 4,
      }}
    >
      <FormControl fullWidth sx={{ mb: 2 }} size="small">
        <Select
          value={chartType}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Select chart type" }}
        >
          <MenuItem value="IEC Material">IEC Material</MenuItem>
          <MenuItem value="MEC Wheel">MEC Wheel</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ 
        height: 150, // Fixed height container
        width: '100%',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <PieChart
          series={[
            {
              data: chartData[chartType],
              innerRadius: 20, // Consistent inner radius
              outerRadius: 50,  // Consistent outer radius
              paddingAngle: 2,
              cornerRadius: 2,
              highlightScope: { faded: "global", highlighted: "item" },
              faded: { innerRadius: 20, additionalRadius: -10, color: "gray" },
            },
          ]}
          width={170}
          height={120}
          slotProps={{
            legend: {
              direction: "row",
              position: { vertical: "bottom", horizontal: "middle" },
              itemMarkWidth: 8,
              itemMarkHeight: 8,
              labelStyle: { fontSize: 13 },
            },
          }}
        />
      </Box>
    </Card>

    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        p: 3,
        width: "100%",
        // maxWidth: 400,
        bgcolor: "background.paper",
        mb: 4,
        height:'100%'
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
          color: "text.primary",
          textAlign: "left",
          fontFamily: 'inherit',
          fontSize: 16
        }}
      >
        Status of Building
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" sx={{ color: "text.secondary", fontSize: 13 }}>
            Indication/ Sign Board (Installed)
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 13 }}>
            60%
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" sx={{ color: "text.secondary", fontSize: 13 }}>
            Electricity
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 13 }}>
            89%
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" sx={{ color: "text.secondary", fontSize: 13 }}>
            Gas
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 13 }}>
            78%
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" sx={{ color: "text.secondary", fontSize: 13 }}>
            Water
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 13 }}>
            19%
          </Typography>
        </Box>

         <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" sx={{ color: "text.secondary", fontSize: 13 }}>
            Cleanlines
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 13 }}>
            98%
          </Typography>
        </Box>
      </Box>
    </Card>

     <Paper
      elevation={2}
      sx={{
        p: 2.5,
        borderRadius: "12px",
        backgroundColor: theme.palette.background.paper,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}  
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 4,
          color: theme.palette.text.primary,
          fontFamily: "inherit",
          fontSize: 16,
        }}
      >
        Total Number of Visits
      </Typography>

      <div style={{ top: "13%", position: "relative" }}>
        {metrics.map((metric, index) => {
          const progressValue = Math.min(metric.value, 100);
          return (
            <Box key={index} sx={{ mb: 3, height: "20px" }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 0 }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 300,
                    fontSize: "13px",
                    marginBottom: "0px",
                    fontFamily: 'inherit',
                    color: "text.secondary",
                  }}
                >
                  {metric.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "0px",
                    marginBottom: "0px",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: "black",
                      fontSize: "13px",
                      fontFamily: 'inherit',
                    }}
                  >
                    {metric.value}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ position: "relative", height: "8px" }}>
                <LinearProgress
                  variant="determinate"
                  value={progressValue}
                  sx={{
                    height: "8px",
                    borderRadius: "4px",
                    backgroundColor: theme.palette.grey[200],
                    "& .MuiLinearProgress-bar": {
                      borderRadius: "4px",
                      backgroundColor: "black",
                      // exceedsTarget ? theme.palette.success.main : theme.palette.error.main,
                    },
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </div>
    </Paper>

    </>
  );
};

export default IecChart;
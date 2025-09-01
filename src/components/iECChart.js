import { Box, Card, MenuItem, Select, FormControl, Typography, useTheme, Paper, LinearProgress, Tooltip } from "@mui/material";
import { BarChart, pieArcLabelClasses, PieChart } from "@mui/x-charts";
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

   const data2 = [
    { label: "Branded", value: 700 },
    { label: "Un Branded", value: 300 },
  ];

  const handleChange = (event) => {
    setChartType(event.target.value);
  };

const chartSetting = {

};

 const dataset = [
  {
    london: 59,
    paris: 64,
    month: 'General Clients	',
  },
  {
    london: 50,
    paris: 64,
    month: 'F.P Clients	',
  },
  {
    london: 47,
    paris: 64,
    month: 'MCH/RH',
  },
  {
    london: 54,
    paris: 64,
    month: 'C.S Cases',
  },
];
 function valueFormatter(value) {
  return `${value}`;
}


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
          height: 203,
          width: '100%',
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <PieChart
            series={[
              {
                data: chartData[chartType],
                innerRadius: 20,
                outerRadius: 50,
                paddingAngle: 2,
                cornerRadius: 2,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: { innerRadius: 20, additionalRadius: -10, color: "gray" },
              },
            ]}
            sx={{
               "& .MuiChartsSurface-root": { marginTop:'20px',marginBottom:'30px' }
            }}
            width={170}
            height={120}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "bottom", horizontal: "middle" },
                itemMarkWidth: 8,
                itemMarkHeight: 8,
                labelStyle: { fontSize: 6 }, // Changed to 6px
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
          bgcolor: "background.paper",
          mb: 4,
          height: 250,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
            fontSize: 16,
            width: '100%'
          }}
        >
          Status of Building
        </Typography>

        <Box sx={{ height: 200, width: '100%', display: 'flex',  }}>
          <PieChart
            series={[
              {
                startAngle: -90,
                endAngle: 90,
                paddingAngle: 5,
                innerRadius: 45,
                outerRadius: 77,
                cy: "75%",
                cx: "50%",
                data: data2,
              },
            ]}
            sx={{
              "& .MuiChartsLegend-root": { marginBlock: "0px !important" }
            }}
          width={150}
          height={150}
          slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "bottom", horizontal: "middle" },
                itemMarkWidth: 8,
                itemMarkHeight: 8,
                labelStyle: { fontSize: 6 }, // Changed to 6px
              },
            }}
        >
          <Tooltip
            formatter={(value) => `${value}`}
            labelFormatter={(label) => label}
            slotProps={{ tooltip: { sx: { fontSize: "0.7rem" }}}}
          />
        </PieChart>
        </Box>
      </Card>

      <Paper
        elevation={2}
        sx={{
          p: 2.5,
          borderRadius: "12px",
          backgroundColor: theme.palette.background.paper,
          width: "100%",
          height: 245,
          display: "flex",
          flexDirection: "column",
        }}  
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: theme.palette.text.primary,
            fontFamily: "inherit",
            fontSize: 16,
          }}
        >
          Performance of SDP
        </Typography>
        <BarChart
          dataset={dataset}
           margin={{ 
            left: -30, 
            right: 0, 
            top: 20, 
            bottom: 30, 
          }}
          xAxis={[{ dataKey: 'month',  tickLabelStyle: { 
              fontSize: 7,
              angle: 14,
            }, }]}
          series={[
            { dataKey: 'london', label: 'New', valueFormatter },
            { dataKey: 'paris', label: 'Old', valueFormatter },
          ]}
           yAxis= {[{width: 60}]}
        />
      </Paper>
    </>
  );
};

export default IecChart;
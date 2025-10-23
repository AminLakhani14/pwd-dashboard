import { Box, Card, MenuItem, Select, FormControl, Typography, useTheme, Paper, useMediaQuery, CardContent } from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import { useState } from "react";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotificationsIcon from '@mui/icons-material/Notifications';
import type { SelectChangeEvent } from '@mui/material/Select';
import { RootState } from "../app/store";
import { useSelector } from "react-redux";

type ChartType = 'IEC Material' | 'MEC Wheel';

type AlertType = 'danger' | 'warning' | 'good';

interface AlertItem {
  Center: string;
  District: string;
  Message: string;
  AlertLevel: string;
  TotalStock: number;
}

const IecChart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [chartType, setChartType] = useState<ChartType>("IEC Material");
  const PWDdashboard = useSelector((state: RootState) => state.PWDINITSLICE);

  const chartData: Record<ChartType, { id: number; value: number; label: string }[]> = {
    "IEC Material": [
      { id: 0, value: 157, label: "Displayed" },
      { id: 1, value: 28, label: "Non Displayed" },
    ],
    "MEC Wheel": [
      { id: 0, value: 158, label: "Available"  },
      { id: 1, value: 27, label: "Not Available" },
    ],
  };

  const handleChange = (event: SelectChangeEvent) => {
    setChartType(event.target.value as ChartType);
  };

  // Map API alert levels to our AlertType
  const getAlertTypeFromAPI = (alertLevel: string): AlertType => {
    switch (alertLevel) {
      case 'low':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'perfect':
        return 'good';
      default:
        return 'warning';
    }
  };

  // Get icon based on alert level
  const getAlertIcon = (alertLevel: string): React.ReactElement => {
    switch (alertLevel) {
      case 'low':
        return <ErrorIcon />;
      case 'medium':
        return <WarningIcon />;
      case 'perfect':
        return <CheckCircleIcon />;
      default:
        return <WarningIcon />;
    }
  };

  // Transform API data to our alert format
  const alerts = PWDdashboard?.ContraceptivesAlert?.map((alert: AlertItem) => ({
    type: getAlertTypeFromAPI(alert.AlertLevel),
    title: alert.Center,
    message: alert.Message,
    icon: getAlertIcon(alert.AlertLevel),
    district: alert.District,
    totalStock: alert.TotalStock
  })) || [];

  const getAlertStyle = (type: AlertType) => {
    switch (type) {
      case "danger":
        return {
          bgcolor: "#ffebee",
          borderLeft: "4px solid #f44336",
          iconColor: "#f44336",
        };
      case "warning":
        return {
          bgcolor: "#fff3e0",
          borderLeft: "4px solid #ff9800",
          iconColor: "#ff9800",
        };
      case "good":
        return {
          bgcolor: "#e8f5e9",
          borderLeft: "4px solid #4caf50",
          iconColor: "#4caf50",
        };
      default:
        return {
          bgcolor: "#f5f5f5",
          borderLeft: "4px solid #9e9e9e",
          iconColor: "#9e9e9e",
        };
    }
  };

 const dataset = [
  {
    new: 3911,
    old: 2536,
    month: 'General Clients\t',
  },
  {
    new: 7925,
    old: 4434,
    month: 'F.P Clients\t',
  },
  {
    new: 1002,
    old: 804,
    month: 'MCH/RH',
  },
  {
    new: 1743,
    old: 1373,
    month: 'C.S Cases',
  },
];
 function valueFormatter(value: number | null) {
  return value == null ? '' : `${value}`;
 }


  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 3,
            height: isMobile ? "auto" : "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            p: isMobile ? 1 : 2,
            mb: 4,
            filter: "blur(3px)",
            opacity: 0.6,
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
            height: isMobile ? 250 : 203,
            width: '100%',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden"
          }}>
            <PieChart
              series={[
                {
                  data: chartData[chartType],
                  innerRadius: isMobile ? 30 : 20,
                  outerRadius: isMobile ? 70 : 50,
                  paddingAngle: 2,
                  cornerRadius: 2,
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: { innerRadius: 20, additionalRadius: -10, color: "gray" },
                },
              ]}
              sx={{
                 "& .MuiChartsSurface-root": { marginTop:'20px',marginBottom:'30px' }
              }}
              width={isMobile ? 250 : 170}
              height={isMobile ? 150 : 120}
              slotProps={{
              legend: {
                  sx: {
                    '& .MuiChartsLegend-label': { fontSize: isMobile ? 8 : 6 },
                    '& .MuiChartsLegend-series': { gap: 0.5 },
                  },
                },
              }}
            />
          </Box>
        </Card>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // backgroundColor: "#f4f4f4",
            zIndex: 1,
            filter: "blur(2px)",
          }}
        >
          {/* <Typography variant="h6" color="text.secondary">
           Coming Soon
        </Typography> */}
        </Box>
      </Box>

     <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        height: isMobile ? "auto" : "248px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        marginTop: isMobile ? "10px" : "10px",
        overflow: "hidden",
        mb: 4,
      }}
    >
      <CardContent
        sx={{
          pb: 0,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
          align="left"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            fontFamily: "inherit",
            fontSize: 16,
          }}
        >
          <NotificationsIcon /> Urgent Alerts & Issues
        </Typography>
      </CardContent>

      <Box
        sx={{
          overflowY: "auto",
          height: "100%",
          p: 1,
          overflowX: "hidden",
        }}
      >
        {alerts.length > 0 ? (
          alerts.map((alert, index) => {
            const alertStyle = getAlertStyle(alert.type);
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  p: 1.5,
                  mb: 1,
                  borderRadius: 2,
                  ...alertStyle,
                }}
              >
                <Box
                  sx={{
                    color: alertStyle.iconColor,
                    mr: 1.5,
                    mt: 0.2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {alert.icon}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      fontSize: isMobile ? "14px" : "12px",
                      color: theme.palette.text.primary,
                      mb: 0.3,
                    }}
                  >
                    {alert.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: isMobile ? "13px" : "12px",
                      color: theme.palette.text.secondary,
                      lineHeight: 1.3,
                    }}
                  >
                    {alert.message}
                  </Typography>
                </Box>
              </Box>
            );
          })
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: theme.palette.text.secondary,
            }}
          >
            <Typography variant="body2">No alerts found</Typography>
          </Box>
        )}
      </Box>
    </Card>

      <Box sx={{ position: "relative" }}>
        <Paper
          elevation={2}
          sx={{
            p: isMobile ? 1.5 : 2.5,
            borderRadius: "12px",
            backgroundColor: theme.palette.background.paper,
            width: "100%",
            height: isMobile ? "auto" : 245,
            display: "flex",
            flexDirection: "column",
            filter: "blur(3px)",
            opacity: 0.6,
          }}  
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: theme.palette.text.primary,
              fontFamily: "inherit",
              fontSize: isMobile ? 14 : 16,
            }}
          >
            Performance of SDP
          </Typography>
          <BarChart
            dataset={dataset}
             margin={{ 
              left: isMobile ? 40 : -13,
              right: isMobile ? 10 : 0, 
              top: isMobile ? 10 : 20, 
              bottom: isMobile ? 40 : 30, 
            }}
            xAxis={[{ dataKey: 'month',  tickLabelStyle: { 
                fontSize: isMobile ? 8 : 7,
                angle: isMobile ? 0 : 14,
              }, }]}
            series={[
              { dataKey: 'new', label: 'New', valueFormatter },
              { dataKey: 'old', label: 'Old', valueFormatter },
            ]}
             yAxis= {[{width: isMobile ? 80 : 60}]}
            height={isMobile ? 200 : undefined}
            sx={{
              width: "100%",
              overflow: "visible"
            }}
          />
        </Paper>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // backgroundColor: "#f4f4f4",
            zIndex: 1,
            filter: "blur(2px)",
          }}
        >
          {/* <Typography variant="h6" color="text.secondary">
           Coming Soon
        </Typography> */}
        </Box>
      </Box>
    </>
  );
};

export default IecChart;
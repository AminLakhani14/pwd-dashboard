import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  useTheme,
  Drawer,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const HealthMetricsCard = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);

  // Sample data for each metric
  const metricsData = {
    "All Reports": [
      { district: "District A", startDate: "2023-01-01", endDate: "2023-01-31", visits: 35 },
      { district: "District B", startDate: "2023-01-01", endDate: "2023-01-31", visits: 25 },
      { district: "District C", startDate: "2023-01-01", endDate: "2023-01-31", visits: 40 }
    ],
    "FWC": [
      { district: "District A", startDate: "2023-01-01", endDate: "2023-01-31", visits: 150 },
      { district: "District B", startDate: "2023-01-01", endDate: "2023-01-31", visits: 120 },
      { district: "District C", startDate: "2023-01-01", endDate: "2023-01-31", visits: 71 }
    ],
    "RHS-A": [
      { district: "District A", startDate: "2023-01-01", endDate: "2023-01-31", visits: 15 },
      { district: "District B", startDate: "2023-01-01", endDate: "2023-01-31", visits: 18 },
      { district: "District C", startDate: "2023-01-01", endDate: "2023-01-31", visits: 10 }
    ],
    "MSU": [
      { district: "District A", startDate: "2023-01-01", endDate: "2023-01-31", visits: 8 },
      { district: "District B", startDate: "2023-01-01", endDate: "2023-01-31", visits: 7 },
      { district: "District C", startDate: "2023-01-01", endDate: "2023-01-31", visits: 7 }
    ]
  };

  const metrics = [
    { name: "All Reports", value: 406, percentage: 100, target: 100 },
    { name: "FWC", value: 341, percentage: 80, target: 380 },
    { name: "RHS-A", value: 43, percentage: 50, target: 100 },
    { name: "MSU", value: 22, percentage: 20, target: 100 },
  ];

  const handleMetricClick = (metric) => {
    setSelectedMetric(metric);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMetric(null);
  };

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: "12px",
          backgroundColor: theme.palette.background.paper,
          width: "100%",
          height: "300px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1,
            color: theme.palette.text.primary,
            fontFamily: "inherit",
            fontSize: 16,
          }}
        >
          Total Number of Visits
        </Typography>

        <div style={{ top: "13%", position: "relative" }}>
          {metrics.map((metric, index) => {
            const progressValue = Math.min(metric.percentage, 100);
            return (
              <Box 
                key={index} 
                sx={{ mb: 3, height: "20px", cursor: "pointer" }}
                onClick={() => handleMetricClick(metric.name)}
              >
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", mb: 0 }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 300,
                      fontSize: "13px",
                      marginBottom: "0px",
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
                      }}
                    >
                      {metric.value} / {metric.percentage}%
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
                        backgroundColor: metric.value >= 60 ? '#4caf50' : metric.value < 60 && metric.value >= 30 ? '#ff9800' : '#f44336',
                      },
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </div>
      </Paper>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => {}} // Empty onClose to prevent closing via backdrop or escape
        disableEscapeKeyDown
        ModalProps={{
          disableBackdropClick: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: '80%',
            maxWidth: 800,
            bgcolor: 'background.paper',
            borderRadius: '8px 0 0 8px',
            boxShadow: 24,
            p: 4,
            maxHeight: '100vh',
            overflow: 'auto'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2,
          borderBottom: '1px solid #e0e0e0',
          pb: 2
        }}>
          <Typography id="drawer-title" variant="h6" component="h2">
            {selectedMetric} - Visit Details
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        {selectedMetric && (
          <TableContainer>
            <Table stickyHeader aria-label="visit details table">
              <TableHead>
                <TableRow>
                  <TableCell>District</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell align="right">Number of Visits</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {metricsData[selectedMetric].map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.district}</TableCell>
                    <TableCell>{row.startDate}</TableCell>
                    <TableCell>{row.endDate}</TableCell>
                    <TableCell align="right">{row.visits}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Drawer>
    </>
  );
};

export default HealthMetricsCard;
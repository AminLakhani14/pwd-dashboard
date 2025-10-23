import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  useTheme,
  Drawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

interface Metric {
  name: string;
  total: string;
  value: number;
  percentage: number;
  target: number;
}

interface MonitoringReportRecord {
  sbjnum: number;
  Created: string;
  DeviceTimestamp: string;
  Latitude: string;
  Longitude: string;
  SurveyorName: string;
  District: string;
  DistrictName: string;
  CenterName: string;
  Center: string;
  DistrictFieldID: string;
  CenterFieldId: string;
  Project: string;
}

const HealthMetricsCard = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<MonitoringReportRecord[]>([]);
  const PWDdashboard: any = useSelector((state: RootState) => state.PWDINITSLICE);

  const handleMetricClick = (metric: string) => {
    setSelectedMetric(metric);
    
    if (PWDdashboard?.MonitoringReportRecord) {
      let filteredRecords: MonitoringReportRecord[] = [];
      
      switch (metric) {
        case "All Reports":
          // Show all records
          filteredRecords = PWDdashboard.MonitoringReportRecord;
          break;
        case "FWC":
          // Filter records where Project is "FWC"
          filteredRecords = PWDdashboard.MonitoringReportRecord.filter(
            (record: MonitoringReportRecord) => record.Project === "FWC"
          );
          break;
        case "RHS-A":
          // Filter records where Project contains "RHS-A" or "RHS-S"
          filteredRecords = PWDdashboard.MonitoringReportRecord.filter(
            (record: MonitoringReportRecord) => 
              record.Project.includes("RHS-A") || record.Project.includes("RHS-S")
          );
          break;
        case "MSU":
          // Filter records where Project is "MSU"
          filteredRecords = PWDdashboard.MonitoringReportRecord.filter(
            (record: MonitoringReportRecord) => record.Project === "MSU"
          );
          break;
        default:
          filteredRecords = [];
      }
      
      setFilteredData(filteredRecords);
    }
    
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMetric(null);
    setFilteredData([]);
  };

  const handleViewRecord = async (record: MonitoringReportRecord) => {
    try {
      const apiUrl = `https://pwd.kcompute.com/Dashboard/Report?sbjnum=${record.sbjnum}&Heading=${encodeURIComponent(record.Project)}`;
      const response = await fetch(apiUrl, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      let targetUrl: string | null = null;
      if (contentType.includes('application/json')) {
        const data = await response.json();
        targetUrl = data || null;
      } else {
        const text = await response.text();
        targetUrl = (text || '').trim();
      }

      if (!targetUrl) {
        throw new Error('No URL returned by API');
      }

      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to open report link:', error);
    }
  };

  const handleViewLocation = (record: MonitoringReportRecord) => {
    const { Latitude, Longitude } = record;
    if (Latitude && Longitude) {
      const googleMapsUrl = `https://www.google.com/maps?q=${Latitude},${Longitude}`;
      window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          p: window.innerWidth < 600 ? 2 : 3,
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
            fontSize: window.innerWidth < 600 ? 14 : 16,
          }}
        >
          Total Number of Visits
        </Typography>

        <div style={{ top: "13%", position: "relative" }}>
          {PWDdashboard?.linearData && PWDdashboard.linearData.length > 0 ? (
            PWDdashboard.linearData.map((metric: Metric, index: number) => {
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
                        fontSize: window.innerWidth < 600 ? "11px" : "13px",
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
                          fontSize: window.innerWidth < 600 ? "11px" : "13px",
                        }}
                      >
                        {metric.value} / {metric.total}
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
                          backgroundColor: metric.percentage >= 60 ? '#4caf50' : metric.percentage < 60 && metric.percentage >= 30 ? '#ff9800' : '#f44336',
                        },
                      }}
                    />
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No visit data available
              </Typography>
            </Box>
          )}
        </div>
      </Paper>

      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        disableEscapeKeyDown
        ModalProps={{
          hideBackdrop: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: '80%',
            maxWidth: 1000,
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
            {selectedMetric} - Visit Details ({filteredData.length} records)
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        {filteredData.length > 0 ? (
          <TableContainer>
            <Table stickyHeader aria-label="visit details table">
              <TableHead>
                <TableRow>
                  <TableCell>Monitoring List</TableCell>
                  <TableCell>District Name</TableCell>
                  <TableCell>Center Name</TableCell>
                  <TableCell>Date of Visit</TableCell>
                  <TableCell>Officer Name</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.Project}</TableCell>
                    <TableCell>{record.DistrictName}</TableCell>
                    <TableCell>{record.CenterName}</TableCell>
                    <TableCell>{record.DeviceTimestamp}</TableCell>
                    <TableCell>{record.SurveyorName}</TableCell>
                    <TableCell>
                      <IconButton 
                        size="small"
                        onClick={() => handleViewRecord(record)}
                        sx={{ 
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          }
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small"
                        onClick={() => handleViewLocation(record)}
                        disabled={!record.Latitude || !record.Longitude}
                        sx={{ 
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          },
                          '&:disabled': {
                            borderColor: 'action.disabled',
                            color: 'action.disabled'
                          }
                        }}
                      >
                        <LocationOnIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No data available for {selectedMetric}
            </Typography>
          </Box>
        )}
      </Drawer>
    </>
  );
};

export default HealthMetricsCard;
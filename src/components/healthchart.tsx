import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  useTheme,
  Drawer,
  IconButton,
  Button
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    {
      field: 'Project',
      headerName: 'Monitoring List',
      width: 150,
      flex: 1,
    },
    {
      field: 'DistrictName',
      headerName: 'District Name',
      width: 150,
      flex: 1,
    },
    {
      field: 'CenterName',
      headerName: 'Center Name',
      width: 150,
      flex: 1,
    },
    {
      field: 'DeviceTimestamp',
      headerName: 'Date of Visit',
      width: 150,
      flex: 1,
    },
    {
      field: 'SurveyorName',
      headerName: 'Officer Name',
      width: 150,
      flex: 1,
    },
    {
      field: 'view',
      headerName: 'Action',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton 
          size="small"
          onClick={() => handleViewRecord(params.row)}
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
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton 
          size="small"
          onClick={() => handleViewLocation(params.row)}
          disabled={!params.row.Latitude || !params.row.Longitude}
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
      ),
    },
  ];

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
                          backgroundColor: metric.percentage >= 70 ? '#4caf50' : metric.percentage < 70 && metric.percentage >= 40 ? '#ff9800' : '#f44336',
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
            {selectedMetric} - Visit Details
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        {filteredData.length > 0 ? (
          <Box sx={{ height: 'calc(100vh - 150px)', width: '100%' }}>
            <DataGrid
              rows={filteredData.map((record, index) => ({ 
                id: index, // DataGrid requires a unique id for each row
                ...record 
              }))}
              columns={columns}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              disableRowSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
                '& .MuiDataGrid-columnHeaders': {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.default,
                },
              }}
            />
          </Box>
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
import { Box, Card, MenuItem, Select, FormControl, Typography, useTheme, Paper, useMediaQuery, CardContent, Drawer, IconButton } from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotificationsIcon from '@mui/icons-material/Notifications';
import type { SelectChangeEvent } from '@mui/material/Select';
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";

type ChartType = 'IEC Material' | 'MEC Wheel';

type AlertType = 'danger' | 'warning' | 'good';

interface AlertItem {
  Center: string;
  District: string;
  Message: string;
  AlertLevel: string;
  TotalStock: number;
  sbjnum: number;
}

interface StockDetailItem {
  Date: string;
  SDP: string;
  District: string;
  Center: string;
  CondomsStock: number;
  POP: number;
  COC: number;
  ECP: number;
  ThreemonthsInj: number;
  DefoStock: number;
  IUD: number;
  Jadelle: number;
  sbjnum: number;
}

interface PieChartItem {
  id: number;
  value: number;
  label: string;
}

interface IECMaterialDetailRecord {
  asDate: string;
  ProjectName: string;
  District: string;
  Center: string;
  IECMatrial: string;
  "IECMatrialYES/NO": string;
  MECWheel: string;
  "MECWheelYES/NO": string;
}

const IecChart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [chartType, setChartType] = useState<ChartType>("IEC Material");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState<ChartType | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<PieChartItem | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const PWDdashboard = useSelector((state: RootState) => state.PWDINITSLICE);

  const chartData = PWDdashboard.IECMaterialChartData || {
    "IEC Material": [
      { id: 0, value: 0, label: "Displayed" },
      { id: 1, value: 0, label: "Non Displayed" },
    ],
    "MEC Wheel": [
      { id: 0, value: 0, label: "Available" },
      { id: 1, value: 0, label: "Not Available" },
    ],
  };

  const handleChange = (event: SelectChangeEvent) => {
    setChartType(event.target.value as ChartType);
  };

  // Handle pie chart segment click
  const handlePieChartClick = (event: React.MouseEvent, pieParam: any) => {
    if (pieParam && pieParam.dataIndex !== undefined) {
      const clickedItem = chartData[chartType][pieParam.dataIndex];
      setSelectedChartType(chartType);
      setSelectedSegment(clickedItem);
      setSelectedAlert(null);
      setDrawerOpen(true);
    }
  };

  // Handle entire pie chart click (when clicking on the chart but not on a segment)
  const handlePieChartContainerClick = () => {
    setSelectedChartType(chartType);
    setSelectedSegment(null);
    setSelectedAlert(null);
    setDrawerOpen(true);
  };

  // Handle alert click
  const handleAlertClick = (alert: AlertItem) => {
    setSelectedAlert(alert);
    setSelectedChartType(null);
    setSelectedSegment(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedSegment(null);
    setSelectedChartType(null);
    setSelectedAlert(null);
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
    totalStock: alert.TotalStock,
    sbjnum: alert.sbjnum,
    originalAlert: alert // Keep original alert data for matching
  })) || [];

  // Get matching stock details for selected alert
  const getMatchingStockDetails = (): StockDetailItem[] => {
    if (!selectedAlert || !PWDdashboard?.stockdetail) {
      return [];
    }

    return PWDdashboard.stockdetail.filter((stock: StockDetailItem) => 
      stock.sbjnum === selectedAlert.sbjnum
    );
  };

  // Stock details columns for DataGrid
  const getStockDetailColumns = (): GridColDef[] => [
    { 
      field: 'Date', 
      headerName: 'Date', 
      width: 100,
      flex: 1,
    },
    { 
      field: 'SDP', 
      headerName: 'SDP', 
      width: 150,
      flex: 1,
    },
    { 
      field: 'District', 
      headerName: 'District', 
      width: 120,
      flex: 1,
    },
    { 
      field: 'Center', 
      headerName: 'Center', 
      width: 200,
      flex: 2,
    },
    { 
      field: 'CondomsStock', 
      headerName: 'Condoms', 
      width: 100,
      flex: 1,
      type: 'number',
    },
    { 
      field: 'POP', 
      headerName: 'POP', 
      width: 80,
      flex: 1,
      type: 'number',
    },
    { 
      field: 'COC', 
      headerName: 'COC', 
      width: 80,
      flex: 1,
      type: 'number',
    },
    { 
      field: 'ECP', 
      headerName: 'ECP', 
      width: 80,
      flex: 1,
      type: 'number',
    },
    { 
      field: 'ThreemonthsInj', 
      headerName: '3M Inj', 
      width: 80,
      flex: 1,
      type: 'number',
    },
    { 
      field: 'DefoStock', 
      headerName: 'Defo', 
      width: 80,
      flex: 1,
      type: 'number',
    },
    { 
      field: 'IUD', 
      headerName: 'IUD', 
      width: 80,
      flex: 1,
      type: 'number',
    },
    { 
      field: 'Jadelle', 
      headerName: 'Jadelle', 
      width: 80,
      flex: 1,
      type: 'number',
    },
  ];

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

  const getFilteredRecords = (): IECMaterialDetailRecord[] => {
    if (!selectedChartType || !selectedSegment) {
      return PWDdashboard.IECMaterialDetailRecord || [];
    }

    const records = PWDdashboard.IECMaterialDetailRecord || [];

    if (selectedChartType === 'IEC Material') {
      if (selectedSegment.label === 'Displayed') {
        return records.filter(record => record.IECMatrial === 'Displayed');
      } else if (selectedSegment.label === 'Non Displayed') {
        return records.filter(record => record.IECMatrial === 'Non Displayed');
      }
    } else if (selectedChartType === 'MEC Wheel') {
      if (selectedSegment.label === 'Available') {
        return records.filter(record => record.MECWheel === 'Available');
      } else if (selectedSegment.label === 'Not Available') {
        return records.filter(record => record.MECWheel === 'Not Available');
      }
    }

    return records;
  };

  // DataGrid columns configuration for IEC Material
  const getColumns = (): GridColDef[] => {
    const baseColumns: GridColDef[] = [
      { 
        field: 'asDate', 
        headerName: 'Date', 
        width: 100,
        flex: isMobile ? 0 : 1,
      },
      { 
        field: 'District', 
        headerName: 'District', 
        width: 120,
        flex: isMobile ? 0 : 1,
      },
      { 
        field: 'Center', 
        headerName: 'Center', 
        width: 200,
        flex: 2,
      },
    ];

    if (selectedChartType === 'IEC Material') {
      baseColumns.push({
        field: 'IECMatrialYES/NO',
        headerName: 'Status',
        width: 100,
        flex: isMobile ? 0 : 1,
      });
    } else if (selectedChartType === 'MEC Wheel') {
      baseColumns.push({
        field: 'MECWheelYES/NO',
        headerName: 'Status',
        width: 100,
        flex: isMobile ? 0 : 1,
      });
    }

    return baseColumns;
  };

  // Prepare data for DataGrid with unique IDs
  const getDataGridRows = () => {
    const filteredRecords = getFilteredRecords();
    return filteredRecords.map((record, index) => ({
      id: index,
      ...record
    }));
  };

  function valueFormatter(value: number | null) {
    return value == null ? '' : `${value}`;
  }

  const getDrawerContent = () => {
    // Show alert stock details
    if (selectedAlert) {
      const matchingStockDetails = getMatchingStockDetails();
      const stockColumns = getStockDetailColumns();
      
      return (
        <Box sx={{ height: "calc(100vh - 120px)" }}>
          <Typography variant="h6" gutterBottom>
            Stock Details
          </Typography>
          
          {matchingStockDetails.length > 0 ? (
            <Box sx={{ height: "calc(100% - 200px)", width: '100%' }}>
              <DataGrid
                rows={matchingStockDetails.map((stock, index) => ({ id: index, ...stock }))}
                columns={stockColumns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[10, 15, 20]}
                checkboxSelection={false}
                disableRowSelectionOnClick
                sx={{
                  height: '100%',
                  '& .MuiDataGrid-cell': {
                    fontSize: isMobile ? '0.7rem' : '0.8rem',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    fontSize: isMobile ? '0.7rem' : '0.8rem',
                    backgroundColor: theme.palette.background.default,
                  },
                }}
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
              <Typography variant="body2" color="text.secondary">
                No matching stock details found for this alert.
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    // Show chart details (existing functionality)
    if (!selectedChartType) return null;

    const filteredRecords = getFilteredRecords();
    const dataGridRows = getDataGridRows();
    const columns = getColumns();

    if (selectedSegment) {
      // Show specific segment details with DataGrid
      return (
        <Box sx={{ height: "calc(100vh - 120px)" }}>
          {filteredRecords.length > 0 ? (
            <Box sx={{ height: "100%", width: '100%' }}>
              <DataGrid
                rows={dataGridRows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 15 },
                  },
                }}
                pageSizeOptions={[10, 15, 20, 50]}
                checkboxSelection={false}
                disableRowSelectionOnClick
                sx={{
                  height: '100%',
                  '& .MuiDataGrid-cell': {
                    fontSize: isMobile ? '0.7rem' : '0.8rem',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    fontSize: isMobile ? '0.7rem' : '0.8rem',
                    backgroundColor: theme.palette.background.default,
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    minHeight: '200px',
                  },
                }}
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <Typography variant="body2" color="text.secondary">
                No records found for {selectedSegment.label} {selectedChartType.toLowerCase()}.
              </Typography>
            </Box>
          )}
        </Box>
      );
    } else {
      // Show overall chart details with summary using DataGrid for sample records
      const sampleRecords = PWDdashboard.IECMaterialDetailRecord?.slice(0, 10) || [];
      const sampleDataGridRows = sampleRecords.map((record, index) => ({
        id: index,
        ...record
      }));

      const sampleColumns: GridColDef[] = [
        { 
          field: 'asDate', 
          headerName: 'Date', 
          width: 100,
          flex: 1,
        },
        { 
          field: 'Center', 
          headerName: 'Center', 
          width: 200,
          flex: 2,
        },
        { 
          field: 'status', 
          headerName: 'Status', 
          width: 150,
          flex: 1,
          renderCell: (params) => {
            const record = params.row as IECMaterialDetailRecord;
            return selectedChartType === 'IEC Material' ? 
              `${record.IECMatrial} (${record["IECMatrialYES/NO"]})` : 
              `${record.MECWheel} (${record["MECWheelYES/NO"]})`;
          }
        },
      ];

      return (
        <Box sx={{ height: "calc(100vh - 120px)" }}>
          {/* Show sample records with DataGrid */}
          {sampleRecords.length > 0 && (
            <Box sx={{ height: "100%", width: '100%' }}>
              <Typography variant="subtitle1" gutterBottom>
                Recent Records:
              </Typography>
              <DataGrid
                rows={sampleDataGridRows}
                columns={sampleColumns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[10, 15, 20]}
                checkboxSelection={false}
                disableRowSelectionOnClick
                sx={{
                  height: 'calc(100% - 40px)',
                  '& .MuiDataGrid-cell': {
                    fontSize: isMobile ? '0.7rem' : '0.8rem',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    fontSize: isMobile ? '0.7rem' : '0.8rem',
                    backgroundColor: theme.palette.background.default,
                  },
                }}
              />
            </Box>
          )}
        </Box>
      );
    }
  };

  const getDrawerTitle = () => {
    if (selectedAlert) {
      return "Alert Stock Details";
    } else if (selectedChartType && selectedSegment) {
      return `${selectedSegment.label} ${selectedChartType} Details`;
    } else if (selectedChartType) {
      return `${selectedChartType} Overview`;
    }
    return "Details";
  };

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
            cursor: 'pointer',
          }}
          // onClick={handlePieChartContainerClick}
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
                "& .MuiChartsSurface-root": { marginTop:'20px',marginBottom:'30px' },
                "& .MuiChartsArc-root": { cursor: 'pointer' },
              }}
              slotProps={{
                legend: {
                  sx: {
                    '& .MuiChartsLegend-label': { fontSize: isMobile ? 8 : 6 },
                    '& .MuiChartsLegend-series': { gap: 0.5 },
                  },
                },
              }}
              onItemClick={handlePieChartClick}
              width={isMobile ? 250 : 170}
              height={isMobile ? 150 : 120}
            />
          </Box>
        </Card>
      </Box>

      {/* Drawer for showing details */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobile ? "100%" : "80%",
            maxWidth: "1200px",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              {getDrawerTitle()}
            </Typography>
            <IconButton onClick={handleCloseDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          {getDrawerContent()}
        </Box>
      </Drawer>

      {/* Alerts section with clickable alerts */}
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
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8,
                      transform: 'translateY(-1px)',
                      transition: 'all 0.2s ease-in-out',
                    },
                  }}
                  onClick={() => handleAlertClick(alert.originalAlert)}
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
            dataset={PWDdashboard.performanceSdpDataset}
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
      </Box>
    </>
  );
};

export default IecChart;
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  useTheme, 
  useMediaQuery, 
  IconButton, 
  Button,
  Drawer,
  AppBar,
  Toolbar,
  IconButton as MuiIconButton
} from '@mui/material';
import { 
  DataGrid, 
  GridToolbar,
} from '@mui/x-data-grid';
import { 
  Circle as CircleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { useSelector } from 'react-redux';

const StockStatusDashboard = () => {
  const PWDdashboard = useSelector((state: any) => state.PWDINITSLICE);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for drawer and selected contraceptive
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedContraceptive, setSelectedContraceptive] = useState(null);

  // Transform contraceptiveStock data for DataGrid
  const transformedStockData = PWDdashboard.contraceptiveStock?.map((item: any, index: number) => {
    let status = 'Adequate';
    if (item.value < 10000) {
      status = 'Critical';
    } else if (item.value < 30000) {
      status = 'Low';
    }

    const monthlyConsumption = Math.round(item.value * 0.1);
    const monthsRemaining = monthlyConsumption > 0 ? (item.value / monthlyConsumption).toFixed(1) : 'N/A';

    return {
      id: index + 1,
      item: item.name,
      currentStock: item.value,
      monthlyConsumption: monthlyConsumption,
      monthsRemaining: monthsRemaining,
      status: status,
      color: item.color,
      expiryDate: '2024-12-31',
      lastDelivery: '2023-12-01',
    };
  }) || [];

  // Handle view button click
  const handleViewClick = (contraceptive: any) => {
    setSelectedContraceptive(contraceptive);
    setDrawerOpen(true);
  };

  // Handle drawer close
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedContraceptive(null);
  };

  // Transform API data for detailed DataGrid - FILTER OUT 1900-01-01 EXPIRY DATES
  const transformDetailedData = () => {
    if (!selectedContraceptive || !PWDdashboard.viewStockOfContraceptiveRecord) {
      return [];
    }

    return (PWDdashboard.viewStockOfContraceptiveRecord as any[])
      .map((record: any, index: number) => {
        const fieldName = (selectedContraceptive as { fieldName: string })?.fieldName;
        const contraceptiveData = record[fieldName] || "0|1900-01-01";
        const [quantity, expiryDate] = contraceptiveData.split('|');
        
        return {
          id: index + 1,
          center: record.Center,
          district: record.District,
          sdp: record.SDP,
          quantity: parseInt(quantity) || 0,
          expiryDate: expiryDate,
          date: record.Date
        };
      })
      .filter(record => record.expiryDate !== '1900-01-01'); // FILTER OUT RECORDS WITH 1900-01-01
  };

  // Main table columns with sorting
  const columns = [
    { 
      field: 'item', 
      headerName: 'Commodities', 
      width: isMobile ? 150 : 400,
      sortable: true,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CircleIcon sx={{ 
            color: params.row.status === 'Adequate' ? theme.palette.success.main : 
                  params.row.status === 'Critical' ? theme.palette.error.main : 
                  theme.palette.warning.main,
            fontSize: '6px',
            mr: 1,
          }} />
          <Typography sx={{ 
            fontSize: isMobile ? '0.7rem' : '0.875rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {params.value}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'currentStock', 
      headerName: 'Stock Available', 
      width: isMobile ? 100 : 200,
      sortable: true,
      type: 'number',
      renderCell: (params: any) => (
        <Typography 
          fontWeight="400" 
          sx={{ 
            fontSize: isMobile ? '0.7rem' : '0.875rem'
          }}
        >
          {Number(params.value).toLocaleString()}
        </Typography>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: isMobile ? 80 : 200,
      sortable: true,
      renderCell: (params: any) => (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          color: params.value === 'Adequate' ? theme.palette.success.main :
                params.value === 'Critical' ? theme.palette.error.main :
                theme.palette.warning.main,
          fontWeight: 500
        }}>
          {params.value === 'Adequate' ? (
            <CheckCircleIcon sx={{ fontSize: '6px', mr: 0.5 }} />
          ) : (
            <ErrorIcon sx={{ fontSize: '6px', mr: 0.5 }} />
          )}
          <Typography sx={{ 
            fontSize: isMobile ? '0.7rem' : '0.875rem'
          }}>
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: isMobile ? 70 : 100,
      sortable: false,
      renderCell: (params: any) => {
        // Map item names to field names in the API
        const fieldNameMap = {
          'Condoms': 'Condoms',
          'POP': 'POP',
          'COC': 'COC',
          'ECP': 'ECP',
          '3 Months Injection': 'ThreeMonth',
          'Defo': 'Defo',
          'IUD': 'IUD',
          'Jadelle': 'Jadelle'
        } as const;

        const fieldName = fieldNameMap[params.row.item as keyof typeof fieldNameMap];
        
        return (
          <Button
            variant="contained"
            onClick={() => handleViewClick({
              name: params.row.item,
              fieldName: fieldName
            })}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              boxShadow: "none",
              backgroundColor: "gray",
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              padding: isMobile ? "6px 12px" : "8px 16px",
              '&:hover': {
                backgroundColor: theme.palette.grey[700],
              }
            }}
          >
            View
          </Button>
        );
      }
    },
  ];

  // Detailed view columns for the drawer with sorting
  const detailedColumns = [
    { 
      field: 'center', 
      headerName: 'Center', 
      width: isMobile ? 150 : 200,
      flex: 1,
      sortable: true
    },
    { 
      field: 'district', 
      headerName: 'District', 
      width: isMobile ? 120 : 150,
      sortable: true
    },
    { 
      field: 'sdp', 
      headerName: 'SDP', 
      width: isMobile ? 120 : 150,
      sortable: true
    },
    { 
      field: 'quantity', 
      headerName: 'Quantity', 
      width: isMobile ? 80 : 100,
      sortable: true,
      type: 'number',
      renderCell: (params: any) => (
        <Typography 
          fontWeight="500" 
          color={params.value === 0 ? theme.palette.error.main : theme.palette.text.primary}
        >
          {params.value.toLocaleString()}
        </Typography>
      )
    },
    { 
      field: 'expiryDate', 
      headerName: 'Expiry Date', 
      width: isMobile ? 100 : 120,
      sortable: true,
      renderCell: (params: any) => (
        <Typography 
          color={params.value === '1900-01-01' ? theme.palette.error.main : theme.palette.text.primary}
        >
          {params.value}
        </Typography>
      )
    },
  ];

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: isMobile ? 1 : 3,
          borderRadius: '16px',
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          height: '100%',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: isMobile ? 1 : 2,
            mt: isMobile ? -1 : 0,
            color: theme.palette.text.primary,
            display: 'flex',
            alignItems: 'center',
            height: 'fit-content',
            fontFamily: "inherit",
            fontSize: isMobile ? 14 : 16,
          }}
        >
          <MedicalServicesIcon sx={{ mr: 1 }} />
          Stock Status of Contraceptives
        </Typography>

        <Box sx={{ 
          height: isMobile ? 250 : 437, 
          width: '100%',
          overflow: 'hidden'
        }}>
          <DataGrid
            rows={transformedStockData}
            columns={columns as any}
            hideFooter
            slots={{
              toolbar: GridToolbar,
            }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.grey[100],
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              '& .MuiDataGrid-root': {
                overflow: 'hidden'
              },
              fontSize: isMobile ? '0.7rem' : '0.875rem',
            }}
            // Enable sorting for all sortable columns
            sortingMode="client"
            initialState={{
              sorting: {
                sortModel: [{ field: 'currentStock', sort: 'asc' }], // Default sort by stock ascending (lower to higher)
              },
            }}
          />
        </Box>
      </Paper>

      {/* Drawer for detailed view */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: isMobile ? '100%' : '80%',
            maxWidth: '1200px',
            overflow: "auto",
          }
        }}
      >
        <Toolbar sx={{display:'flex',flexDirection:'row-reverse'}}>
          <MuiIconButton
            edge="start"
            color="inherit"
            onClick={handleDrawerClose}
            aria-label="close"
          >
            <CloseIcon />
          </MuiIconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            {selectedContraceptive && 'name' in selectedContraceptive
              ? `${(selectedContraceptive as { name: string }).name} - Stock Details`
              : 'Stock Details'}
          </Typography>
        </Toolbar>

        <Box sx={{ p: isMobile ? 1 : 3, height: '100%' }}>
          <DataGrid
            rows={transformDetailedData()}
            disableRowSelectionOnClick
            columns={detailedColumns as any}
            slots={{
              toolbar: GridToolbar,
            }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.grey[100],
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              fontSize: isMobile ? '0.7rem' : '0.875rem',
              height: 'calc(100vh - 120px)'
            }}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25, page: 0 },
              },
              sorting: {
                sortModel: [{ field: 'quantity', sort: 'asc' }], // Default sort by quantity ascending (lower to higher)
              },
            }}
            // Enable sorting for all sortable columns
            sortingMode="client"
          />
        </Box>
      </Drawer>
    </>
  );
};

export default StockStatusDashboard;
import React from 'react';
import { Box, Typography, Paper, Grid, useTheme, LinearProgress } from '@mui/material';
import { 
  DataGrid, 
  GridToolbar, 
} from '@mui/x-data-grid';
import { 
  Circle as CircleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const StockStatusDashboard = () => {
  const theme = useTheme();

  // Sample data - replace with your actual data
  const stockData = [
    { 
      id: 1, 
      item: 'Condoms', 
      currentStock: 12500, 
      monthlyConsumption: 4000, 
      monthsRemaining: 3.1, 
      status: 'Adequate', 
      expiryDate: '2024-05-15',
      lastDelivery: '2023-11-20'
    },
    { 
      id: 2, 
      item: 'COC', 
      currentStock: 8200, 
      monthlyConsumption: 3000, 
      monthsRemaining: 2.7, 
      status: 'Low', 
      expiryDate: '2024-08-30',
      lastDelivery: '2023-10-15'
    },
    { 
      id: 3, 
      item: 'POP', 
      currentStock: 4500, 
      monthlyConsumption: 1500, 
      monthsRemaining: 3.0, 
      status: 'Adequate', 
      expiryDate: '2024-06-22',
      lastDelivery: '2023-12-01'
    },
    { 
      id: 4, 
      item: 'ECP', 
      currentStock: 1800, 
      monthlyConsumption: 600, 
      monthsRemaining: 3.0, 
      status: 'Adequate', 
      expiryDate: '2024-09-10',
      lastDelivery: '2023-11-05'
    },
    { 
      id: 5, 
      item: '3 Months Inj (Depo)', 
      currentStock: 3200, 
      monthlyConsumption: 1200, 
      monthsRemaining: 2.7, 
      status: 'Low', 
      expiryDate: '2024-04-05',
      lastDelivery: '2023-10-28'
    },
    { 
      id: 6, 
      item: '3 Month Inj (Sayana Press)', 
      currentStock: 2500, 
      monthlyConsumption: 800, 
      monthsRemaining: 3.1, 
      status: 'Adequate', 
      expiryDate: '2024-07-18',
      lastDelivery: '2023-12-10'
    },
    { 
      id: 7, 
      item: 'IUCD (CT-380-A)', 
      currentStock: 650, 
      monthlyConsumption: 200, 
      monthsRemaining: 3.3, 
      status: 'Adequate', 
      expiryDate: '2025-01-05',
      lastDelivery: '2023-09-15'
    },
  ];

  const columns = [
    { 
      field: 'item', 
      headerName: 'Medicine', 
      width: '260',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CircleIcon sx={{ 
            color: params.row.status === 'Adequate' ? theme.palette.success.main : 
                  params.row.status === 'Critical' ? theme.palette.error.main : 
                  theme.palette.warning.main,
            fontSize: '6px',
            mr: 1,
          }} />
          {params.value}
        </Box>
      )
    },
    { 
      field: 'currentStock', 
      headerName: 'Stock Available', 
      width: '200',
      renderCell: (params) => (
         <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography fontWeight="400" sx={{ display: 'flex', alignItems: 'center' }}>
          {params.value.toLocaleString()}
        </Typography>
        </Box>
      )
    },
    { 
      field: 'expiryDate', 
      headerName: 'Expiry Date', 
      width: '200',
      renderCell: (params) => {
        const expiry = new Date(params.value);
        const today = new Date();
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {diffDays < 90 ? (
              <WarningIcon color="warning" sx={{ mr: 1, fontSize: '6px', }} />
            ) : null}
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              {expiry.toLocaleDateString()}
            </Typography>
          </Box>
        );
      }
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: '200',
      renderCell: (params) => (
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
          {params.value}
        </Box>
      )
    },
    // {
    //   field: 'actions',
    //   type: 'actions',
    //   width: 80,
    //   getActions: (params) => [
    //     <GridActionsCellItem
    //       icon={<InfoIcon />}
    //       label="View details"
    //     //   onClick={() => handleViewDetails(params.row)}
    //     />,
    //   ],
    // },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        height: '100%'
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontFamily: "inherit",
          fontSize: 16,
        }}
      >
        <MedicalServicesIcon sx={{ mr: 1 }} />
        Stock Status of Contraceptives
      </Typography>

      <Box sx={{ height: 437, width: '100%' }}>
        <DataGrid
          rows={stockData}
          columns={columns}
          hideFooter
          components={{
            Toolbar: GridToolbar,
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
          }}
        />
      </Box>

    </Paper>
  );
};

// Helper component for summary cards

export default StockStatusDashboard;
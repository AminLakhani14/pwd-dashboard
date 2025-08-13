import React from 'react';
import { Box, Typography, Paper, Grid, useTheme, LinearProgress } from '@mui/material';
import { 
  DataGrid, 
  GridToolbar, 
  GridActionsCellItem 
} from '@mui/x-data-grid';
import { 
  Circle as CircleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import InventoryIcon from '@mui/icons-material/Inventory';
import InfoIcon from '@mui/icons-material/Info';

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
      headerName: 'Product', 
      width: '270',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CircleIcon sx={{ 
            color: params.row.status === 'Adequate' ? theme.palette.success.main : 
                  params.row.status === 'Critical' ? theme.palette.error.main : 
                  theme.palette.warning.main,
            fontSize: '0.8rem',
            mr: 1
          }} />
          {params.value}
        </Box>
      )
    },
    { 
      field: 'currentStock', 
      headerName: 'Stock Available', 
      width: '270',
      renderCell: (params) => (
        <Typography fontWeight="500">
          {params.value.toLocaleString()}
        </Typography>
      )
    },
    { 
      field: 'expiryDate', 
      headerName: 'Expiry Date', 
      width: '270',
      renderCell: (params) => {
        const expiry = new Date(params.value);
        const today = new Date();
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {diffDays < 90 ? (
              <WarningIcon color="warning" sx={{ mr: 1, fontSize: '1rem' }} />
            ) : null}
            <Typography>
              {expiry.toLocaleDateString()}
            </Typography>
          </Box>
        );
      }
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: '270',
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
            <CheckCircleIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
          ) : (
            <ErrorIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
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
        // height: '100%'
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
          color: theme.palette.text.primary,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <MedicalServicesIcon sx={{ mr: 1 }} />
        Stock Sufficiency Status of Contraceptives
      </Typography>

      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={stockData}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
          disableSelectionOnClick
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

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Total Products"
            value={stockData.length}
            icon={<InventoryIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Adequate Stock"
            value={stockData.filter(item => item.status === 'Adequate').length}
            icon={<CheckCircleIcon color="success" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Low Stock"
            value={stockData.filter(item => item.status === 'Low').length}
            icon={<WarningIcon color="warning" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Expiring Soon"
            value={stockData.filter(item => {
              const expiry = new Date(item.expiryDate);
              const today = new Date();
              const diffTime = expiry - today;
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays < 90;
            }).length}
            icon={<ErrorIcon color="error" />}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

// Helper component for summary cards
const SummaryCard = ({ title, value, icon }) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        borderRadius: '12px'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {icon}
        <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Paper>
  );
};

export default StockStatusDashboard;
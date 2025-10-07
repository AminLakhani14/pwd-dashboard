import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { 
  DataGrid, 
  GridToolbar, 
} from '@mui/x-data-grid';
import { 
  Circle as CircleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';

const StockStatusDashboard = () => {
  const PWDdashboard = useSelector((state: RootState) => state.PWDINITSLICE);
  const theme = useTheme();

  // Transform contraceptiveStock data for DataGrid
  const transformedStockData = PWDdashboard.contraceptiveStock?.map((item, index) => {
    // Calculate status based on value (you can adjust these thresholds as needed)
    let status = 'Adequate';
    if (item.value < 10000) {
      status = 'Critical';
    } else if (item.value < 30000) {
      status = 'Low';
    }

    // Calculate months remaining (placeholder calculation - adjust based on your business logic)
    const monthlyConsumption = Math.round(item.value * 0.1); // 10% of stock as monthly consumption
    const monthsRemaining = monthlyConsumption > 0 ? (item.value / monthlyConsumption).toFixed(1) : 'N/A';

    return {
      id: index + 1,
      item: item.name,
      currentStock: item.value,
      monthlyConsumption: monthlyConsumption,
      monthsRemaining: monthsRemaining,
      status: status,
      color: item.color,
      // Add placeholder dates since they're not in the original data
      expiryDate: '2024-12-31', // You might want to get this from actual data
      lastDelivery: '2023-12-01', // You might want to get this from actual data
    };
  }) || [];

  type RowType = { 
    id: number; 
    item: string; 
    currentStock: number; 
    monthlyConsumption: number; 
    monthsRemaining: string; 
    status: string; 
    color: string;
    expiryDate: string; 
    lastDelivery: string; 
  };

  const columns: import('@mui/x-data-grid').GridColDef<RowType>[] = [
    { 
      field: 'item', 
      headerName: 'Commodities', 
      width: 400,
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
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography fontWeight="400" sx={{ display: 'flex', alignItems: 'center' }}>
            {Number(params.value).toLocaleString()}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 200,
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
          rows={transformedStockData as RowType[]}
          columns={columns}
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
          }}
        />
      </Box>

    </Paper>
  );
};

export default StockStatusDashboard;
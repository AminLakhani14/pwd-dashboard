import React from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
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
import { useSelector } from 'react-redux';

const StockStatusDashboard = () => {
  // Specify the type for state if possible; otherwise, add a type assertion as a fix for typescript lint error.
  const PWDdashboard = useSelector((state: any) => state.PWDINITSLICE);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const columns = [
    { 
      field: 'item', 
      headerName: 'Commodities', 
      width: isMobile ? 150 : 400,
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
  ];

  return (
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
            '& .MuiDataGrid-root': {
              overflow: 'hidden'
            },
            fontSize: isMobile ? '0.7rem' : '0.875rem',
          }}
        />
      </Box>
    </Paper>
  );
};

export default StockStatusDashboard;
import React, { useState, useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import {
  Box,
  Typography,
  IconButton,
  Drawer
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const COLORS = ['#b3b3b3', '#4caf50'];

const RADIAN = Math.PI / 180;

interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  value: number;
  total: number;
  index: number;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
  total,
  index,
}: CustomizedLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const percentage = ((value / total) * 100).toFixed(0);

  return (
    <g>
      <text
        x={x}
        y={y}
        fill="gray"
        fontSize={10}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${percentage}%`} {Number(percentage) >= 70 ? 'Open' : 'Close'}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }:any) => {
  const PWDdashboard = useSelector((state: RootState) => state.PWDINITSLICE);
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    const total = PWDdashboard.AllOpenClose.reduce((sum, item) => sum + item.value, 0);
    const percentage = ((value / total) * 100).toFixed(0);
    return (
      <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
        <p style={{ fontSize: '12px' }}>{`${name}: ${value} (${percentage}%)`}</p>
      </div>
    );
  }
  return null;
};

// Define columns for DataGrid
const columns: { field: string; headerName: string; width: number }[] = [
  { field: 'district', headerName: 'Name of District', width: 200 },
  { field: 'sdpType', headerName: 'SDP Type', width: 300 },
  { field: 'centerName', headerName: 'Center Name', width: 300 },
  { field: 'status', headerName: 'Status of Center', width: 150 }
];

export default function StatisticsCard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const PWDdashboard = useSelector((state: RootState) => state.PWDINITSLICE);
  const total = PWDdashboard.AllOpenClose.reduce((sum: number, item: { value: number }) => sum + item.value, 0);

  // Transform API data into sdpDetailsData format
  const sdpDetailsData = useMemo(() => {
    const transformedData: Record<string, Array<{
      id: number;
      district: string;
      sdpType: string;
      centerName: string;
      status: string;
    }>> = {
      "RHS-A": [],
      "MSU": [],
      "FWC": []
    };

    // Process the API response data
    if (PWDdashboard.openclose && Array.isArray(PWDdashboard.openclose)) {
      PWDdashboard.openclose.forEach((item: any, index: number) => {
        const sdpType = item.ProjectName || '';
        let category: string = '';

        // Determine category based on ProjectName
        if (sdpType.includes('RHS-A')) {
          category = 'RHS-A';
        } else if (sdpType.includes('MSU')) {
          category = 'MSU';
        } else if (sdpType.includes('FWC') || sdpType.includes('Family Welfare')) {
          category = 'FWC';
        }

        if (category && transformedData[category]) {
          transformedData[category].push({
            id: index,
            district: item.District || 'N/A',
            sdpType: sdpType,
            centerName: item.Center || 'N/A',
            status: item.OpenClose || 'Unknown'
          });
        }
      });
    }

    return transformedData;
  }, [PWDdashboard.openclose]);

  // Filter categories that have records
  const categoriesWithData = useMemo(() => {
    return Object.keys(sdpDetailsData).filter(category => {
      const categoryData = sdpDetailsData[category];
      // Only show category if it has records and if selectedStatus is provided, filter by status
      if (selectedStatus) {
        return categoryData.some(row => row.status === selectedStatus);
      }
      return categoryData.length > 0;
    });
  }, [sdpDetailsData, selectedStatus]);

  const handlePieClick = (_data: unknown, index: number) => {
    setSelectedStatus(PWDdashboard.AllOpenClose[index]?.name ?? null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedStatus(null);
  };

  // Prevent drawer from closing on backdrop click or escape key
  const handleDrawerClose = (_event: React.SyntheticEvent | {}, reason?: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }
    handleCloseDrawer();
  };

  return (
    <>
      <div 
        style={{ 
          width: '100%', 
          height: '80%', 
          cursor: 'pointer' 
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={200}>
            <Pie
              data={PWDdashboard.AllOpenClose}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={55}
              fill="#82ca9d"
              label={(props: any) => renderCustomizedLabel({ ...props, total })}
              onClick={handlePieClick}
            >
              {PWDdashboard.AllOpenClose.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
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
          mb: 3,
          borderBottom: '1px solid #e0e0e0',
          pb: 2
        }}>
          <Typography id="drawer-title" variant="h6" component="h2">
            SDP Status Details - {selectedStatus || 'All'}
          </Typography>
          <IconButton onClick={handleCloseDrawer} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Only show categories that have data */}
        {categoriesWithData.length > 0 ? (
          categoriesWithData.map((category) => {
            const filteredData = sdpDetailsData[category].filter(
              (row: { status: string }) => !selectedStatus || row.status === selectedStatus
            );

            // Only render if there are records after filtering
            if (filteredData.length === 0) {
              return null;
            }

            return (
              <Box key={category} sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {category} ({filteredData.length} records)
                </Typography>
                <Box sx={{ height: 400, width: '100%' }}>
                  <DataGrid
                    rows={filteredData}
                    columns={columns}
                    pageSizeOptions={[5, 10, 20]}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    disableRowSelectionOnClick
                    sx={{
                      '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f5f5f5',
                      },
                      '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #e0e0e0',
                      },
                    }}
                  />
                </Box>
              </Box>
            );
          })
        ) : (
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center', 
              color: 'text.secondary',
              mt: 4
            }}
          >
            No records found for {selectedStatus ? `"${selectedStatus}" status` : 'the selected criteria'}
          </Typography>
        )}
      </Drawer>
    </>
  );
}
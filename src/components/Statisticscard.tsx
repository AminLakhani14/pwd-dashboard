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
  Drawer,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Alert
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import axios from 'axios';

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

// Function to fetch image from API using Axios
const fetchImage = async (photos: string): Promise<string> => {
  try {
    const url = `https://pwd.kcompute.com/Dashboard/GetImages?ImageName=${encodeURIComponent(photos)}`;
    
    const response = await axios.get(url, {
      responseType: 'json', // Expecting JSON response with base64
    });

    console.log('API Response:', response);

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle different response structures
    let base64Data = '';

    if (typeof response.data === 'string') {
      // If response is directly a base64 string
      base64Data = response.data;
    } else if (response.data?.base64) {
      // If response is an object with base64 property
      base64Data = response.data.base64;
    } else if (response.data?.data) {
      // If response is an object with data property containing base64
      base64Data = response.data.data;
    } else if (response.data?.image) {
      // If response is an object with image property
      base64Data = response.data.image;
    } else {
      // Try to stringify and use if it's a simple object
      base64Data = typeof response.data === 'object' ? JSON.stringify(response.data) : response.data;
    }

    // Clean the base64 string (remove data URL prefix if present)
    const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');

    // Create data URL from base64
    const imageUrl = `data:image/jpeg;base64,${cleanBase64}`;
    
    return imageUrl;
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
};

export default function StatisticsCard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState<string | null>(null); // Track which row is loading
  const [imageError, setImageError] = useState<string | null>(null);
  const PWDdashboard = useSelector((state: RootState) => state.PWDINITSLICE);
  const total = PWDdashboard.AllOpenClose.reduce((sum: number, item: { value: number }) => sum + item.value, 0);

  // Function to handle image view
  const handleViewImage = async (photos: string, rowId: number) => {
    if (!photos) {
      setImageError('No photo reference available');
      return;
    }

    setLoadingImage(`${rowId}`);
    setImageError(null);
    setCurrentImageUrl(null);

    try {
      const imageUrl = await fetchImage(photos);
      setCurrentImageUrl(imageUrl);
      setImageDialogOpen(true);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load image. Please try again.';
      setImageError(errorMessage);
      console.error('Error loading image:', error);
    } finally {
      setLoadingImage(null);
    }
  };

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
    setCurrentImageUrl(null);
    setImageError(null);
  };

  // Define columns for DataGrid
  const getColumns = (selectedStatus: string | null): GridColDef[] => {
    const baseColumns: GridColDef[] = [
      { field: 'district', headerName: 'Name of District', width: 200 },
      { field: 'sdpType', headerName: 'SDP Type', width: 300 },
      { field: 'centerName', headerName: 'Center Name', width: 300 },
      { field: 'status', headerName: 'Status of Center', width: 150 }
    ];

    // Add image column only when selectedStatus is "Close"
    if (selectedStatus === 'Close') {
      baseColumns.push({
        field: 'image',
        headerName: 'Image',
        width: 150,
        renderCell: (params) => {
          const photos = params.row.photos || '';
          const isCurrentLoading = loadingImage === `${params.row.id}`;
          
          return (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'left',
              width: '100%',
              marginTop:'10px',
            }}>
              <Button
                variant="contained"
                size="small"
                startIcon={isCurrentLoading ? <CircularProgress size={16} /> : <VisibilityIcon />}
                onClick={() => handleViewImage(photos, params.row.id)}
                disabled={!photos || !!loadingImage}
                sx={{
                  fontSize: '0.75rem',
                  minWidth: 'auto',
                  backgroundColor: 'gray',
                }}
              >
                {isCurrentLoading ? 'Loading...' : 'View'}
              </Button>
            </Box>
          );
        }
      });
    }

    return baseColumns;
  };

  // Transform API data into sdpDetailsData format with photos
  const sdpDetailsData = useMemo(() => {
    const transformedData: Record<string, Array<{
      id: number;
      district: string;
      sdpType: string;
      centerName: string;
      status: string;
      photos: string; // Store the photos parameter for API call
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
            status: item.OpenClose || 'Unknown',
            // Store the photos parameter for API call - adjust based on your API response
            photos: item.Photos || item.photos || item.Photo || item.ImageName || '' // Added ImageName as fallback
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

  // Get columns based on selected status
  const columns = getColumns(selectedStatus);

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
            width: selectedStatus === 'Close' ? '90%' : '80%', // Wider when image column is present
            maxWidth: selectedStatus === 'Close' ? 1200 : 1000,
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
            {selectedStatus === 'Close' && ' (with Images)'}
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

      {/* Image Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={handleCloseImageDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          m: 0, 
          p: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseImageDialog}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: 'center', p: 3 }}>
          {imageError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {imageError}
            </Alert>
          )}
          
          {loadingImage ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ ml: 2 }}>
                Loading image...
              </Typography>
            </Box>
          ) : currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt="SDP Center"
              style={{ 
                maxWidth: '100%', 
                maxHeight: '70vh', 
                objectFit: 'contain' 
              }}
              onError={() => setImageError('Failed to display image')}
            />
          ) : null}
          
          <Box sx={{ mt: 2 }}>
            <Button 
              onClick={handleCloseImageDialog} 
              variant="contained"
              color="primary"
            >
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
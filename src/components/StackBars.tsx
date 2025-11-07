import * as React from 'react';
import { 
  Typography,
  CardContent,
  useTheme,
  useMediaQuery,
  Drawer,
  Box,
  IconButton,
  Toolbar
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import CloseIcon from '@mui/icons-material/Close';

// Define types for the furniture data based on your Redux structure
interface FurnitureGridItem {
  asDate: string;
  projectName: string;
  district: string;
  center: string;
  [key: string]: string | number; // For dynamic furniture fields
}

export default function StackBars() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const PWDdashboard = useSelector((state: RootState) => state.PWDINITSLICE);
  const furnitureData = PWDdashboard.furnitureData || [];
  const furnitureGridData = PWDdashboard.furnitureGridData || [];
  
  // State for drawer and selected furniture
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedFurniture, setSelectedFurniture] = React.useState<{
    furnitureType: string;
    condition: string;
  } | null>(null);

  // Handle bar click - improved version
  const handleBarClick = (event: any, barData: any) => {
    console.log('Full bar click event:', barData);
    
    if (barData && barData.dataIndex !== undefined && barData.seriesId !== undefined) {
      const furnitureItem = furnitureData[barData.dataIndex];
      
      // Extract condition from seriesId - it should be 'good', 'satisfactory', or 'poor'
      const seriesId = barData.seriesId.toLowerCase();
      let condition = '';
      
      if (seriesId.includes('good')) {
        condition = 'Good';
      } else if (seriesId.includes('satisfactory')) {
        condition = 'Satisfactory';
      } else if (seriesId.includes('poor')) {
        condition = 'Poor';
      } else {
        // Fallback: use series index
        const conditionMap = ['Good', 'Satisfactory', 'Poor'];
        condition = conditionMap[barData.seriesIndex] || 'N/A';
      }
      
      const newSelection = {
        furnitureType: furnitureItem.fullForm,
        condition: condition
      };

      console.log('Selected furniture:', newSelection);
      console.log('Available furnitureGridData sample:', furnitureGridData.slice(0, 2));

      // Set new selection and open drawer
      setSelectedFurniture(newSelection);
      setDrawerOpen(true);
    }
  };
  // Handle drawer close
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setSelectedFurniture(null);
    }, 300);
  };

  // Filter and transform furnitureGridData based on selected furniture and condition
  const filteredData = React.useMemo(() => {
    if (!selectedFurniture) return [];
    
    console.log('Filtering for:', selectedFurniture);
    console.log('Total furnitureGridData records:', furnitureGridData.length);
    
    const result = furnitureGridData
      .filter((item: FurnitureGridItem) => {
        const furnitureCondition = item[selectedFurniture.furnitureType];
        const furnitureQuantity = item[`${selectedFurniture.furnitureType} quantity`];
        
        console.log(`Checking item: ${item.center}, ${selectedFurniture.furnitureType}: ${furnitureCondition}, quantity: ${furnitureQuantity}`);
        
        const matches = furnitureCondition === selectedFurniture.condition && 
               Number(furnitureQuantity) > 0;
        
        return matches;
      })
      .map((item: FurnitureGridItem, index: number) => ({
        id: `${item.district}-${item.center}-${index}`,
        district: item.district,
        center: item.center,
        furnitureType: selectedFurniture.furnitureType,
        condition: selectedFurniture.condition,
        quantity: Number(item[`${selectedFurniture.furnitureType} quantity`]),
        lastUpdated: item.asDate,
        projectName: item.projectName
      }));

    console.log('Filtered result count:', result.length);
    console.log('Sample filtered items:', result.slice(0, 3));
    return result;
  }, [selectedFurniture, furnitureGridData]);

  // Debug: Log furniture data structure
  React.useEffect(() => {
    if (furnitureGridData.length > 0) {
      console.log('First furnitureGridData item structure:', furnitureGridData[0]);
      console.log('Available furniture types in first item:', 
        Object.keys(furnitureGridData[0]).filter(key => 
          !['asDate', 'projectName', 'district', 'center'].includes(key) && 
          !key.includes('quantity')
        )
      );
    }
  }, [furnitureGridData]);

  // Define columns for DataGrid
  const columns = [
    { 
      field: 'district', 
      headerName: 'District', 
      width: 150,
      flex: 1
    },
    { 
      field: 'center', 
      headerName: 'Center', 
      width: 200,
      flex: 1
    },
    { 
      field: 'projectName', 
      headerName: 'Project', 
      width: 180,
      flex: 1
    },
    { 
      field: 'furnitureType', 
      headerName: 'Furniture Type', 
      width: 150 
    },
    { 
      field: 'condition', 
      headerName: 'Condition', 
      width: 120,
      renderCell: (params: any) => (
        <Typography 
          sx={{ 
            color: params.value === 'Good' ? '#4CAF50' : 
                  params.value === 'Satisfactory' ? '#FFC107' : 
                  params.value === 'Poor' ? '#F44336' : '#9E9E9E',
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'quantity', 
      headerName: 'Quantity', 
      width: 100,
      type: 'number'
    },
    { 
      field: 'lastUpdated', 
      headerName: 'Last Updated', 
      width: 120 
    },
  ];

  return (
    <>
      <CardContent>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 600,
            mb: 1,
            color: theme.palette.text.primary,
            fontFamily: 'inherit',
            fontSize: 16,
          }}
        >
          Furniture Position
        </Typography>
        
        <BarChart
          dataset={furnitureData}
          onItemClick={handleBarClick}
          series={[
            { 
              dataKey: 'good', 
              label: 'Good',
              color: '#4CAF50',
              valueFormatter: (value) => `${value} items`,
              id: 'good-series'
            },  
            { 
              dataKey: 'satisfactory', 
              label: 'Satisfactory',
              color: '#FFC107',
              valueFormatter: (value) => `${value} items`,
              id: 'satisfactory-series'
            },   
            { 
              dataKey: 'poor', 
              label: 'Poor',
              color: '#F44336',
              valueFormatter: (value) => `${value} items`,
              id: 'poor-series'
            },
          ]}
          xAxis={[{ 
            dataKey: 'fullForm',
            scaleType: 'band',
            tickLabelStyle: { 
              fontSize: isMobile ? 8 : 6.7,
              angle: isMobile ? 0 : 12,
            },
          }]}
          yAxis={[
            {
              min: 2,     
              max:300,             
              tickMinStep: 2,           
              label: 'Items',
            }
          ]}
          height={isMobile ? 200 : 150}
          margin={{ 
            left: isMobile ? 40 : -20, 
            right: isMobile ? 10 : 0, 
            top: isMobile ? 10 : 0.5, 
            bottom: isMobile ? 40 : 0.3 
          }}
          slotProps={{
            legend: {
              sx: {
                '& .MuiChartsLegend-label': { fontSize: isMobile ? 10 : 8 },
              },
            },
          }}
          sx={{ 
            "& .MuiChartsLabelMark-root.MuiChartsLabelMark-square": { borderRadius: "10px !important" },
            width: "100%",
            overflow: "visible",
            cursor: "pointer"
          }}
          colors={['#4CAF50', '#FFC107', '#F44336']}
        />
      </CardContent>

      {/* Drawer for detailed view */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: isMobile ? '100%' : '80%',
            maxWidth: '1200px'
          }
        }}
      >
        <Toolbar sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleDrawerClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            {selectedFurniture?.furnitureType} - {selectedFurniture?.condition} Condition
            {filteredData.length > 0 && ` (${filteredData.length} records)`}
          </Typography>
        </Toolbar>

        <Box sx={{ p: isMobile ? 1 : 3, height: '100%' }}>
          {filteredData.length > 0 ? (
            <DataGrid
              rows={filteredData}
              columns={columns as any}
              slots={{
                toolbar: undefined,
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
                  sortModel: [{ field: 'district', sort: 'asc' }],
                },
              }}
            />
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: 'calc(100vh - 120px)',
                flexDirection: 'column'
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Data Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No records found for {selectedFurniture?.furnitureType} with {selectedFurniture?.condition?.toLowerCase()} condition.
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Check browser console for detailed debugging information
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}
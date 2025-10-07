import React, { useEffect, useState } from "react";
import { Typography, Button, Modal, Box, TextField, MenuItem, useMediaQuery, useTheme, Card, Alert, Collapse, IconButton } from "@mui/material";
import Grid from '@mui/material/Grid';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyMetricCard from "../components/KeyMetricCard";
import StockStatusDashboard from "../components/StockStatusDashboard";
import IecChart from "../components/iECChart";
import { PieChart } from "@mui/x-charts";
import StackBars from "../components/StackBars";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { CenterDropdown, dynamicAPI, SdpDropdown, SldieoutAPI, StaffPositionAPI } from "../Service/Init";
import { useAppDispatch } from '../app/Hooks';
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { updateStates } from "../Slice/InitSlice";
import '../index.css'
import { ToDatabaseFormat } from "../Global/globalFunctions";

const Dashboard = () => {
  const theme = useTheme();
  const PWDdashboard = useSelector((state: RootState) => state.PWDINITSLICE);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  
  const getPreviousMonthDateRange = () => {
    const now = new Date();
    const firstDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    
    return {
      startDate: firstDayOfPreviousMonth.toLocaleDateString('en-US'),
      endDate: lastDayOfPreviousMonth.toLocaleDateString('en-US'),
      month: (now.getMonth()).toString(),
      year: now.getFullYear().toString()
    };
  };

  const previousMonthRange = getPreviousMonthDateRange();

  const [filters, setFilters] = useState({
    month: previousMonthRange.month,
    year: previousMonthRange.year,
    sdpType: '',
    district: '1',
    center: '1'
  });

  console.log(PWDdashboard,'PWDdashboard');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open2, setOpen2] = useState(true);
  const dispatch = useAppDispatch();

  // Month options with ALL option
  const months = [
    { value: 'ALL', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Year options (last 5 years and current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => (currentYear - i).toString());

  // Function to get first and last day of the month or year
  const getDateRange = (month: string, year: string) => {
    if (!month || !year) return { startDate: '', endDate: '' };
    
    const yearNum = parseInt(year);
    
    if (month === 'ALL') {
      // For ALL option: January 1st to December 31st of selected year
      const startDate = new Date(yearNum, 0, 1); // January 1st
      const endDate = new Date(yearNum, 11, 31); // December 31st
      
      return {
        startDate: startDate.toLocaleDateString('en-US'),
        endDate: endDate.toLocaleDateString('en-US')
      };
    } else {
      // For specific month: 1st to last day of the month
      const monthNum = parseInt(month);
      const startDate = new Date(yearNum, monthNum - 1, 1);
      const endDate = new Date(yearNum, monthNum, 0);
      
      return {
        startDate: startDate.toLocaleDateString('en-US'),
        endDate: endDate.toLocaleDateString('en-US')
      };
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value }:any = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'SDPdropdownValue' && value) {
      dispatch(SdpDropdown(value));
      dispatch(updateStates({ key: 'centerValue', value: '0' }));
      dispatch(updateStates({ key: 'centerDropdown', value: [] }));
    }

    if (name === 'districtValue' && value) {
      dispatch(CenterDropdown({
        sdpType: PWDdashboard.SDPdropdownValue,
        value: value
      }));
    }

    dispatch(updateStates({ key: name, value: value }));
  }

  const handleApplyFilters = () => {
    let districtData = PWDdashboard.SDPdropdownValue.split(",");
      
    // Get date range based on selected month and year
    const dateRange = getDateRange(filters.month, filters.year);
    
    dispatch(dynamicAPI({
      StartDate: ToDatabaseFormat(dateRange.startDate) || '',
      EndDate: ToDatabaseFormat(dateRange.endDate) || '',
      DistrictID: districtData[0] || '0',
      DistrictName: PWDdashboard.districtValue,
      CenterID: '',
      CenterName: PWDdashboard.centerValue,
      ProjectId: districtData[2] || '7122,7121,7120',
      QuestionId: ''
    }));

    dispatch(SldieoutAPI({
      StartDate: ToDatabaseFormat(dateRange.startDate) || '',
      EndDate: ToDatabaseFormat(dateRange.endDate) || '',
      DistrictID: districtData[0] || '0',
      DistrictName: PWDdashboard.districtValue,
      CenterID: '',
      CenterName: PWDdashboard.centerValue,
      ProjectId: districtData[2] || '7122,7121,7120',
      QuestionId: ''
    }));

    dispatch(StaffPositionAPI({
      StartDate: ToDatabaseFormat(dateRange.startDate) || '',
      EndDate: ToDatabaseFormat(dateRange.endDate) || '',
      DistrictID: districtData[0] || '0',
      DistrictName: PWDdashboard.districtValue,
      CenterID: '',
      CenterName: PWDdashboard.centerValue,
      ProjectId: districtData[2] || '7122,7121,7120',
      QuestionId: ''
    }));

    handleClose();
  };
  
  useEffect(() => {
    // Use previous month's date range by default
    const defaultDateRange = getPreviousMonthDateRange();
    
    dispatch(dynamicAPI({
      StartDate: ToDatabaseFormat(defaultDateRange.startDate) || '',
      EndDate: ToDatabaseFormat(defaultDateRange.endDate) || '',
      DistrictID: '',
      DistrictName: '',
      CenterID: '',
      CenterName: '',
      ProjectId: '7122,7121,7120',
      QuestionId: ''
    }));

    dispatch(SldieoutAPI({
      StartDate: ToDatabaseFormat(defaultDateRange.startDate) || '',
      EndDate: ToDatabaseFormat(defaultDateRange.endDate) || '',
      DistrictID: '',
      DistrictName: '',
      CenterID: '',
      CenterName: '',
      ProjectId: '7122,7121,7120',
      QuestionId: ''
    }));

    dispatch(StaffPositionAPI({
      StartDate: ToDatabaseFormat(defaultDateRange.startDate) || '',
      EndDate: ToDatabaseFormat(defaultDateRange.endDate) || '',
      DistrictID: '',
      DistrictName: '',
      CenterID: '',
      CenterName: '',
      ProjectId: '7122,7121,7120',
      QuestionId: ''
    }));

  }, []);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? '90%' : 450,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: isMobile ? 2 : 4,
    borderRadius: '16px',
    maxHeight: '90vh',
    overflowY: 'auto',
  } as const;

  const buildingStatusData = [
    { id: 0, value: 365, label: "Hand Washing", color: "#0088FE" },
    { id: 1, value: 345, label: "Decontamination", color: "#00C49F" },
    { id: 2, value: 366, label: "Cleaning (Instruments)", color: "#82ca9d" },
    { id: 3, value: 346, label: "High level disinfection", color: "#FF8042" },
    { id: 4, value: 20, label: "Waste disposal", color: "#8884D8" },
  ];

  return (
    <Container >
    {PWDdashboard.isLoading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <Row>
        <Box sx={{ width: '100%' }}>
          <Collapse in={open2}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen2(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              You are viewing the data from {previousMonthRange.startDate} to {previousMonthRange.endDate}.
            </Alert>
          </Collapse>
        </Box>
      </Row>
      
      <Row className="d-flex justify-content-between align-items-center mb-3" style={{ marginTop: isMobile ? '10px' : '0' }}>
        <Col xs={8} sm={9}>
          <Typography variant={isMobile ? "h5" : "h4"}>Dashboard</Typography>
        </Col>
        <Col xs={4} sm={3} className="d-flex justify-content-end">
          <Button 
            variant="contained" 
            startIcon={<FilterListIcon />}
            onClick={handleOpen}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              boxShadow: 'none',
              backgroundColor: 'black',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              padding: isMobile ? '6px 12px' : '8px 16px'
            }}
          >
            Filters
          </Button>
        </Col>
      </Row>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="filter-modal-title"
        aria-describedby="filter-modal-description"
        hideBackdrop
        disableEscapeKeyDown
      >
        <Box sx={modalStyle}>
          <Typography id="filter-modal-title" variant="h6" component="h2" mb={2}>
            Filter Dashboard Data
          </Typography>
          
          <TextField
            select
            fullWidth
            margin="normal"
            label="Month"
            name="month"
            value={filters.month}
            onChange={handleChange}
            size={isMobile ? "small" : "medium"}
          >
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            select
            fullWidth
            margin="normal"
            label="Year"
            name="year"
            value={filters.year}
            onChange={handleChange}
            size={isMobile ? "small" : "medium"}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            select
            fullWidth
            margin="normal"
            label="Type of SDP"
            name="SDPdropdownValue"
            value={PWDdashboard.SDPdropdownValue}
            onChange={handleChange}
            size={isMobile ? "small" : "medium"}
          >
             {PWDdashboard.SDPdropdown.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            select
            fullWidth
            margin="normal"
            label="District"
            name="districtValue"
            value={PWDdashboard.districtValue}
            onChange={handleChange}
            size={isMobile ? "small" : "medium"}
          >
           <MenuItem value="">---Select All---</MenuItem>
            {PWDdashboard.districtDropdown.map((option) => (
              <MenuItem key={option.Text} value={option.Text}>
                {option.Text}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            select
            fullWidth
            margin="normal"
            label="Center"
            name="centerValue"
            value={PWDdashboard.centerValue}
            onChange={handleChange}
            size={isMobile ? "small" : "medium"}
          >
            <MenuItem value=" ">---Select All---</MenuItem>
            {PWDdashboard.centerDropdown.map((option) => (
              <MenuItem key={option.Text} value={option.Text}>
                {option.Text}
              </MenuItem>
            ))}
          </TextField>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              onClick={handleClose} 
              sx={{ 
                mr: 2, 
                color: 'black', 
                boxShadow: "1px 1px 8px -1px rgb(160 160 160)",
                fontSize: isMobile ? '0.75rem' : '0.875rem'
              }}
            >
              Cancel 
            </Button>
            <Button 
              variant="contained" 
              sx={{ 
                backgroundColor: 'black',
                fontSize: isMobile ? '0.75rem' : '0.875rem'
              }} 
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Modal>

      <Row>
        <KeyMetricCard />
      </Row>

      <Row sx={{ height: "100%" }}>
        <Grid {...({ item: true, xs: 12, sm: 12, md: 6, lg: 6 } as any)}
          sx={{
            width: "76.5%",
            height: "100%",
            paddingLeft: "0px",
            marginTop: "8px",
          }}
        >
          <div>
            <div style={{ display: "flex", height: "100%",justifyContent:'space-between' }}>
              <div style={{width:"51%"}}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  p: 1,
                  width: "100%",
                  bgcolor: "background.paper",
                  mb: 4,
                  height: 290,
                  marginRight: 2,
                }}
              >
                <StackBars />
              </Card>
              </div>
               <div style={{width:"46%",marginRight:'3px'}}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  p: 3,
                  width: "100%",
                  bgcolor: "background.paper",
                  mb: 4,
                  height: 290,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: "text.primary",
                    textAlign: "left",
                    fontFamily: "inherit",
                    fontSize: 16,
                  }}
                >
                  Technical Monitoring Checklist
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                    flexWrap: isMobile ? "wrap" : "nowrap",
                  }}
                >
                  <Box>

                     <PieChart
                      series={[
                        {
                          data: buildingStatusData,
                          innerRadius: 30,
                          outerRadius: 90,
                          paddingAngle: 5,
                          cornerRadius: 5,
                          startAngle: -45,
                          endAngle: 225,
                          cx: 100,
                          cy: 80,
                          arcLabelMinAngle: 15,
                        },
                      ]}
                      sx={{ "& .MuiChartsLegend-label": { fontSize: "10px !important" }, }}
                      width={250}
                      height={170}
                      slotProps={{
                        legend: {
                          sx: { "& .MuiChartsLegend-label": { fontSize: 6, fontWeight: 'normal' } },
                        },
                      }}
                    />
                  </Box>
                  </Box>
              </Card>
              </div>
            </div>
            
            <StockStatusDashboard />
          </div>
        </Grid>
        <Grid {...({ item: true, xs: 12, sm: 12, md: 4, lg: 4 } as any)}
          sx={{
            width: "23.5%",
            height: "100%",
            paddingRight: "0px",
            marginTop: "8px",
          }}
        >
           <div>
            <IecChart />
          </div>
        </Grid>
      </Row>
    </Container>
  );
};

export default Dashboard;
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
import { SdpDropdown } from "../Service/Init";
import { useAppDispatch } from '../app/Hooks';
import { Col, Container, Row } from "react-bootstrap";
const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    sdpType: '',
    district: '1',
    center: '1'
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
 const [open2, setOpen2] = useState(true);
 const dispatch = useAppDispatch();

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    console.log('Applied filters:', filters);
    handleClose();
  };

   const postAttendanceData = async () => {
  const url = `http://localhost:54050/Designer/Grid2/${"55587"},${"FWC"},${"7122"},${"Karachi Central"},${"---Select All---"},${"2025-01-01"},${"2025-09-08"}`;
  
  const response = await axios.post(url, null, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  
  return response.data;
};
useEffect(() => {
  postAttendanceData();
  dispatch(SdpDropdown());

}, [dispatch]);

  const sdpTypes = [
    { value:'', label: 'Select SDP Type For All' },
    { value: '55587, FWC,7122', label: 'Population Welfare Department - FWC' },
    { value: '50484, MSU,7121', label: 'Population Welfare Department - MSU' },
    { value: '50435, RHS,7120', label: 'Population Welfare Department - RHS-A' },
  ];

  const districts = [
    { value: '1', label: '---Select All---' },
    { value: 'district2', label: 'District 2' },
    { value: 'district3', label: 'District 3' },
  ];

  const centers = [
    { value: '1', label: '---Select All---' },
    { value: 'center2', label: 'Center 2' },
    { value: 'center3', label: 'Center 3' },
  ];

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
              You are viewing the data from January 1, 2025, to September 3, 2025.
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
            fullWidth
            margin="normal"
            label="Start Date"
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            size={isMobile ? "small" : "medium"}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="End Date"
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            size={isMobile ? "small" : "medium"}
          />
          
          <TextField
            select
            fullWidth
            margin="normal"
            label="Type of SDP"
            name="sdpType"
            value={filters.sdpType}
            onChange={handleChange}
            size={isMobile ? "small" : "medium"}
          >
            {sdpTypes.map((option) => (
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
            name="district"
            value={filters.district}
            onChange={handleChange}
            size={isMobile ? "small" : "medium"}
          >
            {districts.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            select
            fullWidth
            margin="normal"
            label="Center"
            name="center"
            value={filters.center}
            onChange={handleChange}
            size={isMobile ? "small" : "medium"}
          >
            {centers.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
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
                          // 'labelStyle' is not a valid prop, so we use sx to target the legend label class
                          sx: { "& .MuiChartsLegend-label": { fontSize: 6, fontWeight: 'normal' } },
                        },
                      }}
                    />
                  </Box>
                  </Box>
              </Card>
              </div>
            </div>
            
            {/* Stock Status of Contraceptives moved down */}
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
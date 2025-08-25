import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Typography, Paper, Grid, Button, Modal, Box, TextField, MenuItem, useMediaQuery, useTheme, Card } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyMetricCard from "../components/KeyMetricCard";
import StockStatusDashboard from "../components/StockStatusDashboard";
import ContraceptivePieChart from "../components/ContraceptivePieChart";
import FuturisticGraph from "../components/FuturisticGraph";
import WeightLossChart from "../components/WeightLossChart";
import EnrollmentTrendsChart from "../components/EnrollmentTrendsChart";
import IecChart from "../components/iECChart";
import { BarChart } from "@mui/x-charts";
  import { createTheme, ThemeProvider } from '@mui/material/styles';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

   const dataset = [
  {
    london: 59,
    paris: 57,
    newYork: 86,
    seoul: 21,
    month: 'Jan',
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    seoul: 28,
    month: 'Feb',
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    seoul: 41,
    month: 'Mar',
  },
  {
    london: 54,
    paris: 56,
    newYork: 92,
    seoul: 73,
    month: 'Apr',
  },
  {
    london: 57,
    paris: 69,
    newYork: 92,
    seoul: 99,
    month: 'May',
  },
  {
    london: 60,
    paris: 63,
    newYork: 103,
    seoul: 144,
    month: 'June',
  },
  {
    london: 59,
    paris: 60,
    newYork: 105,
    seoul: 319,
    month: 'July',
  },
  {
    london: 65,
    paris: 60,
    newYork: 106,
    seoul: 249,
    month: 'Aug',
  },
  {
    london: 51,
    paris: 51,
    newYork: 95,
    seoul: 131,
    month: 'Sept',
  },
  {
    london: 60,
    paris: 65,
    newYork: 97,
    seoul: 55,
    month: 'Oct',
  },
  {
    london: 67,
    paris: 64,
    newYork: 76,
    seoul: 48,
    month: 'Nov',
  },
  {
    london: 61,
    paris: 70,
    newYork: 103,
    seoul: 25,
    month: 'Dec',
  },
  ];
  function valueFormatter(value) {
  return `${value}mm`;
}

  const chartSetting = {
  xAxis: [{ label: 'rainfall (mm)' }],
  height: 400,
  margin: { left: 0 },
};

  
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    sdpType: '1',
    district: '1',
    center: '1'
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
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

  const sdpTypes = [
    { value: '1', label: 'Select SDP Type For All' },
    { value: '2', label: 'Population Welfare Department - FWC' },
    { value: '3', label: 'Population Welfare Department - MSU' },
    { value: '4', label: 'Population Welfare Department - RHS-A' },
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
    width: isMobile ? '90%' : 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: isMobile ? 2 : 4,
    borderRadius: '16px',
    maxHeight: '90vh',
    overflowY: 'auto',
  };

  return (
    <Container >
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

      <Row sx={{height:'100%' }}>
          <Grid item xs={12} sm={12} md={6} lg={6} sx={{width:'76.5%',height:'100%',paddingLeft:'0px', marginTop:'8px'}}>
            <div>
              <StockStatusDashboard />
              <div style={{display: 'flex', marginTop:'30px',height:'100%', }}>
               <Card
                    sx={{
                      borderRadius: 2,
                      boxShadow: 3,
                      p: 3,
                      width: "100%",
                      // maxWidth: 400,
                      bgcolor: "background.paper",
                      mb: 4,
                      height:'100%',
                      marginRight:2

                    }}
                  >
                    <BarChart
                    dataset={dataset}
                    yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                    series={[{ dataKey: 'seoul', label: 'Seoul rainfall', valueFormatter }]}
                    layout="horizontal"
                    grid={{ vertical: true }}
                    {...chartSetting}
                  />
            </Card>
              <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    p: 3,
                    width: "100%",
                    // maxWidth: 400,
                    bgcolor: "background.paper",
                    mb: 4,
                    height:'100%'
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: "text.primary",
                      textAlign: "left",
                      fontFamily: 'inherit',
                      fontSize: 16
                    }}
                  >
                    Status of Building
                  </Typography>
            
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body1" sx={{ color: "text.secondary", fontSize: 13 }}>
                        Indication/ Sign Board (Installed)
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 13 }}>
                        60%
                      </Typography>
                    </Box>
            
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body1" sx={{ color: "text.secondary", fontSize: 13 }}>
                        Electricity
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 13 }}>
                        89%
                      </Typography>
                    </Box>
            
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body1" sx={{ color: "text.secondary", fontSize: 13 }}>
                        Gas
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 13 }}>
                        78%
                      </Typography>
                    </Box>
            
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body1" sx={{ color: "text.secondary", fontSize: 13 }}>
                        Water
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 13 }}>
                        19%
                      </Typography>
                    </Box>
            
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body1" sx={{ color: "text.secondary", fontSize: 13 }}>
                        Cleanlines
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 13 }}>
                        98%
                      </Typography>
                    </Box>
                  </Box>
             </Card>
             </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} sx={{width:'23.5%', height:'100%',paddingRight:'0px', marginTop:'8px'}}>
            <div>
              <IecChart/>
            </div>
          </Grid>
      </Row>

      {/* <Row>
        <Col xs={12} className="mb-4">
          <FuturisticGraph/>
        </Col>
      </Row>

      <Row>
        <Col xs={12} className="mt-3">
          <WeightLossChart/>
        </Col>
      </Row>

      <Row>
        <Col xs={12} className="mt-3">
          <EnrollmentTrendsChart/>
        </Col>
      </Row> */}
    </Container>
  );
};

export default Dashboard; 
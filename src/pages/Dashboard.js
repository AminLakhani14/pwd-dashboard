import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Typography, Paper, Grid, Button, Modal, Box, TextField, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyMetricCard from "../components/KeyMetricCard";
import StockStatusDashboard from "../components/StockStatusDashboard";
import ContraceptivePieChart from "../components/ContraceptivePieChart";
import FuturisticGraph from "../components/FuturisticGraph";
import WeightLossChart from "../components/WeightLossChart";
import EnrollmentTrendsChart from "../components/EnrollmentTrendsChart";

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
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
    <Container fluid style={{ padding: isMobile ? '0 10px' : '0 16px' }}>
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

      <Row>
        <Col xs={12} className="mb-4">
          <Grid item xs={12}>
            <div>
              <StockStatusDashboard />
            </div>
          </Grid>
        </Col>
      </Row>

      <Row>
        <Col xs={12} className="mb-4">
          <FuturisticGraph/>
        </Col>
      </Row>

      <Row>
        <Col xs={12} className={isMobile ? "mt-3" : "mt-5"}>
          <Paper
            elevation={0}
            sx={{
              p: isMobile ? 1 : 2,
              borderRadius: "16px",
              height: "100%",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ 
                fontWeight: 500, 
                mb: isMobile ? 1 : 2, 
                color: "text.primary",
                fontSize: isMobile ? '1.1rem' : '1.25rem'
              }}
            >
              Monthly Attendance Trend
            </Typography>

            <div>
              <StockStatusDashboard />
            </div>
          </Paper>
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
      </Row>
    </Container>
  );
};

export default Dashboard;
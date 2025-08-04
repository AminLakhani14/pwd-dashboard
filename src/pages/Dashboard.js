import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Typography, useTheme, Paper, Box, Grid } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

// Import the new components
import KeyMetricCard from "../components/KeyMetricCard";
import GeoMapChart from "../components/GeoMapChart";
import HealthMetricsCard from "../components/healthchart";
import StockStatusDashboard from "../components/StockStatusDashboard";
import ContraceptivePieChart from "../components/ContraceptivePieChart";

// Sample data for the line chart
const lineChartData = [
  { name: "Jan", uv: 4000, pv: 2400 },
  { name: "Feb", uv: 3000, pv: 1398 },
  { name: "Mar", uv: 2000, pv: 9800 },
  { name: "Apr", uv: 2780, pv: 3908 },
  { name: "May", uv: 1890, pv: 4800 },
  { name: "Jun", uv: 2390, pv: 3800 },
];

const currentAttendanceStatus = [
  { name: "Present", value: 105 },
  { name: "Absent", value: 14 },
  { name: "Vacant", value: 15 },
  { name: "Leave", value: 13 },
];
const COLORS = ["#1100fe", "#e7e219", "orange", "red"];

const Dashboard = () => {
  const theme = useTheme();

  return (
    <Container fluid>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, color: "text.primary", mb: 3 }}
      >
        Dashboard
      </Typography>

      {/* --- Data Storytelling: Key Metrics First --- */}
      <Row className="mb-4">
        <Col md={3} className="mb-3 mb-md-0">
          <KeyMetricCard
            title="Total Visit Report submited"
            value="27 FWC"
            // icon={<MonetizationOnIcon sx={{fontSize: 40}} />}
          />
        </Col>
        <Col md={3} className="mb-3 mb-md-0">
          <KeyMetricCard
            title="Status Of FWC"
            value="27 Open and 0 close"
            // icon={<GroupAddIcon sx={{fontSize: 40}} />}
            color={theme.palette.secondary.main}
          />
        </Col>
        <Col md={3} className="mb-3 mb-md-0">
          <KeyMetricCard
            title="Status Of FWC"
            value="25 Branded and 2 Unbranded"
            // icon={<DnsIcon sx={{fontSize: 40}} />}
            color="#82ca9d"
          />
        </Col>
        <Col md={3}>
          <KeyMetricCard
            title="Today's Attendance"
            value="89.2%"
            icon={<PeopleAltIcon sx={{ fontSize: 40 }} />}
            color="#FFBB28"
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12} className="mb-4">
          <Grid item xs={12} md={6}>
            <ContraceptivePieChart />
          </Grid>
        </Col>
      </Row>

      <Row>
        <Col lg={12} className="mb-4">
          <GeoMapChart />
        </Col>
      </Row>

      <Row>
        <Col className="mt-5">

          <Paper
            elevation={0}
            sx={{
              p: { xs: 1, sm: 2 },
              borderRadius: "16px",
              height: "1900px",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, mb: 2, color: "text.primary" }}
            >
              Monthly Attendance Trend
            </Typography>

            <HealthMetricsCard width="100%" height="85%" />

            <div style={{marginTop:'100px', }}>
              <StockStatusDashboard />
            </div>
          </Paper>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;

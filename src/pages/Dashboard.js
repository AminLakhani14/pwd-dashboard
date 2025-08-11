import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Typography, Paper, Grid } from "@mui/material";
import KeyMetricCard from "../components/KeyMetricCard";
import HealthMetricsCard from "../components/healthchart";
import StockStatusDashboard from "../components/StockStatusDashboard";
import ContraceptivePieChart from "../components/ContraceptivePieChart";
import FuturisticGraph from "../components/FuturisticGraph";
import WeightLossChart from "../components/WeightLossChart";
import EnrollmentTrendsChart from "../components/EnrollmentTrendsChart";


const Dashboard = () => {

  return (
    <Container fluid>
      <Row >
          <KeyMetricCard />
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
        <FuturisticGraph/>
        </Col>
      </Row>

      <Row>
        <Col className="mt-5">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1, sm: 2 },
              borderRadius: "16px",
              height: "1300px",
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


      <Row>
        <Col lg={12} className="mt-3">
        <WeightLossChart/>
        </Col>
      </Row>

      <Row>
        <Col lg={12} className="mt-3">
        <EnrollmentTrendsChart/>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;

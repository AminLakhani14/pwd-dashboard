import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Typography, useTheme,Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DnsIcon from '@mui/icons-material/Dns';

// Import the new components
import KeyMetricCard from '../components/KeyMetricCard';
import GeoMapChart from '../components/GeoMapChart';
import RadialProgressChart from '../components/RadialProgressChart';


// Sample data for the line chart
const lineChartData = [
  { name: 'Jan', uv: 4000, pv: 2400 }, { name: 'Feb', uv: 3000, pv: 1398 },
  { name: 'Mar', uv: 2000, pv: 9800 }, { name: 'Apr', uv: 2780, pv: 3908 },
  { name: 'May', uv: 1890, pv: 4800 }, { name: 'Jun', uv: 2390, pv: 3800 },
];

const Dashboard = () => {
  const theme = useTheme();

  return (
    <Container fluid>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
        Dashboard
      </Typography>

      {/* --- Data Storytelling: Key Metrics First --- */}
      <Row className="mb-4">
        <Col md={4} className="mb-3 mb-md-0">
            <KeyMetricCard title="Total Revenue" value="$48,590" icon={<MonetizationOnIcon sx={{fontSize: 40}} />} />
        </Col>
        <Col md={4} className="mb-3 mb-md-0">
            <KeyMetricCard title="New Users" value="1,245" icon={<GroupAddIcon sx={{fontSize: 40}} />} color={theme.palette.secondary.main}/>
        </Col>
        <Col md={4}>
            <KeyMetricCard title="Server Uptime" value="99.8%" icon={<DnsIcon sx={{fontSize: 40}} />} color="#82ca9d"/>
        </Col>
      </Row>

      {/* --- Advanced & Interactive Visualizations --- */}
      <Row>
        <Col xl={8} className="mb-4">
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 1, sm: 2 }, borderRadius: '16px', height: '450px', border: '1px solid',
                    borderColor: 'divider', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: 'text.primary' }}>
                    Sales Trend
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={lineChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                        <XAxis dataKey="name" tick={{ fill: theme.palette.text.secondary }} stroke={theme.palette.divider} />
                        <YAxis tick={{ fill: theme.palette.text.secondary }} stroke={theme.palette.divider} />
                        <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: '12px' }} />
                        <Legend verticalAlign="top" height={36}/>
                        <Line type="monotone" dataKey="pv" stroke={theme.palette.primary.main} strokeWidth={2} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="uv" stroke={theme.palette.secondary.main} strokeWidth={2} activeDot={{ r: 6 }}/>
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
        </Col>

        <Col xl={4} className="mb-4">
            <RadialProgressChart />
        </Col>
      </Row>

      <Row>
        <Col className="mb-4">
          <GeoMapChart />
        </Col>
      </Row>

    </Container>
  );
};

export default Dashboard;
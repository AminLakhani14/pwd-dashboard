import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { Typography } from '@mui/material';

const Reports = () => {
  return (
    <Container fluid>
        <Card>
            <Card.Body>
                <Typography variant="h4">
                    Reports Page
                </Typography>
                <Typography variant="body1">
                    This is where the reports content will be displayed.
                </Typography>
            </Card.Body>
        </Card>
    </Container>
  );
};

export default Reports;
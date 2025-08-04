import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { Typography } from '@mui/material';

const Analytics = () => {
  return (
    <Container fluid>
        <Card>
            <Card.Body>
                <Typography variant="h4">
                    Analytics Page
                </Typography>
                <Typography variant="body1">
                    This is where the analytics content will be displayed.
                </Typography>
            </Card.Body>
        </Card>
    </Container>
  );
};

export default Analytics;
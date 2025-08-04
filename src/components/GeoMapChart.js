import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Paper, Typography, useTheme } from '@mui/material';

// The URL to the world map TopoJSON file
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const markers = [
  { markerOffset: -15, name: "Buenos Aires", coordinates: [-58.3816, -34.6037] },
  { markerOffset: -15, name: "La Paz", coordinates: [-68.1193, -16.4897] },
  { markerOffset: 25, name: "Brasilia", coordinates: [-47.8825, -15.7942] },
  { markerOffset: 25, name: "Santiago", coordinates: [-70.6693, -33.4489] },
  { markerOffset: 25, name: "Bogota", coordinates: [-74.0721, 4.7110] },
  { markerOffset: 25, name: "Cairo", coordinates: [31.2357, 30.0444] },
  { markerOffset: -15, name: "New Delhi", coordinates: [77.2090, 28.6139] },
  { markerOffset: 25, name: "Tokyo", coordinates: [139.6917, 35.6895] },
];

const GeoMapChart = () => {
    const theme = useTheme();

  return (
    <Paper
        elevation={0}
        sx={{
            p: { xs: 1, sm: 2 }, borderRadius: '16px', border: '1px solid',
            borderColor: 'divider', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%'
        }}>
        <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: 'text.primary' }}>
            Global Activity
        </Typography>
        <ComposableMap projectionConfig={{ scale: 140 }}>
            <Geographies geography={geoUrl}>
                {({ geographies }) =>
                geographies.map(geo => (
                    <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={theme.palette.divider}
                        stroke={theme.palette.background.default}
                    />
                ))
                }
            </Geographies>
            {markers.map(({ name, coordinates }) => (
                <Marker key={name} coordinates={coordinates}>
                <circle r={8} fill={theme.palette.primary.main} stroke="#fff" strokeWidth={2} />
                </Marker>
            ))}
        </ComposableMap>
    </Paper>
  );
};

export default GeoMapChart;
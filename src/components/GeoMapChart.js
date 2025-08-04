import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Paper, Typography, useTheme } from '@mui/material';

// The URL to the Pakistan map TopoJSON file
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/pakistan/pakistan.json";

const markers = [
  { markerOffset: -15, name: "Karachi", coordinates: [67.0099, 24.8607] },
  { markerOffset: -15, name: "Sukkur", coordinates: [68.8589, 27.7053] },
  { markerOffset: 25, name: "Dadu", coordinates: [67.7769, 26.7306] },
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
        Pakistan Activity
      </Typography>
      <ComposableMap projectionConfig={{ scale: 1500, center: [69, 30] }}>
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
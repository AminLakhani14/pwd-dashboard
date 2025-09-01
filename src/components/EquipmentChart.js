import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const equipmentData = [
  { name: 'IUD Kits', count: 21 },
  { name: 'BP Apparatus', count: 28 },
  { name: 'Stethoscope', count: 41 },
  { name: 'Thermometer', count: 73 },
  { name: 'Weighing Machine', count: 99 },
  { name: 'Stove', count: 144 },
  { name: 'Autoclave', count: 319 },
  { name: 'Sterilizer', count: 249 },
  { name: 'Screen', count: 131 },
];

const maxValue = Math.max(...equipmentData.map(item => item.count));

export default function CustomEquipmentChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        height: "450px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        marginTop: "20px",
        overflow: 'auto',
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
          align="left"
          sx={{
            mb: 2,
            color: theme.palette.text.primary,
            fontFamily: "inherit",
            fontSize: 16,
          }}
        >
          Equipment Position/Condition
        </Typography>
        
        <Box sx={{ width: '100%' }}>
          {equipmentData.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ 
                  width: '40%', 
                  minWidth: '140px',
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: 500,
                }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontWeight: 600,
                  fontSize: isMobile ? '11px' : '12px',
                }}>
                  {item.count}
                </Typography>
              </Box>
              <Box sx={{ 
                width: '100%', 
                height: '20px', 
                backgroundColor: theme.palette.grey[200],
                borderRadius: '10px',
                overflow: 'hidden',
              }}>
                <Box sx={{
                  width: `${(item.count / maxValue) * 100}%`,
                  height: '100%',
                  backgroundColor: '#4285f4',
                  borderRadius: '10px',
                  transition: 'width 0.5s ease',
                }} />
              </Box>
            </Box>
          ))}
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 2,
          px: 1 
        }}>
          {[0, 100, 200, 300, 400].map((value) => (
            <Typography key={value} variant="caption" sx={{ fontSize: '10px' }}>
              {value}
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
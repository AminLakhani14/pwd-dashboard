import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
  FiberManualRecord as StatusIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const FuturisticContraceptivePieChart = () => {
  const theme = useTheme();

  // Sample data
  const stockData = [
    { name: 'Condoms', value: 12500, expiry: '2024-08-18', status: 'Adequate', color: '#00E5FF' },
    { name: 'COC', value: 8200, expiry: '2024-08-30', status: 'Low', color: '#00BFA5' },
    { name: 'POP', value: 4500, expiry: '2024-06-22', status: 'Adequate', color: '#6200EA' },
    { name: 'ECP', value: 1800, expiry: '2024-09-10', status: 'Expiring', color: '#FF6D00' },
    { name: '3 Months Inj (Depo)', value: 3200, expiry: '2024-04-05', status: 'Critical', color: '#FF1744' },
    { name: '3 Month Inj (Sayana Press)', value: 2500, expiry: '2024-07-18', status: 'Adequate', color: '#AA00FF' },
    { name: 'IUCD (CT-380-A)', value: 2088, expiry: '2025-01-05', status: 'Adequate', color: '#1DE9B6' },
  ];

  // Custom active shape for hover effects
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;

    return (
      <g>
        <path
          d={`M${cx},${cy} 
             L${cx + outerRadius * Math.cos(startAngle)},${cy + outerRadius * Math.sin(startAngle)} 
             A${outerRadius},${outerRadius} 0 ${endAngle - startAngle > Math.PI ? 1 : 0},1 ${cx + outerRadius * Math.cos(endAngle)},${cy + outerRadius * Math.sin(endAngle)} 
             Z`}
          fill={fill}
          stroke="#121212"
          strokeWidth={2}
          style={{ filter: 'drop-shadow(0 0 8px rgba(0,229,255,0.6))' }}
        />
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill="#fff"
          style={{ fontSize: '14px', fontWeight: 'bold' }}
        >
          {payload.name}
        </text>
      </g>
    );
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: '16px',
        height: '100%',
        background: 'linear-gradient(145deg, #121212 0%, #1E1E1E 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 3,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          fontFamily: '"Roboto Condensed", sans-serif',
          letterSpacing: '1px'
        }}
      >
        <StatusIcon sx={{ mr: 1.5, color: theme.palette.primary.light }} />
        CONTRACEPTIVE STOCK ANALYSIS
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Futuristic Pie Chart */}
        <Box sx={{ 
          width: { xs: '100%', md: '50%' },
          position: 'relative'
        }}>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <defs>
                {stockData.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.8}/>
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.3}/>
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={stockData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                activeIndex={[0, 1, 2, 3, 4, 5, 6]}
                activeShape={renderActiveShape}
              >
                {stockData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#gradient-${index})`} 
                    stroke="#121212"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                content={({ payload }) => (
                  <Paper sx={{ 
                    p: 2, 
                    background: 'rgba(30,30,30,0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                  }}>
                    <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600 }}>
                      {payload[0]?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        bgcolor: payload[0]?.payload?.color,
                        mr: 1,
                        borderRadius: '2px'
                      }} />
                      <Typography variant="body2" sx={{ color: '#fff' }}>
                        {payload[0]?.value?.toLocaleString()} units
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                      Exp: {new Date(payload[0]?.payload?.expiry).toLocaleDateString()}
                    </Typography>
                  </Paper>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center metric */}
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}>
            <Typography variant="h4" sx={{ 
              color: '#fff', 
              fontWeight: 700,
              fontFamily: '"Roboto Condensed", sans-serif'
            }}>
              7
            </Typography>
            <Typography variant="body2" sx={{ 
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Products
            </Typography>
          </Box>
        </Box>

        {/* Product List */}
        <Box sx={{ 
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5
        }}>
          {stockData.map((item, index) => {
            const expiryDate = new Date(item.expiry);
            const today = new Date();
            const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
            const isExpiringSoon = diffDays < 90;

            return (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  borderRadius: '8px',
                  background: 'rgba(30,30,30,0.5)',
                  borderLeft: `4px solid ${item.color}`,
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${item.color}40`
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ 
                    color: '#fff', 
                    fontWeight: 600,
                    fontFamily: '"Roboto Condensed", sans-serif'
                  }}>
                    {item.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {item.status === 'Adequate' ? (
                      <CheckIcon sx={{ color: '#00E676', fontSize: '1rem', mr: 0.5 }} />
                    ) : item.status === 'Low' ? (
                      <WarningIcon sx={{ color: '#FFC400', fontSize: '1rem', mr: 0.5 }} />
                    ) : (
                      <ErrorIcon sx={{ color: '#FF3D00', fontSize: '1rem', mr: 0.5 }} />
                    )}
                    <Typography variant="caption" sx={{ 
                      color: item.status === 'Adequate' ? '#00E676' : 
                            item.status === 'Low' ? '#FFC400' : '#FF3D00',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {item.status}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mt: 1
                }}>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255,255,255,0.8)',
                    fontFamily: '"Roboto Mono", monospace'
                  }}>
                    {item.value.toLocaleString()} units
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isExpiringSoon && (
                      <WarningIcon sx={{ 
                        color: '#FFC400', 
                        fontSize: '1rem', 
                        mr: 0.5 
                      }} />
                    )}
                    <Typography variant="body2" sx={{ 
                      color: isExpiringSoon ? '#FFC400' : 'rgba(255,255,255,0.8)',
                      fontFamily: '"Roboto Mono", monospace'
                    }}>
                      Exp: {expiryDate.toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default FuturisticContraceptivePieChart;
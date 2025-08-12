import * as React from 'react';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';

const translations = {
  totAss: 'Office Table ',
  currAss: 'Office Chairs',
  nCurrAss: 'Benches',
  totLia: 'Examination Table',
  curLia: 'Insertion Table',
  nCurLia: 'Revolving Stool',
  totEq: 'Medicine Cabinet',
};

const furnitureData = [
  { shortform: 'OT', fullForm: 'Office Table', good: 36, satisfactory: 8, poor: 4 }, 
  { shortform: 'OC', fullForm: 'Office Chairs', good: 3, satisfactory: 1, poor: 6 }, 
  { shortform: 'B', fullForm: 'Benches', good: 6, satisfactory: 5, poor: 4 }, 
  { shortform: 'ET', fullForm: 'Examination Table', good: 3, satisfactory: 4, poor: 2 }, 
  { shortform: 'IT', fullForm: 'Insertion Table', good: 5, satisfactory: 4, poor: 5 }, 
  { shortform: 'RS', fullForm: 'Revolving Stool', good: 1, satisfactory: 2, poor: 5 }, 
  { shortform: 'MC', fullForm: 'Medicine Cabinet', good: 8, satisfactory: 8, poor: 5 }, 
];

const valueFormatter = (value) => `${(value / 7 * 100).toFixed(1)}%`; // Total items = 7

export function addLabels(series) {
  return series.map((item) => ({
    ...item,
    label: translations[item.dataKey] || item.dataKey,
    valueFormatter: (v) => (v !== null ? valueFormatter(v) : '-'),
    tooltip: (params) => {
      const total = 7;
      const val = params.value || 0;
      const percentage = (val / total * 100).toFixed(1);
      const fullForm = {
        good: 'Good',
        satisfactory: 'Satisfactory',
        poor: 'Poor',
      }[params.dataKey] || params.dataKey;
      const quantities = {
        good: 6,
        satisfactory: 1,
        poor: 0,
      };
      return {
        value: `${fullForm}: ${quantities[params.dataKey]} items (${percentage}%)`,
      };
    },
  }));
}

export default function StackBars() {
  return (
    <div style={{ width: '100%' }}>
      <Typography>Furniture Position</Typography>
      <BarChart
        dataset={furnitureData}
        series={addLabels([
          { dataKey: 'poor', stack: 'status', color: 'red' },
          { dataKey: 'good', stack: 'status', color: 'green' },
          { dataKey: 'satisfactory', stack: 'status', color: 'yellow' },
        ])}
        xAxis={[{ 
          dataKey: 'shortform',
          labelFormatter: (shortform) => {
            const mappings = {
              'OT': 'Office Table',
              'OC': 'Office Chairs',
              'B': 'Bench',
              'ET': 'Examination Table',
              'IT': 'Instrument Table',
              'RS': 'Revolving Stool',
              'MC': 'Medicine Cabinet',
            };
            return mappings[shortform] || shortform;
          },
          tooltip: {
            valueFormatter: (shortform) => {
              const mappings = {
                'OT': 'Office Table: 3 items',
                'OC': 'Office Chairs: 12 items',
                'B': 'Bench',
                'ET': 'Examination Table',
                'IT': 'Instrument Table',
                'RS': 'Revolving Stool',
                'MC': 'Medicine Cabinet',
              };
              return mappings[shortform] || shortform;
            },
          },
        }]}
        height={165}
        margin={0}
        yAxis={[{ width: 50, hide: true }]}
        hideLegend={true}
      />
    </div>
  );
}
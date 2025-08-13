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

const valueFormatter = (value) => `${(value / 7 * 100).toFixed(1)}%`;

export function addLabels(series) {
  return series.map((item) => ({
    ...item,
    label: translations[item.dataKey] || item.dataKey,
    valueFormatter: (v) => (v !== null ? valueFormatter(v) : '-'),
    tooltip: ({ value, dataKey }) => {
      const fullForm = {
        good: 'Good',
        satisfactory: 'Satisfactory',
        poor: 'Poor',
      }[dataKey] || dataKey;
      return `${fullForm}: ${value} items (${valueFormatter(value)})`;
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
          { dataKey: 'good', stack: 'status', color: '#2ecc71' },
          { dataKey: 'satisfactory', stack: 'status', color: '#d4ac0d' },
          { dataKey: 'poor', stack: 'status', color: '#d35454' },
        ])}
        xAxis={[{ 
          dataKey: 'shortform',
          scaleType: 'band',
          labelFormatter: (shortform) => {
            const item = furnitureData.find(item => item.shortform === shortform);
            return item ? item.fullForm : shortform;
          },
        }]}
        height={165}
        margin={0}
        yAxis={[{ width: 50, hide: true }]}
        hideLegend={true}
        tooltip={{
          trigger: 'item',
          content: ({ series, dataIndex }) => {
            const item = furnitureData[dataIndex];
            return (
              <div>
                <strong>{item.fullForm}</strong>
                <div>Poor: {item.poor} items</div>
                <div>Satisfactory: {item.satisfactory} items</div>
                <div>Good: {item.good} items</div>
              </div>
            );
          },
        }}
      />
    </div>
  );
} 
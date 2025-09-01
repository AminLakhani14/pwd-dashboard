import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Present', value: 80 },
  { name: 'Absent', value: 20 },
];

const COLORS = ['#4caf50', '#b3b3b3']; // Green for Present, Orange for Absent

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, total, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) + 30; // Extend beyond outer radius for label
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const percentage = ((value / total) * 100).toFixed(0);

  return (
    <g>
      <text
        x={x}
        y={y}
        fill="gray"
        fontSize={10}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${percentage}%`} {percentage >= 70 ? 'Open' : 'Close'}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const percentage = ((value / total) * 100).toFixed(0);
    return (
      <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
        <p>{`${name}: ${value} people (${percentage}%)`}</p>
      </div>
    );
  }
  return null;
};

export default function Statisticscard() {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <ResponsiveContainer width="100%" height="80%">
      <PieChart width={200}>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={55}
          fill="#82ca9d"
          label={(props) => renderCustomizedLabel({ ...props, total })}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
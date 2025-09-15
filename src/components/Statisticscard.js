import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import {
  Box,
  Typography,
  IconButton,
  Drawer
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';

// Pie chart data
const pieData = [
  { name: 'Open', value: 401 },
  { name: 'Close', value: 3 },
];

const COLORS = ['#4caf50', '#b3b3b3'];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, total, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) + 30;
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
    const total = pieData.reduce((sum, item) => sum + item.value, 0);
    const percentage = ((value / total) * 100).toFixed(0);
    return (
      <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
        <p style={{ fontSize: '12px' }}>{`${name}: ${value} (${percentage}%)`}</p>
      </div>
    );
  }
  return null;
};

// Data for each SDP category
const sdpDetailsData = {
  "RHS-A": [
    { id: 1, district: "Badin", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A M.P.S Centre Badin", status: "Open" },
    { id: 2, district: "Karachi West", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Qatar Hospital Karachi West", status: "Close" },
    { id: 3, district: "Karachi West", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A-Centre KV SITE Hospital Karachi Karachi West", status: "Open" },
    { id: 4, district: "Korangi", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Centre Ibrahim Hyderi Karachi Korangi", status: "Open" },
    { id: 5, district: "Korangi", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Centre SGH Korangi # 5 Karachi Korangi", status: "Open" },
    { id: 6, district: "Malir", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Saudabad Karachi Malir Town", status: "Open" },
    { id: 7, district: "Qambar Shahdadkot", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A CENTRE KAMBER Qambar Shahdadkot", status: "Open" },
    { id: 8, district: "Sanghar", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Center Shahdadpur Sanghar", status: "Open" },
    { id: 9, district: "Sanghar", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Center Tando Adam Sanghar", status: "Open" },
    { id: 10, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A-Center Nawabshah Shaheed Benazirabad", status: "Open" },
    { id: 11, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A-Center Sakrand Shaheed Benazirabad", status: "Open" },
    { id: 12, district: "Shikarpur", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Centre Civil Hospital Shikarpur", status: "Open" },
    { id: 13, district: "Sukkur", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A New Sukkur", status: "Open" },
    { id: 14, district: "Tando Muhammad Khan", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Centre Tando Muhammad Khan", status: "Open" },
    { id: 15, district: "Tharparkar", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Mithi Tharparkar \"Mithi\"", status: "Open" },
    { id: 16, district: "Karachi Central", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Abbasi Shaheed Karachi Central", status: "Open" }
  ],
  "MSU": [
    { id: 17, district: "Kashmore", sdpType: "Population Welfare Department - MSU", centerName: "MSU Center Civil Hospital Kandhkot Kashmore", status: "Open" },
    { id: 18, district: "Kashmore", sdpType: "Population Welfare Department - MSU", centerName: "MSU Center Civil Hospital Kandhkot Kashmore", status: "Open" },
    { id: 19, district: "Kashmore", sdpType: "Population Welfare Department - MSU", centerName: "MSU Center Civil Hospital Kandhkot Kashmore", status: "Open" },
    { id: 20, district: "Kashmore", sdpType: "Population Welfare Department - MSU", centerName: "MSU Center Civil Hospital Kandhkot Kashmore", status: "Open" },
    { id: 21, district: "Malir", sdpType: "Population Welfare Department - MSU", centerName: "MSU Saudabad Karachi Malir Town", status: "Open" },
    { id: 22, district: "Malir", sdpType: "Population Welfare Department - MSU", centerName: "MSU Saudabad Karachi Malir Town", status: "Open" },
    { id: 23, district: "Sanghar", sdpType: "Population Welfare Department - MSU", centerName: "MSU Center Shahdadpur Sanghar", status: "Open" },
    { id: 24, district: "Sanghar", sdpType: "Population Welfare Department - MSU", centerName: "MSU Center Shahdadpur Sanghar", status: "Open" },
    { id: 25, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - MSU", centerName: "MSU-Center Nawabshah Shaheed Benazirabad", status: "Open" },
    { id: 26, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - MSU", centerName: "MSU-Center Nawabshah Shaheed Benazirabad", status: "Open" },
    { id: 27, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - MSU", centerName: "MSU-Center Sakrand Shaheed Benazirabad", status: "Open" },
    { id: 28, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - MSU", centerName: "MSU-Center Sakrand Shaheed Benazirabad", status: "Open" },
    { id: 29, district: "Karachi East", sdpType: "Population Welfare Department - MSU", centerName: "MSU-Centre, Dow Hospital, Ojha Campus Karachi East", status: "Open" }
  ],
  "FWC": [
    { id: 30, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC SGD Abidabad Baldia Karachi West", status: "Open" },
    { id: 31, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC UHU-15 Orangi Karachi West", status: "Open" },
    { id: 32, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC Banaras Colony Karachi West", status: "Open" },
    { id: 33, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC Al-razi Dispensary Orangi Town Karachi West", status: "Open" },
    { id: 34, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC Al-razi Dispensary Orangi Town Karachi West", status: "Open" },
    { id: 35, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC SGD, BHU Qasba Karachi West", status: "Open" },
    { id: 36, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC Mangopir Karachi West", status: "Open" },
    { id: 37, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC Razia Mat. Home Saeedabad Karachi West", status: "Open" },
    { id: 38, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC 7-D Surjani Town Karachi West", status: "Open" },
    { id: 39, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC SGD 5-D Surjani Karachi West", status: "Open" },
    { id: 40, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC SGD 5-D Surjani Karachi West", status: "Open" },
    { id: 41, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC UHU Dispensary Ali Ghar Sec-01 Orangi Town Karachi West", status: "Open" },
    { id: 42, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC Red Crescent Disp. Orangi Town Karachi West", status: "Open" },
    { id: 43, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC Esha Mat.Home Orangi Town Karachi West", status: "Open" },
    { id: 44, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC RHC, SGD Baldia Town Karachi West", status: "Open" },
    { id: 45, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC CDGK Dispensary Saeedabad Karachi West", status: "Open" },
    { id: 46, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC KMC Dispensary, Baldia Karachi West", status: "Open" },
    { id: 47, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC Labour Square Baldia Karachi West", status: "Open" },
    { id: 48, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC KMC Dispensary Golimar Karachi West", status: "Open" },
    { id: 49, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC SGH Asif Bhutto Dispensary Pak Colony Karachi West", status: "Open" },
    { id: 50, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC UHU-10.SGH Orangi Town Karachi West", status: "Open" },
    { id: 51, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC Barkia Med.Centre Surjani Town Karachi West", status: "Open" },
    { id: 52, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC 50 Bed SGH Surjani Karachi West", status: "Open" },
    { id: 53, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC Mat.Home & Disp 11-E Orangi Town Karachi West", status: "Open" },
    { id: 54, district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC Rehman Medical Center, Gulshan-e-Ghazi Karachi West", status: "Open" },
    { id: 55, district: "Korangi", sdpType: "Population Welfare Department - FWC", centerName: "FWC Bhitai Colony E Sacter (New) Korangi", status: "Open" },
    { id: 56, district: "Korangi", sdpType: "Population Welfare Department - FWC", centerName: "FWC BHITAI COLONY Korangi", status: "Open" },
    { id: 57, district: "Korangi", sdpType: "Population Welfare Department - FWC", centerName: "FWC NASIR COLONY Korangi", status: "Open" },
    { id: 58, district: "Korangi", sdpType: "Population Welfare Department - FWC", centerName: "FWC BHU-33-C Korangi", status: "Open" },
    { id: 59, district: "Korangi", sdpType: "Population Welfare Department - FWC", centerName: "FWC INDUS MEHRAN Korangi", status: "Open" },
    { id: 60, district: "Korangi", sdpType: "Population Welfare Department - FWC", centerName: "FWC LANDHI MEDICAL COMPLEX Korangi", status: "Open" },
    { id: 61, district: "Korangi", sdpType: "Population Welfare Department - FWC", centerName: "FWC LANDHI 3 1/2 Korangi", status: "Open" },
    { id: 62, district: "Korangi", sdpType: "Population Welfare Department - FWC", centerName: "FWC 25-Bedded Hospital Malir Kala Board Korangi", status: "Open" },
    { id: 63, district: "Korangi", sdpType: "Population Welfare Department - FWC", centerName: "FWC BALDIA DISP 5 1/2 Korangi", status: "Open" },
    { id: 64, district: "Korangi", sdpType: "Population Welfare Department - FWC", centerName: "FWC HAZRAT BILAL COLONY Korangi", status: "Open" },
    { id: 65, district: "Korangi", sdpType: "Population Welfare Department - FWC", centerName: "FWC SAUDABAD COLONY Korangi", status: "Open" },
    { id: 66, district: "Malir", sdpType: "Population Welfare Department - FWC", centerName: "FWC SHAHNAWAZ GOTH Malir Town", status: "Open" },
    { id: 67, district: "Malir", sdpType: "Population Welfare Department - FWC", centerName: "FWC SHERPAO COLONY Malir Town", status: "Open" },
    { id: 68, district: "Malir", sdpType: "Population Welfare Department - FWC", centerName: "FWC SASSI LANDHI Malir Town", status: "Open" },
    { id: 69, district: "Malir", sdpType: "Population Welfare Department - FWC", centerName: "FWC PIA TOWNSHIP Malir Town", status: "Open" },
    { id: 70, district: "Malir", sdpType: "Population Welfare Department - FWC", centerName: "FWC STEEL TOWN Malir Town", status: "Open" },
    { id: 71, district: "Malir", sdpType: "Population Welfare Department - FWC", centerName: "FWC BEECHM TRUST Malir Town", status: "Open" },
    { id: 72, district: "Malir", sdpType: "Population Welfare Department - FWC", centerName: "FWC YOUSUF GOTH Malir Town", status: "Open" },
    { id: 73, district: "Malir", sdpType: "Population Welfare Department - FWC", centerName: "FWC YOUSUF GOTH Malir Town", status: "Open" },
    { id: 74, district: "Malir", sdpType: "Population Welfare Department - FWC", centerName: "FWC JAM KANDO Malir Town", status: "Open" },
    { id: 75, district: "Malir", sdpType: "Population Welfare Department - FWC", centerName: "FWC Hassan Panwar Goth Malir Town", status: "Open" },
    { id: 76, district: "Malir", sdpType: "Population Welfare Department - FWC", centerName: "FWC ASOO Goth Malir Town", status: "Open" },
    { id: 77, district: "Malir", sdpType: "Population Welfare Department - FWC", centerName: "FWC Government Dispensary Marvi Goth Malir Town", status: "Open" },
    { id: 78, district: "Malir", sdpType: "Population Welfare Department - FWC", centerName: "FWC ALI MUHAMMAD SHAIKH GOTH Malir Town", status: "Open" },
    { id: 79, district: "Malir", sdpType: "Population Welfare Department - FWC", centerName: "FWC Model Centre PWTI Malir Town", status: "Open" },
    { id: 80, district: "Naushahro Feroze", sdpType: "Population Welfare Department - FWC", centerName: "FWC Naushahro Feroze-I", status: "Open" },
    { id: 81, district: "Naushahro Feroze", sdpType: "Population Welfare Department - FWC", centerName: "FWC Naushahro Feroze-III", status: "Open" },
    { id: 82, district: "Naushahro Feroze", sdpType: "Population Welfare Department - FWC", centerName: "FWC Tharo Shah Naushahro Feroze", status: "Open" },
    { id: 83, district: "Naushahro Feroze", sdpType: "Population Welfare Department - FWC", centerName: "FWC Khahi Maman Naushahro Feroze", status: "Open" },
    { id: 84, district: "Naushahro Feroze", sdpType: "Population Welfare Department - FWC", centerName: "FWC Bhiria City Naushahro Feroze", status: "Open" },
    { id: 85, district: "Naushahro Feroze", sdpType: "Population Welfare Department - FWC", centerName: "FWC Khahi Rahoo Naushahro Feroze", status: "Open" },
    { id: 86, district: "Qambar Shahdadkot", sdpType: "Population Welfare Department - FWC", centerName: "FWC KAMBER-I Qambar Shahdadkot", status: "Open" },
    { id: 87, district: "Sanghar", sdpType: "Population Welfare Department - FWC", centerName: "FWC Sinjhoro Sanghar", status: "Open" },
    { id: 88, district: "Sanghar", sdpType: "Population Welfare Department - FWC", centerName: "FWC Jhol Sanghar", status: "Open" },
    { id: 89, district: "Sanghar", sdpType: "Population Welfare Department - FWC", centerName: "FWC Shahdadpur-II Sanghar", status: "Open" },
    { id: 90, district: "Sanghar", sdpType: "Population Welfare Department - FWC", centerName: "FWC Allahyar Goth TDM Sanghar", status: "Open" },
    { id: 91, district: "Sanghar", sdpType: "Population Welfare Department - FWC", centerName: "FWC Tandoadam-III Sanghar", status: "Open" },
    { id: 92, district: "Sanghar", sdpType: "Population Welfare Department - FWC", centerName: "FWC Rukan Buriro Sanghar", status: "Open" },
    { id: 93, district: "Sanghar", sdpType: "Population Welfare Department - FWC", centerName: "FWC Gulzar Colony Tando Adam Sanghar", status: "Open" },
    { id: 94, district: "Sanghar", sdpType: "Population Welfare Department - FWC", centerName: "FWC Shahdadpur-III Sanghar", status: "Open" },
    { id: 95, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC Gyani Ward Evening Shaheed Benazirabad", status: "Open" },
    { id: 96, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC Ghulam Rasool Shah Colony Shaheed Benazirabad", status: "Open" },
    { id: 97, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC GD Nadir Shah Dispensary Shaheed Benazirabad", status: "Open" },
    { id: 98, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC Essa Bhatti Shaheed Benazirabad", status: "Open" },
    { id: 99, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC MCH Centre PMC Hospital Shaheed Benazirabad", status: "Open" },
    { id: 100, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC MCH Center Muhajar Colony, Shaheed Benazirabad", status: "Open" },
    { id: 101, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC Social Security Hospital Shaheed Benazirabad", status: "Open" },
    { id: 102, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC Daulat Colony Shaheed Benazirabad", status: "Open" },
    { id: 103, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC Taj Colony Shaheed Benazirabad", status: "Open" },
    { id: 104, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC BHU Majeed Keerio Shaheed Benazirabad", status: "Open" },
    { id: 105, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC RHC Mehrabpur Shaheed Benazirabad", status: "Open" },
    { id: 106, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC RHS Kazi Ahmed Shaheed Benazirabad", status: "Open" },
    { id: 107, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC Kazi Ahmed Shaheed Benazirabad", status: "Open" },
    { id: 108, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC GD Gahand Shaheed Benazirabad", status: "Open" },
    { id: 109, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC RHC Shahpur Jahania Shaheed Benazirabad", status: "Open" },
    { id: 110, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC Ansari Mohallah Shaheed Benazirabad", status: "Open" },
    { id: 111, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC Daur Shaheed Benazirabad", status: "Open" },
    { id: 112, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC GD Rasool Bux Zardari Shaheed Benazirabad", status: "Open" },
    { id: 113, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWA GhulamRasool Shah Municipal Dispensary Shaheed Benazirabad", status: "Open" },
    { id: 114, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC Bhaloo Jamali Sakrand Shaheed Benazirabad", status: "Open" },
    { id: 115, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC RHC Doulatpur Shaheed Benazirabad", status: "Open" },
    { id: 116, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC, PMC Hospital, Nawabshah Shaheed Benazirabad", status: "Open" },
    { id: 117, district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "Family Welfare Center Golimar Shaheed Benazirabad", status: "Open" },
    { id: 118, district: "Shikarpur", sdpType: "Population Welfare Department - FWC", centerName: "FWC Shikarpur-I", status: "Open" },
    { id: 119, district: "Shikarpur", sdpType: "Population Welfare Department - FWC", centerName: "FWC Shikarpur-II", status: "Open" },
    { id: 120, district: "Shikarpur", sdpType: "Population Welfare Department - FWC", centerName: "FWC Mari Shikarpur", status: "Open" },
    { id: 121, district: "Sukkur", sdpType: "Population Welfare Department - FWC", centerName: "FWC Suk-II Bagh Hayat Sukkur", status: "Open" },
    { id: 122, district: "Sukkur", sdpType: "Population Welfare Department - FWC", centerName: "FWC Bachal Shah Sukkur", status: "Open" },
    { id: 123, district: "Sukkur", sdpType: "Population Welfare Department - FWC", centerName: "FWC Numaish Road Sukkur", status: "Open" },
    { id: 124, district: "Sukkur", sdpType: "Population Welfare Department - FWC", centerName: "FWC Maka Goth Sukkur", status: "Open" },
    { id: 125, district: "Tando Muhammad Khan", sdpType: "Population Welfare Department - FWC", centerName: "FWC Naseerabad Muhallah Tando Muhammad Khan", status: "Open" },
    { id: 126, district: "Tando Muhammad Khan", sdpType: "Population Welfare Department - FWC", centerName: "FWC Peoples Colony Tando Muhammad Khan", status: "Open" },
    { id: 127, district: "Tando Muhammad Khan", sdpType: "Population Welfare Department - FWC", centerName: "FWC Soomra Muhallah Tando Muhammad Khan", status: "Open" },
    { id: 128, district: "Tando Muhammad Khan", sdpType: "Population Welfare Department - FWC", centerName: "FWC Mir Muhalla Tando Muhammad Khan", status: "Open" },
    { id: 129, district: "Tando Muhammad Khan", sdpType: "Population Welfare Department - FWC", centerName: "FWC Pir Mohallah Tando Muhammad Khan", status: "Open" },
    { id: 130, district: "Ghotki", sdpType: "Population Welfare Department - FWC", centerName: "FWC Muhammad Pur Ghotki", status: "Open" },
    { id: 131, district: "Ghotki", sdpType: "Population Welfare Department - FWC", centerName: "FWC Haseeja Mahar (PPHI) Ghotki", status: "Open" },
    { id: 132, district: "Ghotki", sdpType: "Population Welfare Department - FWC", centerName: "FWC Daharki-I Ghotki", status: "Open" },
    { id: 133, district: "Karachi Central", sdpType: "Population Welfare Department - FWC", centerName: "FWC Cental Govt. Dispensary FC Area Karachi Central", status: "Open" },
    { id: 134, district: "Karachi Central", sdpType: "Population Welfare Department - FWC", centerName: "FWC Govt Dispensary Karachi Central", status: "Open" },
    { id: 135, district: "Karachi Central", sdpType: "Population Welfare Department - FWC", centerName: "FWC CDGK Garibabad Dispensary, Karachi Central", status: "Open" },
    { id: 136, district: "Karachi Central", sdpType: "Population Welfare Department - FWC", centerName: "FWC Medi Palace Hospital, North Karachi Central", status: "Open" },
    { id: 137, district: "Karachi Central", sdpType: "Population Welfare Department - FWC", centerName: "FWC Anjuman-e-Ehbab, T-5 Block H NorthNazimbabad Near Al-Falah Masjid Karachi Central", status: "Open" },
    { id: 138, district: "Karachi Central", sdpType: "Population Welfare Department - FWC", centerName: "FWC KMC Maternity Home Liaquatabad Karachi Central", status: "Open" },
    { id: 139, district: "Karachi Central", sdpType: "Population Welfare Department - FWC", centerName: "FWC SGD near Patrol Pump Nazimabad Karachi Central", status: "Open" },
    { id: 140, district: "Karachi Central", sdpType: "Population Welfare Department - FWC", centerName: "FWC MCH Center, Inquiry Office Nazimabad No 2 Karachi Central", status: "Open" },
    { id: 141, district: "Karachi Central", sdpType: "Population Welfare Department - FWC", centerName: "FWC Sessi Dispensary Pirabad, Golimar No 1 Karachi Central", status: "Open" },
    { id: 142, district: "Karachi Central", sdpType: "Population Welfare Department - FWC", centerName: "FWC Shaheed Benazir Dispensary Qalandri Chowk Karachi Central", status: "Open" },
    { id: 143, district: "Karachi Central", sdpType: "Population Welfare Department - FWC", centerName: "FWC Sindh Govt Children Hospital Shadman Town, North Karachi Central", status: "Open" },
    { id: 144, district: "Karachi Central", sdpType: "Population Welfare Department - FWC", centerName: "FWC Abdul Samad Hospital Karachi Central", status: "Open" },
    { id: 145, district: "Karachi Central", sdpType: "Population Welfare Department - FWC", centerName: "FWC 5-D, Sindh Government Hospital, New Karachi Central", status: "Open" },
    { id: 146, district: "Karachi Central", sdpType: "Population Welfare Department - FWC", centerName: "FWC CDGK, Dispensary, Liaquqatabad No 04 Karachi Central", status: "Open" },
    { id: 147, district: "Karachi Central", sdpType: "Population Welfare Department - FWC", centerName: "FWC Sindh Rangers Hospital,North Nazimabad Karachi Central", status: "Open" },
    { id: 148, district: "Karachi Central", sdpType: "Population Welfare Department - FWC", centerName: "FWC 5-C/2 Urban Hospital North Karachi Central", status: "Open" },
    { id: 149, district: "Karachi Central", sdpType: "Population Welfare Department - FWC", centerName: "FWC Qadaria Medical Centre New Karachi Central", status: "Open" },
    { id: 150, district: "Karachi East", sdpType: "Population Welfare Department - FWC", centerName: "FWC-Centre, Dow Hospital, Ojha Campus Karachi East", status: "Open" },
    { id: 151, district: "Karachi East", sdpType: "Population Welfare Department - FWC", centerName: "FWC Patel Para dispensary Jamshed town Karachi East", status: "Open" },
    { id: 152, district: "Karachi East", sdpType: "Population Welfare Department - FWC", centerName: "FWC PIB COLNY Karachi East", status: "Open" },
    { id: 153, district: "Karachi East", sdpType: "Population Welfare Department - FWC", centerName: "FWC PAF MALIR Karachi East", status: "Open" },
    { id: 154, district: "Karachi East", sdpType: "Population Welfare Department - FWC", centerName: "FWC Bhitai Cllinin Bhitai Abad Karachi East", status: "Open" },
    { id: 155, district: "Karachi East", sdpType: "Population Welfare Department - FWC", centerName: "FWC Bhitai Cllinin Bhitai Abad Karachi East", status: "Open" },
    { id: 156, district: "Karachi East", sdpType: "Population Welfare Department - FWC", centerName: "FWC Sachal Dispansery Karachi East", status: "Open" },
    { id: 157, district: "Karachi East", sdpType: "Population Welfare Department - FWC", centerName: "FWC Janat Gul Hospital Karachi East", status: "Open" },
    { id: 158, district: "Karachi East", sdpType: "Population Welfare Department - FWC", centerName: "FWC Qubira Medical Dispensary Edhi Centre Karachi East", status: "Open" },
    { id: 159, district: "Karachi East", sdpType: "Population Welfare Department - FWC", centerName: "FWC Abbas Town Karachi East", status: "Open" },
    { id: 160, district: "Karachi East", sdpType: "Population Welfare Department - FWC", centerName: "FWC PEHLWAN GOTH Karachi East", status: "Open" },
    { id: 161, district: "Karachi East", sdpType: "Population Welfare Department - FWC", centerName: "FWC Edhi Welfare Centre Gulastan e johar Karachi East", status: "Open" },
    { id: 162, district: "Karachi East", sdpType: "Population Welfare Department - FWC", centerName: "FWC Bilawal Shah Noorani Goth Karachi East", status: "Open" },
    { id: 163, district: "Karachi East", sdpType: "Population Welfare Department - FWC", centerName: "FWC - Soldier Bazar Karachi East", status: "Open" },
    { id: 164, district: "Karachi East", sdpType: "Population Welfare Department - FWC", centerName: "FWC Ghazi Goth Karachi East", status: "Open" },
    { id: 165, district: "Karachi East", sdpType: "Population Welfare Department - FWC", centerName: "FWC SGD Gareb Abad Gadap Town Karachi East", status: "Open" },
    { id: 166, district: "Karachi South", sdpType: "Population Welfare Department - FWC", centerName: "FWC - P&T Colony Karachi South", status: "Open" },
    { id: 167, district: "Karachi South", sdpType: "Population Welfare Department - FWC", centerName: "FWC - Garden Karachi South", status: "Open" },
    { id: 168, district: "Karachi South", sdpType: "Population Welfare Department - FWC", centerName: "FWC - Railway Hassan Karachi South", status: "Open" },
    { id: 169, district: "Karachi South", sdpType: "Population Welfare Department - FWC", centerName: "FWC - Ranchore Line Karachi South", status: "Open" },
    { id: 170, district: "Karachi South", sdpType: "Population Welfare Department - FWC", centerName: "FWC - Eid Gah Karachi South", status: "Close" },
    { id: 171, district: "Karachi South", sdpType: "Population Welfare Department - FWC", centerName: "FWC - Gizri Karachi South", status: "Open" },
    { id: 172, district: "Karachi South", sdpType: "Population Welfare Department - FWC", centerName: "FWC - JPMC (NICH) Karachi South", status: "Open" },
    { id: 173, district: "Karachi South", sdpType: "Population Welfare Department - FWC", centerName: "FWC - Empress Market Karachi South", status: "Open" },
    { id: 174, district: "Karachi South", sdpType: "Population Welfare Department - FWC", centerName: "FWC - Civil Services Hospital Karachi South", status: "Open" },
    { id: 175, district: "Karachi South", sdpType: "Population Welfare Department - FWC", centerName: "FWC Junejo Town(Defence View) Karachi South", status: "Open" },
    { id: 176, district: "Karachi South", sdpType: "Population Welfare Department - FWC", centerName: "FWC KMC Hospital Manzoor Colony Karachi South", status: "Open" },
    { id: 177, district: "Karachi South", sdpType: "Population Welfare Department - FWC", centerName: "FWC Kashmir Colony Karachi South", status: "Open" }
  ]
};

// Define columns for DataGrid
const columns = [
  { field: 'district', headerName: 'Name of District', width: 200 },
  { field: 'sdpType', headerName: 'SDP Type', width: 300 },
  { field: 'centerName', headerName: 'Center Name', width: 300 },
  { field: 'status', headerName: 'Status of Center', width: 150 }
];

export default function StatisticsCard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const total = pieData.reduce((sum, item) => sum + item.value, 0);

  const handlePieClick = (data, index) => {
    setSelectedStatus(pieData[index].name);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedStatus(null);
  };

  // Prevent drawer from closing on backdrop click or escape key
  const handleDrawerClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }
    handleCloseDrawer();
  };

  return (
    <>
      <div 
        style={{ 
          width: '100%', 
          height: '80%', 
          cursor: 'pointer' 
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={200}>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={55}
              fill="#82ca9d"
              label={(props) => renderCustomizedLabel({ ...props, total })}
              onClick={handlePieClick}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        ModalProps={{
          disableBackdropClick: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: '80%',
            maxWidth: 1000,
            bgcolor: 'background.paper',
            borderRadius: '8px 0 0 8px',
            boxShadow: 24,
            p: 4,
            maxHeight: '100vh',
            overflow: 'auto'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          borderBottom: '1px solid #e0e0e0',
          pb: 2
        }}>
          <Typography id="drawer-title" variant="h6" component="h2">
            SDP Status Details - {selectedStatus || 'All'}
          </Typography>
          <IconButton onClick={handleCloseDrawer} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        {Object.keys(sdpDetailsData).map((category) => (
          <Box key={category} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {category}
            </Typography>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={sdpDetailsData[category].filter(row => !selectedStatus || row.status === selectedStatus)}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                disableSelectionOnClick
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #e0e0e0',
                  },
                }}
              />
            </Box>
          </Box>
        ))}
      </Drawer>
    </>
  );
}
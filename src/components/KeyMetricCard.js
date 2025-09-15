import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  useMediaQuery,
  useTheme,
  LinearProgress,
  Drawer,
  IconButton
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import HealthMetricsCard from "./healthchart";
import "../index.css";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip as ReToolTip,
  ResponsiveContainer,
} from "recharts";
import CloseIcon from "@mui/icons-material/Close";
import Statisticscard from "./Statisticscard";

// Sample rawRows data based on expected Excel format
const rawRows = [
  "45768.00013888889,Badin,RHS-A M.P.S Centre Badin,Present,Absent,Leave,Vcant,Present,Absent,Leave,Vcant,Absent,Leave",
  "45792.00013888889,Karachi West,RHS-A Qatar Hospital Karachi West,Present,Present,Present,Present,Present,Present,Present,Present,Present,Present",
  "45799.00013888889,Karachi West,RHS-A Qatar Hospital Karachi West,Present,Present,Present,Vcant,Vcant,Present,Present,Vcant,Vcant,Present",
  "45799.00013888889,Karachi West,RHS-A Qatar Hospital Karachi West,Present,Vcant,Present,Present,Present,Present,Vcant,Vcant,Present,Vcant",
  "45896.00013888889,Karachi West,RHS-A-Centre KV SITE Hospital Karachi Karachi West,Present,Vcant,Vcant,Vcant,Present,Vcant,Vcant,Vcant,Vcant,Vcant",
  "45882.00013888889,Karachi West,RHS-A-Centre KV SITE Hospital Karachi Karachi West,Present,Vcant,Vcant,Vcant,Vcant,Vcant,Vcant,Vcant,Vcant,Vcant",
  "45800.00013888889,Korangi,RHS-A Centre Ibrahim Hyderi Karachi Korangi,Present,Vcant,Vcant,Present,Present,Vcant,Absent,Vcant,Present,Present",
  "45777.00013888889,Korangi,RHS-A Centre SGH Korangi # 5 Karachi Korangi,Present,Vcant,Vcant,Present,Present,Present,Present,Vcant,Leave,Vcant",
  "45757.00013888889,Malir,RHS-A Saudabad Karachi Malir Town,Present,Present,Present,Present,Present,Present,Present,Vcant,Present,Vcant",
  "45792.00013888889,Malir,RHS-A Saudabad Karachi Malir Town,Present,Leave,Leave,Present,Present,Present,Present,Vcant,Present,Vcant",
  "45804.00013888889,Qambar Shahdadkot,RHS-A CENTRE KAMBER Qambar Shahdadkot,Present,Present,Vcant,Present,Present,Present,Vcant,Present,Present,Present",
  "45852.00013888889,Sanghar,RHS-A Center Shahdadpur Sanghar,Present,Present,Present,Present,Present,Present,Present,Present,Present,Present",
  "45861.00013888889,Sanghar,RHS-A Center Tando Adam Sanghar,Vcant,Present,Present,Present,Present,Present,Present,Vcant,Present,Present",
  "45803.00013888889,Sanghar,RHS-A Center Tando Adam Sanghar,Vcant,Present,Present,Present,Present,Vcant,Present,Vcant,Present,Absent",
  "45877.00013888889,Shaheed Benazirabad,RHS-A-Center Nawabshah Shaheed Benazirabad,Present,Present,Present,Present,Present,Vcant,Present,Present,Present,Vcant",
  "45798.00013888889,Shaheed Benazirabad,RHS-A-Center Sakrand Shaheed Benazirabad,Present,Absent,Present,Present,Present,Vcant,Present,Vcant,Present,Vcant",
  "45860.00013888889,Shaheed Benazirabad,RHS-A-Center Sakrand Shaheed Benazirabad,Present,Absent,Present,Absent,Present,Vcant,Vcant,Present,Vcant,Present",
  "45796.00013888889,Shikarpur,RHS-A Centre Civil Hospital Shikarpur,Present,Present,Vcant,Present,Present,Present,Present,Present,Vcant,Vcant",
  "45796.00013888889,Sukkur,RHS-A New Sukkur,Present,Leave,Vcant,Present,Present,Present,Present,Present,Vcant,Present",
  "45804.00013888889,Tando Muhammad Khan,RHS-A Centre Tando Muhammad Khan,Present,Present,Present,Present,Present,Vcant,Present,Present,Leave,Leave",
  "45793.00013888889,Tharparkar,RHS-A Mithi Tharparkar \"Mithi\",Present,Present,Present,Vcant,Vcant,Present,Present,Vcant,Present,Present",
  "45820.00013888889,Karachi Central,RHS-A Abbasi Shaheed Karachi Central,Present,Vcant,Vcant,Present,Present,Vcant,Present,Vcant,Present,Vcant",
  "45769.00013888889,Kashmore,MSU Center Civil Hospital Kandhkot Kashmore,Present,Leave,Present,Leave,Absent,Present,Present,,,",
  "45769.00013888889,Kashmore,MSU Center Civil Hospital Kandhkot Kashmore,Absent,Present,Present,Present,Present,Present,Present,,,",
  "45798.00013888889,Malir,MSU Saudabad Karachi Malir Town,Present,Vcant,Vcant,Present,Vcant,Present,Vcant,,,",
  "45762.00013888889,Malir,MSU Saudabad Karachi Malir Town,Vcant,Vcant,Vcant,Present,Vcant,Present,Present,,,",
  "45852.00013888889,Sanghar,MSU Center Shahdadpur Sanghar,Vcant,Vcant,Present,Vcant,Present,Present,Vcant,,,",
  "45887.00013888889,Shaheed Benazirabad,MSU-Center Nawabshah Shaheed Benazirabad,Vcant,Vcant,Present,Vcant,Vcant,Present,Vcant,,,",
  "45877.00013888889,Shaheed Benazirabad,MSU-Center Nawabshah Shaheed Benazirabad,Vcant,Vcant,Present,Vcant,Vcant,Vcant,Vcant,,,",
  "45877.00013888889,Shaheed Benazirabad,MSU-Center Sakrand Shaheed Benazirabad,Vcant,Vcant,Present,Vcant,Present,Vcant,Vcant,,,",
  "45798.00013888889,Karachi East,MSU-Centre, Dow Hospital, Ojha Campus Karachi East,Vcant,Vcant,Present,Present,Vcant,Vcant,Present,,,",
  "45895.00013888889,Karachi West,FWC SGD Abidabad Baldia Karachi West,Vcant,Vcant,Present,Present,Vcant,Vcant,Present,Vcant,,",
  "45765.00013888889,Karachi West,FWC SGD Abidabad Baldia Karachi West,Vcant,Vcant,Present,Vcant,Vcant,Vcant,Present,Vcant,,",
  "45762.00013888889,Karachi West,FWC UHU-15 Orangi Karachi West,Present,Present,Vcant,Vcant,Vcant,Vcant,Leave,Vcant,,",
  "45792.00013888889,Karachi West,FWC UHU-15 Orangi Karachi West,Vcant,Present,Vcant,Vcant,Absent,Present,Vcant,Vcant,,",
  "45799.00013888889,Karachi West,FWC UHU-15 Orangi Karachi West,Vcant,Vcant,Present,Absent,Vcant,Present,Vcant,Vcant,,",
  "45757.00013888889,Karachi West,FWC Banaras Colony Karachi West,Vcant,Present,Vcant,Vcant,Present,Vcant,Vcant,Vcant,,",
  "45897.00013888889,Karachi West,FWC Banaras Colony Karachi West,Vcant,Vcant,Vcant,Absent,Present,Vcant,Vcant,Vcant,,",
  "45736.00013888889,Karachi West,FWC Al-razi Dispensary Orangi Town Karachi West,Present,Present,Present,Present,Leave,Absent,Vcant,Leave,,",
  "45791.00013888889,Karachi West,FWC Al-razi Dispensary Orangi Town Karachi West,Vcant,Present,Vcant,Present,Vcant,Vcant,Leave,Present,,",
  "45867.00013888889,Karachi West,FWC Al-razi Dispensary Orangi Town Karachi West,Vcant,Present,Vcant,Leave,Vcant,Vcant,Vcant,Vcant,,",
  "45761.00013888889,Karachi West,FWC SGD, BHU Qasba Karachi West,Vcant,Vcant,Present,Present,Vcant,Vcant,Vcant,Vcant,,",
  "45762.00013888889,Karachi West,FWC SGD, BHU Qasba Karachi West,Vcant,Vcant,Vcant,Present,Present,Vcant,Vcant,Vcant,,",
  "45867.00013888889,Karachi West,FWC SGD, BHU Qasba Karachi West,Vcant,Vcant,Vcant,Present,Vcant,Vcant,Vcant,Present,,",
  "45761.00013888889,Karachi West,FWC Mangopir Karachi West,Present,Vcant,Vcant,Present,Present,Vcant,Vcant,Vcant,,",
  "45896.00013888889,Karachi West,FWC Mangopir Karachi West,Present,Vcant,Vcant,Present,Vcant,Vcant,Vcant,Vcant,,",
  "45765.00013888889,Karachi West,FWC Razia Mat. Home Saeedabad Karachi West,Vcant,Vcant,Present,Vcant,Vcant,Present,Present,Vcant,,",
  "45853.00013888889,Karachi West,FWC Razia Mat. Home Saeedabad Karachi West,Vcant,Vcant,Present,Vcant,Vcant,Absent,Present,Vcant,,",
  "45874.00013888889,Karachi West,FWC 7-D Surjani Town Karachi West,Vcant,Vcant,Vcant,Present,Present,Vcant,Vcant,Vcant,,",
  "45860.00013888889,Karachi West,FWC 7-D Surjani Town Karachi West,Vcant,Vcant,Vcant,Vcant,Present,Present,Vcant,Absent,,",
  "45763.00013888889,Karachi West,FWC SGD 5-D Surjani Karachi West,Present,Vcant,Vcant,Present,Present,Vcant,Vcant,Vcant,,",
  "45764.00013888889,Karachi West,FWC SGD 5-D Surjani Karachi West,Absent,Absent,Leave,Present,Absent,Present,Leave,Absent,,",
  "45871.00013888889,Karachi West,FWC SGD 5-D Surjani Karachi West,Vcant,Present,Vcant,Vcant,Present,Absent,Leave,Vcant,,",
  "45882.00013888889,Karachi West,FWC UHU Dispensary Ali Ghar Sec-01 Orangi Town Karachi West,Vcant,Vcant,Vcant,Present,Present,Vcant,Vcant,Vcant,,",
  "45799.00013888889,Karachi West,FWC Red Crescent Disp. Orangi Town Karachi West,Vcant,Present,Vcant,Present,Present,Vcant,Present,Vcant,,",
  "45799.00013888889,Karachi West,FWC Red Crescent Disp. Orangi Town Karachi West,Vcant,Present,Vcant,Present,Present,Vcant,Vcant,Present,,",
  "45873.00013888889,Karachi West,FWC Red Crescent Disp. Orangi Town Karachi West,Vcant,Present,Vcant,Present,Vcant,Vcant,Present,Present,,",
  "45762.00013888889,Karachi West,FWC Red Crescent Disp. Orangi Town Karachi West,Vcant,Vcant,Present,Present,Vcant,Present,Vcant,Vcant,,",
  "45897.00013888889,Karachi West,FWC Esha Mat.Home Orangi Town Karachi West,Vcant,Present,Vcant,Present,Vcant,Vcant,Present,Vcant,,",
  "45868.00013888889,Karachi West,FWC RHC, SGD Baldia Town Karachi West,Vcant,Vcant,Present,Vcant,Vcant,Present,Present,Vcant,,",
  "45895.00013888889,Karachi West,FWC CDGK Dispensary Saeedabad Karachi West,Vcant,Vcant,Vcant,Present,Vcant,Vcant,Present,Vcant,,",
  "45902.00013888889,Karachi West,FWC KMC Dispensary, Baldia Karachi West,Present,Vcant,Vcant,Vcant,Vcant,Vcant,Vcant,Vcant,,",
  "45853.00013888889,Karachi West,FWC Labour Square Baldia Karachi West,Vcant,Present,Vcant,Present,Vcant,Vcant,Vcant,Present,,",
  "45791.00013888889,Karachi West,FWC Labour Square Baldia Karachi West,Vcant,Present,Vcant,Present,Vcant,Vcant,Vcant,Absent,,",
  "45882.00013888889,Karachi West,FWC Labour Square Baldia Karachi West,Vcant,Present,Vcant,Vcant,Vcant,Vcant,Vcant,Present,,",
  "45895.00013888889,Karachi West,FWC KMC Dispensary Golimar Karachi West,Vcant,Present,Vcant,Absent,Vcant,Vcant,Present,Present,,",
  "45764.00013888889,Karachi West,FWC KMC Dispensary Golimar Karachi West,Vcant,Present,Vcant,Absent,Vcant,Vcant,Vcant,Present,,",
  "45764.00013888889,Karachi West,FWC SGH Asif Bhutto Dispensary Pak Colony Karachi West,Present,Present,Vcant,Vcant,Vcant,Present,Vcant,Vcant,,",
  "45874.00013888889,Karachi West,FWC UHU-10.SGH Orangi Town Karachi West,Vcant,Present,Vcant,Present,Vcant,Present,Present,Vcant,,",
  "45791.00013888889,Karachi West,FWC UHU-10.SGH Orangi Town Karachi West,Vcant,Present,Vcant,Leave,Vcant,Present,Present,Vcant,,",
  "45763.00013888889,Karachi West,FWC Barkia Med.Centre Surjani Town Karachi West,Present,Vcant,Present,Vcant,Present,Present,Vcant,Vcant,,",
  "45871.00013888889,Karachi West,FWC Barkia Med.Centre Surjani Town Karachi West,Vcant,Present,Vcant,Present,Absent,Vcant,Absent,Vcant,,",
  "45763.00013888889,Karachi West,FWC 50 Bed SGH Surjani Karachi West,Present,Vcant,Present,Present,Present,Present,Vcant,Vcant,,",
  "45874.00013888889,Karachi West,FWC Mat.Home & Disp 11-E Orangi Town Karachi West,Vcant,Present,Vcant,Vcant,Present,Vcant,Leave,Vcant,,",
  "45882.00013888889,Karachi West,FWC Rehman Medical Center, Gulshan-e-Ghazi Karachi West,Vcant,Vcant,Present,Vcant,Vcant,Vcant,Vcant,Vcant,,",
  "45777.00013888889,Korangi,FWC Bhitai Colony E Sacter (New) Korangi,Vcant,Vcant,Vcant,Present,Present,Vcant,Present,Present,,",
  "45777.00013888889,Korangi,FWC BHITAI COLONY Korangi,Vcant,Vcant,Present,Present,Present,Vcant,Absent,Present,,",
  "45800.00013888889,Korangi,FWC NASIR COLONY Korangi,Present,Vcant,Present,Vcant,Present,Vcant,Present,Vcant,,",
  "45800.00013888889,Korangi,FWC BHU-33-C Korangi,Vcant,Present,Vcant,Present,Leave,Vcant,Present,Present,,",
  "45810.00013888889,Korangi,FWC BHU-33-C Korangi,Vcant,Present,Vcant,Absent,Present,Vcant,Present,Present,,",
  "45777.00013888889,Korangi,FWC INDUS MEHRAN Korangi,Vcant,Present,Vcant,Present,Absent,Vcant,Present,Present,,",
  "45800.00013888889,Korangi,FWC LANDHI MEDICAL COMPLEX Korangi,Leave,Present,Vcant,Present,Present,Present,Present,Vcant,,",
  "45777.00013888889,Korangi,FWC LANDHI 3 1/2 Korangi,Vcant,Vcant,Present,Present,Present,Absent,Present,Vcant,,",
  "45777.00013888889,Korangi,FWC 25-Bedded Hospital Malir Kala Board Korangi,Vcant,Vcant,Vcant,Present,Absent,Vcant,Present,Vcant,,",
  "45800.00013888889,Korangi,FWC BALDIA DISP 5 1/2 Korangi,Vcant,Vcant,Present,Present,Vcant,Present,Absent,Present,,",
  "45777.00013888889,Korangi,FWC HAZRAT BILAL COLONY Korangi,Vcant,Present,Vcant,Absent,Vcant,Vcant,Present,Present,,",
  "45800.00013888889,Korangi,FWC SAUDABAD COLONY Korangi,Vcant,Vcant,Present,Present,Present,Present,Present,Vcant,,",
  "45762.00013888889,Malir,FWC SHAHNAWAZ GOTH Malir Town,Vcant,Present,Vcant,Absent,Vcant,Vcant,Present,Present,,",
  "45756.00013888889,Malir,FWC SHAHNAWAZ GOTH Malir Town,Vcant,Leave,Vcant,Absent,Vcant,Vcant,Present,Present,,",
  "45762.00013888889,Malir,FWC SHERPAO COLONY Malir Town,Vcant,Present,Present,Present,Present,Vcant,Vcant,Vcant,,",
  "45762.00013888889,Malir,FWC SASSI LANDHI Malir Town,Present,Present,Vcant,Present,Vcant,Vcant,Present,Present,,",
  "45741.00013888889,Malir,FWC SASSI LANDHI Malir Town,Present,Present,Vcant,Present,Vcant,Vcant,Present,Leave,,",
  "45791.00013888889,Malir,FWC SASSI LANDHI Malir Town,Present,Present,Vcant,Absent,Vcant,Vcant,Present,Present,,",
  "45803.00013888889,Malir,FWC PIA TOWNSHIP Malir Town,Vcant,Present,Vcant,Present,Absent,Vcant,Present,Vcant,,",
  "45791.00013888889,Malir,FWC PIA TOWNSHIP Malir Town,Vcant,Present,Vcant,Present,Leave,Vcant,Present,Vcant,,",
  "45757.00013888889,Malir,FWC PIA TOWNSHIP Malir Town,Vcant,Leave,Vcant,Present,Present,Vcant,Present,Vcant,,",
  "45799.00013888889,Malir,FWC STEEL TOWN Malir Town,Vcant,Vcant,Present,Present,Present,Vcant,Present,Present,,",
  "45762.00013888889,Malir,FWC STEEL TOWN Malir Town,Vcant,Vcant,Present,Present,Vcant,Present,Present,Present,,",
  "45791.00013888889,Malir,FWC STEEL TOWN Malir Town,Vcant,Vcant,Present,Absent,Vcant,Vcant,Present,Present,,",
  "45742.00013888889,Malir,FWC STEEL TOWN Malir Town,Vcant,Vcant,Leave,Present,Present,Vcant,Present,Present,,",
  "45762.00013888889,Malir,FWC BEECHM TRUST Malir Town,Vcant,Present,Present,Present,Present,Vcant,Present,Present,,",
  "45803.00013888889,Malir,FWC BEECHM TRUST Malir Town,Vcant,Present,Vcant,Present,Present,Vcant,Present,Present,,",
  "45792.00013888889,Malir,FWC YOUSUF GOTH Malir Town,Present,Present,Present,Present,Present,Vcant,Vcant,Vcant,,",
  "45756.00013888889,Malir,FWC YOUSUF GOTH Malir Town,Vcant,Vcant,Present,Present,Absent,Vcant,Vcant,Present,,",
  "45798.00013888889,Malir,FWC YOUSUF GOTH Malir Town,Vcant,Vcant,Present,Present,Absent,Vcant,Vcant,Vcant,,",
  "45762.00013888889,Malir,FWC JAM KANDO Malir Town,Vcant,Present,Present,Present,Vcant,Present,Present,Present,,",
  "45803.00013888889,Malir,FWC Hassan Panwar Goth Malir Town,Vcant,Vcant,Vcant,Present,Present,Present,Vcant,Vcant,,",
  "45762.00013888889,Malir,FWC ASOO Goth Malir Town,Vcant,Present,Present,Present,Present,Vcant,Vcant,Vcant,,",
  "45741.00013888889,Malir,FWC Government Dispensary Marvi Goth Malir Town,Present,Present,Present,Present,Vcant,Vcant,Vcant,Vcant,,",
  "45803.00013888889,Malir,FWC Government Dispensary Marvi Goth Malir Town,Vcant,Present,Present,Vcant,Present,Vcant,Vcant,Present,,",
  "45762.00013888889,Malir,FWC Government Dispensary Marvi Goth Malir Town,Vcant,Present,Vcant,Present,Vcant,Vcant,Present,Present,,",
  "45798.00013888889,Malir,FWC ALI MUHAMMAD SHAIKH GOTH Malir Town,Vcant,Present,Vcant,Present,Present,Absent,Vcant,Vcant,,",
  "45756.00013888889,Malir,FWC ALI MUHAMMAD SHAIKH GOTH Malir Town,Vcant,Present,Vcant,Present,Absent,Vcant,Absent,Vcant,,",
  "45756.00013888889,Malir,FWC Model Centre PWTI Malir Town,Present,Vcant,Present,Vcant,Present,Vcant,Leave,Present,,",
  "45792.00013888889,Malir,FWC Model Centre PWTI Malir Town,Present,Vcant,Present,Vcant,Present,Vcant,Vcant,Present,,",
  "45798.00013888889,Malir,FWC Model Centre PWTI Malir Town,Present,Vcant,Present,Vcant,Present,Vcant,Vcant,Vcant,,",
  "45860.00013888889,Naushahro Feroze,FWC Naushahro Feroze-I,Vcant,Present,Vcant,Present,Present,Absent,Absent,Vcant,,",
  "45838.00013888889,Naushahro Feroze,FWC Naushahro Feroze-III,Vcant,Present,Vcant,Vcant,Present,Present,Present,Present,,",
  "45797.00013888889,Naushahro Feroze,FWC Tharo Shah Naushahro Feroze,Vcant,Vcant,Present,Present,Absent,Present,Present,Vcant,,",
  "45860.00013888889,Naushahro Feroze,FWC Khahi Maman Naushahro Feroze,Vcant,Present,Vcant,Present,Vcant,Present,Vcant,Present,,",
  "45797.00013888889,Naushahro Feroze,FWC Bhiria City Naushahro Feroze,Present,Vcant,Vcant,Present,Present,Present,Present,Vcant,,",
  "45838.00013888889,Naushahro Feroze,FWC Khahi Rahoo Naushahro Feroze,Vcant,Vcant,Present,Present,Vcant,Vcant,Vcant,Present,,",
  "45804.00013888889,Qambar Shahdadkot,FWC KAMBER-I Qambar Shahdadkot,Present,Vcant,Present,Present,Present,Present,Vcant,Vcant,,",
  "45803.00013888889,Sanghar,FWC Sinjhoro Sanghar,Vcant,Vcant,Present,Vcant,Leave,Present,Vcant,Present,,",
  "45803.00013888889,Sanghar,FWC Jhol Sanghar,Vcant,Present,Vcant,Present,Present,Vcant,Present,Vcant,,",
  "45852.00013888889,Sanghar,FWC Shahdadpur-II Sanghar,Vcant,Present,Vcant,Leave,Leave,Leave,Present,Present,,",
  "45861.00013888889,Sanghar,FWC Allahyar Goth TDM Sanghar,Vcant,Present,Vcant,Present,Present,Present,Present,Present,,",
  "45803.00013888889,Sanghar,FWC Tandoadam-III Sanghar,Vcant,Present,Vcant,Present,Present,Present,Present,Present,,",
  "45852.00013888889,Sanghar,FWC Rukan Buriro Sanghar,Vcant,Vcant,Vcant,Present,Present,Present,Vcant,Vcant,,",
  "45861.00013888889,Sanghar,FWC Gulzar Colony Tando Adam Sanghar,Vcant,Vcant,Present,Vcant,Present,Vcant,Present,Vcant,,",
  "45852.00013888889,Sanghar,FWC Shahdadpur-III Sanghar,Vcant,Vcant,Present,Present,Present,Leave,Vcant,Vcant,,",
  "45798.00013888889,Shaheed Benazirabad,FWC Gyani Ward Evening Shaheed Benazirabad,Leave,Present,Present,Present,Leave,Leave,Present,Leave,,",
  "45877.00013888889,Shaheed Benazirabad,FWC Gyani Ward Evening Shaheed Benazirabad,Vcant,Present,Vcant,Present,Present,Vcant,Present,Vcant,,",
  "45896.00013888889,Shaheed Benazirabad,FWC Ghulam Rasool Shah Colony Shaheed Benazirabad,Present,Vcant,Vcant,Present,Present,Vcant,Vcant,Present,,",
  "45798.00013888889,Shaheed Benazirabad,FWC Ghulam Rasool Shah Colony Shaheed Benazirabad,Leave,Present,Leave,Present,Absent,Leave,Absent,Present,,",
  "45877.00013888889,Shaheed Benazirabad,FWC GD Nadir Shah Dispensary Shaheed Benazirabad,Present,Vcant,Vcant,Present,Present,Vcant,Present,Vcant,,",
  "45798.00013888889,Shaheed Benazirabad,FWC GD Nadir Shah Dispensary Shaheed Benazirabad,Leave,Present,Leave,Absent,Present,Vcant,Absent,Vcant,,",
  "45902.00013888889,Shaheed Benazirabad,FWC GD Nadir Shah Dispensary Shaheed Benazirabad,Vcant,Present,Vcant,Present,Vcant,Present,Vcant,Present,,",
  "45877.00013888889,Shaheed Benazirabad,FWC Essa Bhatti Shaheed Benazirabad,Vcant,Vcant,Vcant,Present,Present,Vcant,Vcant,Present,,",
  "45877.00013888889,Shaheed Benazirabad,FWC MCH Centre PMC Hospital Shaheed Benazirabad,Present,Present,Present,Vcant,Vcant,Vcant,Vcant,Vcant,,",
  "45877.00013888889,Shaheed Benazirabad,FWC MCH Centre PMC Hospital Shaheed Benazirabad,Vcant,Present,Vcant,Present,Vcant,Vcant,Vcant,Present,,",
  "45877.00013888889,Shaheed Benazirabad,FWC MCH Centre PMC Hospital Shaheed Benazirabad,Vcant,Leave,Vcant,Present,Present,Present,Present,Vcant,,",
  "45798.00013888889,Shaheed Benazirabad,FWC MCH Center Muhajar Colony, Shaheed Benazirabad,Leave,Present,Leave,Present,Present,Leave,Present,Present,,",
  "45888.00013888889,Shaheed Benazirabad,FWC MCH Center Muhajar Colony, Shaheed Benazirabad,Vcant,Present,Present,Present,Absent,Present,Vcant,Vcant,,",
  "45877.00013888889,Shaheed Benazirabad,FWC Social Security Hospital Shaheed Benazirabad,Present,Present,Present,Present,Vcant,Vcant,Vcant,Vcant,,",
  "45790.00013888889,Shaheed Benazirabad,FWC Social Security Hospital Shaheed Benazirabad,Present,Present,Vcant,Vcant,Vcant,Vcant,Vcant,Present,,",
  "45877.00013888889,Shaheed Benazirabad,FWC Social Security Hospital Shaheed Benazirabad,Vcant,Present,Vcant,Present,Vcant,Present,Present,Vcant,,",
  "45798.00013888889,Shaheed Benazirabad,FWC Daulat Colony Shaheed Benazirabad,Present,Leave,Present,Present,Absent,Leave,Absent,Present,,",
  "45877.00013888889,Shaheed Benazirabad,FWC Daulat Colony Shaheed Benazirabad,Present,Vcant,Vcant,Leave,Present,Vcant,Present,Present,,",
  "45877.00013888889,Shaheed Benazirabad,FWC Taj Colony Shaheed Benazirabad,Vcant,Present,Vcant,Present,Vcant,Vcant,Absent,Present,,",
  "45877.00013888889,Shaheed Benazirabad,FWC BHU Majeed Keerio Shaheed Benazirabad,Vcant,Present,Vcant,Present,Vcant,Vcant,Present,Vcant,,",
  "45877.00013888889,Shaheed Benazirabad,FWC RHC Mehrabpur Shaheed Benazirabad,Vcant,Present,Vcant,Present,Vcant,Vcant,Absent,Present,,",
  "45877.00013888889,Shaheed Benazirabad,FWC RHS Kazi Ahmed Shaheed Benazirabad,Vcant,Present,Vcant,Present,Present,Vcant,Vcant,Vcant,,",
  "45877.00013888889,Shaheed Benazirabad,FWC Kazi Ahmed Shaheed Benazirabad,Vcant,Vcant,Vcant,Present,Present,Present,Vcant,Absent,,",
  "45877.00013888889,Shaheed Benazirabad,FWC GD Gahand Shaheed Benazirabad,Vcant,Vcant,Vcant,Present,Vcant,Present,Absent,Present,,",
  "45877.00013888889,Shaheed Benazirabad,FWC RHC Shahpur Jahania Shaheed Benazirabad,Vcant,Present,Vcant,Vcant,Vcant,Vcant,Absent,Present,,",
  "45877.00013888889,Shaheed Benazirabad,FWC Ansari Mohallah Shaheed Benazirabad,Vcant,Present,Vcant,Absent,Present,Vcant,Vcant,Present,,",
  "45887.00013888889,Shaheed Benazirabad,FWC Daur Shaheed Benazirabad,Vcant,Present,Vcant,Present,Present,Vcant,Present,Vcant,,",
  "45877.00013888889,Shaheed Benazirabad,FWC Daur Shaheed Benazirabad,Vcant,Present,Vcant,Absent,Present,Vcant,Absent,Vcant,,",
  "45887.00013888889,Shaheed Benazirabad,FWC GD Rasool Bux Zardari Shaheed Benazirabad,Vcant,Absent,Vcant,Present,Vcant,Vcant,Present,Present,,",
  "45877.00013888889,Shaheed Benazirabad,FWC GD Rasool Bux Zardari Shaheed Benazirabad,Vcant,Absent,Vcant,Present,Vcant,Vcant,Absent,Absent,,",
  "45896.00013888889,Shaheed Benazirabad,FWA GhulamRasool Shah Municipal Dispensary Shaheed Benazirabad,Present,Vcant,Vcant,Present,Present,Vcant,Vcant,Present,,",
  "45791.00013888889,Shaheed Benazirabad,FWA GhulamRasool Shah Municipal Dispensary Shaheed Benazirabad,Vcant,Present,Present,Present,Vcant,Vcant,Vcant,Present,,",
  "45877.00013888889,Shaheed Benazirabad,FWC Bhaloo Jamali Sakrand Shaheed Benazirabad,Vcant,Present,Vcant,Absent,Vcant,Vcant,Absent,Present,,",
  "45877.00013888889,Shaheed Benazirabad,FWC RHC Doulatpur Shaheed Benazirabad,Vcant,Present,Vcant,Present,Vcant,Vcant,Vcant,Present,,",
  "45896.00013888889,Shaheed Benazirabad,FWC, PMC Hospital, Nawabshah Shaheed Benazirabad,Vcant,Leave,Vcant,Present,Present,Vcant,Present,Vcant,,",
  "45877.00013888889,Shaheed Benazirabad,Family Welfare Center Golimar Shaheed Benazirabad,Vcant,Present,Vcant,Vcant,Absent,Vcant,Present,Vcant,,",
  "45791.00013888889,Shikarpur,FWC Shikarpur-I,Vcant,Present,Vcant,Present,Present,Present,Vcant,Present,,",
  "45796.00013888889,Shikarpur,FWC Shikarpur-II,Present,Present,Vcant,Present,Present,Present,Present,Present,,",
  "45820.00013888889,Shikarpur,FWC Mari Shikarpur,Vcant,Vcant,Present,Present,Present,Present,Present,Vcant,,",
  "45793.00013888889,Sukkur,FWC Suk-II Bagh Hayat Sukkur,Present,Vcant,Vcant,Vcant,Vcant,Vcant,Vcant,Present,,",
  "45796.00013888889,Sukkur,FWC Bachal Shah Sukkur,Vcant,Present,Vcant,Present,Vcant,Vcant,Present,Present,,",
  "45793.00013888889,Sukkur,FWC Numaish Road Sukkur,Present,Present,Present,Present,Vcant,Vcant,Vcant,Vcant,,",
  "45796.00013888889,Sukkur,FWC Maka Goth Sukkur,Vcant,Present,Present,Vcant,Vcant,Vcant,Vcant,Vcant,,",
  "45804.00013888889,Tando Muhammad Khan,FWC Naseerabad Muhallah Tando Muhammad Khan,Vcant,Present,Vcant,Absent,Vcant,Present,Present,Present,,",
  "45804.00013888889,Tando Muhammad Khan,FWC Peoples Colony Tando Muhammad Khan,Vcant,Vcant,Present,Absent,Present,Absent,Vcant,Absent,,",
  "45804.00013888889,Tando Muhammad Khan,FWC Soomra Muhallah Tando Muhammad Khan,Present,Present,Present,Present,Absent,Vcant,Vcant,Present,,",
  "45804.00013888889,Tando Muhammad Khan,FWC Mir Muhalla Tando Muhammad Khan,Vcant,Present,Vcant,Present,Present,Vcant,Present,Present,,",
  "45804.00013888889,Tando Muhammad Khan,FWC Pir Mohallah Tando Muhammad Khan,Vcant,Present,Vcant,Absent,Leave,Vcant,Absent,Absent,,",
  "45803.00013888889,Ghotki,FWC Muhammad Pur Ghotki,Present,Vcant,Vcant,Vcant,Vcant,Vcant,Vcant,Present,,",
  "45803.00013888889,Ghotki,FWC Haseeja Mahar (PPHI) Ghotki,Vcant,Present,Vcant,Leave,Present,Vcant,Present,Present,,",
  "45803.00013888889,Ghotki,FWC Daharki-I Ghotki,Vcant,Vcant,Present,Leave,Vcant,Present,Present,Absent,,",
  "45784.00013888889,Karachi Central,FWC Cental Govt. Dispensary FC Area Karachi Central,Vcant,Present,Vcant,Present,Present,Vcant,Vcant,Present,,",
  "45818.00013888889,Karachi Central,FWC Govt Dispensary Karachi Central,Vcant,Present,Vcant,Present,Present,Vcant,Present,Present,,",
  "45784.00013888889,Karachi Central,FWC CDGK Garibabad Dispensary, Karachi Central,Vcant,Present,Vcant,Present,Present,Vcant,Present,Present,,",
  "45742.00013888889,Karachi Central,FWC CDGK Garibabad Dispensary, Karachi Central,Vcant,Present,Vcant,Present,Leave,Vcant,Present,Present,,",
  "45838.00013888889,Karachi Central,FWC Medi Palace Hospital, North Karachi Central,Present,Vcant,Vcant,Present,Leave,Leave,Vcant,Vcant,,",
  "45758.00013888889,Karachi Central,FWC Anjuman-e-Ehbab, T-5 Block H NorthNazimbabad Near Al-Falah Masjid Karachi Central,Vcant,Present,Vcant,Present,Present,Vcant,Present,Vcant,,",
  "45768.00013888889,Karachi Central,FWC KMC Maternity Home Liaquatabad Karachi Central,Vcant,Present,Vcant,Present,Vcant,Vcant,Present,Vcant,,",
  "45803.00013888889,Karachi Central,FWC SGD near Patrol Pump Nazimabad Karachi Central,Vcant,Present,Vcant,Present,Vcant,Vcant,Present,Present,,",
  "45820.00013888889,Karachi Central,FWC MCH Center, Inquiry Office Nazimabad No 2 Karachi Central,Vcant,Vcant,Present,Vcant,Present,Present,Present,Present,,",
  "45756.00013888889,Karachi Central,FWC MCH Center, Inquiry Office Nazimabad No 2 Karachi Central,Vcant,Vcant,Present,Vcant,Present,Present,Present,Absent,,",
  "45882.00013888889,Karachi Central,FWC MCH Center, Inquiry Office Nazimabad No 2 Karachi Central,Vcant,Vcant,Present,Vcant,Present,Absent,Present,Absent,,",
  "45803.00013888889,Karachi Central,FWC MCH Center, Inquiry Office Nazimabad No 2 Karachi Central,Vcant,Vcant,Present,Vcant,Present,Vcant,Present,Present,,",
  "45803.00013888889,Karachi Central,FWC Sessi Dispensary Pirabad, Golimar No 1 Karachi Central,Vcant,Vcant,Vcant,Absent,Present,Vcant,Present,Absent,,",
  "45742.00013888889,Karachi Central,FWC Shaheed Benazir Dispensary Qalandri Chowk Karachi Central,Vcant,Present,Vcant,Vcant,Leave,Vcant,Present,Present,,",
  "45754.00013888889,Karachi Central,FWC Sindh Govt Children Hospital Shadman Town, North Karachi Central,Vcant,Present,Vcant,Present,Present,Vcant,Present,Vcant,,",
  "45768.00013888889,Karachi Central,FWC Sindh Govt Children Hospital Shadman Town, North Karachi Central,Vcant,Present,Vcant,Present,Present,Vcant,Vcant,Leave,,",
  "45790.00013888889,Karachi Central,FWC Abdul Samad Hospital Karachi Central,Vcant,Present,Present,Present,Present,Vcant,Vcant,Vcant,,",
  "45790.00013888889,Karachi Central,FWC Abdul Samad Hospital Karachi Central,Vcant,Present,Vcant,Vcant,Present,Vcant,Vcant,Vcant,,",
  "45838.00013888889,Karachi Central,FWC 5-D, Sindh Government Hospital, New Karachi Central,Vcant,Vcant,Present,Vcant,Vcant,Absent,Vcant,Present,,",
  "45755.00013888889,Karachi Central,FWC CDGK, Dispensary, Liaquqatabad No 04 Karachi Central,Vcant,Present,Vcant,Present,Present,Vcant,Vcant,Present,,",
  "45818.00013888889,Karachi Central,FWC Sindh Rangers Hospital,North Nazimabad Karachi Central,Vcant,Present,Vcant,Vcant,Vcant,Present,Present,Vcant,,",
  "45798.00013888889,Karachi Central,FWC 5-C/2 Urban Hospital North Karachi Central,Present,Vcant,Vcant,Present,Present,Present,Present,Vcant,,",
  "45784.00013888889,Karachi Central,FWC 5-C/2 Urban Hospital North Karachi Central,Vcant,Present,Vcant,Vcant,Present,Present,Present,Present,,",
  "45838.00013888889,Karachi Central,FWC Qadaria Medical Centre New Karachi Central,Vcant,Vcant,Vcant,Present,Present,Vcant,Present,Present,,",
  "45759.00013888889,Karachi East,FWC-Centre, Dow Hospital, Ojha Campus Karachi East,Vcant,Present,Present,Present,Present,Present,Present,Vcant,,",
  "45742.00013888889,Karachi East,FWC Patel Para dispensary Jamshed town Karachi East,Present,Present,Present,Present,Present,Present,Present,Present,,",
  "45765.00013888889,Karachi East,FWC Patel Para dispensary Jamshed town Karachi East,Vcant,Vcant,Present,Present,Present,Present,Vcant,Vcant,,",
  "45791.00013888889,Karachi East,FWC PIB COLNY Karachi East,Vcant,Vcant,Present,Present,Vcant,Present,Vcant,Present,,",
  "45743.00013888889,Karachi East,FWC PAF MALIR Karachi East,Vcant,Present,Vcant,Present,Present,Vcant,Vcant,Present,,",
  "45764.00013888889,Karachi East,FWC Bhitai Cllinin Bhitai Abad Karachi East,Present,Present,Absent,Present,Absent,Present,Absent,Absent,,",
  "45783.00013888889,Karachi East,FWC Bhitai Cllinin Bhitai Abad Karachi East,Present,Vcant,Vcant,Present,Present,Present,Present,Vcant,,",
  "45764.00013888889,Karachi East,FWC Bhitai Cllinin Bhitai Abad Karachi East,Present,Vcant,Vcant,Present,Present,Vcant,Present,Vcant,,",
  "45798.00013888889,Karachi East,FWC Sachal Dispansery Karachi East,Present,Vcant,Vcant,Present,Present,Present,Vcant,Present,,",
  "45755.00013888889,Karachi East,FWC Sachal Dispansery Karachi East,Vcant,Present,Vcant,Present,Vcant,Vcant,Present,Present,,",
  "45785.00013888889,Karachi East,FWC Sachal Dispansery Karachi East,Vcant,Vcant,Present,Present,Present,Vcant,Present,Vcant,,",
  "45757.00013888889,Karachi East,FWC Janat Gul Hospital Karachi East,Vcant,Present,Vcant,Leave,Vcant,Vcant,Present,Present,,",
  "45784.00013888889,Karachi East,FWC Qubira Medical Dispensary Edhi Centre Karachi East,Vcant,Present,Vcant,Vcant,Present,Present,Present,Vcant,,",
  "45757.00013888889,Karachi East,FWC Qubira Medical Dispensary Edhi Centre Karachi East,Vcant,Present,Vcant,Vcant,Vcant,Present,Present,Present,,",
  "45792.00013888889,Karachi East,FWC Abbas Town Karachi East,Vcant,Vcant,Present,Present,Present,Present,Vcant,Vcant,,",
  "45765.00013888889,Karachi East,FWC Abbas Town Karachi East,Vcant,Vcant,Present,Present,Present,Vcant,Vcant,Vcant,,",
  "45783.00013888889,Karachi East,FWC PEHLWAN GOTH Karachi East,Vcant,Vcant,Vcant,Present,Present,Present,Present,Vcant,,",
  "45764.00013888889,Karachi East,FWC PEHLWAN GOTH Karachi East,Vcant,Vcant,Vcant,Present,Present,Vcant,Present,Vcant,,",
  "45763.00013888889,Karachi East,FWC Edhi Welfare Centre Gulastan e johar Karachi East,Vcant,Present,Vcant,Present,Present,Vcant,Leave,Leave,,",
  "45783.00013888889,Karachi East,FWC Edhi Welfare Centre Gulastan e johar Karachi East,Vcant,Present,Vcant,Leave,Present,Present,Present,Present,,",
  "45798.00013888889,Karachi East,FWC Bilawal Shah Noorani Goth Karachi East,Present,Present,Present,Vcant,Vcant,Vcant,Vcant,Vcant,,",
  "45765.00013888889,Karachi East,FWC Bilawal Shah Noorani Goth Karachi East,Vcant,Present,Present,Present,Present,Present,Vcant,Leave,,",
  "45791.00013888889,Karachi East,FWC - Soldier Bazar Karachi East,Vcant,Vcant,Present,Vcant,Vcant,Present,Present,Vcant,,",
  "45761.00013888889,Karachi East,FWC - Soldier Bazar Karachi East,Vcant,Vcant,Vcant,Vcant,Vcant,Present,Vcant,Vcant,,",
  "45755.00013888889,Karachi East,FWC Ghazi Goth Karachi East,Vcant,Present,Vcant,Present,Present,Vcant,Present,Present,,",
  "45764.00013888889,Karachi East,FWC SGD Gareb Abad Gadap Town Karachi East,Vcant,Vcant,Present,Vcant,Present,Present,Vcant,Present,,",
  "45764.00013888889,Karachi South,FWC - P&T Colony Karachi South,Vcant,Vcant,Absent,Present,Present,Vcant,Absent,Present,,",
  "45762.00013888889,Karachi South,FWC - Garden Karachi South,Vcant,Present,Vcant,Vcant,Vcant,Vcant,Present,Vcant,,",
  "45771.00013888889,Karachi South,FWC - Railway Hassan Karachi South,Vcant,Vcant,Present,Present,Vcant,Vcant,Leave,Present,,",
  "45762.00013888889,Karachi South,FWC - Ranchore Line Karachi South,Vcant,Present,Vcant,Absent,Present,Present,Vcant,Present,,",
  "45764.00013888889,Karachi South,FWC - Gizri Karachi South,Vcant,Vcant,Leave,Present,Vcant,Vcant,Present,Present,,",
  "45742.00013888889,Karachi South,FWC - JPMC (NICH) Karachi South,Vcant,Present,Vcant,Present,Present,Vcant,Present,Vcant,,",
  "45768.00013888889,Karachi South,FWC - JPMC (NICH) Karachi South,Vcant,Present,Vcant,Present,Absent,Vcant,Absent,Vcant,,",
  "45768.00013888889,Karachi South,FWC - Empress Market Karachi South,Vcant,Vcant,Vcant,Present,Present,Vcant,Absent,Vcant,,",
  "45743.00013888889,Karachi South,FWC - Civil Services Hospital Karachi South,Vcant,Vcant,Present,Vcant,Present,Vcant,Vcant,Absent,,",
  "45807.00013888889,Karachi South,FWC Junejo Town(Defence View) Karachi South,Vcant,Absent,Vcant,Absent,Present,Absent,Vcant,Vcant,,",
  "45768.00013888889,Karachi South,FWC Junejo Town(Defence View) Karachi South,Vcant,Vcant,Absent,Present,Present,Absent,Vcant,Vcant,,",
  "45762.00013888889,Karachi South,FWC KMC Hospital Manzoor Colony Karachi South,Present,Present,Vcant,Present,Present,Vcant,Vcant,Vcant,,",
  "45771.00013888889,Karachi South,FWC Kashmir Colony Karachi South,Vcant,Present,Vcant,Present,Vcant,Vcant,Present,Present,,"
];

const dataset = [
  { month: "Minilap Kits", rainfall: 1593, total: 2000, percentage: 79.65 },
  { month: "Iud kits", rainfall: 708, total: 2000, percentage: 35.4 },
  { month: "B.P. Apparatus", rainfall: 885, total: 2000, percentage: 44.25 },
  { month: "Thermometer", rainfall: 531, total: 2000, percentage: 26.55 },
  { month: "Weighting Machine", rainfall: 177, total: 2000, percentage: 8.85 },
  { month: "Stove", rainfall: 177, total: 2000, percentage: 8.85 },
  { month: "O.T. Lights", rainfall: 354, total: 2000, percentage: 17.7 },
  { month: "Hydraulic Table", rainfall: 177, total: 2000, percentage: 8.85 },
  { month: "Autoclave", rainfall: 177, total: 2000, percentage: 8.85 },
  { month: "Oxygen Cylinder", rainfall: 177, total: 2000, percentage: 8.85 },
  { month: "Aspirating Pumps", rainfall: 354, total: 2000, percentage: 17.7 },
  { month: "Wheel Chair", rainfall: 177, total: 2000, percentage: 8.85 },
  { month: "Stretcher", rainfall: 354, total: 2000, percentage: 17.7 },
  { month: "Generator", rainfall: 177, total: 2000, percentage: 8.85 },
  { month: "Screen", rainfall: 177, total: 2000, percentage: 8.85 },
];

// Attendance data with both counts and percentages
const attendanceData = [
  {
    label: "All Staff",
    count: "3286",
    percentage: "100%",
    color: "#2196F3",
    borderLeft: "none",
  },
  {
    label: "Present",
    count: "1391",
    percentage: "42.33%",
    color: "#4CAF50",
    borderLeft: "5px solid #4CAF50",
  },
  {
    label: "Absent",
    count: "185",
    percentage: "5.63%",
    color: "#F44336",
    borderLeft: "5px solid #F44336",
  },
  {
    label: "Vacant",
    count: "1606",
    percentage: "48.87%",
    color: "#9E9E9E",
    borderLeft: "5px solid #9E9E9E",
  },
  {
    label: "Leave",
    count: "104",
    percentage: "3.16%",
    color: "#FF9800",
    borderLeft: "5px solid #FF9800",
  },
];

const data = [
  { name: "Close", value: 2, color: "#b3b3b3" },
  { name: "Open", value: 339, color: "#0088FE" },
];

const data3 = [
  { name: "Close", value: 0, color: "#b3b3b3" },
  { name: "Open", value: 20, color: "#FFBB28" },
];

const data2 = [
  { name: "Close", value: 1, color: "#b3b3b3" },
  { name: "Open", value: 42, color: "#FF8042" },
];

const COLORS = ['#b3b3b3', '#0088FE'];
const COLORS2 = ['#b3b3b3', '#FFBB28'];
const COLORS3 = ['#b3b3b3', '#FF8042'];

const CustomTooltip = ({ active, payload, total }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
    return (
      <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
        <p style={{ fontSize: '12px' }}>{`${name}: ${value} (${percentage}%)`}</p>
      </div>
    );
  }
  return null;
};

function excelSerialToDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  const fractional_day = serial - Math.floor(serial) + 0.0000001;
  let total_seconds = Math.floor(86400 * fractional_day);
  const seconds = total_seconds % 60;
  total_seconds -= seconds;
  const hours = Math.floor(total_seconds / 3600);
  const minutes = Math.floor(total_seconds / 60) % 60;
  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds).toLocaleDateString();
}

const positions = [
  'wmo', 'aa', 'tn', 'ott', 'fwcouncilor', 'fww', 'fwwa', 'driver', 'help', 'sweep'
];

const positionNames = {
  wmo: 'Women Medical Officer',
  aa: 'Accounts Assistant',
  tn: 'Theater Nurse',
  ott: 'O.T Technician',
  fwcouncilor: 'Family Welfare Councilor',
  fww: 'Family Welfare Worker',
  fwwa: 'Family Welfare Worker Assistant',
  driver: 'Driver',
  help: 'Help',
  sweep: 'Sweep'
};

const sdpData = {
  "RHS-A": [
    { district: "Badin", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A M.P.S Centre Badin", status: "Open" },
    { district: "Karachi West", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Qatar Hospital Karachi West", status: "Close" },
    { district: "Korangi", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Centre Ibrahim Hyderi Karachi Korangi", status: "Open" },
    { district: "Korangi", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Centre SGH Korangi # 5 Karachi Korangi", status: "Open" },
    { district: "Malir", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Saudabad Karachi Malir Town", status: "Open" },
    { district: "Qambar Shahdadkot", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A CENTRE KAMBER Qambar Shahdadkot", status: "Open" },
    { district: "Sanghar", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Center Shahdadpur Sanghar", status: "Open" },
    { district: "Sanghar", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Center Tando Adam Sanghar", status: "Open" },
    { district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A-Center Nawabshah Shaheed Benazirabad", status: "Open" },
    { district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A-Center Sakrand Shaheed Benazirabad", status: "Open" },
    { district: "Shikarpur", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Centre Civil Hospital Shikarpur", status: "Open" },
    { district: "Sukkur", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A New Sukkur", status: "Open" },
    { district: "Tando Muhammad Khan", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Centre Tando Muhammad Khan", status: "Open" },
    { district: "Tharparkar", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Mithi Tharparkar \"Mithi\"", status: "Open" },
    { district: "Karachi Central", sdpType: "Population Welfare Department - RHS-A", centerName: "RHS-A Abbasi Shaheed Karachi Central", status: "Open" }
  ],
  "MSU": [
    { district: "Kashmore", sdpType: "Population Welfare Department - MSU", centerName: "MSU Center Civil Hospital Kandhkot Kashmore", status: "Open" },
    { district: "Malir", sdpType: "Population Welfare Department - MSU", centerName: "MSU Saudabad Karachi Malir Town", status: "Open" },
    { district: "Sanghar", sdpType: "Population Welfare Department - MSU", centerName: "MSU Center Shahdadpur Sanghar", status: "Open" },
    { district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - MSU", centerName: "MSU-Center Nawabshah Shaheed Benazirabad", status: "Open" },
    { district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - MSU", centerName: "MSU-Center Sakrand Shaheed Benazirabad", status: "Open" },
    { district: "Karachi East", sdpType: "Population Welfare Department - MSU", centerName: "MSU-Centre, Dow Hospital, Ojha Campus Karachi East", status: "Open" }
  ],
  "FWC": [
    { district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC SGD Abidabad Baldia Karachi West", status: "Open" },
    { district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC UHU-15 Orangi Karachi West", status: "Open" },
    { district: "Karachi West", sdpType: "Population Welfare Department - FWC", centerName: "FWC Banaras Colony Karachi West", status: "Open" },
    { district: "Korangi", sdpType: "Population Welfare Department - FWC", centerName: "FWC Bhitai Colony E Sacter (New) Korangi", status: "Open" },
    { district: "Malir", sdpType: "Population Welfare Department - FWC", centerName: "FWC SHAHNAWAZ GOTH Malir Town", status: "Open" },
    { district: "Naushahro Feroze", sdpType: "Population Welfare Department - FWC", centerName: "FWC Naushahro Feroze-I", status: "Open" },
    { district: "Qambar Shahdadkot", sdpType: "Population Welfare Department - FWC", centerName: "FWC KAMBER-I Qambar Shahdadkot", status: "Open" },
    { district: "Sanghar", sdpType: "Population Welfare Department - FWC", centerName: "FWC Sinjhoro Sanghar", status: "Open" },
    { district: "Shaheed Benazirabad", sdpType: "Population Welfare Department - FWC", centerName: "FWC Gyani Ward Evening Shaheed Benazirabad", status: "Open" },
    { district: "Karachi Central", sdpType: "Population Welfare Department - FWC", centerName: "FWC Cental Govt. Dispensary FC Area Karachi Central", status: "Open" },
    { district: "Karachi East", sdpType: "Population Welfare Department - FWC", centerName: "FWC-Centre, Dow Hospital, Ojha Campus Karachi East", status: "Open" },
    { district: "Karachi South", sdpType: "Population Welfare Department - FWC", centerName: "FWC - P&T Colony Karachi South", status: "Open" }
  ],
};

export default function KeyMetricCard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [sdpDrawerOpen, setSdpDrawerOpen] = useState(false);
  const [attendanceDrawerOpen, setAttendanceDrawerOpen] = useState(false);
  const [selectedSdp, setSelectedSdp] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [groupedAttendance, setGroupedAttendance] = useState({});
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    const data = rawRows.map((rawLine, index) => {
      const line = rawLine.replace(/row\d+:\s*/, '').trim();
      const parts = line.split(',').map(s => s.trim());
      const numStatuses = 10;
      const dateStr = parts[0];
      const district = parts[1];
      const center = parts.slice(2, parts.length - numStatuses).join(', ');
      let statuses = parts.slice(-numStatuses);
      if (statuses.length < numStatuses) {
        statuses = [...statuses, ...Array(numStatuses - statuses.length).fill('')];
      }
      const date = excelSerialToDate(parseFloat(dateStr));
      return {
        id: index,
        date,
        district,
        center,
        wmo: statuses[0],
        aa: statuses[1],
        tn: statuses[2],
        ott: statuses[3],
        fwcouncilor: statuses[4],
        fww: statuses[5],
        fwwa: statuses[6],
        driver: statuses[7],
        help: statuses[8],
        sweep: statuses[9],
      };
    });
    setParsedData(data);

    const statuses = ['Present', 'Absent', 'Vacant', 'Leave'];
    const grouped = {};
    statuses.forEach(status => {
      grouped[status] = {};
      positions.forEach(pos => {
        grouped[status][pos] = data.filter(row => row[pos] === status).map(row => ({
          id: row.id + pos,
          district: row.district,
          center: row.center,
          status: status
        }));
      });
    });
    setGroupedAttendance(grouped);
  }, []);

  const allStaffColumns = [
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'district', headerName: 'Name of District', width: 150 },
    { field: 'center', headerName: 'Center Name', width: 300, flex: 1 },
    ...positions.map(pos => ({
      field: pos,
      headerName: positionNames[pos],
      width: 200
    })),
  ];

  const statusColumns = [
    { field: 'district', headerName: 'Name of District', width: 200 },
    { field: 'center', headerName: 'Center Name', width: 400, flex: 1 },
    { field: 'status', headerName: 'Status', width: 200, valueGetter: (params) => selectedAttendance || 'N/A' },
  ];

  const handlePieClick = (entry, index, event, sdpType) => {
  const clickedStatus = entry?.name; // Safely get the name from the clicked entry
  setSelectedSdp(sdpType);
  setSelectedStatus(clickedStatus);
  setSdpDrawerOpen(true);
};

  const handleAttendanceClick = (attendanceType) => {
    setSelectedAttendance(attendanceType);
    setAttendanceDrawerOpen(true);
  };

  const handleCloseSdpDrawer = () => {
    setSdpDrawerOpen(false);
    setSelectedSdp(null);
    setSelectedStatus(null);
  };

  const handleCloseAttendanceDrawer = () => {
    setAttendanceDrawerOpen(false);
    setSelectedAttendance(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: isMobile ? 1 : "2px",
        maxWidth: "100%",
        overflowX: "hidden",
        marginBottom: "20px",
      }}
    >
      <Grid
        container
        spacing={isMobile ? 1 : isTablet ? 2 : 3}
        alignItems="stretch"
        sx={{ flexWrap: "nowrap" }}
      >
        <Grid item xs={12} sm={12} md={4} lg={4} sx={{ width: "40%" }}>
          <HealthMetricsCard />
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              height: "300px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              marginTop: isMobile ? "10px" : "20px",
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                align="left"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: theme.palette.text.primary,
                  fontFamily: "inherit",
                  fontSize: 16,
                }}
              >
                Equipment Position/Condition
              </Typography>
              <Box sx={{ height: 230, overflow: "auto" }}>
                {dataset.map((item, index) => (
                  <Box key={index} sx={{ mb: 0.3 }}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between", }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ width: 180, fontSize: "0.75rem", color: "gray", paddingTop: '7px' }}
                      >
                        {item.month}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "end",
                          justifyContent: 'end',
                          marginBottom: "2px",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: "black",
                            fontSize: "13px",
                            paddingTop: '7px',
                          }}
                        >
                          {item.rainfall} / {item.percentage}%
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ position: "relative", height: "8px" }}>
                      <LinearProgress
                        variant="determinate"
                        value={item.percentage}
                        sx={{
                          height: "8px",
                          borderRadius: "4px",
                          backgroundColor: theme.palette.grey[200],
                          "& .MuiLinearProgress-bar": {
                            borderRadius: "4px",
                            backgroundColor: '#4caf50'
                          },
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={6} sx={{ width: "36.5%" }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              height: isMobile ? "auto" : "300px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                align="left"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: theme.palette.text.primary,
                  fontFamily: "inherit",
                  fontSize: 16,
                }}
              >
                SDP's Status
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "calc(100% - 40px)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 1,
                    flexDirection: "column",
                    alignItems: "center",
                    height: isMobile ? "140px" : "150px",
                    marginTop: "-10px",
                  }}
                >
                  <Statisticscard />
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: "10px", color: "gray" }}
                    >
                      Open / Close Status
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                    height: '40%',
                    flexWrap: isMobile ? "wrap" : "nowrap",
                  }}
                >
                  <ResponsiveContainer width="25%" height="80%">
                    <RePieChart>
                      <Pie
                        data={data}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={17}
                        outerRadius={33}
                        startAngle={-90}
                        fill="#82ca9d"
                        onClick={(entry, index, event) => handlePieClick(entry, index, event, 'FWC')}
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ReToolTip style={{ zIndex: '1' }} content={<CustomTooltip total={341} />} />
                    </RePieChart>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="caption" sx={{ fontSize: "10px", color: "gray" }}>
                        FWC
                      </Typography>
                    </Box>
                  </ResponsiveContainer>
                  <ResponsiveContainer width="25%" height="80%">
                    <RePieChart>
                      <Pie
                        data={data3}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={17}
                        outerRadius={33}
                        startAngle={-90}
                        fill="#82ca9d"
                        onClick={(entry, index, event) => handlePieClick(entry, index, event, 'MSU')}
                      >
                        {data3.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
                        ))}
                      </Pie>
                      <ReToolTip content={<CustomTooltip total={20} />} />
                    </RePieChart>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="caption" sx={{ fontSize: "10px", color: "gray" }}>
                        MSU
                      </Typography>
                    </Box>
                  </ResponsiveContainer>
                  <ResponsiveContainer width="25%" height="80%">
                    <RePieChart>
                      <Pie
                        data={data2}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={17}
                        outerRadius={33}
                        startAngle={-90}
                        fill="#82ca9d"
                        onClick={(entry, index, event) => handlePieClick(entry, index, event, 'RHS-A')}
                      >
                        {data2.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS3[index % COLORS3.length]} />
                        ))}
                      </Pie>
                      <ReToolTip content={<CustomTooltip total={43} />} />
                    </RePieChart>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="caption" sx={{ fontSize: "10px", color: "gray" }}>
                        RHS-A
                      </Typography>
                    </Box>
                  </ResponsiveContainer>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              height: "300px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              marginTop: isMobile ? "10px" : "20px",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: "text.primary",
                  textAlign: "left",
                  fontFamily: "inherit",
                  fontSize: 16,
                }}
              >
                Status of Building
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: 10 }}
                  >
                    Government
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: 10 }}
                  >
                    61.58%
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: 10 }}
                  >
                    Rented
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: 10 }}
                  >
                    31.64%
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: 10 }}
                  >
                    Pvt (Free Of Cost)
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: 10 }}
                  >
                    6.78%
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: 10 }}
                  >
                    Indication/ Sign Board (Installed)
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: 10 }}
                  >
                    83.51%
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: 10 }}
                  >
                    Electricity
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: 10 }}
                  >
                    94.14%
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: 10 }}
                  >
                    Gas
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: 10 }}
                  >
                    50.53%
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: 10 }}
                  >
                    Water
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: 10 }}
                  >
                    86.70%
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: 10 }}
                  >
                    Cleanlines
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: 10 }}
                  >
                    92.02%
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: 10 }}
                  >
                    Branded
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: 10 }}
                  >
                    61.01%
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", fontSize: 10 }}
                  >
                    Un Branded
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontSize: 10 }}
                  >
                    38.98%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={4} lg={4} sx={{ width: "23.5%" }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              height: "100%",
              width: isMobile ? "100%" : "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: isMobile ? "14px" : "16px",
                  marginBottom: isMobile ? "15px" : "20px",
                  fontFamily: "inherit",
                }}
                fontWeight={600}
                gutterBottom
                align="left"
              >
                Attendance Overview
              </Typography>
              <Grid
                container
                spacing={isMobile ? 1 : 2}
                sx={{ height: "auto", justifyContent: "center", width: "100%" }}
              >
                <Grid item xs={12} sm={6} md={12} sx={{ width: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: isMobile ? 1.5 : 3.5,
                      width: isMobile ? "100%" : "100%",
                      height: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    {attendanceData.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                          p: 1.5,
                          background: "rgba(255,255,255,0.7)",
                          borderRadius: 2,
                          boxShadow: "1px 1px 8px -1px rgb(160 160 160)",
                          borderLeft: item.borderLeft,
                          width: "100%",
                          cursor: 'pointer',
                        }}
                        onClick={() => handleAttendanceClick(item.label)}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant={isMobile ? "body2" : "subtitle2"}
                            sx={{ fontWeight: 600 }}
                          >
                            {item.label}
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ color: item.color }}
                          >
                            {item.percentage}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            Count: {item.count}
                          </Typography>
                          {item.label !== "All Staff" && (
                            <Box sx={{ width: "60%" }}>
                              <LinearProgress
                                variant="determinate"
                                value={parseInt(item.percentage)}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: theme.palette.grey[200],
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor: item.color,
                                    borderRadius: 3,
                                  },
                                }}
                              />
                            </Box>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Drawer
        anchor="right"
        open={sdpDrawerOpen}
        onClose={handleCloseSdpDrawer}
        sx={{ '& .MuiDrawer-paper': { width: '80%', maxWidth: 800, p: 4, maxHeight: '100vh', overflow: 'auto' } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6">{selectedSdp} - SDP Status Details - {selectedStatus || 'All'}</Typography>
          <IconButton onClick={handleCloseSdpDrawer}><CloseIcon /></IconButton>
        </Box>
        {selectedSdp && (
          <>
            <div style={{ height: 600, width: '100%' }}>
              <DataGrid
                rows={sdpData[selectedSdp].filter(row => !selectedStatus || row.status === selectedStatus)}
                columns={[
                  { field: 'district', headerName: 'District', width: 150 },
                  { field: 'sdpType', headerName: 'SDP Type', width: 200 },
                  { field: 'centerName', headerName: 'Center Name', flex: 1 },
                  { field: 'status', headerName: 'Status', width: 100 },
                ]}
                getRowId={(row) => `${row.district}-${row.centerName}-${row.status}`} // Custom ID generation
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
              />
            </div>
            <Box sx={{ mt: 2 }}>
              <Typography>
                Open: {sdpData[selectedSdp].filter(r => r.status === 'Open').length}, 
                Closed: {sdpData[selectedSdp].filter(r => r.status === 'Close').length}, 
                Percentage: {((sdpData[selectedSdp].filter(r => r.status === 'Open').length / sdpData[selectedSdp].length) * 100).toFixed(2)}%
              </Typography>
            </Box>
          </>
        )}
      </Drawer>

      <Drawer
        anchor="right"
        open={attendanceDrawerOpen}
        onClose={handleCloseAttendanceDrawer}
        sx={{ '& .MuiDrawer-paper': { width: '80%', maxWidth: 1200, p: 4, maxHeight: '100vh', overflow: 'auto' } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6">{selectedAttendance} - Detailed Breakdown</Typography>
          <IconButton onClick={handleCloseAttendanceDrawer}><CloseIcon /></IconButton>
        </Box>
        {selectedAttendance === 'All Staff' ? (
          <div style={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={parsedData}
              columns={allStaffColumns}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
            />
          </div>
        ) : (
          positions.map(pos => (
            <Box key={pos} sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}><b>{positionNames[pos]}</b></Typography>
              <div style={{ height: 300, width: '100%' }}>
                <DataGrid
                  rows={groupedAttendance[selectedAttendance]?.[pos] || []}
                  columns={statusColumns}
                  pageSizeOptions={[5, 10, 25]}
                  disableRowSelectionOnClick
                />
              </div>
            </Box>
          ))
        )}
      </Drawer>
    </Box>
  );
}
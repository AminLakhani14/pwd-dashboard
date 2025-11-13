import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  LinearProgress,
  Drawer,
  IconButton,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Alert
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import Statisticscard from "./Statisticscard";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import axios from 'axios';

type AttendanceStatus = "present" | "absent" | "vacant" | "leave";

type PositionKey =
  | "wmo"
  | "aa"
  | "tn"
  | "ott"
  | "fwcouncilor"
  | "fww"
  | "fwwa"
  | "driver"
  | "help"
  | "sweep";

type AttendanceRecord = {
  asDate: string;
  District: string;
  Center: string;
  "Women Medical Officer": string;
  "Accounts Assistant": string;
  "Theater Nurse": string;
  "O.T Technician": string;
  "Family Welfare Councilor": string;
  "Family Welfare Worker": string;
  "Family Welfare Worker Assistant": string;
  Driver: string;
  Help: string;
  Sweep: string;
};

type ParsedRow = {
  id: number;
  date: string;
  district: string;
  center: string;
} & Record<PositionKey, string>;


type TooltipPayloadItem = { name: string; value: number };

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  total: number;
};

// Function to fetch image from API using Axios
const fetchImage = async (photos: string): Promise<string> => {
  try {
    const url = `https://pwd.kcompute.com/Dashboard/GetImages?ImageName=${encodeURIComponent(photos)}`;
    
    const response = await axios.get(url, {
      responseType: 'json', // Expecting JSON response with base64
    });

    console.log('API Response:', response);

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle different response structures
    let base64Data = '';

    if (typeof response.data === 'string') {
      // If response is directly a base64 string
      base64Data = response.data;
    } else if (response.data?.base64) {
      // If response is an object with base64 property
      base64Data = response.data.base64;
    } else if (response.data?.data) {
      // If response is an object with data property containing base64
      base64Data = response.data.data;
    } else if (response.data?.image) {
      // If response is an object with image property
      base64Data = response.data.image;
    } else {
      // Try to stringify and use if it's a simple object
      base64Data = typeof response.data === 'object' ? JSON.stringify(response.data) : response.data;
    }

    // Clean the base64 string (remove data URL prefix if present)
    const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');

    // Create data URL from base64
    const imageUrl = `data:image/jpeg;base64,${cleanBase64}`;
    
    return imageUrl;
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
};

const getEquipmentColumns = (selectedEquipment: string): GridColDef[] => [
  { field: "asDate", headerName: "Date", width: 120 },
  { field: "projectName", headerName: "Project Name", width: 250 },
  { field: "district", headerName: "District", width: 150 },
  { field: "center", headerName: "Center", width: 200, flex: 1 },
  { 
    field: selectedEquipment, 
    headerName: selectedEquipment, 
    width: 150,
    renderCell: (params: any) => (
      <Typography 
        sx={{ 
          color: params.value === 'Good' ? '#4CAF50' : 
                params.value === 'Satisfactory' ? '#FFC107' : 
                params.value === 'Poor' ? '#F44336' : '#9E9E9E',
          fontWeight: 500
        }}
      >
        {params.value}
      </Typography>
    )
  },
];

const COLORS = ["#b3b3b3", "#0088FE"];
const COLORS2 = ["#b3b3b3", "#FFBB28"];
const COLORS3 = ["#b3b3b3", "#FF8042"];

const CustomTooltip = ({ active, payload, total }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    return (
      <div
        style={{
          backgroundColor: "white",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <p
          style={{ fontSize: "12px" }}
        >{`${name}: ${value} (${percentage}%)`}</p>
      </div>
    );
  }
  return null;
};

const positions: PositionKey[] = [
  "wmo",
  "aa",
  "tn",
  "ott",
  "fwcouncilor",
  "fww",
  "fwwa",
  "driver",
  "help",
  "sweep",
];

const positionNames: Record<PositionKey, string> = {
  wmo: "Women Medical Officer",
  aa: "Accounts Assistant",
  tn: "Theater Nurse",
  ott: "O.T Technician",
  fwcouncilor: "Family Welfare Councilor",
  fww: "Family Welfare Worker",
  fwwa: "Family Welfare Worker Assistant",
  driver: "Driver",
  help: "Help",
  sweep: "Sweep",
};

const positionToFieldMap: Record<PositionKey, keyof AttendanceRecord> = {
  wmo: "Women Medical Officer",
  aa: "Accounts Assistant",
  tn: "Theater Nurse",
  ott: "O.T Technician",
  fwcouncilor: "Family Welfare Councilor",
  fww: "Family Welfare Worker",
  fwwa: "Family Welfare Worker Assistant",
  driver: "Driver",
  help: "Help",
  sweep: "Sweep",
};

// Define columns for DataGrid with image column for Close status


export default function KeyMetricCard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [sdpDrawerOpen, setSdpDrawerOpen] = useState(false);
  const [attendanceDrawerOpen, setAttendanceDrawerOpen] = useState(false);
  const [selectedSdp, setSelectedSdp] = useState<
    "RHS-A" | "MSU" | "FWC" | null
  >(null);
  const [selectedAttendance, setSelectedAttendance] = useState<
    AttendanceStatus | "All Staff" | null
  >(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [equipmentDrawerOpen, setEquipmentDrawerOpen] = useState(false);
  const [groupedAttendance, setGroupedAttendance] = useState<
    Record<
      AttendanceStatus,
      Record<
        PositionKey,
        {
          id: string | number;
          district: string;
          center: string;
          status: AttendanceStatus;
        }[]
      >
    >
  >({
    present: {
      wmo: [],
      aa: [],
      tn: [],
      ott: [],
      fwcouncilor: [],
      fww: [],
      fwwa: [],
      driver: [],
      help: [],
      sweep: [],
    },
    absent: {
      wmo: [],
      aa: [],
      tn: [],
      ott: [],
      fwcouncilor: [],
      fww: [],
      fwwa: [],
      driver: [],
      help: [],
      sweep: [],
    },
    vacant: {
      wmo: [],
      aa: [],
      tn: [],
      ott: [],
      fwcouncilor: [],
      fww: [],
      fwwa: [],
      driver: [],
      help: [],
      sweep: [],
    },
    leave: {
      wmo: [],
      aa: [],
      tn: [],
      ott: [],
      fwcouncilor: [],
      fww: [],
      fwwa: [],
      driver: [],
      help: [],
      sweep: [],
    },
  });
  const [selectedStatus, setSelectedStatus] = useState<"Open" | "Close" | null>(
    null
  );
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const PWDdashboard = useSelector((state: RootState) => state.PWDINITSLICE);

  // Function to handle image view
  const handleViewImage = async (photos: string, rowId: number) => {
    if (!photos) {
      setImageError('No photo reference available');
      return;
    }

    setLoadingImage(`${rowId}`);
    setImageError(null);
    setCurrentImageUrl(null);

    try {
      const imageUrl = await fetchImage(photos);
      setCurrentImageUrl(imageUrl);
      setImageDialogOpen(true);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load image. Please try again.';
      setImageError(errorMessage);
      console.error('Error loading image:', error);
    } finally {
      setLoadingImage(null);
    }
  };

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
    setCurrentImageUrl(null);
    setImageError(null);
  };

  // Get equipment data from Redux state
  const equipmentData = PWDdashboard.equipmentStockData || [];
  const equipmentGridData = PWDdashboard.equipmentGridData || [];
  const sdpDropdownValue = PWDdashboard.SDPdropdownValue || "";

  // Filter equipment data to exclude N/A items (where percentage is 0)
  const filteredEquipmentData = equipmentData.filter(item => 
    parseFloat(item.percentage) > 0
  );

  // Determine which SDP to show based on dropdown value
  const getSdpToShow = () => {
    if (!sdpDropdownValue) return "all"; // Show all if empty
    
    if (sdpDropdownValue.includes("55587") && sdpDropdownValue.includes("FWC")) {
      return "FWC";
    } else if (sdpDropdownValue.includes("50484") && sdpDropdownValue.includes("MSU")) {
      return "MSU";
    } else if (sdpDropdownValue.includes("RHS-A")) {
      return "RHS-A";
    }
    
    return "all"; // Default to showing all
  };

  const sdpToShow = getSdpToShow();

  // Calculate attendance statistics from Redux data
  const calculateAttendanceStats = () => {
    const attendanceRecords: AttendanceRecord[] =
      PWDdashboard.attendanceRecord || [];

    let totalStaffPositions = 0;
    let presentCount = 0;
    let absentCount = 0;
    let vacantCount = 0;
    let leaveCount = 0;

    attendanceRecords.forEach((record) => {
      Object.values(positionToFieldMap).forEach((field) => {
        const status = (
          record[field] as string
        )?.toLowerCase() as AttendanceStatus;
        
        if (status && status.trim() !== '') {
          totalStaffPositions++;
          switch (status) {
            case "present":
              presentCount++;
              break;
            case "absent":
              absentCount++;
              break;
            case "vacant":
              vacantCount++;
              break;
            case "leave":
              leaveCount++;
              break;
          }
        }
      });
    });

    // Calculate total valid staff positions
    const totalValidStaff = presentCount + absentCount + vacantCount + leaveCount;
    
    return {
      totalStaff: totalStaffPositions,
      presentCount,
      absentCount,
      vacantCount,
      leaveCount,
      presentPercentage: totalValidStaff > 0 ? (presentCount / totalValidStaff) * 100 : 0,
      absentPercentage: totalValidStaff > 0 ? (absentCount / totalValidStaff) * 100 : 0,
      vacantPercentage: totalValidStaff > 0 ? (vacantCount / totalValidStaff) * 100 : 0,
      leavePercentage: totalValidStaff > 0 ? (leaveCount / totalValidStaff) * 100 : 0,
    };
  };

  const stats = calculateAttendanceStats();

  const getSdpColumns = (selectedStatus: string | null): GridColDef[] => {
    const baseColumns: GridColDef[] = [
      { field: "district", headerName: "District", width: 150 },
      { field: "sdpType", headerName: "SDP Type", width: 200 },
      { field: "centerName", headerName: "Center Name", flex: 1 },
      { field: "status", headerName: "Status", width: 100 },
    ];
  
    // Add image column only when selectedStatus is "Close"
    // if (selectedStatus === "Close") {
      baseColumns.push({
        field: "image",
        headerName: "Image",
        width: 150,
        renderCell: (params) => {
          const photos = params.row.photos || '';
          const isCurrentLoading = loadingImage === `${params.row.id}`;
          
          return (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'left',
              width: '100%',
              marginTop:'10px',
            }}>
              <Button
                variant="contained"
                size="small"
                startIcon={isCurrentLoading ? <CircularProgress size={16} /> : <VisibilityIcon />}
                onClick={() => handleViewImage(photos, params.row.id)}
                disabled={!photos || !!loadingImage}
                sx={{
                  fontSize: isMobile ? "0.75rem" : "0.75rem",
                  // padding: isMobile ? "6px 12px" : "8px 16px",
                  minWidth: 'auto',
                  backgroundColor: 'gray',
                }}
              >
                {isCurrentLoading ? 'Loading...' : 'View'}
              </Button>
            </Box>
          );
        }
      });
    // }
  
    return baseColumns;
  };

    // Handle equipment item click
  const handleEquipmentClick = (equipmentName: string) => {
    setSelectedEquipment(equipmentName);
    setEquipmentDrawerOpen(true);
  };

  const handleCloseEquipmentDrawer = () => {
    setEquipmentDrawerOpen(false);
    setSelectedEquipment(null);
  };

  const equipmentColumns: GridColDef[] = [
    { field: "asDate", headerName: "Date", width: 120 },
    { field: "projectName", headerName: "Project Name", width: 250 },
    { field: "district", headerName: "District", width: 150 },
    { field: "center", headerName: "Center", width: 200, flex: 1 },
    { 
      field: "Minilap Kits", 
      headerName: "Minilap Kits", 
      width: 120,
      renderCell: (params: any) => (
        <Typography 
          sx={{ 
            color: params.value === 'Good' ? '#4CAF50' : 
                  params.value === 'Satisfactory' ? '#FFC107' : 
                  params.value === 'Poor' ? '#F44336' : '#9E9E9E',
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: "IUD Kits", 
      headerName: "IUD Kits", 
      width: 120,
      renderCell: (params: any) => (
        <Typography 
          sx={{ 
            color: params.value === 'Good' ? '#4CAF50' : 
                  params.value === 'Satisfactory' ? '#FFC107' : 
                  params.value === 'Poor' ? '#F44336' : '#9E9E9E',
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: "BP Apparatus", 
      headerName: "BP Apparatus", 
      width: 120,
      renderCell: (params: any) => (
        <Typography 
          sx={{ 
            color: params.value === 'Good' ? '#4CAF50' : 
                  params.value === 'Satisfactory' ? '#FFC107' : 
                  params.value === 'Poor' ? '#F44336' : '#9E9E9E',
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: "Stethoscope", 
      headerName: "Stethoscope", 
      width: 120,
      renderCell: (params: any) => (
        <Typography 
          sx={{ 
            color: params.value === 'Good' ? '#4CAF50' : 
                  params.value === 'Satisfactory' ? '#FFC107' : 
                  params.value === 'Poor' ? '#F44336' : '#9E9E9E',
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: "Thermometer", 
      headerName: "Thermometer", 
      width: 120,
      renderCell: (params: any) => (
        <Typography 
          sx={{ 
            color: params.value === 'Good' ? '#4CAF50' : 
                  params.value === 'Satisfactory' ? '#FFC107' : 
                  params.value === 'Poor' ? '#F44336' : '#9E9E9E',
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: "Weighting Machine", 
      headerName: "Weighting Machine", 
      width: 140,
      renderCell: (params: any) => (
        <Typography 
          sx={{ 
            color: params.value === 'Good' ? '#4CAF50' : 
                  params.value === 'Satisfactory' ? '#FFC107' : 
                  params.value === 'Poor' ? '#F44336' : '#9E9E9E',
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: "Stove", 
      headerName: "Stove", 
      width: 100,
      renderCell: (params: any) => (
        <Typography 
          sx={{ 
            color: params.value === 'Good' ? '#4CAF50' : 
                  params.value === 'Satisfactory' ? '#FFC107' : 
                  params.value === 'Poor' ? '#F44336' : '#9E9E9E',
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: "OT Lights", 
      headerName: "OT Lights", 
      width: 120,
      renderCell: (params: any) => (
        <Typography 
          sx={{ 
            color: params.value === 'Good' ? '#4CAF50' : 
                  params.value === 'Satisfactory' ? '#FFC107' : 
                  params.value === 'Poor' ? '#F44336' : '#9E9E9E',
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: "Hydrolic Table", 
      headerName: "Hydrolic Table", 
      width: 130,
      renderCell: (params: any) => (
        <Typography 
          sx={{ 
            color: params.value === 'Good' ? '#4CAF50' : 
                  params.value === 'Satisfactory' ? '#FFC107' : 
                  params.value === 'Poor' ? '#F44336' : '#9E9E9E',
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: "Autoclave", 
      headerName: "Autoclave", 
      width: 120,
      renderCell: (params: any) => (
        <Typography 
          sx={{ 
            color: params.value === 'Good' ? '#4CAF50' : 
                  params.value === 'Satisfactory' ? '#FFC107' : 
                  params.value === 'Poor' ? '#F44336' : '#9E9E9E',
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: "Oxygen Cylinder", 
      headerName: "Oxygen Cylinder", 
      width: 140,
      renderCell: (params: any) => (
        <Typography 
          sx={{ 
            color: params.value === 'Good' ? '#4CAF50' : 
                  params.value === 'Satisfactory' ? '#FFC107' : 
                  params.value === 'Poor' ? '#F44336' : '#9E9E9E',
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: "Aspirating Pumps", 
      headerName: "Aspirating Pumps", 
      width: 150,
      renderCell: (params: any) => (
        <Typography 
          sx={{ 
            color: params.value === 'Good' ? '#4CAF50' : 
                  params.value === 'Satisfactory' ? '#FFC107' : 
                  params.value === 'Poor' ? '#F44336' : '#9E9E9E',
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: "Wheel Chair", 
      headerName: "Wheel Chair", 
      width: 120,
      renderCell: (params: any) => (
        <Typography 
          sx={{ 
            color: params.value === 'Good' ? '#4CAF50' : 
                  params.value === 'Satisfactory' ? '#FFC107' : 
                  params.value === 'Poor' ? '#F44336' : '#9E9E9E',
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: "Stretcher", 
      headerName: "Stretcher", 
      width: 120,
      renderCell: (params: any) => (
        <Typography 
          sx={{ 
            color: params.value === 'Good' ? '#4CAF50' : 
                  params.value === 'Satisfactory' ? '#FFC107' : 
                  params.value === 'Poor' ? '#F44336' : '#9E9E9E',
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: "Generators", 
      headerName: "Generators", 
      width: 120,
      renderCell: (params: any) => (
        <Typography 
          sx={{ 
            color: params.value === 'Good' ? '#4CAF50' : 
                  params.value === 'Satisfactory' ? '#FFC107' : 
                  params.value === 'Poor' ? '#F44336' : '#9E9E9E',
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: "Screen", 
      headerName: "Screen", 
      width: 100,
      renderCell: (params: any) => (
        <Typography 
          sx={{ 
            color: params.value === 'Good' ? '#4CAF50' : 
                  params.value === 'Satisfactory' ? '#FFC107' : 
                  params.value === 'Poor' ? '#F44336' : '#9E9E9E',
            fontWeight: 500
          }}
        >
          {params.value}
        </Typography>
      )
    },
  ];

  const attendanceData = [
    {
      label: "All Staff",
      count: stats.totalStaff.toString(),
      percentage: "100%",
      color: "#2196F3",
      borderLeft: "none",
    },
    {
      label: "Present",
      count: stats.presentCount.toString(),
      percentage: `${stats.presentPercentage.toFixed(2)}%`,
      color: "#4CAF50",
      borderLeft: "5px solid #4CAF50",
    },
    {
      label: "Absent",
      count: stats.absentCount.toString(),
      percentage: `${stats.absentPercentage.toFixed(2)}%`,
      color: "#F44336",
      borderLeft: "5px solid #F44336",
    },
    {
      label: "Vacant",
      count: stats.vacantCount.toString(),
      percentage: `${stats.vacantPercentage.toFixed(2)}%`,
      color: "#9E9E9E",
      borderLeft: "5px solid #9E9E9E",
    },
    {
      label: "Leave",
      count: stats.leaveCount.toString(),
      percentage: `${stats.leavePercentage.toFixed(2)}%`,
      color: "#FF9800",
      borderLeft: "5px solid #FF9800",
    },
  ] as const;

  // Get SDP data from Redux state and add photos field
  const sdpData = {
    "RHS-A": (PWDdashboard.RHSAOpenCloseRecord || []).map((item: any, index: number) => ({
      ...item,
      id: index,
      photos: item.Photos || item.photos || item.Photo || item.ImageName || ''
    })),
    MSU: (PWDdashboard.MSUOpenCloseRecord || []).map((item: any, index: number) => ({
      ...item,
      id: index,
      photos: item.Photos || item.photos || item.Photo || item.ImageName || ''
    })),
    FWC: (PWDdashboard.FWCOpenCloseRecord || []).map((item: any, index: number) => ({
      ...item,
      id: index,
      photos: item.Photos || item.photos || item.Photo || item.ImageName || ''
    })),
  };

  useEffect(() => {
    // Parse attendance records from Redux
    const attendanceRecords: AttendanceRecord[] =
      PWDdashboard.attendanceRecord || [];

    const parsed: ParsedRow[] = attendanceRecords.map((record, index) => ({
      id: index,
      date: record.asDate,
      district: record.District,
      center: record.Center,
      wmo: record["Women Medical Officer"],
      aa: record["Accounts Assistant"],
      tn: record["Theater Nurse"],
      ott: record["O.T Technician"],
      fwcouncilor: record["Family Welfare Councilor"],
      fww: record["Family Welfare Worker"],
      fwwa: record["Family Welfare Worker Assistant"],
      driver: record.Driver,
      help: record.Help,
      sweep: record.Sweep,
    }));

    setParsedData(parsed);

    // Group attendance data by status and position
    const statuses: AttendanceStatus[] = [
      "present",
      "absent",
      "vacant",
      "leave",
    ];
    const grouped: Record<
      AttendanceStatus,
      Record<
        PositionKey,
        {
          id: string | number;
          district: string;
          center: string;
          status: AttendanceStatus;
        }[]
      >
    > = {
      present: {
        wmo: [],
        aa: [],
        tn: [],
        ott: [],
        fwcouncilor: [],
        fww: [],
        fwwa: [],
        driver: [],
        help: [],
        sweep: [],
      },
      absent: {
        wmo: [],
        aa: [],
        tn: [],
        ott: [],
        fwcouncilor: [],
        fww: [],
        fwwa: [],
        driver: [],
        help: [],
        sweep: [],
      },
      vacant: {
        wmo: [],
        aa: [],
        tn: [],
        ott: [],
        fwcouncilor: [],
        fww: [],
        fwwa: [],
        driver: [],
        help: [],
        sweep: [],
      },
      leave: {
        wmo: [],
        aa: [],
        tn: [],
        ott: [],
        fwcouncilor: [],
        fww: [],
        fwwa: [],
        driver: [],
        help: [],
        sweep: [],
      },
    };

    statuses.forEach((status) => {
      positions.forEach((pos) => {
        grouped[status][pos] = parsed
          .filter((row) => row[pos]?.toLowerCase() === status)
          .map((row) => ({
            id: `${row.id}-${pos}-${status}`,
            district: row.district,
            center: row.center,
            status: status,
          }));
      });
    });

    setGroupedAttendance(grouped);
  }, [PWDdashboard.attendanceRecord]);

  const allStaffColumns: GridColDef<ParsedRow>[] = [
    { field: "date", headerName: "Date", width: 150 },
    { field: "district", headerName: "Name of District", width: 150 },
    { field: "center", headerName: "Center Name", width: 300, flex: 1 },
    ...(positions.map((pos) => ({
      field: pos as any,
      headerName: positionNames[pos],
      width: 200,
    })) as any),
  ];

  const statusColumns: GridColDef[] = [
    { field: "district", headerName: "Name of District", width: 200 },
    { field: "center", headerName: "Center Name", width: 400, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      valueGetter: () =>
        selectedAttendance
          ? selectedAttendance.charAt(0).toUpperCase() +
            selectedAttendance.slice(1)
          : "N/A",
    },
  ];

  // Filter equipment grid data for selected equipment - exclude N/A records
  const filteredEquipmentGridData = React.useMemo(() => {
    if (!selectedEquipment || !equipmentGridData.length) return [];
    
    return equipmentGridData
      .filter(item => {
        const equipmentCondition = item[selectedEquipment];
        return equipmentCondition && equipmentCondition !== 'N/A';
      })
      .map((item, index) => ({
        ...item,
        id: index, // Add unique id for DataGrid
      }));
  }, [selectedEquipment, equipmentGridData]);

  const handlePieClick = (
    entry: any,
    _index: number,
    _event: any,
    sdpType: "RHS-A" | "MSU" | "FWC"
  ) => {
    const clickedStatus = entry?.name as "Open" | "Close" | undefined;
    setSelectedSdp(sdpType);
    setSelectedStatus(clickedStatus ?? null);
    setSdpDrawerOpen(true);
  };

  const handleAttendanceClick = (
    attendanceType: AttendanceStatus | "All Staff"
  ) => {
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

  const handleLinearProgressClick = (event: React.MouseEvent, equipmentName: string) => {
    event.stopPropagation(); // Prevent triggering the parent click
    handleEquipmentClick(equipmentName);
  };


  // Render pie chart based on SDP type with different sizes
  const renderPieChart = (sdpType: "FWC" | "MSU" | "RHS-A", isSingleChart: boolean = false) => {
    const dataMap = {
      "FWC": PWDdashboard.FWCOpenClose,
      "MSU": PWDdashboard.MSUOpenClose,
      "RHS-A": PWDdashboard.RHSAOpenClose
    };

    const colorMap = {
      "FWC": COLORS,
      "MSU": COLORS2,
      "RHS-A": COLORS3
    };

    const data = dataMap[sdpType];
    const colors = colorMap[sdpType];

    // Size configuration for single vs multiple charts
    const chartSize = isSingleChart ? {
      containerWidth: "60%", // Bigger container for single chart
      innerRadius: 35, // Bigger inner radius
      outerRadius: 70, // Bigger outer radius
      fontSize: "12px" // Bigger font for label
    } : {
      containerWidth: "25%", // Normal size for multiple charts
      innerRadius: 17,
      outerRadius: 33,
      fontSize: "10px"
    };

    return (
      <Box sx={{ width: chartSize.containerWidth, height: isSingleChart ? "100%" : "80%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={chartSize.innerRadius}
              outerRadius={chartSize.outerRadius}
              startAngle={-90}
              fill="#82ca9d"
              onClick={(entry, index, event) =>
                handlePieClick(entry, index, event, sdpType)
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.color || colors[index % colors.length]
                  }
                />
              ))}
            </Pie>
            <ReToolTip
              content={(props: any) => (
                <CustomTooltip 
                  {...props} 
                  total={data.reduce((sum, item) => sum + item.value, 0)} 
                />
              )}
            />
          </RePieChart>
        </ResponsiveContainer>
        <Box sx={{ textAlign: "center", mt: isSingleChart ? 1 : 0 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: chartSize.fontSize, color: "gray", fontWeight: isSingleChart ? 600 : "normal" }}
          >
            {sdpType}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: isMobile ? 0.5 : "2px",
        maxWidth: "100%",
        overflowX: "hidden",
        marginBottom: "20px",
      }}
    >
      <Grid
        container
        spacing={isMobile ? 0.5 : isTablet ? 2 : 3}
        alignItems="stretch"
        sx={{ flexWrap: isMobile ? "wrap" : "nowrap" }}
      >
        <Grid
          {...({ item: true, xs: 12, sm: 12, md: 4, lg: 4 } as any)}
          sx={{ width: isMobile ? "100%" : "40%" }}
        >
          <HealthMetricsCard />
          <Box sx={{ position: "relative" }}>
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
              <CardContent sx={{ flexGrow: 1, p: isMobile ? 1 : 2 }}>
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
                  {filteredEquipmentData.length > 0 ? (
                    filteredEquipmentData.map((item, index) => (
                      <Box key={index} sx={{ mb: 0.3 }}>
                        <Box
                          sx={{ display: "flex", justifyContent: "space-between" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              width: 180,
                              fontSize: "0.75rem",
                              color: "gray",
                              paddingTop: "7px",
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "end",
                              justifyContent: "end",
                              marginBottom: "2px",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 600,
                                color: "black",
                                fontSize: "13px",
                                paddingTop: "7px",
                              }}
                            >
                              {item.percentage}%
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ position: "relative", height: "8px" }}
                        onClick={(e) => handleLinearProgressClick(e, item.name)}>
                          <LinearProgress
                            variant="determinate"
                            value={item.percentage}
                            sx={{
                              height: "8px",
                              borderRadius: "4px",
                              backgroundColor: theme.palette.grey[200],
                              "& .MuiLinearProgress-bar": {
                                borderRadius: "4px",
                                backgroundColor: item.color || "#4caf50",
                              },
                              cursor: 'pointer',
                            }}
                          />
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        height: '100%',
                        flexDirection: 'column'
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No equipment data available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Rest of the code remains the same */}
        <Grid
          {...({ item: true, xs: 12, sm: 12, md: 6, lg: 6 } as any)}
          sx={{ width: isMobile ? "100%" : "36.5%" }}
        >
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              height: "300px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: isMobile ? 1 : 2 }}>
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
                  fontSize: isMobile ? 14 : 16,
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
                {/* Show Statisticscard only when showing all SDPs */}
                {sdpToShow === "all" && (
                  <>
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
                  </>
                )}
                
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                    height: sdpToShow === "all" ? "40%" : "85%",
                    flexWrap: isMobile ? "wrap" : "nowrap",
                    alignItems: "center",
                  }}
                >
                  {/* Show pie charts based on sdpToShow */}
                  {sdpToShow === "all" ? (
                    // Show all pie charts (normal size)
                    <>
                      {renderPieChart("FWC", false)}
                      {renderPieChart("MSU", false)}
                      {renderPieChart("RHS-A", false)}
                    </>
                  ) : sdpToShow === "FWC" ? (
                    // Show only FWC (bigger size)
                    renderPieChart("FWC", true)
                  ) : sdpToShow === "MSU" ? (
                    // Show only MSU (bigger size)
                    renderPieChart("MSU", true)
                  ) : sdpToShow === "RHS-A" ? (
                    // Show only RHS-A (bigger size)
                    renderPieChart("RHS-A", true)
                  ) : null}
                </Box>
              </Box>
            </CardContent>
          </Card>
          {/* Rest of the building status card remains the same */}
          <Box sx={{ position: "relative" }}>
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
              <CardContent sx={{ flexGrow: 1, p: isMobile ? 1 : 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 3,
                    color: "text.primary",
                    textAlign: "left",
                    fontFamily: "inherit",
                    fontSize: isMobile ? 14 : 16,
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
                      {PWDdashboard?.GovernmentPercentage}%
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
                      {PWDdashboard?.RentedPercentage}%
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
                      {PWDdashboard?.PVTPercentage}%
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
                      {PWDdashboard?.IndicationPercentage}%
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
                      {PWDdashboard?.ElectricityPercentage}%
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
                      {PWDdashboard?.GasPercentage}%
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
                      {PWDdashboard?.WaterPercentage}%
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
                      {PWDdashboard?.CleanessPercentage}%
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
                      {PWDdashboard?.BrandedPercentage}%
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
                      {PWDdashboard?.UnbrandedPercentage}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Rest of the attendance section remains the same */}
        <Grid
          {...({ item: true, xs: 12, sm: 12, md: 4, lg: 4 } as any)}
          sx={{ width: isMobile ? "100%" : "23.5%" }}
        >
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: isMobile ? 1 : 2 }}>
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
              {isMobile ? (
                // Mobile layout: First card full width, then 2 cards per row
                <Box sx={{ width: "100%" }}>
                  {/* First card - All Staff - Full width */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                      p: 1.5,
                      background: "rgba(255,255,255,0.7)",
                      borderRadius: 2,
                      boxShadow: "1px 1px 8px -1px rgb(160 160 160)",
                      borderLeft: attendanceData[0].borderLeft,
                      width: "100%",
                      cursor: "pointer",
                      mb: 1.5,
                    }}
                    onClick={() => handleAttendanceClick(attendanceData[0].label as any)}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600 }}
                      >
                        {attendanceData[0].label}
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: attendanceData[0].color }}
                      >
                        {attendanceData[0].count}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Remaining cards - 2 per row */}
                  <Grid container spacing={1}>
                    {attendanceData.slice(1).map((item, index) => (
                      <Grid {...({ item: true, xs: 6 } as any)} key={index + 1}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                            p: 1.5,
                            background: "rgba(255,255,255,0.7)",
                            borderRadius: 2,
                            boxShadow: "1px 1px 8px -1px rgb(160 160 160)",
                            borderLeft: item.borderLeft,
                            width: "100%",
                            cursor: "pointer",
                            height: "100%",
                          }}
                          onClick={() => handleAttendanceClick(item.label as any)}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                            >
                              {item.label}
                            </Typography>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              sx={{ color: item.color, fontSize: "0.875rem" }}
                            >
                              {item.percentage}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary", fontSize: "0.65rem" }}
                            >
                              Count: {item.count}
                            </Typography>
                            <Box sx={{ width: "100%" }}>
                              <LinearProgress
                                variant="determinate"
                                value={parseFloat(item.percentage)}
                                sx={{
                                  height: 4,
                                  borderRadius: 3,
                                  backgroundColor: theme.palette.grey[200],
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor: item.color,
                                    borderRadius: 3,
                                  },
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : (
                // Desktop layout - original
                <Grid
                  container
                  spacing={isMobile ? 1 : 2}
                  sx={{ height: "auto", justifyContent: "center", width: "100%" }}
                >
                  <Grid
                    {...({ item: true, xs: 12, sm: 6, md: 12 } as any)}
                    sx={{ width: "100%" }}
                  >
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
                            cursor: "pointer",
                          }}
                          onClick={() => handleAttendanceClick(item.label as any)}
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
                              {item.label === "All Staff" ? item.count : item.percentage}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            {item.label !== "All Staff" && (
                              <>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "text.secondary" }}
                                >
                                  Count: {item.count}
                                </Typography>
                                <Box sx={{ width: "60%" }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={parseFloat(item.percentage)}
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
                              </>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Rest of the drawer components remain the same */}
      <Drawer
        anchor="right"
        open={sdpDrawerOpen}
        onClose={handleCloseSdpDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: selectedStatus === "Close" ? "90%" : "80%",
            maxWidth: selectedStatus === "Close" ? 1200 : 800,
            p: 4,
            maxHeight: "100vh",
            overflow: "auto",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            pb: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6">
            {selectedSdp} - SDP Status Details - {selectedStatus || "All"}
            {selectedStatus === "Close" && " (with Images)"}
          </Typography>
          <IconButton onClick={handleCloseSdpDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        {selectedSdp && (
          <>
            <div style={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={(sdpData[selectedSdp] || []).filter(
                  (row) => !selectedStatus || row.status === selectedStatus
                )}
                columns={getSdpColumns(selectedStatus)}
                getRowId={(row) =>
                  `${row.district}-${row.centerName}-${row.status}-${row.id}`
                }
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
              />
            </div>
            <Box sx={{ mt: 2 }}>
              <Typography>
                Open:{" "}
                {
                  (sdpData[selectedSdp] || []).filter(
                    (r) => r.status === "Open"
                  ).length
                }
                , Closed:{" "}
                {
                  (sdpData[selectedSdp] || []).filter(
                    (r) => r.status === "Close"
                  ).length
                }
                , Percentage:{" "}
                {(
                  ((sdpData[selectedSdp] || []).filter(
                    (r) => r.status === "Open"
                  ).length /
                    (sdpData[selectedSdp] || []).length) *
                  100
                ).toFixed(2)}
                %
              </Typography>
            </Box>
          </>
        )}
      </Drawer>

      <Drawer
          anchor="right"
          open={attendanceDrawerOpen}
          onClose={handleCloseAttendanceDrawer}
          sx={{
            "& .MuiDrawer-paper": {
              width: "80%",
              maxWidth: 1200,
              p: 4,
              maxHeight: "100vh",
              overflow: "auto",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              pb: 2,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="h6">
              {selectedAttendance === "All Staff"
                ? "All Staff"
                : selectedAttendance
                ? selectedAttendance.charAt(0).toUpperCase() +
                  selectedAttendance.slice(1)
                : ""}{" "}
              - Detailed Breakdown
            </Typography>
            <IconButton onClick={handleCloseAttendanceDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {selectedAttendance === "All Staff" ? (
            <div style={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={parsedData}
                columns={allStaffColumns as GridColDef[]}
                pageSizeOptions={[10, 25, 50]}
                disableRowSelectionOnClick
              />
            </div>
          ) : (
            <>
              {selectedAttendance && (
                <Typography
                  variant="body2"
                  sx={{ mb: 2, color: "text.secondary" }}
                >
                  Total Records for{" "}
                  {selectedAttendance.charAt(0).toUpperCase() +
                    selectedAttendance.slice(1)}
                  :{" "}
                  {Object.values(
                    groupedAttendance[
                      selectedAttendance.toLowerCase() as AttendanceStatus
                    ] || {}
                  ).reduce(
                    (acc: any, posData: any) => acc + (posData?.length || 0),
                    0
                  )}
                </Typography>
              )}
              
              {/* Only show positions that have records */}
              {(positions as PositionKey[]).map((pos) => {
                const statusKey = (
                  selectedAttendance as string
                )?.toLowerCase() as AttendanceStatus;
                const positionData =
                  (groupedAttendance[statusKey] || {})[pos] || [];
                
                // Only render if there are records for this position
                if (positionData.length === 0) {
                  return null;
                }
                
                return (
                  <Box key={pos} sx={{ mb: 4 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 1, fontWeight: "bold" }}
                    >
                      {positionNames[pos]} -{" "}
                      {selectedAttendance
                        ? selectedAttendance.charAt(0).toUpperCase() +
                          selectedAttendance.slice(1)
                        : ""}{" "}
                      ({positionData.length} records)
                    </Typography>
                    <div style={{ height: 300, width: "100%" }}>
                      <DataGrid
                        rows={positionData}
                        columns={statusColumns}
                        pageSizeOptions={[5, 10, 25]}
                        disableRowSelectionOnClick
                      />
                    </div>
                  </Box>
                );
              })}
              
              {/* Show message if no records found for any position */}
              {selectedAttendance && 
                Object.values(
                  groupedAttendance[
                    selectedAttendance.toLowerCase() as AttendanceStatus
                  ] || {}
                ).every((posData: any) => posData.length === 0) && (
                <Typography
                  variant="body1"
                  sx={{ 
                    textAlign: "center", 
                    color: "text.secondary",
                    mt: 4
                  }}
                >
                  No records found for {selectedAttendance} status
                </Typography>
              )}
            </>
          )}
        </Drawer>

        <Drawer
        anchor="right"
        open={equipmentDrawerOpen}
        onClose={handleCloseEquipmentDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: "80%",
            maxWidth: 1000,
            p: 4,
            maxHeight: "100vh",
            overflow: "auto",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            pb: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6">
            {selectedEquipment} - Condition Details ({filteredEquipmentGridData.length} records)
          </Typography>
          <IconButton onClick={handleCloseEquipmentDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        {filteredEquipmentGridData.length > 0 ? (
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={filteredEquipmentGridData}
              columns={getEquipmentColumns(selectedEquipment!)}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell': {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: theme.palette.grey[100],
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
              }}
            />
          </div>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '200px',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Data Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No records found for {selectedEquipment} with available condition data.
            </Typography>
          </Box>
        )}
      </Drawer>

      {/* Image Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={handleCloseImageDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          m: 0, 
          p: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseImageDialog}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: 'center', p: 3 }}>
          {imageError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {imageError}
            </Alert>
          )}
          
          {loadingImage ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ ml: 2 }}>
                Loading image...
              </Typography>
            </Box>
          ) : currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt="SDP Center"
              style={{ 
                maxWidth: '100%', 
                maxHeight: '70vh', 
                objectFit: 'contain' 
              }}
              onError={() => setImageError('Failed to display image')}
            />
          ) : null}
          
          <Box sx={{ mt: 2 }}>
            <Button 
              onClick={handleCloseImageDialog} 
              variant="contained"
              color="primary"
            >
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
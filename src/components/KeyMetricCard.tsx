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
import Statisticscard from "./Statisticscard";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

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

// Define columns for DataGrid
const sdpColumns: GridColDef[] = [
  { field: "district", headerName: "District", width: 150 },
  { field: "sdpType", headerName: "SDP Type", width: 200 },
  { field: "centerName", headerName: "Center Name", flex: 1 },
  { field: "status", headerName: "Status", width: 100 },
];

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
  const PWDdashboard = useSelector((state: RootState) => state.PWDINITSLICE);

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

  // Get SDP data from Redux state
  const sdpData = {
    "RHS-A": PWDdashboard.RHSAOpenCloseRecord || [],
    MSU: PWDdashboard.MSUOpenCloseRecord || [],
    FWC: PWDdashboard.FWCOpenCloseRecord || [],
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
                filter: "blur(2px)",
                opacity: 0.6,
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
                  {dataset.map((item, index) => (
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
                          {item.month}
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
                              backgroundColor: "#4caf50",
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // backgroundColor: "#f4f4f4",
                zIndex: 1,
                filter: "blur(2px)",
              }}
            >
              {/* <Typography variant="h6" color="text.secondary">
              Coming Soon
              </Typography> */}
            </Box>
          </Box>
        </Grid>

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
                    height: "40%",
                    flexWrap: isMobile ? "wrap" : "nowrap",
                  }}
                >
                  <Box sx={{ width: "25%", height: "80%" }}>
                    <ResponsiveContainer>
                      <RePieChart>
                        <Pie
                          data={PWDdashboard.FWCOpenClose}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={17}
                          outerRadius={33}
                          startAngle={-90}
                          fill="#82ca9d"
                          onClick={(entry, index, event) =>
                            handlePieClick(entry, index, event, "FWC")
                          }
                        >
                          {PWDdashboard.FWCOpenClose.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.color || COLORS[index % COLORS.length]
                              }
                            />
                          ))}
                        </Pie>
                        <ReToolTip
                          content={(props: any) => (
                            <CustomTooltip 
                              {...props} 
                              total={PWDdashboard.FWCOpenClose.reduce((sum, item) => sum + item.value, 0)} 
                            />
                          )}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="caption"
                        sx={{ fontSize: "10px", color: "gray" }}
                      >
                        FWC
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ width: "25%", height: "80%" }}>
                    <ResponsiveContainer>
                      <RePieChart>
                        <Pie
                          data={PWDdashboard.MSUOpenClose}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={17}
                          outerRadius={33}
                          startAngle={-90}
                          fill="#82ca9d"
                          onClick={(entry, index, event) =>
                            handlePieClick(entry, index, event, "MSU")
                          }
                        >
                          {PWDdashboard.MSUOpenClose.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.color || COLORS2[index % COLORS2.length]
                              }
                            />
                          ))}
                        </Pie>
                        <ReToolTip
                          content={(props: any) => (
                            <CustomTooltip 
                              {...props} 
                              total={PWDdashboard.MSUOpenClose.reduce((sum, item) => sum + item.value, 0)} 
                            />
                          )}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="caption"
                        sx={{ fontSize: "10px", color: "gray" }}
                      >
                        MSU
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ width: "25%", height: "80%" }}>
                    <ResponsiveContainer>
                      <RePieChart>
                        <Pie
                          data={PWDdashboard.RHSAOpenClose}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={17}
                          outerRadius={33}
                          startAngle={-90}
                          fill="#82ca9d"
                          onClick={(entry, index, event) =>
                            handlePieClick(entry, index, event, "RHS-A")
                          }
                        >
                          {PWDdashboard.RHSAOpenClose.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.color || COLORS3[index % COLORS3.length]
                              }
                            />
                          ))}
                        </Pie>
                        <ReToolTip
                          content={(props: any) => (
                            <CustomTooltip 
                              {...props} 
                              total={PWDdashboard.RHSAOpenClose.reduce((sum, item) => sum + item.value, 0)} 
                            />
                          )}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="caption"
                        sx={{ fontSize: "10px", color: "gray" }}
                      >
                        RHS-A
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
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
                filter: "blur(3px)",
                opacity: 0.6,
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
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // backgroundColor: "#f4f4f4",
                zIndex: 1,
                filter: "blur(3px)",
              }}
            >
              {/* <Typography variant="h6" color="text.secondary">
                Coming Soon
              </Typography> */}
            </Box>
          </Box>
        </Grid>

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
                        {attendanceData[0].percentage}
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
                        Count: {attendanceData[0].count}
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

      <Drawer
        anchor="right"
        open={sdpDrawerOpen}
        onClose={handleCloseSdpDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: "80%",
            maxWidth: 800,
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
                columns={sdpColumns}
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
            {(positions as PositionKey[]).map((pos) => {
              const statusKey = (
                selectedAttendance as string
              )?.toLowerCase() as AttendanceStatus;
              const positionData =
                (groupedAttendance[statusKey] || {})[pos] || [];
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
          </>
        )}
      </Drawer>
    </Box>
  );
}
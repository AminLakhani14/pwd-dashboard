import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  MenuItem,
  useMediaQuery,
  useTheme,
  Card,
  Alert,
  Collapse,
  IconButton,
  Drawer,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyMetricCard from "../components/KeyMetricCard";
import StockStatusDashboard from "../components/StockStatusDashboard";
import IecChart from "../components/iECChart";
import { PieChart } from "@mui/x-charts";
import StackBars from "../components/StackBars";
import CloseIcon from "@mui/icons-material/Close";
import {
  CenterDropdown,
  dynamicAPI,
  MonitoringVisitsReportAPI,
  OfficerVisitReportAPI,
  SdpDropdown,
  SldieoutAPI,
  StaffPositionAPI,
  StockOfContraceptiveAPI,
  DetailStockOfContraceptiveAPI,
  EquiptmentPositionDetailAPI,
  TechnicalMonitoringDetailAPI,
  TechnicalMonitoringStockAPI,
  EquiptmentPositionStockAPI,
  PerformaceOfSdpAPI,
  IECMatrialDetailAPI,
  IECMatrialStockAPI,
  StatusOfBuildingAPI,
} from "../Service/Init";
import { useAppDispatch } from "../app/Hooks";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { updateStates } from "../Slice/InitSlice";
import "../index.css";
import { ToDatabaseFormat } from "../Global/globalFunctions";
import ReportData from "../components/ReportData";

// Add this import for the data grid
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const Dashboard = () => {
  const theme = useTheme();
  const PWDdashboard = useSelector((state: RootState) => state.PWDINITSLICE);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    // Log the structure of first item if available
    if (PWDdashboard.technicalGridData && PWDdashboard.technicalGridData.length > 0) {
    }
  }, [PWDdashboard.technicalGridData, PWDdashboard.buildingStatusData]);

  const getPreviousMonthDateRange = () => {
    const now = new Date();
    const firstDayOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const lastDayOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0
    );

    return {
      startDate: firstDayOfPreviousMonth.toLocaleDateString("en-US"),
      endDate: lastDayOfPreviousMonth.toLocaleDateString("en-US"),
      month: now.getMonth().toString(),
      year: now.getFullYear().toString(),
    };
  };

  const previousMonthRange = getPreviousMonthDateRange();

  const [filters, setFilters] = useState({
    month: previousMonthRange.month,
    year: previousMonthRange.year,
    sdpType: "",
    district: "1",
    center: "1",
  });

  const [currentFormattedDates, setCurrentFormattedDates] = useState({
    start: formatDate(previousMonthRange.startDate),
    end: formatDate(previousMonthRange.endDate),
  });

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const ordinal = (d: number) => {
      if (d > 3 && d < 21) return d + 'th';
      switch (d % 10) {
        case 1: return d + "st";
        case 2: return d + "nd";
        case 3: return d + "rd";
        default: return d + "th";
      }
    };
    return `${ordinal(day)} ${month} ${year}`;
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open2, setOpen2] = useState(true);
  const dispatch = useAppDispatch();

  // Month options with ALL option
  const months = [
    { value: "ALL", label: "All Months" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Year options (last 5 years and current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) =>
    (currentYear - i).toString()
  );

  // Function to get first and last day of the month or year
  const getDateRange = (month: string, year: string) => {
    if (!month || !year) return { startDate: "", endDate: "" };

    const yearNum = parseInt(year);

    if (month === "ALL") {
      // For ALL option: January 1st to December 31st of selected year
      const startDate = new Date(yearNum, 0, 1); // January 1st
      const endDate = new Date(yearNum, 11, 31); // December 31st

      return {
        startDate: startDate.toLocaleDateString("en-US"),
        endDate: endDate.toLocaleDateString("en-US"),
      };
    } else {
      // For specific month: 1st to last day of the month
      const monthNum = parseInt(month);
      const startDate = new Date(yearNum, monthNum - 1, 1);
      const endDate = new Date(yearNum, monthNum, 0);

      return {
        startDate: startDate.toLocaleDateString("en-US"),
        endDate: endDate.toLocaleDateString("en-US"),
      };
    }
  };

  const handlePieChartClick = (
    _event: React.MouseEvent,
    params: { dataIndex?: number }
  ) => {
    if (
      params?.dataIndex === undefined ||
      !PWDdashboard.buildingStatusData?.length ||
      !PWDdashboard.technicalGridData?.length
    )
      return;

    const clickedIdx = params.dataIndex;
    const clickedSegment = PWDdashboard.buildingStatusData[clickedIdx];
    const clickedLabel = clickedSegment?.label?.trim(); // e.g. "Decontamination"

    if (!clickedLabel) return;

    setSelectedCategory(clickedLabel);

    const raw = PWDdashboard.technicalGridData;

    // ---------------------------------------------------------
    // Keep ONLY rows that have a NON-EMPTY value for the column
    // ---------------------------------------------------------
    const filtered = raw.filter((row: any) => {
      const val = row[clickedLabel];
      return val != null && val !== "";
    });

    setFilteredData(filtered);
    setDrawerOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value }: any = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "SDPdropdownValue" && value) {
      dispatch(SdpDropdown(value));
      dispatch(updateStates({ key: "centerValue", value: "0" }));
      dispatch(updateStates({ key: "centerDropdown", value: [] }));
    }

    if (name === "districtValue" && value) {
      dispatch(
        CenterDropdown({
          sdpType: PWDdashboard.SDPdropdownValue,
          value: value,
        })
      );
    }

    dispatch(updateStates({ key: name, value: value }));
  };

  const handleApplyFilters = async () => {
    handleClose();
    let districtData = PWDdashboard.SDPdropdownValue.split(",");

    // Get date range based on selected month and year
    const dateRange = getDateRange(filters.month, filters.year);
    dispatch(updateStates({ key: "isLoading", value: true }));

    setCurrentFormattedDates({
      start: formatDate(dateRange.startDate),
      end: formatDate(dateRange.endDate),
    });

    await dispatch(
      dynamicAPI({
        StartDate: ToDatabaseFormat(dateRange.startDate) || "",
        EndDate: ToDatabaseFormat(dateRange.endDate) || "",
        DistrictID: districtData[0] || "0",
        DistrictName: PWDdashboard.districtValue,
        CenterID: "",
        CenterName: PWDdashboard.centerValue,
        ProjectId: districtData[2] || "7122,7121,7120",
        QuestionId: "",
      })
    );

    await dispatch(
      SldieoutAPI({
        StartDate: ToDatabaseFormat(dateRange.startDate) || "",
        EndDate: ToDatabaseFormat(dateRange.endDate) || "",
        DistrictID: districtData[0] || "0",
        DistrictName: PWDdashboard.districtValue,
        CenterID: "",
        CenterName: PWDdashboard.centerValue,
        ProjectId: districtData[2] || "7122,7121,7120",
        QuestionId: "",
      })
    );

    await dispatch(
      StaffPositionAPI({
        StartDate: ToDatabaseFormat(dateRange.startDate) || "",
        EndDate: ToDatabaseFormat(dateRange.endDate) || "",
        DistrictID: districtData[0] || "0",
        DistrictName: PWDdashboard.districtValue,
        CenterID: "",
        CenterName: PWDdashboard.centerValue,
        ProjectId: districtData[2] || "7122,7121,7120",
        QuestionId: "",
      })
    );

    await dispatch(
       StockOfContraceptiveAPI({
        StartDate: ToDatabaseFormat(dateRange.startDate) || "",
        EndDate: ToDatabaseFormat(dateRange.endDate) || "",
        DistrictID: districtData[0] || "0",
        DistrictName: PWDdashboard.districtValue,
        CenterID: "",
        CenterName: PWDdashboard.centerValue,
        ProjectId: districtData[2] || "7122,7121,7120",
        QuestionId: "",
      })
    );
    

    await dispatch(OfficerVisitReportAPI());

    await dispatch(
      DetailStockOfContraceptiveAPI({
        StartDate: ToDatabaseFormat(dateRange.startDate) || "",
        EndDate: ToDatabaseFormat(dateRange.endDate) || "",
        DistrictID: districtData[0] || "0",
        DistrictName: PWDdashboard.districtValue,
        CenterID: "",
        CenterName: PWDdashboard.centerValue,
        ProjectId: districtData[2] || "7122,7121,7120",
        QuestionId: "",
      })
    );

    await dispatch(
      EquiptmentPositionDetailAPI({
        StartDate: ToDatabaseFormat(dateRange.startDate) || "",
        EndDate: ToDatabaseFormat(dateRange.endDate) || "",
        DistrictID: districtData[0] || "0",
        DistrictName: PWDdashboard.districtValue,
        CenterID: "",
        CenterName: PWDdashboard.centerValue,
        ProjectId: districtData[2] || "7122,7121,7120",
        QuestionId: "",
      })
    );

    await dispatch(
      EquiptmentPositionStockAPI({
        StartDate: ToDatabaseFormat(dateRange.startDate) || "",
        EndDate: ToDatabaseFormat(dateRange.endDate) || "",
        DistrictID: districtData[0] || "0",
        DistrictName: PWDdashboard.districtValue,
        CenterID: "",
        CenterName: PWDdashboard.centerValue,
        ProjectId: districtData[2] || "7122,7121,7120",
        QuestionId: "",
      })
    );

    await dispatch(
      TechnicalMonitoringDetailAPI({
        StartDate: ToDatabaseFormat(dateRange.startDate) || "",
        EndDate: ToDatabaseFormat(dateRange.endDate) || "",
        DistrictID: districtData[0] || "0",
        DistrictName: PWDdashboard.districtValue,
        CenterID: "",
        CenterName: PWDdashboard.centerValue,
        ProjectId: districtData[2] || "7122,7121,7120",
        QuestionId: "",
      })
    );

    await dispatch(
      TechnicalMonitoringStockAPI({
        StartDate: ToDatabaseFormat(dateRange.startDate) || "",
        EndDate: ToDatabaseFormat(dateRange.endDate) || "",
        DistrictID: districtData[0] || "0",
        DistrictName: PWDdashboard.districtValue,
        CenterID: "",
        CenterName: PWDdashboard.centerValue,
        ProjectId: districtData[2] || "7122,7121,7120",
        QuestionId: "",
      })
    );

    await dispatch(
      IECMatrialStockAPI({
        StartDate: ToDatabaseFormat(dateRange.startDate) || "",
        EndDate: ToDatabaseFormat(dateRange.endDate) || "",
        DistrictID: districtData[0] || "0",
        DistrictName: PWDdashboard.districtValue,
        CenterID: "",
        CenterName: PWDdashboard.centerValue,
        ProjectId: districtData[2] || "7122,7121,7120",
        QuestionId: "",
      })
    );

    await dispatch(
      IECMatrialDetailAPI({
        StartDate: ToDatabaseFormat(dateRange.startDate) || "",
        EndDate: ToDatabaseFormat(dateRange.endDate) || "",
        DistrictID: districtData[0] || "0",
        DistrictName: PWDdashboard.districtValue,
        CenterID: "",
        CenterName: PWDdashboard.centerValue,
        ProjectId: districtData[2] || "7122,7121,7120",
        QuestionId: "",
      })
    );

    await dispatch(
      PerformaceOfSdpAPI({
        StartDate: ToDatabaseFormat(dateRange.startDate) || "",
        EndDate: ToDatabaseFormat(dateRange.endDate) || "",
        DistrictID: districtData[0] || "0",
        DistrictName: PWDdashboard.districtValue,
        CenterID: "",
        CenterName: PWDdashboard.centerValue,
        ProjectId: districtData[2] || "7122,7121,7120",
        QuestionId: "",
      })
    );

    await dispatch(
      StatusOfBuildingAPI({
        StartDate: ToDatabaseFormat(dateRange.startDate) || "",
        EndDate: ToDatabaseFormat(dateRange.endDate) || "",
        DistrictID: districtData[0] || "0",
        DistrictName: PWDdashboard.districtValue,
        CenterID: "",
        CenterName: PWDdashboard.centerValue,
        ProjectId: districtData[2] || "7122,7121,7120",
        QuestionId: "",
      })
    );
    await dispatch(updateStates({ key: "isLoading", value: false }));

  };

  useEffect(() => {
    const fetchAllData = async () => {
      const defaultDateRange = getPreviousMonthDateRange();
      dispatch(updateStates({ key: "isLoading", value: true }));
  
      try {
        await Promise.all([
          dispatch(
            dynamicAPI({
              StartDate: ToDatabaseFormat(defaultDateRange.startDate) || "",
              EndDate: ToDatabaseFormat(defaultDateRange.endDate) || "",
              DistrictID: "",
              DistrictName: "",
              CenterID: "",
              CenterName: "",
              ProjectId: "7122,7121,7120",
              QuestionId: "",
            })
          ),
          dispatch(
            SldieoutAPI({
              StartDate: ToDatabaseFormat(defaultDateRange.startDate) || "",
              EndDate: ToDatabaseFormat(defaultDateRange.endDate) || "",
              DistrictID: "",
              DistrictName: "",
              CenterID: "",
              CenterName: "",
              ProjectId: "7122,7121,7120",
              QuestionId: "",
            })
          ),
          dispatch(
            StaffPositionAPI({
              StartDate: ToDatabaseFormat(defaultDateRange.startDate) || "",
              EndDate: ToDatabaseFormat(defaultDateRange.endDate) || "",
              DistrictID: "",
              DistrictName: "",
              CenterID: "",
              CenterName: "",
              ProjectId: "7122,7121,7120",
              QuestionId: "",
            })
          ),
          dispatch(
            MonitoringVisitsReportAPI({
              StartDate: ToDatabaseFormat(defaultDateRange.startDate) || "",
              EndDate: ToDatabaseFormat(defaultDateRange.endDate) || "",
              DistrictID: "",
              DistrictName: "",
              CenterID: "",
              CenterName: "",
              ProjectId: "7122,7121,7120",
              QuestionId: "",
            })
          ),
          dispatch(OfficerVisitReportAPI()),
          dispatch(
            StockOfContraceptiveAPI({
              StartDate: ToDatabaseFormat(defaultDateRange.startDate) || "",
              EndDate: ToDatabaseFormat(defaultDateRange.endDate) || "",
              DistrictID: "",
              DistrictName: "",
              CenterID: "",
              CenterName: "",
              ProjectId: "7122,7121,7120",
              QuestionId: "",
            })
          ),
          dispatch(
            DetailStockOfContraceptiveAPI({
              StartDate: ToDatabaseFormat(defaultDateRange.startDate) || "",
              EndDate: ToDatabaseFormat(defaultDateRange.endDate) || "",
              DistrictID: "",
              DistrictName: "",
              CenterID: "",
              CenterName: "",
              ProjectId: "7122,7121,7120",
              QuestionId: "",
            })
          ),
          dispatch(
            EquiptmentPositionDetailAPI({
              StartDate: ToDatabaseFormat(defaultDateRange.startDate) || "",
              EndDate: ToDatabaseFormat(defaultDateRange.endDate) || "",
              DistrictID: "",
              DistrictName: "",
              CenterID: "",
              CenterName: "",
              ProjectId: "7122,7121,7120",
              QuestionId: "",
            })
          ),
          dispatch(
            EquiptmentPositionStockAPI({
              StartDate: ToDatabaseFormat(defaultDateRange.startDate) || "",
              EndDate: ToDatabaseFormat(defaultDateRange.endDate) || "",
              DistrictID: "",
              DistrictName: "",
              CenterID: "",
              CenterName: "",
              ProjectId: "7122,7121,7120",
              QuestionId: "",
            })
          ),
          dispatch(
            TechnicalMonitoringDetailAPI({
              StartDate: ToDatabaseFormat(defaultDateRange.startDate) || "",
              EndDate: ToDatabaseFormat(defaultDateRange.endDate) || "",
              DistrictID: "",
              DistrictName: "",
              CenterID: "",
              CenterName: "",
              ProjectId: "7122,7121,7120",
              QuestionId: "",
            })
          ),
          dispatch(
            TechnicalMonitoringStockAPI({
              StartDate: ToDatabaseFormat(defaultDateRange.startDate) || "",
              EndDate: ToDatabaseFormat(defaultDateRange.endDate) || "",
              DistrictID: "",
              DistrictName: "",
              CenterID: "",
              CenterName: "",
              ProjectId: "7122,7121,7120",
              QuestionId: "",
            })
          ),
          dispatch(
            IECMatrialStockAPI({
              StartDate: ToDatabaseFormat(defaultDateRange.startDate) || "",
              EndDate: ToDatabaseFormat(defaultDateRange.endDate) || "",
              DistrictID: "",
              DistrictName: "",
              CenterID: "",
              CenterName: "",
              ProjectId: "7122,7121,7120",
              QuestionId: "",
            })
          ),
          dispatch(
            IECMatrialDetailAPI({
              StartDate: ToDatabaseFormat(defaultDateRange.startDate) || "",
              EndDate: ToDatabaseFormat(defaultDateRange.endDate) || "",
              DistrictID: "",
              DistrictName: "",
              CenterID: "",
              CenterName: "",
              ProjectId: "7122,7121,7120",
              QuestionId: "",
            })
          ),
          dispatch(
            StatusOfBuildingAPI({
              StartDate: ToDatabaseFormat(defaultDateRange.startDate) || "",
              EndDate: ToDatabaseFormat(defaultDateRange.endDate) || "",
              DistrictID: "",
              DistrictName: "",
              CenterID: "",
              CenterName: "",
              ProjectId: "7122,7121,7120",
              QuestionId: "",
            })
          ),
          dispatch(
            PerformaceOfSdpAPI({
              StartDate: ToDatabaseFormat(defaultDateRange.startDate) || "",
              EndDate: ToDatabaseFormat(defaultDateRange.endDate) || "",
              DistrictID: "",
              DistrictName: "",
              CenterID: "",
              CenterName: "",
              ProjectId: "7122,7121,7120",
              QuestionId: "",
            })
          )
        ]);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        dispatch(updateStates({ key: "isLoading", value: false }));
      }
    };
  
    fetchAllData();
  }, [dispatch]);
  const getColumns = (): GridColDef[] => {
    if (!filteredData.length) return [];

    const identifierKeys = ["asDate", "projectName", "district", "center"];
    const clickedKey = selectedCategory;               // e.g. "Decontamination"

    const columns: GridColDef[] = [];

    // ---- identifier columns (always shown) ----
    identifierKeys.forEach((key) => {
      if (filteredData[0].hasOwnProperty(key)) {
        columns.push({
          field: key,
          headerName: key,
          flex: 1,
          minWidth: 130,
        });
      }
    });

    // ---- the clicked checklist column (the only one we care about) ----
    if (filteredData[0].hasOwnProperty(clickedKey)) {
      columns.push({
        field: clickedKey,
        headerName: clickedKey,
        flex: 1,
        minWidth: 150,
        renderCell: (params) => {
          const raw = params.value?.toString().trim().toLowerCase();
          if (["yes", "no"].includes(raw)) {
            return (
              <span
                style={{
                  color: raw === "yes" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {params.value}
              </span>
            );
          }
          return params.value ?? "-";
        },
      });
    }

    return columns;
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? "90%" : 450,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: isMobile ? 2 : 4,
    borderRadius: "16px",
    maxHeight: "90vh",
    overflowY: "auto",
  } as const;

  return (
    <Container>
      {PWDdashboard.isLoading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <Row>
        <Box sx={{ width: "100%" }}>
          <Collapse in={open2}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen2(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              You are viewing the data from {currentFormattedDates.start} to{" "}
              {currentFormattedDates.end}.
            </Alert>
          </Collapse>
        </Box>
      </Row>

      <Row
        className="d-flex justify-content-between align-items-center mb-3"
        style={{ marginTop: isMobile ? "10px" : "0" }}
      >
        <Col xs={8} sm={9}>
          <Typography variant={isMobile ? "h5" : "h4"}>Dashboard</Typography>
        </Col>
        <Col xs={4} sm={3} className="d-flex justify-content-end">
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={handleOpen}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              boxShadow: "none",
              backgroundColor: "black",
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              padding: isMobile ? "6px 12px" : "8px 16px",
            }}
          >
            Filters
          </Button>
        </Col>
      </Row>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="filter-modal-title"
        aria-describedby="filter-modal-description"
        hideBackdrop
        disableEscapeKeyDown
      >
        <Box sx={modalStyle}>
          <Typography
            id="filter-modal-title"
            variant="h6"
            component="h2"
            mb={2}
          >
            Filter Dashboard Data
          </Typography>

          <TextField
            select
            fullWidth
            margin="normal"
            label="Month"
            name="month"
            value={filters.month}
            onChange={handleChange}
            size={isMobile ? "small" : "medium"}
          >
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            margin="normal"
            label="Year"
            name="year"
            value={filters.year}
            onChange={handleChange}
            size={isMobile ? "small" : "medium"}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            margin="normal"
            label="Type of SDP"
            name="SDPdropdownValue"
            value={PWDdashboard.SDPdropdownValue}
            onChange={handleChange}
            disabled
            size={isMobile ? "small" : "medium"}
          >
            {PWDdashboard.SDPdropdown.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            margin="normal"
            label="District"
            name="districtValue"
            disabled
            value={PWDdashboard.districtValue}
            onChange={handleChange}
            size={isMobile ? "small" : "medium"}
          >
            <MenuItem value="">---Select All---</MenuItem>
            {PWDdashboard.districtDropdown.map((option) => (
              <MenuItem key={option.Text} value={option.Text}>
                {option.Text}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            margin="normal"
            label="Center"
            name="centerValue"
            disabled
            value={PWDdashboard.centerValue}
            onChange={handleChange}
            size={isMobile ? "small" : "medium"}
          >
            <MenuItem value=" ">---Select All---</MenuItem>
            {PWDdashboard.centerDropdown.map((option) => (
              <MenuItem key={option.Text} value={option.Text}>
                {option.Text}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleClose}
              sx={{
                mr: 2,
                color: "black",
                boxShadow: "1px 1px 8px -1px rgb(160 160 160)",
                fontSize: isMobile ? "0.75rem" : "0.875rem",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "black",
                fontSize: isMobile ? "0.75rem" : "0.875rem",
              }}
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Modal>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobile ? "100%" : "80%",
            maxWidth: "1200px",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5">
              Technical Monitoring – {selectedCategory}
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {filteredData.length > 0 ? (
            <Box sx={{ height: "80vh", width: "100%" }}>
              <DataGrid
                rows={filteredData.map((r, i) => ({ ...r, id: r.id ?? i }))}
                columns={getColumns()}
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                  pagination: { paginationModel: { page: 0, pageSize: 10 } },
                }}
                sx={{
                  "& .MuiDataGrid-cell": { borderBottom: "1px solid #f0f0f0" },
                  "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f5f5f5" },
                }}
              />
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="body1" gutterBottom>
                No records found for <strong>{selectedCategory}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total technical rows loaded: {PWDdashboard.technicalGridData?.length ?? 0}
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>

      <Row>
        <KeyMetricCard />
      </Row>

      <Row sx={{ height: "100%" }} className="mb-3">
        {isMobile ? (
          // Mobile layout - stack vertically
          <>
            <Grid {...({ item: true, xs: 12 } as any)} sx={{ mb: 1 }}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  p: isMobile ? 0.5 : 1,
                  width: "100%",
                  bgcolor: "background.paper",
                  mb: 1,
                  height: "auto",
                }}
              >
                <StackBars />
              </Card>
            </Grid>
            <Grid {...({ item: true, xs: 12 } as any)} sx={{ mb: 1 }}>
              <IecChart />
            </Grid>
            <Grid {...({ item: true, xs: 12 } as any)}>
              <StockStatusDashboard />
            </Grid>
          </>
        ) : (
          // Desktop layout - original
          <>
            <Grid
              {...({ item: true, xs: 12, sm: 12, md: 6, lg: 6 } as any)}
              sx={{
                width: "76.5%",
                height: "100%",
                paddingLeft: "0px",
                marginTop: "8px",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: "51%" }}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        boxShadow: 3,
                        p: 1,
                        width: "100%",
                        bgcolor: "background.paper",
                        mb: 4,
                        height: 290,
                        marginRight: 2,
                      }}
                    >
                      <StackBars />
                    </Card>
                  </div>
                  <div style={{ width: "46%", marginRight: "3px" }}>
                    <Box sx={{ position: "relative" }}>
                      <Card
                        sx={{
                          borderRadius: 2,
                          boxShadow: 3,
                          p: 3,
                          width: "100%",
                          bgcolor: "background.paper",
                          mb: 4,
                          height: 290,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                            color: "text.primary",
                            textAlign: "left",
                            fontFamily: "inherit",
                            fontSize: 16,
                          }}
                        >
                          Technical Monitoring Checklist
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 3,
                            flexWrap: isMobile ? "wrap" : "nowrap",
                          }}
                        >
                          <Box>
                            <PieChart
                              series={[
                                {
                                  data: PWDdashboard.buildingStatusData || [],
                                  innerRadius: 30,
                                  outerRadius: 80,
                                  paddingAngle: 5,
                                  cornerRadius: 5,
                                  startAngle: -45,
                                  endAngle: 225,
                                  cx: 100,
                                  cy: 80,
                                  arcLabelMinAngle: 15,
                                },
                              ]}
                              onItemClick={handlePieChartClick}
                              sx={{
                                "& .MuiChartsLegend-label": {
                                  fontSize: "10px !important",
                                },
                                "& .MuiPieArc-root": {
                                  cursor: "pointer",
                                  "&:hover": {
                                    opacity: 0.8,
                                  },
                                },
                              }}
                              width={250}
                              height={170}
                              slotProps={{
                                legend: {
                                  sx: {
                                    "& .MuiChartsLegend-label": {
                                      fontSize: 6,
                                      fontWeight: "normal",
                                    },
                                  },
                                },
                              }}
                            />
                          </Box>
                        </Box>
                      </Card>
                    </Box>
                  </div>
                </div>

                <StockStatusDashboard />
              </div>
            </Grid>
            <Grid
              {...({ item: true, xs: 12, sm: 12, md: 4, lg: 4 } as any)}
              sx={{
                width: "23.5%",
                height: "100%",
                paddingRight: "0px",
                marginTop: "8px",
              }}
            >
              <div>
                <IecChart />
              </div>
            </Grid>
          </>
        )}
      </Row>

      <Row>
        <ReportData />
      </Row>

    </Container>
  );
};

export default Dashboard;
import { createSlice } from "@reduxjs/toolkit";
import {
  CenterDropdown,
  DetailStockOfContraceptiveAPI,
  EquiptmentPositionDetailAPI,
  EquiptmentPositionStockAPI,
  IECMatrialDetailAPI,
  IECMatrialStockAPI,
  MonitoringVisitsReportAPI,
  OfficerVisitReportAPI,
  PerformaceOfSdpAPI,
  SdpDropdown,
  SldieoutAPI,
  StaffPositionAPI,
  StatusOfBuildingAPI,
  StockOfContraceptiveAPI,
  TechnicalMonitoringDetailAPI,
  TechnicalMonitoringStockAPI,
  dynamicAPI,
} from "../Service/Init";
import {
  IActionKeyValueData,
  PWDInitINTERFACE,
} from "../Interface/InitInterface";
import { PWDinitModel } from "../Model/InitModel";

const initialState: PWDInitINTERFACE = PWDinitModel;
const PWDINITSLICE = createSlice({
  name: "PWDINITSLICE",
  initialState,
  reducers: {
    updateStates: (state: PWDInitINTERFACE, action: IActionKeyValueData) => {
      const key = action?.payload?.key;
      if (key && Object.prototype.hasOwnProperty.call(state, key)) {
        // Type assertion to allow assignment, but only if key is a valid property of state
        (state as any)[key] = action.payload.value;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SdpDropdown.pending, (state: PWDInitINTERFACE) => {})
      .addCase(SdpDropdown.fulfilled, (state: PWDInitINTERFACE, action) => {
        state.districtDropdown = action.payload;
      })
      .addCase(SdpDropdown.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });

    builder
      .addCase(CenterDropdown.pending, (state: PWDInitINTERFACE) => {})
      .addCase(CenterDropdown.fulfilled, (state: PWDInitINTERFACE, action) => {
        state.centerDropdown = action.payload;
      })
      .addCase(CenterDropdown.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });

    builder
      .addCase(dynamicAPI.pending, (state: PWDInitINTERFACE) => {})
      .addCase(dynamicAPI.fulfilled, (state: PWDInitINTERFACE, action) => {
        state.ContraceptivesAlert =
          action.payload.contraceptiveStockPositionModel.centerStockAlerts;

        // Transform contraceptiveStockPositionStockWise data
        const stockData =
          action.payload.contraceptiveStockPositionModel
            .contraceptiveStockPositionStockWise;

        if (stockData && Array.isArray(stockData)) {
          // Create consolidated array with all contraceptive types
          const consolidatedStock = [
            {
              name: "Condoms",
              value: stockData.reduce(
                (sum, item) => sum + (item.CondomsStock || 0),
                0
              ),
              color: "#0088FE",
            },
            {
              name: "POP",
              value: stockData.reduce((sum, item) => sum + (item.POP || 0), 0),
              color: "#00C49F",
            },
            {
              name: "COC",
              value: stockData.reduce((sum, item) => sum + (item.COC || 0), 0),
              color: "#FFBB28",
            },
            {
              name: "ECP",
              value: stockData.reduce((sum, item) => sum + (item.ECP || 0), 0),
              color: "#FF8042",
            },
            {
              name: "3 Months Injection",
              value: stockData.reduce(
                (sum, item) => sum + (item.ThreemonthsInj || 0),
                0
              ),
              color: "#8884D8",
            },
            {
              name: "Defo",
              value: stockData.reduce(
                (sum, item) => sum + (item.DefoStock || 0),
                0
              ),
              color: "#82CA9D",
            },
            {
              name: "IUD",
              value: stockData.reduce((sum, item) => sum + (item.IUD || 0), 0),
              color: "#FFC658",
            },
            {
              name: "Jadelle",
              value: stockData.reduce(
                (sum, item) => sum + (item.Jadelle || 0),
                0
              ),
              color: "#8DD1E1",
            },
          ];

          state.contraceptiveStock = consolidatedStock;
        } else {
          state.contraceptiveStock = [];
        }

        const targetValues = {
          "All Reports": 500,
          FWC: 450,
          "RHS-A": 80,
          MSU: 50,
        };
        state.AllReport = action.payload.All;
        state.FWCReport = action.payload.FWC;
        state.MSUReport = action.payload.MSU;
        state.RHSAReport = action.payload.RHS;

        const metricsArray = [
          {
            name: "All Reports",
            value: action.payload.All?.SurveyCount || 0,
            total: "965",
            percentage: Math.round(
              ((action.payload.All?.SurveyCount || 0) /
                targetValues["All Reports"]) *
                100
            ),
            target: targetValues["All Reports"],
          },
          {
            name: "FWC",
            value: action.payload.FWC?.SurveyCount || 0,
            total: "811",
            percentage: Math.round(
              ((action.payload.FWC?.SurveyCount || 0) / targetValues["FWC"]) *
                100
            ),
            target: targetValues["FWC"],
          },
          {
            name: "RHS-A",
            value: action.payload.RHS?.SurveyCount || 0,
            total: "85",
            percentage: Math.round(
              ((action.payload.RHS?.SurveyCount || 0) / targetValues["RHS-A"]) *
                100
            ),
            target: targetValues["RHS-A"],
          },
          {
            name: "MSU",
            value: action.payload.MSU?.SurveyCount || 0,
            total: "69",
            percentage: Math.round(
              ((action.payload.MSU?.SurveyCount || 0) / targetValues["MSU"]) *
                100
            ),
            target: targetValues["MSU"],
          },
        ];
        state.linearData = metricsArray;

        // Transform FWCOpenClose data
        const fwcOpenCloseData =
          action.payload.FWCOpenClose?.map((item: any) => {
            const colorMap: { [key: string]: string } = {
              Open: "#0088FE",
              Close: "#b3b3b3",
            };

            return {
              name: item.Title,
              value: item.OpenClose,
              color: colorMap[item.Title] || "#000000", // default color if not found
            };
          }) || [];

        state.FWCOpenClose = fwcOpenCloseData;

        // Similarly, you can transform other OpenClose arrays if needed
        const msuOpenCloseData =
          action.payload.MSUOpenClose?.map((item: any) => {
            const colorMap: { [key: string]: string } = {
              Open: "#FFBB28",
              Close: "#b3b3b3",
            };

            return {
              name: item.Title,
              value: item.OpenClose,
              color: colorMap[item.Title] || "#000000",
            };
          }) || [];

        state.MSUOpenClose = msuOpenCloseData;

        const rhsOpenCloseData =
          action.payload.RHSOpenClose?.map((item: any) => {
            const colorMap: { [key: string]: string } = {
              Open: "#FF8042",
              Close: "#b3b3b3",
            };

            return {
              name: item.Title,
              value: item.OpenClose,
              color: colorMap[item.Title] || "#000000",
            };
          }) || [];

        const combineOpenCloseData = (
          fwcData: any[],
          msuData: any[],
          rhsData: any[]
        ) => {
          const combined: { [key: string]: number } = {};

          // Function to add data to combined object
          const addData = (data: any[]) => {
            data.forEach((item: any) => {
              const title = item.Title;
              const openClose = item.OpenClose;

              if (combined[title]) {
                combined[title] += openClose;
              } else {
                combined[title] = openClose;
              }
            });
          };

          addData(fwcData);
          addData(msuData);
          addData(rhsData);
          return Object.keys(combined).map((title) => ({
            Title: title,
            OpenClose: combined[title],
          }));
        };

        const allOpenCloseData = combineOpenCloseData(
          action.payload.FWCOpenClose || [],
          action.payload.MSUOpenClose || [],
          action.payload.RHSOpenClose || []
        ).map((item: any) => ({
          name: item.Title,
          value: item.OpenClose,
        }));

        state.AllOpenClose = allOpenCloseData;

        state.RHSAOpenClose = rhsOpenCloseData;

        // Furniture Position aggregation
        const furnitureNames = [
          { shortform: "OT", fullForm: "Office Table" },
          { shortform: "OC", fullForm: "Office Chairs" },
          { shortform: "B", fullForm: "Benches" },
          { shortform: "ET", fullForm: "Examination Table" },
          { shortform: "IT", fullForm: "Insertion Table" },
          { shortform: "RS", fullForm: "Revolving Stool" },
          { shortform: "MC", fullForm: "Medicine Cabinet" },
          { shortform: "ST", fullForm: "Stretcher" },
        ];

        const conditionMap: { [key: number]: string } = {
          1: "N/A",
          2: "Good",
          3: "Satisfactory",
          4: "Poor",
        };

        // Add this to your dynamicAPI.fulfilled case after the existing furnitureData transformation

        // Transform Furniture Position data for grid binding
        if (
          action.payload.FuniturePosition &&
          Array.isArray(action.payload.FuniturePosition)
        ) {
          const furnitureGridData = action.payload.FuniturePosition.map(
            (record: any) => {
              const fpArray = record.FP ? record.FP.split(",").map(Number) : [];
              const fpqArray = record.FPQ
                ? record.FPQ.split(",").map(Number)
                : [];

              const gridRecord: any = {
                asDate: record.asDate,
                projectName: record.ProjectName,
                district: record.District,
                center: record.Center,
              };

              furnitureNames.forEach((furn, index) => {
                const conditionCode =
                  index < fpArray.length ? fpArray[index] : 1;
                const quantity = index < fpqArray.length ? fpqArray[index] : 0;
                const condition = conditionMap[conditionCode] || "N/A";

                // Add condition field
                gridRecord[furn.fullForm] = condition;

                // Add quantity field
                gridRecord[`${furn.fullForm} quantity`] = quantity;
              });

              return gridRecord;
            }
          );

          state.furnitureGridData = furnitureGridData;

          // Console log the transformed data for verification

          // Also log a sample record for detailed inspection
          if (furnitureGridData.length > 0) {
          }
        } else {
          state.furnitureGridData = [];
        }

        // Also update your existing furnitureData transformation to ensure consistency
        const furnitureStats: any = {};
        furnitureNames.forEach((item) => {
          furnitureStats[item.shortform] = {
            shortform: item.shortform,
            fullForm: item.fullForm,
            good: 0,
            satisfactory: 0,
            poor: 0,
            notAvailable: 0,
          };
        });

        if (
          action.payload.FuniturePosition &&
          Array.isArray(action.payload.FuniturePosition)
        ) {
          action.payload.FuniturePosition.forEach((record: any) => {
            const fp = record.FP ? record.FP.split(",").map(Number) : [];
            const fpq = record.FPQ ? record.FPQ.split(",").map(Number) : [];

            furnitureNames.forEach((furn, index) => {
              if (index < fp.length && index < fpq.length) {
                const condCode = fp[index];
                const qty = fpq[index];

                if (condCode === 1) {
                  furnitureStats[furn.shortform].notAvailable += qty;
                } else if (qty > 0) {
                  const condition = conditionMap[condCode];
                  if (condition === "Good") {
                    furnitureStats[furn.shortform].good += qty;
                  } else if (condition === "Satisfactory") {
                    furnitureStats[furn.shortform].satisfactory += qty;
                  } else if (condition === "Poor") {
                    furnitureStats[furn.shortform].poor += qty;
                  }
                }
              }
            });
          });
        }

        const furnitureDataArray = Object.values(furnitureStats);
        state.furnitureData = furnitureDataArray;

        state.stockdetail = action.payload.contraceptiveStockPositionModel.contraceptiveStockPositionResponse;
      })
      .addCase(dynamicAPI.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });

    builder
      .addCase(SldieoutAPI.pending, (state: PWDInitINTERFACE) => {})
      .addCase(SldieoutAPI.fulfilled, (state: PWDInitINTERFACE, action) => {
        state.openclose = action.payload;

        // Filter and categorize the SldieoutAPI response into RHS-A, FWC, MSU
        if (action.payload && Array.isArray(action.payload)) {
          const categorizedData: {
            RHS: Array<{
              id: number;
              district: string;
              sdpType: string;
              centerName: string;
              status: string;
              asDate: string;
              premises: string;
              Photos: string;
            }>;
            MSU: Array<{
              id: number;
              district: string;
              sdpType: string;
              centerName: string;
              status: string;
              asDate: string;
              premises: string;
              Photos: string;
            }>;
            FWC: Array<{
              id: number;
              district: string;
              sdpType: string;
              centerName: string;
              status: string;
              asDate: string;
              premises: string;
              Photos: string;
            }>;
          } = {
            RHS: [],
            MSU: [],
            FWC: [],
          };

          action.payload.forEach((item: any, index: number) => {
            const projectName = item.ProjectName || "";
            let category: keyof typeof categorizedData | null = null;

            // Determine category based on ProjectName
            if (projectName.includes("RHS")) {
              category = "RHS";
            } else if (projectName.includes("MSU")) {
              category = "MSU";
            } else if (
              projectName.includes("FWC") ||
              projectName.includes("Family Welfare")
            ) {
              category = "FWC";
            }

            if (category) {
              categorizedData[category].push({
                id: index,
                district: item.District || "N/A",
                sdpType: projectName,
                centerName: item.Center || "N/A",
                status: item.OpenClose || "Unknown",
                asDate: item.asDate || "N/A",
                premises: item.Premises || "N/A",
                Photos: item.Photos || "N/A",
              });
            }
          });

          state.FWCOpenCloseRecord = categorizedData.FWC;
          state.MSUOpenCloseRecord = categorizedData.MSU;
          state.RHSAOpenCloseRecord = categorizedData.RHS;
        }
      })
      .addCase(SldieoutAPI.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });

    builder
      .addCase(StaffPositionAPI.pending, (state: PWDInitINTERFACE) => {})
      .addCase(
        StaffPositionAPI.fulfilled,
        (state: PWDInitINTERFACE, action) => {
          // Transform the attendance record data
          const transformAttendanceData = (data: any) => {
            // Staff position mapping
            const staffPositions = [
              "Women Medical Officer",
              "Accounts Assistant",
              "Theater Nurse",
              "O.T Technician",
              "Family Welfare Councilor",
              "Family Welfare Worker",
              "Family Welfare Worker Assistant",
              "Driver",
              "Help",
              "Sweep",
            ];

            // Status mapping
            const statusMap: { [key: string]: string } = {
              "1": "present",
              "2": "absent",
              "3": "vacant",
              "4": "leave",
            };

            if (data && Array.isArray(data)) {
              return data.map((item: any) => {
                const remarksArray = item.Remarks?.split(",") || [];
                const transformedData: any = {
                  asDate: item.asDate,
                  District: item.District,
                  Center: item.Center,
                };

                // Map each staff position to its status
                staffPositions.forEach((position, index) => {
                  if (index < remarksArray.length) {
                    const statusCode = remarksArray[index].trim();
                    transformedData[position] =
                      statusMap[statusCode] || "unknown";
                  } else {
                    transformedData[position] = "unknown";
                  }
                });

                return transformedData;
              });
            }
            return [];
          };

          const transformedData = transformAttendanceData(action.payload);

          state.attendanceRecord = transformedData;
        }
      )

      .addCase(StaffPositionAPI.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });

    builder
      .addCase(
        MonitoringVisitsReportAPI.pending,
        (state: PWDInitINTERFACE) => {}
      )
      .addCase(
        MonitoringVisitsReportAPI.fulfilled,
        (state: PWDInitINTERFACE, action) => {
          state.MonitoringReportRecord = action.payload;
        }
      )

      .addCase(
        MonitoringVisitsReportAPI.rejected,
        (state: PWDInitINTERFACE) => {
          state.isLoading = false;
        }
      );

    builder
      .addCase(OfficerVisitReportAPI.pending, (state: PWDInitINTERFACE) => {})
      .addCase(
        OfficerVisitReportAPI.fulfilled,
        (state: PWDInitINTERFACE, action) => {
          const transformOfficerVisitData = (data: any[]) => {
            if (!data || !Array.isArray(data)) return [];

            return data.map((item: any) => {
              // Parse the count values
              const parseCount = (countString: string) => {
                const [totalStr, visitedStr] = countString.split("/");
                return {
                  total: parseInt(totalStr) || 0,
                  visited: parseInt(visitedStr) || 0,
                };
              };

              const rhs = parseCount(item.RHSCountVisited || "0/0");
              const fwc = parseCount(item.FWCCountVisited || "0/0");
              const msu = parseCount(item.MSUCountVisited || "0/0");

              // Calculate totals
              const totalCenters = rhs.total + fwc.total + msu.total;
              const totalVisited = rhs.visited + fwc.visited + msu.visited;

              // Calculate percentage
              const percentage =
                totalCenters > 0 ? (totalVisited / totalCenters) * 100 : 0;

              // Determine star rating based on percentage
              let stars = 0;
              if (percentage >= 40) {
                stars = 5;
              } else if (percentage >= 30) {
                stars = 4;
              } else if (percentage >= 20) {
                stars = 3;
              } else if (percentage >= 10) {
                stars = 2;
              } else if (percentage <= 10) {
                stars = 1;
              }
              // Below 10% gets 0 stars

              return {
                district: item.District || "N/A",
                officerName: item.OfficerName || "N/A",
                designationName: item.DesignationName || "N/A",
                rhsCountVisited: item.RHSCountVisited || "0/0",
                fwcCountVisited: item.FWCCountVisited || "0/0",
                msuCountVisited: item.MSUCountVisited || "0/0",
                totalDistinctCentersVisited: `${totalCenters}/${totalVisited}`,
                percentage: Math.round(percentage),
                stars: stars,
                // You can also include the parsed numbers separately if needed
                _parsed: {
                  rhs,
                  fwc,
                  msu,
                  totalCenters,
                  totalVisited,
                },
              };
            });
          };

          const transformedData = transformOfficerVisitData(action.payload);

          state.officeGridRecord = transformedData;
        }
      )
      .addCase(OfficerVisitReportAPI.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });

    builder
      .addCase(StockOfContraceptiveAPI.pending, (state: PWDInitINTERFACE) => {})
      .addCase(
        StockOfContraceptiveAPI.fulfilled,
        (state: PWDInitINTERFACE, action) => {}
      )

      .addCase(StockOfContraceptiveAPI.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });

    builder
      .addCase(
        DetailStockOfContraceptiveAPI.pending,
        (state: PWDInitINTERFACE) => {}
      )
      .addCase(
        DetailStockOfContraceptiveAPI.fulfilled,
        (state: PWDInitINTERFACE, action) => {
          state.viewStockOfContraceptiveRecord = action.payload;
        }
      )

      .addCase(
        DetailStockOfContraceptiveAPI.rejected,
        (state: PWDInitINTERFACE) => {
          state.isLoading = false;
        }
      );

    builder
      .addCase(
        EquiptmentPositionDetailAPI.pending,
        (state: PWDInitINTERFACE) => {}
      )
      .addCase(
        EquiptmentPositionDetailAPI.fulfilled,
        (state: PWDInitINTERFACE, action) => {
          if (action.payload && Array.isArray(action.payload)) {
            // Define equipment names and their condition mapping
            const equipmentNames = [
              { key: "Minilapkits", name: "Minilap Kits" },
              { key: "Iudkits", name: "IUD Kits" },
              { key: "BPApparatus", name: "BP Apparatus" },
              { key: "Stethoscope", name: "Stethoscope" },
              { key: "Thermometer", name: "Thermometer" },
              { key: "WeightingMachine", name: "Weighting Machine" },
              { key: "Stove", name: "Stove" },
              { key: "OTLights", name: "OT Lights" },
              { key: "HydrolicTable", name: "Hydrolic Table" },
              { key: "Autoclave", name: "Autoclave" },
              { key: "OxygenCylinder", name: "Oxygen Cylinder" },
              { key: "AspiratingPumps", name: "Aspirating Pumps" },
              { key: "WheelChair", name: "Wheel Chair" },
              { key: "Stretcher", name: "Stretcher" },
              { key: "Generators", name: "Generators" },
              { key: "Screen", name: "Screen" },
            ];

            // Condition mapping
            const conditionMap: { [key: number]: string } = {
              1: "N/A",
              2: "Good",
              3: "Satisfactory",
              4: "Poor",
            };

            // Transform equipment position data for grid binding
            const equipmentGridData = action.payload.map((record: any) => {
              const equipmentArray = record.EuiptmentPosition
                ? record.EuiptmentPosition.split(",").map(Number)
                : [];

              // Create base object with common fields
              const gridRecord: any = {
                asDate: record.asDate,
                projectName: record.ProjectName,
                district: record.District,
                center: record.Center,
              };

              // Add equipment condition fields for each equipment type
              equipmentNames.forEach((equipment, index) => {
                const conditionCode =
                  index < equipmentArray.length ? equipmentArray[index] : 1;
                const condition = conditionMap[conditionCode] || "N/A";

                // Add condition field
                gridRecord[equipment.name] = condition;
              });

              return gridRecord;
            });

            state.equipmentGridData = equipmentGridData;

            // Console log the transformed data for verification
            // Also log a sample record for detailed inspection
            if (equipmentGridData.length > 0) {
            }
          } else {
            state.equipmentGridData = [];
          }
        }
      )
      .addCase(
        EquiptmentPositionDetailAPI.rejected,
        (state: PWDInitINTERFACE) => {
          state.isLoading = false;
        }
      );

    builder
      .addCase(
        EquiptmentPositionStockAPI.pending,
        (state: PWDInitINTERFACE) => {}
      )
      .addCase(
        EquiptmentPositionStockAPI.fulfilled,
        (state: PWDInitINTERFACE, action) => {
          if (action.payload) {
            const equipmentData = action.payload;

            // Define equipment names and their display names
            const equipmentNames = [
              { key: "Minilapkits", name: "Minilap Kits" },
              { key: "Iudkits", name: "IUD Kits" },
              { key: "BPApparatus", name: "BP Apparatus" },
              { key: "Stethoscope", name: "Stethoscope" },
              { key: "Thermometer", name: "Thermometer" },
              { key: "WeightingMachine", name: "Weighting Machine" },
              { key: "Stove", name: "Stove" },
              { key: "OTLights", name: "OT Lights" },
              { key: "HydrolicTable", name: "Hydrolic Table" },
              { key: "Autoclave", name: "Autoclave" },
              { key: "OxygenCylinder", name: "Oxygen Cylinder" },
              { key: "AspiratingPumps", name: "Aspirating Pumps" },
              { key: "WheelChair", name: "Wheel Chair" },
              { key: "Stretcher", name: "Stretcher" },
              { key: "Generators", name: "Generators" },
              { key: "Screen", name: "Screen" },
            ];

            // Transform equipment data with percentages
            const transformedEquipmentData = equipmentNames.map((equipment) => {
              const current = equipmentData[equipment.key] || 0;
              const total = equipmentData[`${equipment.key}Total`] || 0;

              // Calculate percentage (avoid division by zero)
              const percentage = total > 0 ? (current / total) * 100 : 0;

              return {
                name: equipment.name,
                current: current,
                total: total,
                percentage: percentage.toFixed(2),
              };
            });

            // Set the transformed data to state
            state.equipmentStockData = transformedEquipmentData;
          }
        }
      )
      .addCase(
        EquiptmentPositionStockAPI.rejected,
        (state: PWDInitINTERFACE) => {
          state.isLoading = false;
        }
      );

    builder
      .addCase(
        TechnicalMonitoringDetailAPI.pending,
        (state: PWDInitINTERFACE) => {}
      )
      .addCase(
        TechnicalMonitoringDetailAPI.fulfilled,
        (state: PWDInitINTERFACE, action) => {
          if (action.payload && Array.isArray(action.payload)) {
            // Define technical monitoring items and their status mapping
            const technicalItems = [
              {
                key: "handWashing",
                name: "Hand Washing",
                position: 0,
              },
              {
                key: "decontamination",
                name: "Decontamination",
                position: 1,
              },
              {
                key: "cleaning",
                name: "Cleaning (Instruments)",
                position: 2,
              },
              {
                key: "disinfection",
                name: "High level disinfection",
                position: 3,
              },
              {
                key: "wasteDisposal",
                name: "Waste disposal",
                position: 4,
              },
            ];

            // Status mapping
            const statusMap: { [key: number]: string } = {
              1: "Yes",
              2: "No",
            };

            // Transform technical monitoring data for grid binding
            const technicalGridData = action.payload.map((record: any) => {
              const technicalArray = record.Technical
                ? record.Technical.split(",").map(Number)
                : [];

              // Create base object with common fields
              const gridRecord: any = {
                asDate: record.asDate,
                projectName: record.ProjectName,
                district: record.District,
                center: record.Center || "N/A",
              };

              // Add technical monitoring status fields for each item
              technicalItems.forEach((item) => {
                const statusCode =
                  item.position < technicalArray.length
                    ? technicalArray[item.position]
                    : 2; // Default to 'No'
                const status = statusMap[statusCode] || "No";

                // Add status field
                gridRecord[item.name] = status;
              });

              return gridRecord;
            });

            state.technicalGridData = technicalGridData;

            // Also log a sample record for detailed inspection
            if (technicalGridData.length > 0) {
            }
          } else {
            state.technicalGridData = [];
          }
        }
      )
      .addCase(
        TechnicalMonitoringDetailAPI.rejected,
        (state: PWDInitINTERFACE) => {
          state.isLoading = false;
        }
      );

    builder
      .addCase(
        TechnicalMonitoringStockAPI.pending,
        (state: PWDInitINTERFACE) => {}
      )
      .addCase(
        TechnicalMonitoringStockAPI.fulfilled,
        (state: PWDInitINTERFACE, action) => {
          if (action.payload) {
            const monitoringData = action.payload;

            // Define the mapping for building status data
            const buildingStatusMapping = [
              {
                key: "HandWashing",
                label: "Hand Washing",
                color: "#0088FE",
                noKey: "HandWashingNo",
              },
              {
                key: "Decontamination",
                label: "Decontamination",
                color: "#00C49F",
                noKey: "DecontaminationNo",
              },
              {
                key: "Cleaning",
                label: "Cleaning (Instruments)",
                color: "#82ca9d",
                noKey: "CleaningNo",
              },
              {
                key: "disinfection",
                label: "High level disinfection",
                color: "#FF8042",
                noKey: "disinfectionNo",
              },
              {
                key: "Wastedisposal",
                label: "Waste disposal",
                color: "#8884D8",
                noKey: "WastedisposalNo",
              },
            ];

            // Transform the data into buildingStatusData format
            const buildingStatusData = buildingStatusMapping.map(
              (item, index) => {
                const value = monitoringData[item.key] || 0;
                const noValue = monitoringData[item.noKey] || 0;

                return {
                  id: index,
                  value: value,
                  label: item.label,
                  color: item.color,
                  total: value + noValue, // Optional: include total if needed
                };
              }
            );

            // Set the transformed data to state
            state.buildingStatusData = buildingStatusData;
          }
        }
      )
      .addCase(
        TechnicalMonitoringStockAPI.rejected,
        (state: PWDInitINTERFACE) => {
          state.isLoading = false;
        }
      );

    builder
      .addCase(IECMatrialStockAPI.pending, (state: PWDInitINTERFACE) => {})
      .addCase(
        IECMatrialStockAPI.fulfilled,
        (state: PWDInitINTERFACE, action) => {
          if (action.payload) {
            const responseData = action.payload;

            // Transform the API response into chartData format
            const chartData = {
              "IEC Material": [
                {
                  id: 0,
                  value: responseData.IECMatrialYes || 0,
                  label: "Displayed",
                },
                {
                  id: 1,
                  value: responseData.IECMatrialNo || 0,
                  label: "Non Displayed",
                },
              ],
              "MEC Wheel": [
                {
                  id: 0,
                  value: responseData.MECWheelYes || 0,
                  label: "Available",
                },
                {
                  id: 1,
                  value: responseData.MECWheelNo || 0,
                  label: "Not Available",
                },
              ],
            };

            // Set the transformed data to state
            state.IECMaterialChartData = chartData;

            // Optional: Log for verification
          }
        }
      )
      .addCase(IECMatrialStockAPI.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });

      builder
      .addCase(IECMatrialDetailAPI.pending, (state: PWDInitINTERFACE) => {})
      .addCase(
        IECMatrialDetailAPI.fulfilled,
        (state: PWDInitINTERFACE, action) => {
          if (action.payload && Array.isArray(action.payload)) {
            // Transform the API response into updatedRecord format
            const updatedRecord = action.payload.map((record: any) => {
              // Parse IECMatrial values (ignore third number)
              const iecMatrialValues = record.IECMatrial ? 
                record.IECMatrial.split(',').map(Number) : [];
              
              // Parse MECWheel values (ignore third number)
              const mecWheelValues = record.MECWheel ? 
                record.MECWheel.split(',').map(Number) : [];
    
              // Determine IECMatrial status
              const iecSecondValue = iecMatrialValues.length > 1 ? iecMatrialValues[1] : 2; // Default to "No" if not available
              const iecDisplayed = iecSecondValue === 1 ? "Displayed" : "Non Displayed";
              const iecYesNo = iecSecondValue === 1 ? "Yes" : "No";
    
              // Determine MECWheel status
              const mecSecondValue = mecWheelValues.length > 1 ? mecWheelValues[1] : 2; // Default to "No" if not available
              const mecAvailable = mecSecondValue === 1 ? "Available" : "Not Available";
              const mecYesNo = mecSecondValue === 1 ? "Yes" : "No";
    
              return {
                asDate: record.asDate || "N/A",
                ProjectName: record.ProjectName || "N/A",
                District: record.District || "N/A",
                Center: record.Center || "N/A",
                IECMatrial: iecDisplayed,
                "IECMatrialYES/NO": iecYesNo,
                MECWheel: mecAvailable,
                "MECWheelYES/NO": mecYesNo
              };
            });
    
            // Set the transformed data to state
            state.IECMaterialDetailRecord = updatedRecord;
    
            // Optional: Log for verification
          } else {
            state.IECMaterialDetailRecord = [];
          }
        }
      )
      .addCase(IECMatrialDetailAPI.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });

    builder
      .addCase(PerformaceOfSdpAPI.pending, (state: PWDInitINTERFACE) => {})
      .addCase(
        PerformaceOfSdpAPI.fulfilled,
        (state: PWDInitINTERFACE, action) => {
          if (action.payload) {
            const responseData = action.payload;

            // Transform the API response into dataset format
            const dataset = [
              {
                new: responseData.GeneralClientNew || 0,
                old: responseData.GeneralClientOld || 0,
                month: "General Clients\t",
              },
              {
                new: responseData.FPClientsNew || 0,
                old: responseData.FPClientsOld || 0,
                month: "F.P Clients\t",
              },
              {
                new: responseData.MCH_RH_New || 0,
                old: responseData.MCH_RH_Old || 0,
                month: "MCH/RH",
              },
              {
                new: responseData.CSCasesNew || 0,
                old: responseData.CSCasesOld || 0,
                month: "C.S Cases",
              },
            ];

            // Set the transformed data to state
            state.performanceSdpDataset = dataset;

            // Optional: Log for verification
          }
        }
      )
      .addCase(PerformaceOfSdpAPI.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });

      builder
      .addCase(StatusOfBuildingAPI.pending, (state: PWDInitINTERFACE) => {})
      .addCase(StatusOfBuildingAPI.fulfilled,(state: PWDInitINTERFACE, action) => {
         state.GovernmentPercentage  = action.payload.GovermentPercentage;
         state.RentedPercentage = action.payload.RantedPercentage;
         state.PVTPercentage = action.payload.PVTPercentage;
         state.IndicationPercentage = action.payload.IndicationPercentage;
         state.ElectricityPercentage = action.payload.ElectricityPercentage;
         state.GasPercentage = action.payload.GasPercentage;
         state.WaterPercentage = action.payload.WaterPercentage;
         state.CleanessPercentage = action.payload.CleanessPercentage;
         state.BrandedPercentage = action.payload.BrandedPercentage;
         state.UnbrandedPercentage = action.payload.UnbrandedPercentage;
        }
      )
      .addCase(StatusOfBuildingAPI.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });
  },
});
export const { updateStates } = PWDINITSLICE.actions;
export default PWDINITSLICE.reducer;

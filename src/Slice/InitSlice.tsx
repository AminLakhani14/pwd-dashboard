import { createSlice } from '@reduxjs/toolkit'
import { CenterDropdown, MonitoringVisitsReportAPI, OfficerVisitReportAPI, SdpDropdown, SldieoutAPI, StaffPositionAPI, dynamicAPI } from '../Service/Init';
import { IActionKeyValueData, PWDInitINTERFACE } from '../Interface/InitInterface';
import { PWDinitModel } from '../Model/InitModel';

const initialState: PWDInitINTERFACE = PWDinitModel;
const PWDINITSLICE = createSlice({
  name: 'PWDINITSLICE',
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
      .addCase(SdpDropdown.pending, (state: PWDInitINTERFACE) => {
        state.isLoading = true;
      })
      .addCase(SdpDropdown.fulfilled, (state: PWDInitINTERFACE, action) => {
        state.isLoading = false;
        console.log('action.payload',action.payload);
          // state.SDPdropdown = action.payload as any;
          state.districtDropdown = action.payload
      })
      .addCase(SdpDropdown.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });

      builder
      .addCase(CenterDropdown.pending, (state: PWDInitINTERFACE) => {
        state.isLoading = true;
      })
      .addCase(CenterDropdown.fulfilled, (state: PWDInitINTERFACE, action) => {
        state.isLoading = false;
        state.centerDropdown = action.payload
      })
      .addCase(CenterDropdown.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });

      builder
      .addCase(dynamicAPI.pending, (state: PWDInitINTERFACE) => {
        state.isLoading = true;
      })
      .addCase(dynamicAPI.fulfilled, (state: PWDInitINTERFACE, action) => {
        state.isLoading = false;
        state.ContraceptivesAlert = action.payload.contraceptiveStockPositionModel.centerStockAlerts;
        
        // Transform contraceptiveStockPositionStockWise data
        const stockData = action.payload.contraceptiveStockPositionModel.contraceptiveStockPositionStockWise;
        
        if (stockData && Array.isArray(stockData)) {
          // Create consolidated array with all contraceptive types
          const consolidatedStock = [
            {
              name: "Condoms",
              value: stockData.reduce((sum, item) => sum + (item.CondomsStock || 0), 0),
              color: "#0088FE"
            },
            {
              name: "POP",
              value: stockData.reduce((sum, item) => sum + (item.POP || 0), 0),
              color: "#00C49F"
            },
            {
              name: "COC",
              value: stockData.reduce((sum, item) => sum + (item.COC || 0), 0),
              color: "#FFBB28"
            },
            {
              name: "ECP",
              value: stockData.reduce((sum, item) => sum + (item.ECP || 0), 0),
              color: "#FF8042"
            },
            {
              name: "3 Months Injection",
              value: stockData.reduce((sum, item) => sum + (item.ThreemonthsInj || 0), 0),
              color: "#8884D8"
            },
            {
              name: "Defo",
              value: stockData.reduce((sum, item) => sum + (item.DefoStock || 0), 0),
              color: "#82CA9D"
            },
            {
              name: "IUD",
              value: stockData.reduce((sum, item) => sum + (item.IUD || 0), 0),
              color: "#FFC658"
            },
            {
              name: "Jadelle",
              value: stockData.reduce((sum, item) => sum + (item.Jadelle || 0), 0),
              color: "#8DD1E1"
            }
          ];
          
          state.contraceptiveStock = consolidatedStock;
        } else {
          state.contraceptiveStock = [];
        }
        
        const targetValues = {
          "All Reports": 500,
          "FWC": 450,
          "RHS-A": 80,
          "MSU": 50
        };
        state.AllReport = action.payload.All; 
        state.FWCReport = action.payload.FWC; 
        state.MSUReport = action.payload.MSU; 
        state.RHSAReport = action.payload.RHS;
        
        const metricsArray = [
          {
            name: "All Reports",
            value: action.payload.All?.SurveyCount || 0,
            total: '1244',
            percentage: Math.round(((action.payload.All?.SurveyCount || 0) / targetValues["All Reports"]) * 100),
            target: targetValues["All Reports"]
          },
          {
            name: "FWC",
            value: action.payload.FWC?.SurveyCount || 0,
            total: '1100',
            percentage: Math.round(((action.payload.FWC?.SurveyCount || 0) / targetValues["FWC"]) * 100),
            target: targetValues["FWC"]
          },
          {
            name: "RHS-A",
            value: action.payload.RHS?.SurveyCount || 0,
            total: '72',
            percentage: Math.round(((action.payload.RHS?.SurveyCount || 0) / targetValues["RHS-A"]) * 100),
            target: targetValues["RHS-A"]
          },
          {
            name: "MSU",
            value: action.payload.MSU?.SurveyCount || 0,
            total: '72',
            percentage: Math.round(((action.payload.MSU?.SurveyCount || 0) / targetValues["MSU"]) * 100),
            target: targetValues["MSU"]
          }
        ];
        state.linearData = metricsArray;

        // Transform FWCOpenClose data
        const fwcOpenCloseData = action.payload.FWCOpenClose?.map((item: any) => {
          const colorMap: { [key: string]: string } = {
            "Open": "#0088FE",
            "Close": "#b3b3b3",
          };
          
          return {
            name: item.Title,
            value: item.OpenClose,
            color: colorMap[item.Title] || "#000000" // default color if not found
          };
        }) || [];
        
        state.FWCOpenClose = fwcOpenCloseData;

        // Similarly, you can transform other OpenClose arrays if needed
        const msuOpenCloseData = action.payload.MSUOpenClose?.map((item: any) => {
          const colorMap: { [key: string]: string } = {
            "Open": "#FFBB28",
            "Close": "#b3b3b3",
          };
          
          return {
            name: item.Title,
            value: item.OpenClose,
            color: colorMap[item.Title] || "#000000"
          };
        }) || [];
        
        state.MSUOpenClose = msuOpenCloseData;

        const rhsOpenCloseData = action.payload.RHSOpenClose?.map((item: any) => {
          const colorMap: { [key: string]: string } = {
            "Open": "#FF8042",
            "Close": "#b3b3b3",
          };
          
          return {
            name: item.Title,
            value: item.OpenClose,
            color: colorMap[item.Title] || "#000000"
          };
        }) || [];

        const combineOpenCloseData = (fwcData: any[], msuData: any[], rhsData: any[]) => {
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
          return Object.keys(combined).map(title => ({
            Title: title,
            OpenClose: combined[title]
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
          { shortform: 'OT', fullForm: 'Office Table' },
          { shortform: 'OC', fullForm: 'Office Chairs' },
          { shortform: 'B', fullForm: 'Benches' },
          { shortform: 'ET', fullForm: 'Examination Table' },
          { shortform: 'IT', fullForm: 'Insertion Table' },
          { shortform: 'RS', fullForm: 'Revolving Stool' },
          { shortform: 'MC', fullForm: 'Medicine Cabinet' },
          { shortform: 'ST', fullForm: 'Stretcher' }
        ];

        const conditionMap: { [key: number]: string } = {
          1: 'N/A',
          2: 'Good',
          3: 'Satisfactory',
          4: 'Poor'
        };

        let furnitureStats: any = {};
        furnitureNames.forEach(item => {
          furnitureStats[item.shortform] = {
            shortform: item.shortform,
            fullForm: item.fullForm,
            good: 0,
            satisfactory: 0,
            poor: 0
          };
        });

        if (action.payload.FuniturePosition && Array.isArray(action.payload.FuniturePosition)) {
          action.payload.FuniturePosition.forEach((record: any) => {
            const fp = record.FP ? record.FP.split(',').map(Number) : [];
            const fpq = record.FPQ ? record.FPQ.split(',').map(Number) : [];
            furnitureNames.forEach((furn, index) => {
              if (index < fp.length && index < fpq.length) {
                const condCode = fp[index];
                const qty = fpq[index];
                if (qty > 0 && condCode !== 1) {
                  const condition = conditionMap[condCode];
                  if (condition === 'Good') {
                    furnitureStats[furn.shortform].good += qty;
                  } else if (condition === 'Satisfactory') {
                    furnitureStats[furn.shortform].satisfactory += qty;
                  } else if (condition === 'Poor') {
                    furnitureStats[furn.shortform].poor += qty;
                  }
                }
              }
            });
          });
        }

        const furnitureDataArray = Object.values(furnitureStats);

        state.furnitureData = furnitureDataArray;

      })
      .addCase(dynamicAPI.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });

      builder
      .addCase(SldieoutAPI.pending, (state: PWDInitINTERFACE) => {
        state.isLoading = true;
      })
      .addCase(SldieoutAPI.fulfilled, (state: PWDInitINTERFACE, action) => {
        state.isLoading = false;
        state.openclose = action.payload;

        // Filter and categorize the SldieoutAPI response into RHS-A, FWC, MSU
        if (action.payload && Array.isArray(action.payload)) {
          const categorizedData: {
            "RHS": Array<{
              id: number;
              district: string;
              sdpType: string;
              centerName: string;
              status: string;
              asDate: string;
              premises: string;
            }>;
            "MSU": Array<{
              id: number;
              district: string;
              sdpType: string;
              centerName: string;
              status: string;
              asDate: string;
              premises: string;
            }>;
            "FWC": Array<{
              id: number;
              district: string;
              sdpType: string;
              centerName: string;
              status: string;
              asDate: string;
              premises: string;
            }>;
          } = {
            "RHS": [],
            "MSU": [],
            "FWC": []
          };

          action.payload.forEach((item: any, index: number) => {
            const projectName = item.ProjectName || '';
            let category: keyof typeof categorizedData | null = null;

            // Determine category based on ProjectName
            if (projectName.includes('RHS')) {
              category = 'RHS';
            } else if (projectName.includes('MSU')) {
              category = 'MSU';
            } else if (projectName.includes('FWC') || projectName.includes('Family Welfare')) {
              category = 'FWC';
            }

            if (category) {
              categorizedData[category].push({
                id: index,
                district: item.District || 'N/A',
                sdpType: projectName,
                centerName: item.Center || 'N/A',
                status: item.OpenClose || 'Unknown',
                asDate: item.asDate || 'N/A',
                premises: item.Premises || 'N/A'
              });
            }
          });
          console.log('categorizedData',categorizedData);

          state.FWCOpenCloseRecord = categorizedData.FWC;
          state.MSUOpenCloseRecord = categorizedData.MSU;
          state.RHSAOpenCloseRecord = categorizedData.RHS;
        }
      })
      .addCase(SldieoutAPI.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });

      builder
      .addCase(StaffPositionAPI.pending, (state: PWDInitINTERFACE) => {
        state.isLoading = true;
      })
      .addCase(StaffPositionAPI.fulfilled, (state: PWDInitINTERFACE, action) => {
        state.isLoading = false;
        
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
            "Sweep"
          ];

          // Status mapping
          const statusMap: { [key: string]: string } = {
            "1": "present",
            "2": "absent",
            "3": "vacant",
            "4": "leave"
          };

          if (data && Array.isArray(data)) {
            return data.map((item: any) => {
              const remarksArray = item.Remarks?.split(',') || [];
              const transformedData: any = {
                asDate: item.asDate,
                District: item.District,
                Center: item.Center
              };

              // Map each staff position to its status
              staffPositions.forEach((position, index) => {
                if (index < remarksArray.length) {
                  const statusCode = remarksArray[index].trim();
                  transformedData[position] = statusMap[statusCode] || 'unknown';
                } else {
                  transformedData[position] = 'unknown';
                }
              });

              return transformedData;
            });
          }
          return [];
        };

        const transformedData = transformAttendanceData(action.payload);
        console.log('Transformed Attendance Data:', transformedData);
        
        state.attendanceRecord = transformedData;
      })

      .addCase(StaffPositionAPI.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });

      builder
      .addCase(MonitoringVisitsReportAPI.pending, (state: PWDInitINTERFACE) => {
        state.isLoading = true;
      })
      .addCase(MonitoringVisitsReportAPI.fulfilled, (state: PWDInitINTERFACE, action) => {
        state.isLoading = false;
        state.MonitoringReportRecord = action.payload;
      })

      .addCase(MonitoringVisitsReportAPI.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });

      builder
      .addCase(OfficerVisitReportAPI.pending, (state: PWDInitINTERFACE) => {
        state.isLoading = true;
      })
      .addCase(OfficerVisitReportAPI.fulfilled, (state: PWDInitINTERFACE, action) => {
        state.isLoading = false;
        
        const transformOfficerVisitData = (data: any[]) => {
          if (!data || !Array.isArray(data)) return [];

          return data.map((item: any) => {
            // Parse the count values
            const parseCount = (countString: string) => {
              const [totalStr, visitedStr] = countString.split('/');
              return {
                total: parseInt(totalStr) || 0,
                visited: parseInt(visitedStr) || 0
              };
            };

            const rhs = parseCount(item.RHSCountVisited || "0/0");
            const fwc = parseCount(item.FWCCountVisited || "0/0");
            const msu = parseCount(item.MSUCountVisited || "0/0");

            // Calculate totals
            const totalCenters = rhs.total + fwc.total + msu.total;
            const totalVisited = rhs.visited + fwc.visited + msu.visited;
            
            // Calculate percentage
            const percentage = totalCenters > 0 ? (totalVisited / totalCenters) * 100 : 0;


            console.log('totalCenters', totalCenters);
            console.log('totalVisited', totalVisited);
            console.log('percentage', percentage);

            // Determine star rating based on percentage
            let stars = 0;
            if (percentage >= 50) {
              stars = 5;
            } else if (percentage >= 40) {
              stars = 4;
            } else if (percentage >= 30) {
              stars = 3;
            } else if (percentage >= 20) {
              stars = 2;
            } else if (percentage >= 10) {
              stars = 1;
            }
            // Below 10% gets 0 stars

            return {
              district: item.District || 'N/A',
              officerName: item.OfficerName || 'N/A',
              designationName: item.DesignationName || 'N/A',
              rhsCountVisited: item.RHSCountVisited || '0/0',
              fwcCountVisited: item.FWCCountVisited || '0/0',
              msuCountVisited: item.MSUCountVisited || '0/0',
              totalDistinctCentersVisited: `${totalCenters}/${totalVisited}`,
              percentage: Math.round(percentage),
              stars: stars,
              // You can also include the parsed numbers separately if needed
              _parsed: {
                rhs,
                fwc,
                msu,
                totalCenters,
                totalVisited
              }
            };
          });
        };

        const transformedData = transformOfficerVisitData(action.payload);
        console.log('Transformed Officer Visit Data:', transformedData);
        
        state.officeGridRecord = transformedData;
      })
      .addCase(OfficerVisitReportAPI.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });
  },
});
export const { updateStates } = PWDINITSLICE.actions;
export default PWDINITSLICE.reducer;
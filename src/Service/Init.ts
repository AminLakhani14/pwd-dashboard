import axios from "axios";
import { PostService } from "../GerneralService/Service";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Give the thunk a proper action type string, not a URL
export const SdpDropdown = createAsyncThunk(
  'init/fetchSdpDropdown',
  async (value: string, { rejectWithValue }) => {
    try {
      const url = `https://pwd.kcompute.com/Designer/GetDistictById/${value}`;
      const response = await PostService(url, null);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data ?? 'Request failed');
    }
  }
);

export const CenterDropdown = createAsyncThunk(
  'init/fetchCenterDropdown',
  async (
    { sdpType, value }: { sdpType: string; value: string },
    { rejectWithValue }
  ) => {
    try {
      const url = `https://pwd.kcompute.com/Designer/GetCentral/${encodeURIComponent(
        sdpType
      )},${encodeURIComponent(value)}`;
      const response = await PostService(url, null);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data ?? 'Request failed');
    }
  }
);

export const dynamicAPI = createAsyncThunk(
  'init/fetchDashboard',
  async (
    { StartDate, EndDate, DistrictID, DistrictName, CenterID, CenterName, ProjectId, QuestionId }: { 
      StartDate: string; 
      EndDate: string; 
      DistrictID: string; 
      DistrictName: string; 
      CenterID: string; 
      CenterName: string; 
      ProjectId: string;
      QuestionId: string; 
    },
    { rejectWithValue }
  ) => {
    try {
      const url = 'https://pwd.kcompute.com/Designer/GetDashboard';
      
      // Create payload object
      const payload = {
        StartDate: StartDate || '',
        EndDate: EndDate || '',
        DistrictID,
        DistrictName,
        CenterID,
        CenterName,
        ProjectId,
        QuestionId
      };
      
      const response = await PostService(url, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data ?? 'Request failed');
    }
  }
);

export const SldieoutAPI = createAsyncThunk(
  'init/fetchSldieout',
  async (
    { StartDate, EndDate, DistrictID, DistrictName, CenterID, CenterName, ProjectId, QuestionId }: { 
      StartDate: string; 
      EndDate: string; 
      DistrictID: string; 
      DistrictName: string; 
      CenterID: string; 
      CenterName: string; 
      ProjectId: string;
      QuestionId: string; 
    },
    { rejectWithValue }
  ) => {
    try { 
      const url = 'https://pwd.kcompute.com/Dashboard/GetSdpsStatus';
      
      // Create payload object
      const payload = {
        StartDate: StartDate || '',
        EndDate: EndDate || '',
        DistrictID,
        DistrictName,
        CenterID,
        CenterName,
        ProjectId,
        QuestionId
      };
      
      const response = await PostService(url, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data ?? 'Request failed');
    }
  }
);

export const StaffPositionAPI = createAsyncThunk(
  'init/fetchStaffPostiton',
  async (
    { StartDate, EndDate, DistrictID, DistrictName, CenterID, CenterName, ProjectId, QuestionId }: { 
      StartDate: string; 
      EndDate: string; 
      DistrictID: string; 
      DistrictName: string; 
      CenterID: string; 
      CenterName: string; 
      ProjectId: string;
      QuestionId: string; 
    },
    { rejectWithValue }
  ) => {
    try { 
      const url = `https://pwd.kcompute.com/Dashboard/StaffPosition`;
      
      // Create payload object
      const payload = {
        StartDate: StartDate || '',
        EndDate: EndDate || '',
        DistrictID,
        DistrictName,
        CenterID,
        CenterName,
        ProjectId,
        QuestionId
      };
      
      const response = await PostService(url, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data ?? 'Request failed');
    }
  }
);

export const MonitoringVisitsReportAPI = createAsyncThunk(
  'init/fetchMonitoringVisitsReport',
  async (
    { StartDate, EndDate, DistrictID, DistrictName, CenterID, CenterName, ProjectId, QuestionId }: { 
      StartDate: string; 
      EndDate: string; 
      DistrictID: string; 
      DistrictName: string; 
      CenterID: string; 
      CenterName: string; 
      ProjectId: string;
      QuestionId: string; 
    },
    { rejectWithValue }
  ) => {
    try { 
      const url = `https://pwd.kcompute.com/Dashboard/MonitoringVisitsReport`;
      
      // Create payload object
      const payload = {
        StartDate: StartDate || '',
        EndDate: EndDate || '',
        DistrictID,
        DistrictName,
        CenterID,
        CenterName,
        ProjectId,
        QuestionId
      };
      
      const response = await PostService(url, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data ?? 'Request failed');
    }
  }
);

export const OfficerVisitReportAPI = createAsyncThunk(
  'init/fetchOfficerVisitReport',
  async () => {
    try { 
      const url = `https://pwd.kcompute.com/Dashboard/OfficerVisitReport`;
      
      const response = await axios.get(url);
      
      return response.data;
    } catch (error: any) {
      return 'Request failed';
    }
  }
);

export const StockOfContraceptiveAPI = createAsyncThunk(
  'init/fetchStockOfContraceptive',
  async (
    { StartDate, EndDate, DistrictID, DistrictName, CenterID, CenterName, ProjectId, QuestionId }: { 
      StartDate: string; 
      EndDate: string; 
      DistrictID: string; 
      DistrictName: string; 
      CenterID: string; 
      CenterName: string; 
      ProjectId: string;
      QuestionId: string; 
    },
    { rejectWithValue }
  ) => {
    try { 
      const url = `https://pwd.kcompute.com/Dashboard/StockOfContraceptive`;
      
      // Create payload object
      const payload = {
        StartDate: StartDate || '',
        EndDate: EndDate || '',
        DistrictID,
        DistrictName,
        CenterID,
        CenterName,
        ProjectId,
        QuestionId
      };
      
      const response = await PostService(url, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data ?? 'Request failed');
    }
  }
);

export const DetailStockOfContraceptiveAPI = createAsyncThunk(
  'init/fetchDetailStockOfContraceptive',
  async (
    { StartDate, EndDate, DistrictID, DistrictName, CenterID, CenterName, ProjectId, QuestionId }: { 
      StartDate: string; 
      EndDate: string; 
      DistrictID: string; 
      DistrictName: string; 
      CenterID: string; 
      CenterName: string; 
      ProjectId: string;
      QuestionId: string; 
    },
    { rejectWithValue }
  ) => {
    try { 
      const url = `https://pwd.kcompute.com/Dashboard/DetailStockOfContraceptive`;
      
      // Create payload object
      const payload = {
        StartDate: StartDate || '',
        EndDate: EndDate || '',
        DistrictID,
        DistrictName,
        CenterID,
        CenterName,
        ProjectId,
        QuestionId
      };
      
      const response = await PostService(url, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data ?? 'Request failed');
    }
  }
);

export const EquiptmentPositionDetailAPI = createAsyncThunk(
  'init/fetchEquiptmentPositionDetail',
  async (
    { StartDate, EndDate, DistrictID, DistrictName, CenterID, CenterName, ProjectId, QuestionId }: { 
      StartDate: string; 
      EndDate: string; 
      DistrictID: string; 
      DistrictName: string; 
      CenterID: string; 
      CenterName: string; 
      ProjectId: string;
      QuestionId: string; 
    },
    { rejectWithValue }
  ) => {
    try { 
      const url = `https://pwd.kcompute.com/Dashboard/EquiptmentPositionDetail`;
      
      // Create payload object
      const payload = {
        StartDate: StartDate || '',
        EndDate: EndDate || '',
        DistrictID,
        DistrictName,
        CenterID,
        CenterName,
        ProjectId,
        QuestionId
      };
      
      const response = await PostService(url, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data ?? 'Request failed');
    }
  }
);

export const TechnicalMonitoringDetailAPI = createAsyncThunk(
  'init/fetchTechnicalMonitoringDetail',
  async (
    { StartDate, EndDate, DistrictID, DistrictName, CenterID, CenterName, ProjectId, QuestionId }: { 
      StartDate: string; 
      EndDate: string; 
      DistrictID: string; 
      DistrictName: string; 
      CenterID: string; 
      CenterName: string; 
      ProjectId: string;
      QuestionId: string; 
    },
    { rejectWithValue }
  ) => {
    try { 
      const url = `https://pwd.kcompute.com/Dashboard/TechnicalMonitoringDetail`;
      
      // Create payload object
      const payload = {
        StartDate: StartDate || '',
        EndDate: EndDate || '',
        DistrictID,
        DistrictName,
        CenterID,
        CenterName,
        ProjectId,
        QuestionId
      };
      
      const response = await PostService(url, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data ?? 'Request failed');
    }
  }
);

export const TechnicalMonitoringStockAPI = createAsyncThunk(
  'init/fetchTechnicalMonitoringStock',
  async (
    { StartDate, EndDate, DistrictID, DistrictName, CenterID, CenterName, ProjectId, QuestionId }: { 
      StartDate: string; 
      EndDate: string; 
      DistrictID: string; 
      DistrictName: string; 
      CenterID: string; 
      CenterName: string; 
      ProjectId: string;
      QuestionId: string; 
    },
    { rejectWithValue }
  ) => {
    try { 
      const url = `https://pwd.kcompute.com/Dashboard/TechnicalMonitoringStock`;
      
      // Create payload object
      const payload = {
        StartDate: StartDate || '',
        EndDate: EndDate || '',
        DistrictID,
        DistrictName,
        CenterID,
        CenterName,
        ProjectId,
        QuestionId
      };
      
      const response = await PostService(url, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data ?? 'Request failed');
    }
  }
);

export const EquiptmentPositionStockAPI = createAsyncThunk(
  'init/fetchEquiptmentPositionStockAPI',
  async (
    { StartDate, EndDate, DistrictID, DistrictName, CenterID, CenterName, ProjectId, QuestionId }: { 
      StartDate: string; 
      EndDate: string; 
      DistrictID: string; 
      DistrictName: string; 
      CenterID: string; 
      CenterName: string; 
      ProjectId: string;
      QuestionId: string; 
    },
    { rejectWithValue }
  ) => {
    try { 
      const url = `https://pwd.kcompute.com/Dashboard/EquiptmentPositionStock`;
      
      // Create payload object
      const payload = {
        StartDate: StartDate || '',
        EndDate: EndDate || '',
        DistrictID,
        DistrictName,
        CenterID,
        CenterName,
        ProjectId,
        QuestionId
      };
      
      const response = await PostService(url, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data ?? 'Request failed');
    }
  }
);


export const IECMatrialStockAPI = createAsyncThunk(
  'init/fetchIECMatrialStockAPI',
  async (
    { StartDate, EndDate, DistrictID, DistrictName, CenterID, CenterName, ProjectId, QuestionId }: { 
      StartDate: string; 
      EndDate: string; 
      DistrictID: string; 
      DistrictName: string; 
      CenterID: string; 
      CenterName: string; 
      ProjectId: string;
      QuestionId: string; 
    },
    { rejectWithValue }
  ) => {
    try { 
      const url = `https://pwd.kcompute.com/Dashboard/IECMatrialStock`;
      
      // Create payload object
      const payload = {
        StartDate: StartDate || '',
        EndDate: EndDate || '',
        DistrictID,
        DistrictName,
        CenterID,
        CenterName,
        ProjectId,
        QuestionId
      };
      
      const response = await PostService(url, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data ?? 'Request failed');
    }
  }
);

export const IECMatrialDetailAPI = createAsyncThunk(
  'init/fetchIECMatrialDetailAPI',
  async (
    { StartDate, EndDate, DistrictID, DistrictName, CenterID, CenterName, ProjectId, QuestionId }: { 
      StartDate: string; 
      EndDate: string; 
      DistrictID: string; 
      DistrictName: string; 
      CenterID: string; 
      CenterName: string; 
      ProjectId: string;
      QuestionId: string; 
    },
    { rejectWithValue }
  ) => {
    try { 
      const url = `https://pwd.kcompute.com/Dashboard/IECMatrialDetail`;
      
      // Create payload object
      const payload = {
        StartDate: StartDate || '',
        EndDate: EndDate || '',
        DistrictID,
        DistrictName,
        CenterID,
        CenterName,
        ProjectId,
        QuestionId
      };
      
      const response = await PostService(url, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data ?? 'Request failed');
    }
  }
);

export const PerformaceOfSdpAPI = createAsyncThunk(
  'init/fetchPerformaceOfSdp',
  async (
    { StartDate, EndDate, DistrictID, DistrictName, CenterID, CenterName, ProjectId, QuestionId }: { 
      StartDate: string; 
      EndDate: string; 
      DistrictID: string; 
      DistrictName: string; 
      CenterID: string; 
      CenterName: string; 
      ProjectId: string;
      QuestionId: string; 
    },
    { rejectWithValue }
  ) => {
    try { 
      const url = `https://pwd.kcompute.com/Dashboard/PerformaceOfSdp`;
      
      // Create payload object
      const payload = {
        StartDate: StartDate || '',
        EndDate: EndDate || '',
        DistrictID,
        DistrictName,
        CenterID,
        CenterName,
        ProjectId,
        QuestionId
      };
      
      const response = await PostService(url, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data ?? 'Request failed');
    }
  }
);

export const StatusOfBuildingAPI = createAsyncThunk(
  'init/fetchStatusOfBuilding',
  async (
    { StartDate, EndDate, DistrictID, DistrictName, CenterID, CenterName, ProjectId, QuestionId }: { 
      StartDate: string; 
      EndDate: string; 
      DistrictID: string; 
      DistrictName: string; 
      CenterID: string; 
      CenterName: string; 
      ProjectId: string;
      QuestionId: string; 
    },
    { rejectWithValue }
  ) => {
    try { 
      const url = `https://pwd.kcompute.com/Dashboard/StatusOfBuilding`;
      
      // Create payload object
      const payload = {
        StartDate: StartDate || '',
        EndDate: EndDate || '',
        DistrictID,
        DistrictName,
        CenterID,
        CenterName,
        ProjectId,
        QuestionId
      };
      
      const response = await PostService(url, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data ?? 'Request failed');
    }
  }
);
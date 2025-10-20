import { PostService } from "../GerneralService/Service";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Give the thunk a proper action type string, not a URL
export const SdpDropdown = createAsyncThunk(
  'init/fetchSdpDropdown',
  async (value: string, { rejectWithValue }) => {
    try {
      const url = `http://localhost:54050/Designer/GetDistictById/${value}`;
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
      const url = `http://localhost:54050/Designer/GetCentral/${encodeURIComponent(
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
      const url = 'http://localhost:54050/Designer/GetDashboard';
      
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
      const url = 'http://localhost:54050/Dashboard/GetSdpsStatus';
      
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
      const url = `http://localhost:54050/Dashboard/StaffPosition`;
      
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
      const url = `http://localhost:54050/Dashboard/MonitoringVisitsReport`;
      
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
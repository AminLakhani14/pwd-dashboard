import axios from "axios";
import { GetService } from "../GerneralService/Service";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const SdpDropdown:any = createAsyncThunk(`http://localhost:54050/Designer/GetDistictById/55587,%20FWC,7122`, async () =>{
    const response  = await GetService(`http://localhost:54050/Designer/GetDistictById/55587,%20FWC,7122`);
    return  response;
});
import { createSlice } from '@reduxjs/toolkit'
import { SdpDropdown } from '../Service/Init';
import { IActionKeyValueData, PWDInitINTERFACE } from '../Interface/InitInterface';
import { PWDinitModel } from '../Model/InitModel';


const initialState: PWDInitINTERFACE = PWDinitModel;
const PWDINITSLICE = createSlice({
  name: 'PWDINITSLICE',
  initialState,
  reducers: {
    updateTCStates: (state: PWDInitINTERFACE, action: IActionKeyValueData) => {
      const key = action?.payload?.key as keyof PWDInitINTERFACE;
      if (key) {
        state[key] = action.payload.value as any;
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
      })
      .addCase(SdpDropdown.rejected, (state: PWDInitINTERFACE) => {
        state.isLoading = false;
      });
  },
});
export const { updateTCStates } = PWDINITSLICE.actions;
export default PWDINITSLICE.reducer;
import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../features/ui/uiSlice';
import { useDispatch } from 'react-redux';
import PWDINITSLICE from '../Slice/InitSlice';
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    PWDINITSLICE:PWDINITSLICE
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Building } from '../../types';

interface BuildingState {
  data: Building | null;
  loading: boolean;
  error: string | null;
}

const initialState: BuildingState = {
  data: null,
  loading: false,
  error: null,
};

const buildingSlice = createSlice({
  name: 'building',
  initialState,
  reducers: {
    initializeBuilding: (state, action: PayloadAction<Building>) => {
      state.data = action.payload;
    },
    
    updateFloorStatus: (state, action: PayloadAction<{ floorNumber: number; status: 'occupied' | 'vacant'; tenantName?: string }>) => {
      const { floorNumber, status, tenantName } = action.payload;
      if (state.data) {
        const floor = state.data.floors.find(f => f.floorNumber === floorNumber);
        if (floor) {
          floor.status = status;
          floor.tenantName = tenantName || undefined;
          floor.tenantId = status === 'occupied' ? `tenant-${floorNumber}` : undefined;
        }
      }
    },
    
    updateFloorTerms: (state, action: PayloadAction<{ floorNumber: number; rent: number; commonCharge: number; deposit: string; keyMoney: string }>) => {
      const { floorNumber, ...terms } = action.payload;
      if (state.data) {
        const floor = state.data.floors.find(f => f.floorNumber === floorNumber);
        if (floor) {
          Object.assign(floor, terms);
        }
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { initializeBuilding, updateFloorStatus, updateFloorTerms, setLoading, setError } = buildingSlice.actions;
export default buildingSlice.reducer;
import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { ViewingReservation } from '../../types';

interface ViewingsState {
  entities: Record<string, ViewingReservation>;
  ids: string[];
  byDate: Record<string, string[]>;
  byFloor: Record<number, string[]>;
  loading: boolean;
  error: string | null;
}

const initialState: ViewingsState = {
  entities: {},
  ids: [],
  byDate: {},
  byFloor: {},
  loading: false,
  error: null,
};

const viewingsSlice = createSlice({
  name: 'viewings',
  initialState,
  reducers: {
    initializeViewings: (state, action: PayloadAction<ViewingsState>) => {
      Object.assign(state, action.payload);
    },
    
    createViewing: {
      reducer: (state, action: PayloadAction<ViewingReservation>) => {
        const viewing = action.payload;
        state.entities[viewing.id] = viewing;
        state.ids.push(viewing.id);
        
        // Add to byDate index
        if (!state.byDate[viewing.reservationDate]) {
          state.byDate[viewing.reservationDate] = [];
        }
        state.byDate[viewing.reservationDate].push(viewing.id);
        
        // Add to byFloor index
        if (!state.byFloor[viewing.floorNumber]) {
          state.byFloor[viewing.floorNumber] = [];
        }
        state.byFloor[viewing.floorNumber].push(viewing.id);
      },
      prepare: (viewingData: Omit<ViewingReservation, 'id'>) => ({
        payload: {
          id: nanoid(),
          ...viewingData,
        },
      }),
    },
    
    updateViewingStatus: (state, action: PayloadAction<{ id: string; status: ViewingReservation['status'] }>) => {
      const { id, status } = action.payload;
      const viewing = state.entities[id];
      if (viewing) {
        viewing.status = status;
      }
    },
    
    cancelViewing: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const viewing = state.entities[id];
      if (viewing) {
        viewing.status = 'cancelled';
      }
    },
  },
});

export const { initializeViewings, createViewing, updateViewingStatus, cancelViewing } = viewingsSlice.actions;
export default viewingsSlice.reducer;
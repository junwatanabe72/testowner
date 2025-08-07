import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { ActivityLog } from '../../types';

interface ActivitiesState {
  entities: Record<string, ActivityLog>;
  ids: string[];
  byDate: Record<string, string[]>;
  loading: boolean;
  error: string | null;
}

const initialState: ActivitiesState = {
  entities: {},
  ids: [],
  byDate: {},
  loading: false,
  error: null,
};

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    initializeActivities: (state, action: PayloadAction<ActivitiesState>) => {
      Object.assign(state, action.payload);
    },
    
    addActivity: {
      reducer: (state, action: PayloadAction<ActivityLog>) => {
        const activity = action.payload;
        state.entities[activity.id] = activity;
        state.ids.unshift(activity.id); // Add to beginning for newest first
        
        // Add to byDate index
        if (!state.byDate[activity.date]) {
          state.byDate[activity.date] = [];
        }
        state.byDate[activity.date].push(activity.id);
      },
      prepare: (activityData: Omit<ActivityLog, 'id' | 'date'>) => ({
        payload: {
          id: nanoid(),
          date: new Date().toISOString().split('T')[0],
          ...activityData,
        },
      }),
    },
  },
});

export const { initializeActivities, addActivity } = activitiesSlice.actions;
export default activitiesSlice.reducer;
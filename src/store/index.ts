import { configureStore, combineReducers } from '@reduxjs/toolkit';
import buildingReducer from './slices/buildingSlice';
import applicationsReducer from './slices/applicationsSlice';
import viewingsReducer from './slices/viewingsSlice';
import activitiesReducer from './slices/activitiesSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';
import loadingReducer from './slices/loadingSlice';
import errorReducer from './slices/errorSlice';
import viewingReservationsReducer from './slices/viewingReservationsSlice';
import tenantApplicationsReducer from './slices/tenantApplicationsSlice';
import recruitmentReducer from './slices/recruitmentSlice';
import { localStorageMiddleware, loadPersistedState } from './middleware';
import { generateInitialData } from '../utils/dataGenerator';

const rootReducer = combineReducers({
  building: buildingReducer,
  applications: applicationsReducer,
  viewings: viewingsReducer,
  activities: activitiesReducer,
  ui: uiReducer,
  user: userReducer,
  loading: loadingReducer,
  error: errorReducer,
  viewingReservations: viewingReservationsReducer,
  tenantApplications: tenantApplicationsReducer,
  recruitment: recruitmentReducer,
});

const persistedState = loadPersistedState();
const initialData: Partial<RootState> | undefined = (persistedState || generateInitialData()) as any;

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialData,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // 永続化対象に Date 文字列などが含まれてもビルドを阻害しないために無効化
      serializableCheck: false,
    }).concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

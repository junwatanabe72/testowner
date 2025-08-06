import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authSlice from './slices/authSlice';
import applicationsSlice from './slices/applicationsSlice';
import notificationsSlice from './slices/notificationsSlice';
import uiSlice from './slices/uiSlice';

// ミドルウェア
import { sessionTimeoutMiddleware, localStorageMiddleware, errorHandlingMiddleware } from './middleware';

const configuredStore: any = configureStore({
  reducer: {
    auth: authSlice,
    applications: applicationsSlice,
    notifications: notificationsSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['ui.modals'],
      },
    }).concat([
      sessionTimeoutMiddleware,
      localStorageMiddleware,
      errorHandlingMiddleware,
    ]),
  devTools: process.env.NODE_ENV !== 'production',
});

export const store = configuredStore;

export type RootState = ReturnType<typeof configuredStore.getState>;
export type AppDispatch = typeof configuredStore.dispatch;

// 型付きhooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
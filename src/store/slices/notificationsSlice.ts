import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types';

interface NotificationsState {
  items: Record<string, Notification>;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  items: {},
  unreadCount: 0,
  isLoading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.items[action.payload.id] = action.payload;
      if (!action.payload.read_status) {
        state.unreadCount++;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items[action.payload];
      if (notification && !notification.read_status) {
        notification.read_status = true;
        notification.read_at = new Date().toISOString();
        state.unreadCount--;
      }
    },
    markAllAsRead: (state) => {
      Object.values(state.items).forEach(notification => {
        if (!notification.read_status) {
          notification.read_status = true;
          notification.read_at = new Date().toISOString();
        }
      });
      state.unreadCount = 0;
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      const notification = state.items[action.payload];
      if (notification && !notification.read_status) {
        state.unreadCount--;
      }
      delete state.items[action.payload];
    },
    clearError: (state) => {
      state.error = null;
    },
    // 初期通知データの設定
    initializeNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.items = action.payload.reduce((acc, notification) => {
        acc[notification.id] = notification;
        return acc;
      }, {} as Record<string, Notification>);
      state.unreadCount = action.payload.filter(n => !n.read_status).length;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearError,
  initializeNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
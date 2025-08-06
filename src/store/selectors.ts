import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';

// Auth selectors
export const selectAuthState = (state: RootState) => state.auth;
export const selectCurrentUser = createSelector(
  selectAuthState,
  (auth) => auth.user
);
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (auth) => auth.isAuthenticated
);
export const selectUserRole = createSelector(
  selectCurrentUser,
  (user) => user?.role
);

// Applications selectors
export const selectApplicationsState = (state: RootState) => state.applications;
export const selectAllApplications = createSelector(
  selectApplicationsState,
  (applications) => Object.values(applications.items)
);

export const selectFilteredApplications = createSelector(
  [selectAllApplications, selectApplicationsState],
  (applications, state) => {
    return applications.filter((app: any) => {
      const { filters } = state;
      
      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(app.status)) return false;
      }
      
      // Type filter
      if (filters.type && filters.type.length > 0) {
        if (!filters.type.includes(app.type)) return false;
      }
      
      // Priority filter
      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(app.priority)) return false;
      }
      
      return true;
    });
  }
);

export const selectPendingApplicationsCount = createSelector(
  selectAllApplications,
  (applications) => applications.filter((app: any) => app.status === 'submitted').length
);

// Notifications selectors
export const selectNotificationsState = (state: RootState) => state.notifications;
export const selectUnreadNotifications = createSelector(
  selectNotificationsState,
  (notifications) => Object.values(notifications.items).filter((n: any) => !n.read_status)
);

export const selectUnreadNotificationsCount = createSelector(
  selectNotificationsState,
  (notifications) => notifications.unreadCount
);

// UI selectors
export const selectUIState = (state: RootState) => state.ui;
export const selectIsMobile = createSelector(
  selectUIState,
  (ui) => ui.isMobile
);
export const selectSidebarCollapsed = createSelector(
  selectUIState,
  (ui) => ui.sidebarCollapsed
);
export const selectToasts = createSelector(
  selectUIState,
  (ui) => ui.toasts
);
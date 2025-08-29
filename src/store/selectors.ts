import { RootState } from './index';
import { Floor, ViewingReservation } from '../types';
import { createSelector } from '@reduxjs/toolkit';

// Building selectors
export const selectBuilding = (state: RootState) => state.building.data;
export const selectFloors = (state: RootState) => state.building.data?.floors || [];

export const selectOccupancyRate = createSelector([selectFloors], (floors: Floor[]) => {
  if (floors.length === 0) return 0;
  const occupiedCount = floors.filter((f) => f.status === 'occupied').length;
  return Math.round((occupiedCount / floors.length) * 100);
});

export const selectVacantFloors = createSelector([selectFloors], (floors: Floor[]) =>
  [...floors]
    .filter((f) => f.status === 'vacant')
    .sort((a, b) => b.floorNumber - a.floorNumber)
);

export const selectOccupiedFloors = createSelector([selectFloors], (floors: Floor[]) =>
  [...floors]
    .filter((f) => f.status === 'occupied')
    .sort((a, b) => b.floorNumber - a.floorNumber)
);

// Applications selectors
export const selectApplications = (state: RootState) => state.applications;
export const selectPendingApplications = createSelector(
  [(state: RootState) => state.applications],
  (apps) => {
    const pendingIds = apps.byStatus['pending'] || [];
    return pendingIds.map((id: string) => apps.entities[id]).filter(Boolean);
  }
);

export const selectPendingApplicationsCount = createSelector(
  [(state: RootState) => state.applications.byStatus['pending']],
  (pending) => pending?.length || 0
);

// Viewings selectors
export const selectViewings = (state: RootState) => state.viewings;
export const selectViewingsByFloor = (state: RootState, floorNumber: number) => {
  const viewingIds = state.viewings.byFloor[floorNumber] || [];
  return viewingIds.map((id: string) => state.viewings.entities[id]).filter(Boolean);
};

export const selectPendingViewings = createSelector(
  [(state: RootState) => state.viewings],
  (viewings) =>
    viewings.ids
      .map((id: string) => viewings.entities[id])
      .filter((v: ViewingReservation) => v && v.status === 'pending')
      .sort((a: ViewingReservation, b: ViewingReservation) => a.reservationDate.localeCompare(b.reservationDate))
);

// Activities selectors
export const selectRecentActivities = (state: RootState, limit: number = 10) => {
  return state.activities.ids
    .slice(0, limit)
    .map((id: string) => state.activities.entities[id])
    .filter(Boolean);
};

// User selectors
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectUserRole = (state: RootState) => state.user.currentUser?.role;

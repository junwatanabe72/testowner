import { RootState } from './index';
import { Floor, ViewingReservation } from '../types';

// Building selectors
export const selectBuilding = (state: RootState) => state.building.data;
export const selectFloors = (state: RootState) => state.building.data?.floors || [];

export const selectOccupancyRate = (state: RootState) => {
  const floors = selectFloors(state);
  if (floors.length === 0) return 0;
  const occupiedCount = floors.filter((f: Floor) => f.status === 'occupied').length;
  return Math.round((occupiedCount / floors.length) * 100);
};

export const selectVacantFloors = (state: RootState) => {
  return selectFloors(state)
    .filter((f: Floor) => f.status === 'vacant')
    .sort((a: Floor, b: Floor) => b.floorNumber - a.floorNumber);
};

export const selectOccupiedFloors = (state: RootState) => {
  return selectFloors(state)
    .filter((f: Floor) => f.status === 'occupied')
    .sort((a: Floor, b: Floor) => b.floorNumber - a.floorNumber);
};

// Applications selectors
export const selectApplications = (state: RootState) => state.applications;
export const selectPendingApplications = (state: RootState) => {
  const pendingIds = state.applications.byStatus['pending'] || [];
  return pendingIds.map((id: string) => state.applications.entities[id]);
};

export const selectPendingApplicationsCount = (state: RootState) => {
  return state.applications.byStatus['pending']?.length || 0;
};

// Viewings selectors
export const selectViewings = (state: RootState) => state.viewings;
export const selectViewingsByFloor = (state: RootState, floorNumber: number) => {
  const viewingIds = state.viewings.byFloor[floorNumber] || [];
  return viewingIds.map((id: string) => state.viewings.entities[id]);
};

export const selectPendingViewings = (state: RootState) => {
  return state.viewings.ids
    .map((id: string) => state.viewings.entities[id])
    .filter((v: ViewingReservation) => v.status === 'pending')
    .sort((a: ViewingReservation, b: ViewingReservation) => a.reservationDate.localeCompare(b.reservationDate));
};

// Activities selectors
export const selectRecentActivities = (state: RootState, limit: number = 10) => {
  return state.activities.ids
    .slice(0, limit)
    .map((id: string) => state.activities.entities[id]);
};

// User selectors
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectUserRole = (state: RootState) => state.user.currentUser?.role;
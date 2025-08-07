import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ViewingReservation } from '../../types';

interface ViewingReservationsState {
  reservations: ViewingReservation[];
  loading: boolean;
  error: string | null;
}

const initialState: ViewingReservationsState = {
  reservations: [
    // エステート不動産の予約（現在ログイン中の仲介会社）
    {
      id: 'res-1',
      floorNumber: 5,
      reservationDate: '2025-08-10',
      timeSlot: '10:00-11:00',
      status: 'approved',
      brokerCompany: 'エステート不動産',
      clientName: '山田太郎',
      notes: '駐車場の利用についても確認したい',
    },
    {
      id: 'res-today-1',
      floorNumber: 5,
      reservationDate: new Date().toISOString().split('T')[0],
      timeSlot: '14:00-15:00',
      status: 'pending',
      brokerCompany: 'エステート不動産',
      clientName: '鈴木次郎',
      notes: 'IT企業、15名規模での移転検討',
    },
    // 他社の予約
    {
      id: 'res-2',
      floorNumber: 6,
      reservationDate: '2025-08-12',
      timeSlot: '14:00-15:00',
      status: 'pending',
      brokerCompany: '総合不動産サービス',
      clientName: '佐藤花子',
      notes: '会議室の利用可能性について質問予定',
    },
    {
      id: 'res-today-2',
      floorNumber: 5,
      reservationDate: new Date().toISOString().split('T')[0],
      timeSlot: '10:00-11:00',
      status: 'approved',
      brokerCompany: '総合不動産サービス',
      clientName: '高橋三郎',
      notes: '製造業の本社移転候補',
    },
    {
      id: 'res-today-3',
      floorNumber: 6,
      reservationDate: new Date().toISOString().split('T')[0],
      timeSlot: '11:00-12:00',
      status: 'approved',
      brokerCompany: 'オフィス専門不動産',
      clientName: '伊藤美咲',
      notes: 'コンサルティング会社、20名規模',
    },
    {
      id: 'res-3',
      floorNumber: 5,
      reservationDate: '2025-08-08',
      timeSlot: '11:00-12:00',
      status: 'completed',
      brokerCompany: 'ビジネス不動産',
      clientName: '田中一郎',
      notes: 'スタートアップ企業、8名規模',
    },
  ],
  loading: false,
  error: null,
};

const viewingReservationsSlice = createSlice({
  name: 'viewingReservations',
  initialState,
  reducers: {
    addViewingReservation: (state, action: PayloadAction<ViewingReservation>) => {
      state.reservations.push(action.payload);
    },
    updateViewingReservationStatus: (state, action: PayloadAction<{ id: string; status: ViewingReservation['status'] }>) => {
      const { id, status } = action.payload;
      const reservation = state.reservations.find(r => r.id === id);
      if (reservation) {
        reservation.status = status;
      }
    },
    cancelViewingReservation: (state, action: PayloadAction<string>) => {
      const reservation = state.reservations.find(r => r.id === action.payload);
      if (reservation) {
        reservation.status = 'cancelled';
      }
    },
    deleteViewingReservation: (state, action: PayloadAction<string>) => {
      state.reservations = state.reservations.filter(r => r.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addViewingReservation,
  updateViewingReservationStatus,
  cancelViewingReservation,
  deleteViewingReservation,
  setLoading,
  setError,
} = viewingReservationsSlice.actions;

export default viewingReservationsSlice.reducer;
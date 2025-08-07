import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface UIState {
  notification: Notification | null;
  loading: boolean;
  activeModal: string | null;
}

const initialState: UIState = {
  notification: null,
  loading: false,
  activeModal: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      state.notification = {
        id: Date.now().toString(),
        ...action.payload,
      };
    },
    
    hideNotification: (state) => {
      state.notification = null;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    
    closeModal: (state) => {
      state.activeModal = null;
    },
  },
});

export const { showNotification, hideNotification, setLoading, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
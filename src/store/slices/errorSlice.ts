import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ErrorInfo {
  id: string;
  message: string;
  type: 'network' | 'validation' | 'server' | 'unknown';
  timestamp: string;
  operation?: string;
}

interface ErrorState {
  errors: ErrorInfo[];
  globalError: ErrorInfo | null;
}

const initialState: ErrorState = {
  errors: [],
  globalError: null,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    addError: (state, action: PayloadAction<Omit<ErrorInfo, 'id' | 'timestamp'>>) => {
      const error: ErrorInfo = {
        ...action.payload,
        id: `error-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      state.errors.push(error);
      
      // 重大なエラーの場合はグローバルエラーとして設定
      if (action.payload.type === 'server' || action.payload.type === 'network') {
        state.globalError = error;
      }
    },
    removeError: (state, action: PayloadAction<string>) => {
      state.errors = state.errors.filter(error => error.id !== action.payload);
      if (state.globalError && state.globalError.id === action.payload) {
        state.globalError = null;
      }
    },
    clearErrors: (state) => {
      state.errors = [];
      state.globalError = null;
    },
    clearGlobalError: (state) => {
      state.globalError = null;
    },
  },
});

export const {
  addError,
  removeError,
  clearErrors,
  clearGlobalError,
} = errorSlice.actions;

export default errorSlice.reducer;
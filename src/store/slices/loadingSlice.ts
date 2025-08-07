import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoadingState {
  global: boolean;
  operations: { [key: string]: boolean };
}

const initialState: LoadingState = {
  global: false,
  operations: {},
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.global = action.payload;
    },
    setOperationLoading: (state, action: PayloadAction<{ operation: string; loading: boolean }>) => {
      state.operations[action.payload.operation] = action.payload.loading;
    },
    clearOperationLoading: (state, action: PayloadAction<string>) => {
      delete state.operations[action.payload];
    },
    clearAllLoading: (state) => {
      state.global = false;
      state.operations = {};
    },
  },
});

export const {
  setGlobalLoading,
  setOperationLoading,
  clearOperationLoading,
  clearAllLoading,
} = loadingSlice.actions;

export default loadingSlice.reducer;
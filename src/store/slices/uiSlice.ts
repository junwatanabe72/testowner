import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface ModalState {
  isOpen: boolean;
  data?: any;
}

interface Breadcrumb {
  label: string;
  path?: string;
}

interface UIState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  loading: Record<string, boolean>;
  modals: Record<string, ModalState>;
  toasts: Toast[];
  currentPage: string;
  breadcrumbs: Breadcrumb[];
  isMobile: boolean;
}

const initialState: UIState = {
  theme: 'light',
  sidebarCollapsed: false,
  loading: {},
  modals: {},
  toasts: [],
  currentPage: '',
  breadcrumbs: [],
  isMobile: window.innerWidth < 768,
};

const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setLoading: (state, action: PayloadAction<{key: string; isLoading: boolean}>) => {
      state.loading[action.payload.key] = action.payload.isLoading;
    },
    openModal: (state, action: PayloadAction<{modalId: string; data?: any}>) => {
      state.modals[action.payload.modalId] = {
        isOpen: true,
        data: action.payload.data,
      };
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = { isOpen: false };
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast: Toast = {
        ...action.payload,
        id: generateId(),
        duration: action.payload.duration || 5000,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    setBreadcrumbs: (state, action: PayloadAction<Breadcrumb[]>) => {
      state.breadcrumbs = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarCollapsed,
  setLoading,
  openModal,
  closeModal,
  addToast,
  removeToast,
  setBreadcrumbs,
  setCurrentPage,
  setIsMobile,
} = uiSlice.actions;

export default uiSlice.reducer;
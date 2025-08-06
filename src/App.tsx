import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';
import { useAppSelector, useAppDispatch } from './store';
import { selectIsAuthenticated, selectUIState } from './store/selectors';
import { setIsMobile } from './store/slices/uiSlice';

// コンポーネント
import SimpleLoginPage from './pages/SimpleLoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import SimpleOwnerDashboard from './pages/SimpleOwnerDashboard';
import SimpleTenantPortal from './pages/SimpleTenantPortal';
import ToastProvider from './components/common/ToastProvider';

// スマホ対応のテーマ設定
const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#6c757d',
    },
    success: {
      main: '#28a745',
    },
    warning: {
      main: '#ffc107',
    },
    error: {
      main: '#dc3545',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minHeight: '44px', // タッチしやすいサイズ
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            minHeight: '44px', // タッチしやすいサイズ
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

function AppContent() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { isMobile } = useAppSelector(selectUIState);
  const dispatch = useAppDispatch();

  // レスポンシブ対応
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      if (mobile !== isMobile) {
        dispatch(setIsMobile(mobile));
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [isMobile, dispatch]);

  // 認証状態の復元
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('currentUser');
    
    if (token && userStr) {
      try {
        // TODO: 実際のアプリでは、トークンの有効性を確認し、セッションを復元
        console.log('Session restoration would happen here');
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<SimpleLoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/owner/*" element={<SimpleOwnerDashboard />} />
        <Route path="/broker/*" element={<div>仲介会社ダッシュボード（開発中）</div>} />
        <Route path="/" element={<Navigate to="/owner" replace />} />
        <Route path="*" element={<Navigate to="/owner" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
          <ToastProvider />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

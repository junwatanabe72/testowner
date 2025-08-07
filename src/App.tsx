import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import AppLayout from './components/Layout/AppLayout';
import RoleSelection from './pages/RoleSelection';
import OwnerDashboard from './features/owner/pages/OwnerDashboard';
import ApprovalManagement from './features/owner/pages/ApprovalManagement';
import VacancyManagement from './features/owner/pages/VacancyManagement';
import TenantManagement from './features/owner/pages/TenantManagement';
import FacilityManagement from './features/owner/pages/FacilityManagement';
import MaintenanceManagement from './features/owner/pages/MaintenanceManagement';
import ConstructionManagement from './features/owner/pages/ConstructionManagement';
import EmergencyManagement from './features/owner/pages/EmergencyManagement';
import BrokerPortal from './features/broker/pages/BrokerPortal';
import ViewingReservation from './features/broker/pages/ViewingReservation';
import Notification from './components/Common/Notification';
import ErrorBoundary from './components/Common/ErrorBoundary';
import DataManagement from './components/Common/DataManagement';
import ApplicationManagement from './features/owner/pages/ApplicationManagement';
import EnhancedTenantManagement from './features/owner/pages/EnhancedTenantManagement';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <Notification />
          <Routes>
          <Route path="/" element={<RoleSelection />} />
          
          <Route path="/owner" element={<AppLayout />}>
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="vacancy" element={<VacancyManagement />} />
            <Route path="tenant" element={<EnhancedTenantManagement />} />
            <Route path="applications" element={<ApplicationManagement />} />
            <Route path="facility" element={<FacilityManagement />} />
            <Route path="maintenance" element={<MaintenanceManagement />} />
            <Route path="construction" element={<ConstructionManagement />} />
            <Route path="approval" element={<ApprovalManagement />} />
            <Route path="emergency" element={<EmergencyManagement />} />
            <Route path="data" element={<DataManagement />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
          
          <Route path="/broker" element={<AppLayout />}>
            <Route path="portal" element={<BrokerPortal />} />
            <Route path="viewing" element={<ViewingReservation />} />
            <Route index element={<Navigate to="portal" replace />} />
          </Route>
          
          <Route path="/logout" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
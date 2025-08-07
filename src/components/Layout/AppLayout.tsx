import React from 'react';
import { Box, Container, Toolbar } from '@mui/material';
import Header from './Header';
import Navigation from './Navigation';
import { Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Toolbar /> {/* Spacer for fixed header */}
      <Navigation />
      <Container maxWidth="lg" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
      <Box component="footer" sx={{ p: 2, bgcolor: 'grey.100', textAlign: 'center' }}>
        <p>&copy; 2025 ビルオーナー向けSaaS</p>
      </Box>
    </Box>
  );
};

export default AppLayout;
import React from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setUser } from '../store/slices/userSlice';
import { Business, HomeWork } from '@mui/icons-material';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleRoleSelect = (role: 'owner' | 'broker') => {
    if (role === 'owner') {
      dispatch(setUser({
        id: 'owner-1',
        name: '鈴木一郎',
        role: 'owner',
      }));
      navigate('/owner/dashboard');
    } else {
      dispatch(setUser({
        id: 'broker-1',
        name: '佐藤不動産',
        role: 'broker',
        company: '佐藤不動産',
      }));
      navigate('/broker/portal');
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
            ビル統合管理システム
          </Typography>
          <Typography variant="subtitle1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
            利用者を選択してください
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 300px', maxWidth: { xs: '100%', md: '50%' } }}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                sx={{
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
                onClick={() => handleRoleSelect('owner')}
              >
                <HomeWork sx={{ fontSize: 48 }} />
                <Typography variant="h6">ビルオーナー</Typography>
                <Typography variant="body2" color="text.secondary">
                  ビル管理・承認・運営
                </Typography>
              </Button>
            </Box>
            
            <Box sx={{ flex: '1 1 300px', maxWidth: { xs: '100%', md: '50%' } }}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                sx={{
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
                onClick={() => handleRoleSelect('broker')}
              >
                <Business sx={{ fontSize: 48 }} />
                <Typography variant="h6">仲介会社</Typography>
                <Typography variant="body2" color="text.secondary">
                  空室確認・内見予約
                </Typography>
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RoleSelection;

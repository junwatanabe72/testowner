import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Home as HomeIcon,
  EventSeat as FacilityIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store';
import { loginAsync } from '../store/slices/authSlice';
import { addToast } from '../store/slices/uiSlice';
import { selectAuthState } from '../store/selectors';

// デモ用ユーザー定義（オーナーと仲介会社のみ）
const DEMO_USERS = [
  {
    id: 'owner-001',
    email: 'owner@example.com',
    name: '鈴木一郎（オーナー）',
    role: 'owner',
    icon: <BusinessIcon sx={{ fontSize: 48 }} />,
    description: 'ビル所有者として物件管理・収支管理機能を利用',
    color: '#007bff',
  },
  {
    id: 'broker-001',
    email: 'broker@sato-real.com',
    name: '田中健太（仲介会社）',
    role: 'broker',
    icon: <HomeIcon sx={{ fontSize: 48 }} />,
    description: '仲介会社として物件情報・内見予約機能を利用',
    color: '#17a2b8',
  },
];

const SimpleLoginPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(selectAuthState);
  const [selectedUser, setSelectedUser] = useState<string>('');

  const handleDemoLogin = async (userEmail: string) => {
    try {
      await dispatch(loginAsync({ email: userEmail, password: 'password' })).unwrap();
      dispatch(addToast({
        type: 'success',
        title: 'ログイン成功',
        message: 'ビルオーナー向けSaaSにようこそ！',
      }));
    } catch (error) {
      dispatch(addToast({
        type: 'error',
        title: 'ログイン失敗',
        message: 'ログインに失敗しました。',
      }));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%' }}>
        {/* ヘッダー */}
        <Box textAlign="center" mb={4}>
          <Typography 
            variant={isMobile ? 'h4' : 'h3'} 
            component="h1" 
            gutterBottom
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            ビル管理システム
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            React版デモ - 以下からユーザーを選択してログインしてください
          </Typography>
        </Box>

        {/* エラー表示 */}
        {error && (
          <Paper 
            sx={{ 
              p: 2, 
              mb: 3, 
              bgcolor: 'error.light', 
              color: 'error.contrastText',
              textAlign: 'center' 
            }}
          >
            <Typography>{error}</Typography>
          </Paper>
        )}

        {/* デモユーザー選択 - CSS Gridを使用 */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: 3, 
          mb: 4 
        }}>
          {DEMO_USERS.map((user) => (
            <Paper
              key={user.id}
              elevation={selectedUser === user.email ? 8 : 2}
              sx={{
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: selectedUser === user.email ? `2px solid ${user.color}` : '2px solid transparent',
                '&:hover': {
                  elevation: 4,
                  transform: 'translateY(-4px)',
                },
                minHeight: isMobile ? '200px' : '240px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onClick={() => setSelectedUser(user.email)}
            >
              <Box>
                <Box sx={{ color: user.color, mb: 2 }}>
                  {user.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {user.description}
                </Typography>
              </Box>
              
              <Button
                variant={selectedUser === user.email ? 'contained' : 'outlined'}
                color="primary"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDemoLogin(user.email);
                }}
                sx={{ 
                  mt: 2,
                  bgcolor: selectedUser === user.email ? user.color : 'transparent',
                  borderColor: user.color,
                  '&:hover': {
                    bgcolor: user.color,
                    color: 'white',
                  },
                }}
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </Button>
            </Paper>
          ))}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* フッター情報 */}
        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            © 2025 ビルオーナー向けSaaS - React版デモ
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            このデモでは認証は簡略化されています。実際のシステムでは適切な認証機能を実装します。
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SimpleLoginPage;
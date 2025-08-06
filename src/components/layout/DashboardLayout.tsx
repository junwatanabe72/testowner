import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store';
import { selectCurrentUser, selectUnreadNotificationsCount, selectIsMobile, selectSidebarCollapsed } from '../../store/selectors';
import { logout } from '../../store/slices/authSlice';
import { toggleSidebar, setSidebarCollapsed, addToast } from '../../store/slices/uiSlice';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DRAWER_WIDTH = 280;

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useAppSelector(selectIsMobile);
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);
  const currentUser = useAppSelector(selectCurrentUser);
  const unreadCount = useAppSelector(selectUnreadNotificationsCount);
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addToast({
      type: 'info',
      title: 'ログアウト',
      message: 'ログアウトしました',
    }));
    handleMenuClose();
  };

  const handleDrawerToggle = () => {
    if (isMobile) {
      dispatch(toggleSidebar());
    } else {
      dispatch(setSidebarCollapsed(!sidebarCollapsed));
    }
  };

  // ロール別の色設定
  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'owner': return '#007bff';
      case 'tenant': return '#28a745';
      case 'manager': return '#ffc107';
      case 'broker': return '#17a2b8';
      case 'facility_user': return '#6c757d';
      default: return theme.palette.primary.main;
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'owner': return 'オーナー';
      case 'tenant': return 'テナント';
      case 'manager': return '管理会社';
      case 'broker': return '仲介会社';
      case 'facility_user': return '施設利用者';
      default: return 'ユーザー';
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: getRoleColor(currentUser?.role),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            ビル管理システム
            {currentUser && (
              <Typography variant="caption" display="block" sx={{ opacity: 0.8 }}>
                {getRoleLabel(currentUser.role)} - {currentUser.profile.name}
              </Typography>
            )}
          </Typography>

          {/* 通知ベル */}
          <IconButton
            color="inherit"
            onClick={handleNotificationOpen}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* ユーザーメニュー */}
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'rgba(255,255,255,0.2)',
                fontSize: '0.875rem',
              }}
            >
              {currentUser?.profile.name?.[0] || <AccountCircle />}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ユーザーメニュー */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">
            {currentUser?.profile.name}
          </Typography>
        </MenuItem>
        <MenuItem disabled>
          <Typography variant="caption" color="text.secondary">
            {currentUser?.profile.company_name}
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          ログアウト
        </MenuItem>
      </Menu>

      {/* 通知メニュー（簡易版） */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 300, maxHeight: 400 }
        }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">
            通知 ({unreadCount}件)
          </Typography>
        </MenuItem>
        <Divider />
        {unreadCount === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              新しい通知はありません
            </Typography>
          </MenuItem>
        ) : (
          <MenuItem disabled>
            <Typography variant="body2">
              通知機能は開発中です
            </Typography>
          </MenuItem>
        )}
      </Menu>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? !sidebarCollapsed : true}
        onClose={() => dispatch(setSidebarCollapsed(true))}
        ModalProps={{
          keepMounted: true, // モバイルでのパフォーマンス向上
        }}
        sx={{
          width: sidebarCollapsed && !isMobile ? 0 : DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Toolbar /> {/* AppBarの高さ分のスペース */}
        <Sidebar />
      </Drawer>

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            xs: '100%',
            md: sidebarCollapsed ? '100%' : `calc(100% - ${DRAWER_WIDTH}px)`
          },
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar /> {/* AppBarの高さ分のスペース */}
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
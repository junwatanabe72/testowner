import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Business as BuildingIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  MeetingRoom as RoomIcon,
  Build as BuildIcon,
  CheckCircle as ApprovalIcon,
  Warning as EmergencyIcon,
  Description as DocumentIcon,
  Phone as ContactIcon,
  ViewModule as ViewIcon,
  CalendarToday as CalendarIcon,
  Report as ReportIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useAppSelector } from '../../store';
import { selectCurrentUser } from '../../store/selectors';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  path?: string;
  children?: MenuItem[];
  roles?: string[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'ダッシュボード',
    icon: <DashboardIcon />,
    path: '/',
    roles: ['owner', 'tenant', 'manager', 'broker'],
  },
  // オーナー専用メニュー
  {
    id: 'owner_management',
    label: '物件管理',
    icon: <BuildingIcon />,
    roles: ['owner'],
    children: [
      {
        id: 'vacancy_management',
        label: '空室管理',
        icon: <HomeIcon />,
        path: '/owner/vacancy',
        roles: ['owner'],
      },
      {
        id: 'tenant_management',
        label: 'テナント管理',
        icon: <PeopleIcon />,
        path: '/owner/tenants',
        roles: ['owner'],
      },
    ],
  },
  {
    id: 'facility_management',
    label: '施設管理',
    icon: <RoomIcon />,
    roles: ['owner'],
    children: [
      {
        id: 'meeting_rooms',
        label: '会議室',
        icon: <RoomIcon />,
        path: '/owner/facilities',
        roles: ['owner'],
      },
      {
        id: 'maintenance',
        label: 'メンテナンス',
        icon: <BuildIcon />,
        path: '/owner/maintenance',
        roles: ['owner'],
      },
      {
        id: 'construction',
        label: '工事',
        icon: <BuildIcon />,
        path: '/owner/construction',
        roles: ['owner'],
      },
    ],
  },
  {
    id: 'approvals',
    label: '承認',
    icon: <ApprovalIcon />,
    path: '/owner/approvals',
    roles: ['owner'],
  },
  {
    id: 'emergency',
    label: '緊急対応',
    icon: <EmergencyIcon />,
    path: '/owner/emergency',
    roles: ['owner'],
  },
  
  // テナント専用メニュー
  {
    id: 'applications',
    label: '各種申請',
    icon: <AssignmentIcon />,
    roles: ['tenant'],
    children: [
      {
        id: 'construction_request',
        label: '工事申請',
        icon: <BuildIcon />,
        path: '/tenant/construction',
        roles: ['tenant'],
      },
      {
        id: 'facility_request',
        label: '施設利用申請',
        icon: <RoomIcon />,
        path: '/tenant/facility',
        roles: ['tenant'],
      },
    ],
  },
  {
    id: 'documents',
    label: '契約書・館内細則',
    icon: <DocumentIcon />,
    path: '/tenant/documents',
    roles: ['tenant'],
  },
  {
    id: 'contact',
    label: '緊急連絡',
    icon: <ContactIcon />,
    path: '/tenant/emergency',
    roles: ['tenant'],
  },

  // 管理会社専用メニュー
  {
    id: 'tasks',
    label: '業務管理',
    icon: <AssignmentIcon />,
    roles: ['manager'],
    children: [
      {
        id: 'schedule',
        label: '業務予定',
        icon: <CalendarIcon />,
        path: '/manager/schedule',
        roles: ['manager'],
      },
      {
        id: 'reports',
        label: '報告書',
        icon: <ReportIcon />,
        path: '/manager/reports',
        roles: ['manager'],
      },
    ],
  },

  // ブローカー専用メニュー
  {
    id: 'properties',
    label: '物件情報',
    icon: <ViewIcon />,
    path: '/broker/properties',
    roles: ['broker'],
  },
  {
    id: 'viewing',
    label: '内見予約',
    icon: <CalendarIcon />,
    path: '/broker/viewing',
    roles: ['broker'],
  },

  // 共通メニュー
  {
    id: 'notifications',
    label: '通知',
    icon: <NotificationsIcon />,
    path: '/notifications',
    roles: ['owner', 'tenant', 'manager', 'broker'],
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);
  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const userRole = currentUser?.role || '';

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      setOpenItems(prev =>
        prev.includes(item.id)
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const isItemVisible = (item: MenuItem): boolean => {
    return !item.roles || item.roles.includes(userRole);
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (!item.path) return false;
    return location.pathname === item.path || 
           (item.path !== '/' && location.pathname.startsWith(item.path));
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    if (!isItemVisible(item)) return null;

    const hasChildren = item.children && item.children.some(isItemVisible);
    const isOpen = openItems.includes(item.id);
    const isActive = isItemActive(item);

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            selected={isActive}
            sx={{
              pl: 2 + level * 2,
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
                '& .MuiListItemText-primary': {
                  fontWeight: 'bold',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontSize: level > 0 ? '0.875rem' : '1rem',
              }}
            />
            {hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        
        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const getRoleLabel = (role: string) => {
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
    <Box>
      {/* ユーザー情報 */}
      {currentUser && (
        <Box sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography variant="subtitle2" noWrap>
            {getRoleLabel(currentUser.role)}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {currentUser.profile.company_name || currentUser.profile.name}
          </Typography>
        </Box>
      )}
      
      <Divider />

      {/* メニューリスト */}
      <List>
        {MENU_ITEMS.map(item => renderMenuItem(item))}
      </List>
    </Box>
  );
};

export default Sidebar;
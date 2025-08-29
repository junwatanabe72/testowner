import React from 'react';
import { Box, Button, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { selectUserRole } from '../../store/selectors';

interface NavItem {
  label: string;
  path: string;
  group?: string;
}

const ownerNavItems: NavItem[] = [
  { label: 'ダッシュボード', path: '/owner/dashboard', group: 'main' },
  { label: 'カレンダー', path: '/owner/calendar', group: 'main' },
  { label: '空室管理', path: '/owner/vacancy', group: 'management' },
  { label: 'テナント管理', path: '/owner/tenant', group: 'management' },
  { label: '会議室', path: '/owner/facility', group: 'facility' },
  { label: 'メンテナンス', path: '/owner/maintenance', group: 'facility' },
  { label: '工事', path: '/owner/construction', group: 'facility' },
  { label: '承認', path: '/owner/approval', group: 'admin' },
  { label: '緊急対応', path: '/owner/emergency', group: 'admin' },
  { label: 'データ管理', path: '/owner/data', group: 'system' },
  { label: 'ログアウト', path: '/logout', group: 'user' },
];

const brokerNavItems: NavItem[] = [
  { label: 'ポータル', path: '/broker/portal', group: 'main' },
  { label: '内見予約', path: '/broker/viewing', group: 'main' },
  { label: 'ログアウト', path: '/logout', group: 'user' },
];

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = useAppSelector(selectUserRole);

  const navItems = userRole === 'owner' ? ownerNavItems : brokerNavItems;
  const groups = Array.from(new Set(navItems.map(item => item.group).filter(Boolean)));

  return (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: 2, 
      p: 2, 
      bgcolor: 'grey.100',
      borderBottom: 1,
      borderColor: 'divider'
    }}>
      {groups.map((group, index) => (
        <React.Fragment key={group}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems
              .filter(item => item.group === group)
              .map(item => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? 'contained' : 'text'}
                  color={location.pathname === item.path ? 'primary' : 'inherit'}
                  onClick={() => navigate(item.path)}
                  size="small"
                >
                  {item.label}
                </Button>
              ))}
          </Box>
          {index < groups.length - 1 && (
            <Divider orientation="vertical" flexItem />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default Navigation;

import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Badge } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/selectors';

const Header: React.FC = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ビル統合管理システム
        </Typography>
        
        {user && (
          <>
            <Typography variant="body1" sx={{ mr: 2 }}>
              ようこそ、{user.name}様
            </Typography>
            
            <IconButton color="inherit" sx={{ mr: 2 }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {user.name.charAt(0)}
            </Avatar>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
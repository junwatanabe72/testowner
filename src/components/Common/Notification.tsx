import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { hideNotification } from '../../store/slices/uiSlice';

const Notification: React.FC = () => {
  const dispatch = useAppDispatch();
  const notification = useAppSelector((state) => state.ui.notification);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideNotification());
  };

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={notification?.type || 'info'} 
        sx={{ width: '100%' }}
      >
        {notification?.message || ''}
      </Alert>
    </Snackbar>
  );
};

export default Notification;

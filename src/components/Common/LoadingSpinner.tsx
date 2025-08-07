import React from 'react';
import {
  Box,
  CircularProgress,
  Backdrop,
  Typography,
} from '@mui/material';

interface LoadingSpinnerProps {
  open?: boolean;
  message?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'backdrop' | 'inline';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  open = true,
  message = '読み込み中...',
  size = 'medium',
  variant = 'backdrop',
}) => {
  const getSizeValue = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'medium':
        return 40;
      case 'large':
        return 60;
      default:
        return 40;
    }
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress size={getSizeValue()} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (variant === 'backdrop') {
    return (
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        open={open}
      >
        {content}
      </Backdrop>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        width: '100%',
      }}
    >
      {content}
    </Box>
  );
};

export default LoadingSpinner;
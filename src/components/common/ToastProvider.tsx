import React, { useEffect } from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../store';
import { selectToasts } from '../../store/selectors';
import { removeToast } from '../../store/slices/uiSlice';

const ToastProvider: React.FC = () => {
  const toasts = useAppSelector(selectToasts);
  const dispatch = useAppDispatch();

  // 自動削除タイマー
  useEffect(() => {
    toasts.forEach((toast: any) => {
      if (toast.duration && toast.duration > 0) {
        const timer = setTimeout(() => {
          dispatch(removeToast(toast.id));
        }, toast.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [toasts, dispatch]);

  const handleClose = (toastId: string) => {
    dispatch(removeToast(toastId));
  };

  return (
    <>
      {toasts.map((toast: any, index: number) => (
        <Snackbar
          key={toast.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            mt: index * 7, // 複数のトーストを縦に並べる
          }}
        >
          <Alert
            onClose={() => handleClose(toast.id)}
            severity={toast.type}
            variant="filled"
            sx={{ 
              minWidth: '320px',
              maxWidth: '500px',
            }}
          >
            <AlertTitle>{toast.title}</AlertTitle>
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default ToastProvider;
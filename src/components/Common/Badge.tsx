import React from 'react';
import { Chip } from '@mui/material';

interface StatusBadgeProps {
  status: 'vacant' | 'occupied' | 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  label?: string;
}

const getStatusColor = (status: StatusBadgeProps['status']) => {
  switch (status) {
    case 'vacant':
      return 'warning';
    case 'occupied':
      return 'default';
    case 'pending':
      return 'warning';
    case 'approved':
    case 'completed':
      return 'success';
    case 'rejected':
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: StatusBadgeProps['status']) => {
  switch (status) {
    case 'vacant':
      return '募集中';
    case 'occupied':
      return '入居中';
    case 'pending':
      return '承認待ち';
    case 'approved':
      return '承認済み';
    case 'rejected':
      return '却下';
    case 'completed':
      return '完了';
    case 'cancelled':
      return 'キャンセル';
    default:
      return status;
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  return (
    <Chip
      label={label || getStatusLabel(status)}
      color={getStatusColor(status)}
      size="small"
      variant={status === 'vacant' ? 'filled' : 'outlined'}
    />
  );
};

export default StatusBadge;
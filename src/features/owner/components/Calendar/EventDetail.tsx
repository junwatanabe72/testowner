import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Stack,
  Chip,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { CalendarEvent } from '../../../../types';
import { formatDateJapanese, formatTime } from './utils/calendarHelpers';

interface EventDetailProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({
  event,
  isOpen,
  onClose
}) => {
  if (!isOpen || !event) {
    return null;
  }

  const getTypeText = (type: CalendarEvent['type']): string => {
    const typeMap = {
      viewing: '内見予約',
      application: '入居申込',
      maintenance: 'メンテナンス',
      tenant: 'テナント関連',
      facility: '施設利用'
    };
    return typeMap[type];
  };

  const getStatusText = (status?: string): string => {
    if (!status) return '';
    
    const statusMap: { [key: string]: string } = {
      'pending': '承認待ち',
      'approved': '承認済み',
      'completed': '完了',
      'cancelled': 'キャンセル',
      'rejected': '却下',
      'confirmed': '確定',
      'tentative': '仮'
    };
    
    return statusMap[status] || status;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6">予定詳細</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* イベントタイプ */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: event.color,
                flexShrink: 0
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {getTypeText(event.type)}
            </Typography>
          </Stack>

          {/* タイトル */}
          <Box>
            <Typography variant="h6" color="text.primary">
              {event.title}
            </Typography>
          </Box>

          {/* 説明 */}
          {event.description && (
            <Typography variant="body2" color="text.secondary">
              {event.description}
            </Typography>
          )}

          <Divider />

          {/* 詳細情報 */}
          <Stack spacing={2}>
            {/* 日付 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" fontWeight="medium" color="text.secondary">
                日付
              </Typography>
              <Typography variant="body2">
                {formatDateJapanese(event.startDate)}
                {event.endDate && event.endDate !== event.startDate && (
                  <span> - {formatDateJapanese(event.endDate)}</span>
                )}
              </Typography>
            </Box>

            {/* 時間 */}
            {(event.startTime || event.endTime) && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" fontWeight="medium" color="text.secondary">
                  時間
                </Typography>
                <Typography variant="body2">
                  {event.startTime && formatTime(event.startTime)}
                  {event.endTime && ` - ${formatTime(event.endTime)}`}
                </Typography>
              </Box>
            )}

            {/* 場所 */}
            {event.location && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" fontWeight="medium" color="text.secondary">
                  場所
                </Typography>
                <Typography variant="body2">{event.location}</Typography>
              </Box>
            )}

            {/* 状態 */}
            {event.status && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" fontWeight="medium" color="text.secondary">
                  状態
                </Typography>
                <Chip
                  label={getStatusText(event.status)}
                  size="small"
                  color={
                    event.status === 'approved' || event.status === 'completed' 
                      ? 'success'
                      : event.status === 'pending' 
                      ? 'warning'
                      : event.status === 'cancelled' || event.status === 'rejected'
                      ? 'error'
                      : 'default'
                  }
                />
              </Box>
            )}

            {/* 関係者 */}
            {event.participants && event.participants.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="body2" fontWeight="medium" color="text.secondary">
                  関係者
                </Typography>
                <Typography variant="body2" textAlign="right" sx={{ maxWidth: '60%' }}>
                  {event.participants.filter(Boolean).join(', ')}
                </Typography>
              </Box>
            )}
          </Stack>

          {/* 追加情報 */}
          {event.metadata && Object.keys(event.metadata).length > 0 && (
            <>
              <Divider />
              <Box>
                <Typography variant="body2" fontWeight="medium" color="text.secondary" gutterBottom>
                  追加情報
                </Typography>
                <Stack spacing={1}>
                  {event.metadata.floorNumber && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">階数</Typography>
                      <Typography variant="body2">{event.metadata.floorNumber}階</Typography>
                    </Box>
                  )}
                  {event.metadata.brokerCompany && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">仲介会社</Typography>
                      <Typography variant="body2">{event.metadata.brokerCompany}</Typography>
                    </Box>
                  )}
                  {event.metadata.tenantName && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">テナント</Typography>
                      <Typography variant="body2">{event.metadata.tenantName}</Typography>
                    </Box>
                  )}
                  {event.metadata.contractorName && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">業者</Typography>
                      <Typography variant="body2">{event.metadata.contractorName}</Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
};
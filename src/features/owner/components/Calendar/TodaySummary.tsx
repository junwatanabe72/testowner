import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Stack
} from '@mui/material';
import { CalendarEvent } from '../../../../types';
import { getTodayEvents } from './utils/eventTransformers';
import { formatTime } from './utils/calendarHelpers';

interface TodaySummaryProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

export const TodaySummary: React.FC<TodaySummaryProps> = ({
  events,
  onEventClick
}) => {
  const todayEvents = getTodayEvents(events);

  if (todayEvents.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          今日の予定
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
          本日の予定はありません
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ borderRadius: 2 }}>
      <Box sx={{ p: 3, pb: 1 }}>
        <Typography variant="h6" gutterBottom>
          今日の予定
        </Typography>
      </Box>
      
      <List sx={{ pt: 0 }}>
        {todayEvents.map(event => (
          <ListItem
            key={event.id}
            onClick={() => onEventClick?.(event)}
            sx={{
              cursor: 'pointer',
              borderRadius: 1,
              mx: 1,
              mb: 1,
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'grey.50',
                borderColor: 'primary.main',
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 20, mr: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: event.color,
                  flexShrink: 0
                }}
              />
            </ListItemIcon>
            
            <ListItemText
              primary={
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    {event.startTime && (
                      <Typography variant="body2" fontWeight="medium">
                        {formatTime(event.startTime)}
                      </Typography>
                    )}
                    {event.endTime && (
                      <Typography variant="body2" color="text.secondary">
                        - {formatTime(event.endTime)}
                      </Typography>
                    )}
                  </Box>
                  
                  <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
                    {event.title}
                  </Typography>
                  
                  {event.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {event.description}
                    </Typography>
                  )}
                  
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    {event.location && (
                      <Typography variant="caption" color="text.secondary">
                        📍 {event.location}
                      </Typography>
                    )}
                    
                    {event.participants && event.participants.length > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        👥 {event.participants.filter(Boolean).join(', ')}
                      </Typography>
                    )}
                    
                    {event.status && (
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
                        sx={{ 
                          height: 20, 
                          fontSize: '0.7rem',
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    )}
                  </Stack>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

function getStatusText(status: string): string {
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
}
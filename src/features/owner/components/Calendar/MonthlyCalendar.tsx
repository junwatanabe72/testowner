import React, { useMemo } from 'react';
import { 
  Box, 
  Paper, 
  Typography
} from '@mui/material';
import { CalendarEvent } from '../../../../types';
import {
  getCalendarWeeks,
  formatDate,
  isToday,
  isSameMonth,
  getDayOfWeekName
} from './utils/calendarHelpers';

interface MonthlyCalendarProps {
  year: number;
  month: number;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
}

export const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  year,
  month,
  events,
  onEventClick,
  onDateClick
}) => {
  const weeks = useMemo(() => getCalendarWeeks(year, month), [year, month]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach(event => {
      const dateKey = event.startDate;
      const existing = map.get(dateKey) || [];
      existing.push(event);
      map.set(dateKey, existing);
    });
    return map;
  }, [events]);

  return (
    <Paper elevation={2} sx={{ borderRadius: 2 }}>
      {/* ヘッダー：曜日 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => (
          <Box
            key={dayIndex}
            sx={{
              py: 1,
              textAlign: 'center',
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'grey.50'
            }}
          >
            <Typography variant="body2" fontWeight="medium" color="text.secondary">
              {getDayOfWeekName(dayIndex)}
            </Typography>
          </Box>
        ))}
      </Box>
      
      {/* カレンダーボディ */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((date, dayIndex) => {
              const dateStr = formatDate(date);
              const dayEvents = eventsByDate.get(dateStr) || [];
              const isCurrentMonth = isSameMonth(date, year, month);
              const isCurrentDay = isToday(date);

              return (
                <Box
                  key={dayIndex}
                  onClick={() => onDateClick?.(date)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onDateClick?.(date);
                    }
                  }}
                  tabIndex={0}
                  role="gridcell"
                  aria-label={`${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日, ${dayEvents.length}件の予定`}
                  sx={{
                    minHeight: { xs: 80, sm: 100 },
                    p: { xs: 0.5, sm: 1 },
                    borderBottom: '1px solid',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    bgcolor: !isCurrentMonth ? 'grey.50' : 
                             isCurrentDay ? 'primary.50' : 'white',
                    color: !isCurrentMonth ? 'text.disabled' : 'text.primary',
                    '&:hover': {
                      bgcolor: !isCurrentMonth ? 'grey.100' : 
                               isCurrentDay ? 'primary.100' : 'grey.50',
                    },
                    '&:focus': {
                      outline: 'none',
                      boxShadow: isCurrentDay ? 
                        '0 0 0 2px #1976d2' : 
                        '0 0 0 2px #1976d2',
                      bgcolor: 'primary.50'
                    }
                  }}
                >
                  <Typography 
                    variant="body2" 
                    fontWeight={isCurrentDay ? 'bold' : 'medium'}
                    color={isCurrentDay ? 'primary.main' : 'inherit'}
                    sx={{ mb: 0.5 }}
                  >
                    {date.getDate()}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                    {dayEvents.slice(0, 3).map(event => (
                      <Box
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(event);
                        }}
                        sx={{
                          fontSize: '0.65rem',
                          p: 0.25,
                          borderRadius: 0.5,
                          cursor: 'pointer',
                          bgcolor: `${event.color}20`,
                          color: event.color,
                          borderLeft: `3px solid ${event.color}`,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          '&:hover': {
                            opacity: 0.8,
                          }
                        }}
                        title={event.title}
                      >
                        {event.startTime && (
                          <Box component="span" sx={{ fontWeight: 'bold', mr: 0.5 }}>
                            {event.startTime.slice(0, 5)}
                          </Box>
                        )}
                        {event.title}
                      </Box>
                    ))}
                    
                    {dayEvents.length > 3 && (
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        textAlign="center"
                        sx={{ fontSize: '0.65rem' }}
                      >
                        他{dayEvents.length - 3}件
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </React.Fragment>
        ))}
      </Box>
    </Paper>
  );
};
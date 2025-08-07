import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  ButtonGroup,
  IconButton,
  Stack,
  Container
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight, 
  Today 
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { CalendarEvent, CalendarView } from '../../../../types';
import { MonthlyCalendar } from './MonthlyCalendar';
import { TodaySummary } from './TodaySummary';
import { EventDetail } from './EventDetail';
import {
  transformViewingToEvent,
  transformApplicationToEvent,
  transformMaintenanceToEvent,
  transformFacilityToEvent,
  transformActivityToEvent,
  transformTenantContractToEvents,
  getMonthEvents
} from './utils/eventTransformers';
import { getMonthName } from './utils/calendarHelpers';

export const CalendarContainer: React.FC = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);

  // Reduxストアからデータを取得
  const { reservations: viewingReservations } = useSelector((state: RootState) => state.viewingReservations);
  const { applications: tenantApplications } = useSelector((state: RootState) => state.tenantApplications);
  const { applications } = useSelector((state: RootState) => state.applications);
  const { activities } = useSelector((state: RootState) => state.activities);
  const { building } = useSelector((state: RootState) => state.building);

  // 全てのイベントをカレンダーイベント形式に変換
  const allEvents = useMemo(() => {
    const events: CalendarEvent[] = [];

    // 内見予約
    viewingReservations?.forEach((viewing: any) => {
      events.push(transformViewingToEvent(viewing));
    });

    // 入居申込
    tenantApplications?.forEach((application: any) => {
      events.push(...transformApplicationToEvent(application));
    });

    // 申請（メンテナンス・施設利用）
    applications?.forEach((application: any) => {
      const maintenanceEvent = transformMaintenanceToEvent(application);
      if (maintenanceEvent) {
        events.push(maintenanceEvent);
      }

      const facilityEvent = transformFacilityToEvent(application);
      if (facilityEvent) {
        events.push(facilityEvent);
      }
    });

    // 活動履歴
    activities?.forEach((activity: any) => {
      const activityEvent = transformActivityToEvent(activity);
      if (activityEvent) {
        events.push(activityEvent);
      }
    });

    // テナント契約情報
    if (building?.floors) {
      building.floors.forEach((floor: any) => {
        events.push(...transformTenantContractToEvents(floor));
      });
    }

    return events;
  }, [viewingReservations, tenantApplications, applications, activities, building]);

  // 現在の表示月のイベントを取得
  const currentMonthEvents = useMemo(() => {
    return getMonthEvents(allEvents, currentYear, currentMonth + 1);
  }, [allEvents, currentYear, currentMonth]);

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDetailOpen(true);
  };

  const handleDateClick = (date: Date) => {
    // 将来的にはここで新規予定作成ダイアログを表示
    console.log('Date clicked:', date);
  };

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        {/* ヘッダー */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4" component="h1" fontWeight="bold">
                カレンダー
              </Typography>
              
              {/* ビュー切り替え */}
              <ButtonGroup size="small" variant="outlined">
                <Button 
                  variant={currentView === 'month' ? 'contained' : 'outlined'}
                  onClick={() => setCurrentView('month')}
                >
                  月間
                </Button>
                <Button 
                  variant={currentView === 'week' ? 'contained' : 'outlined'}
                  onClick={() => setCurrentView('week')}
                  disabled
                >
                  週間
                </Button>
                <Button 
                  variant={currentView === 'day' ? 'contained' : 'outlined'}
                  onClick={() => setCurrentView('day')}
                  disabled
                >
                  日次
                </Button>
              </ButtonGroup>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                onClick={handleToday}
                variant="outlined"
                startIcon={<Today />}
                size="small"
              >
                今日
              </Button>
              <Button
                variant="contained"
                disabled
                size="small"
              >
                新規予定
              </Button>
            </Stack>
          </Box>

          {/* 月間ナビゲーション */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <IconButton 
              onClick={handlePreviousMonth}
              aria-label="前の月"
              size="large"
            >
              <ChevronLeft />
            </IconButton>
            
            <Typography variant="h5" component="h2" fontWeight="medium" id="calendar-month-label">
              {currentYear}年{getMonthName(currentMonth)}
            </Typography>
            
            <IconButton 
              onClick={handleNextMonth}
              aria-label="次の月"
              size="large"
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
          {/* サイドパネル（モバイルでは上部表示） */}
          <Box sx={{ 
            width: { xs: '100%', lg: '300px' }, 
            order: { xs: 1, lg: 2 },
            flexShrink: 0
          }}>
            <Stack spacing={3}>
              <TodaySummary
                events={allEvents}
                onEventClick={handleEventClick}
              />

              {/* 凡例 */}
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  凡例
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#2196F3' }} />
                    <Typography variant="body2">内見予約</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4CAF50' }} />
                    <Typography variant="body2">入居申込</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#FF9800' }} />
                    <Typography variant="body2">メンテナンス</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#9C27B0' }} />
                    <Typography variant="body2">テナント関連</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#757575' }} />
                    <Typography variant="body2">施設利用</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Box>

          {/* カレンダー */}
          <Box sx={{ 
            flex: 1,
            order: { xs: 2, lg: 1 },
            minWidth: 0
          }}>
            {currentView === 'month' && (
              <MonthlyCalendar
                year={currentYear}
                month={currentMonth}
                events={currentMonthEvents}
                onEventClick={handleEventClick}
                onDateClick={handleDateClick}
              />
            )}
          </Box>
        </Box>

        {/* イベント詳細ダイアログ */}
        <EventDetail
          event={selectedEvent}
          isOpen={isEventDetailOpen}
          onClose={() => setIsEventDetailOpen(false)}
        />
      </Stack>
    </Container>
  );
};
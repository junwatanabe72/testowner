import React from 'react';
import { Typography, Box } from '@mui/material';
import OccupancySummary from '../components/OccupancySummary';
import PendingApplications from '../components/PendingApplications';
import ActivityHistory from '../components/ActivityHistory';
import SummaryCard from '../../../components/Common/SummaryCard';
import { TodaySummary } from '../components/Calendar/TodaySummary';
import { useSelector } from 'react-redux';
import { selectPendingApplicationsCount } from '../../../store/selectors';
import {
  transformViewingToEvent,
  transformApplicationToEvent,
  transformMaintenanceToEvent,
  transformFacilityToEvent,
  transformActivityToEvent,
  transformTenantContractToEvents
} from '../components/Calendar/utils/eventTransformers';

const OwnerDashboard: React.FC = () => {
  const pendingCount = useSelector(selectPendingApplicationsCount);
  
  // Reduxストアからカレンダーイベント用のデータを取得
  const { reservations: viewingReservations } = useSelector((state: any) => state.viewingReservations);
  const { applications: tenantApplications } = useSelector((state: any) => state.tenantApplications);
  const { applications } = useSelector((state: any) => state.applications);
  const { activities } = useSelector((state: any) => state.activities);
  const { building } = useSelector((state: any) => state.building);

  // 全てのイベントをカレンダーイベント形式に変換
  const allEvents = React.useMemo(() => {
    const events: any[] = [];

    // 内見予約
    if (viewingReservations) {
      viewingReservations.forEach((viewing: any) => {
        events.push(transformViewingToEvent(viewing));
      });
    }

    // 入居申込
    if (tenantApplications) {
      tenantApplications.forEach((application: any) => {
        events.push(...transformApplicationToEvent(application));
      });
    }

    // 申請（メンテナンス・施設利用）
    if (applications) {
      applications.forEach((application: any) => {
        const maintenanceEvent = transformMaintenanceToEvent(application);
        if (maintenanceEvent) {
          events.push(maintenanceEvent);
        }

        const facilityEvent = transformFacilityToEvent(application);
        if (facilityEvent) {
          events.push(facilityEvent);
        }
      });
    }

    // 活動履歴
    if (activities) {
      activities.forEach((activity: any) => {
        const activityEvent = transformActivityToEvent(activity);
        if (activityEvent) {
          events.push(activityEvent);
        }
      });
    }

    // テナント契約情報
    if (building?.floors) {
      building.floors.forEach((floor: any) => {
        events.push(...transformTenantContractToEvents(floor));
      });
    }

    return events;
  }, [viewingReservations, tenantApplications, applications, activities, building]);

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        オーナーダッシュボード
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 300px', maxWidth: { xs: '100%', sm: '50%', md: '25%' } }}>
          <OccupancySummary />
        </Box>
        <Box sx={{ flex: '1 1 300px', maxWidth: { xs: '100%', sm: '50%', md: '25%' } }}>
          <SummaryCard
            title="未承認の申請"
            value={pendingCount}
            subtitle="件"
            color="warning"
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TodaySummary events={allEvents} />
        <PendingApplications />
        <ActivityHistory />
      </Box>
    </>
  );
};

export default OwnerDashboard;
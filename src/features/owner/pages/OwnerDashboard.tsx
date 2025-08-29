import React from 'react';
import { Typography, Box } from '@mui/material';
import OccupancySummary from '../components/OccupancySummary';
import PendingApplications from '../components/PendingApplications';
import ActivityHistory from '../components/ActivityHistory';
import SummaryCard from '../../../components/Common/SummaryCard';
import { TodaySummary } from '../components/Calendar/TodaySummary';
import { useAppSelector } from '../../../store/hooks';
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
  const pendingCount = useAppSelector(selectPendingApplicationsCount);
  
  // Reduxストアからカレンダーイベント用のデータを取得
  const { reservations: viewingReservations } = useAppSelector((state) => state.viewingReservations);
  const { applications: tenantApplications } = useAppSelector((state) => state.tenantApplications);
  const applicationsState = useAppSelector((state) => state.applications);
  const activitiesState = useAppSelector((state) => state.activities);
  const buildingState = useAppSelector((state) => state.building);

  const applications = React.useMemo(
    () => applicationsState.ids.map((id: string) => applicationsState.entities[id]).filter(Boolean),
    [applicationsState]
  );

  const activities = React.useMemo(
    () => activitiesState.ids.map((id: string) => activitiesState.entities[id]).filter(Boolean),
    [activitiesState]
  );

  const building = buildingState.data;

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

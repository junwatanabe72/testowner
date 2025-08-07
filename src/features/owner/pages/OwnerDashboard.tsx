import React from 'react';
import { Typography, Box } from '@mui/material';
import OccupancySummary from '../components/OccupancySummary';
import PendingApplications from '../components/PendingApplications';
import ActivityHistory from '../components/ActivityHistory';
import SummaryCard from '../../../components/Common/SummaryCard';
import { useSelector } from 'react-redux';
import { selectPendingApplicationsCount } from '../../../store/selectors';

const OwnerDashboard: React.FC = () => {
  const pendingCount = useSelector(selectPendingApplicationsCount);

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
        <PendingApplications />
        <ActivityHistory />
      </Box>
    </>
  );
};

export default OwnerDashboard;
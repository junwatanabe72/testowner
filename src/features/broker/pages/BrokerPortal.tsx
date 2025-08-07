import React from 'react';
import { Box, Typography } from '@mui/material';
import FloorAvailabilityTable from '../components/FloorAvailabilityTable';
import ViewingReservationTable from '../components/ViewingReservationTable';
import BuildingOverview from '../components/BuildingOverview';
import AIChat from '../components/AIChat';
import { useSelector } from 'react-redux';
import { selectBuilding } from '../../../store/selectors';

const BrokerPortal: React.FC = () => {
  const building = useSelector(selectBuilding);

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        仲介会社ポータル
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {building?.info.name}（築{building?.info.builtYear}年）
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <FloorAvailabilityTable />
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <ViewingReservationTable />
      </Box>
      
      <BuildingOverview />
      
      <AIChat />
    </>
  );
};

export default BrokerPortal;
import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import SummaryCard from '../../../components/Common/SummaryCard';
import { useSelector } from 'react-redux';
import { selectOccupancyRate, selectFloors } from '../../../store/selectors';
import { Floor } from '../../../types';

const OccupancySummary: React.FC = () => {
  const occupancyRate = useSelector(selectOccupancyRate);
  const floors = useSelector(selectFloors);
  const occupiedCount = floors.filter((f: Floor) => f.status === 'occupied').length;

  return (
    <SummaryCard
      title="現在の稼働率"
      value={`${occupancyRate}%`}
      subtitle={`(${occupiedCount}/${floors.length}区画)`}
      color="primary"
    />
  );
};

export default OccupancySummary;
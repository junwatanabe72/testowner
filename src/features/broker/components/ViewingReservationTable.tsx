import React from 'react';
import { Box, Typography, Paper, Link } from '@mui/material';
import DataTable from '../../../components/Common/DataTable';
import StatusBadge from '../../../components/Common/Badge';
import { useSelector } from 'react-redux';
import { selectPendingViewings, selectBuilding } from '../../../store/selectors';
import { ViewingReservation } from '../../../types';

const ViewingReservationTable: React.FC = () => {
  const viewings = useSelector(selectPendingViewings);
  const building = useSelector(selectBuilding);

  const columns = [
    { id: 'buildingName', label: 'ビル名' },
    { id: 'floorNumber', label: 'フロア', format: (value: number) => `${value}F` },
    { 
      id: 'datetime', 
      label: '予約日時',
      format: (value: any, row: any) => `${row.reservationDate} ${row.timeSlot}`
    },
    { 
      id: 'status', 
      label: 'ステータス',
      format: (value: ViewingReservation['status']) => <StatusBadge status={value} />
    },
    { 
      id: 'action', 
      label: 'アクション',
      format: (value: any, row: any) => (
        <>
          <Link component="button" variant="body2" sx={{ mr: 1 }}>
            詳細
          </Link>
          {row.status === 'pending' && (
            <Link component="button" variant="body2">
              キャンセル
            </Link>
          )}
        </>
      )
    },
  ];

  const rows = viewings.map((viewing: ViewingReservation) => ({
    ...viewing,
    buildingName: building?.info.name || 'さくらビル',
    datetime: null,
    action: null,
  }));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        内見予約状況
      </Typography>
      <DataTable
        columns={columns}
        rows={rows}
        defaultRowsPerPage={5}
        rowsPerPageOptions={[5]}
      />
    </Paper>
  );
};

export default ViewingReservationTable;
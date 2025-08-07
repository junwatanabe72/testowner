import React from 'react';
import { Typography, Paper, Link, Chip } from '@mui/material';
import DataTable from '../../../components/Common/DataTable';
import StatusBadge from '../../../components/Common/Badge';
import { useSelector } from 'react-redux';
import { selectFloors } from '../../../store/selectors';
import { useNavigate } from 'react-router-dom';
import { Floor, ViewingReservation, TenantApplication } from '../../../types';
import { RootState } from '../../../store';

const FloorAvailabilityTable: React.FC = () => {
  const navigate = useNavigate();
  const floors = useSelector(selectFloors);
  
  const viewingReservations = useSelector((state: RootState) => state.viewingReservations.reservations);
  const applications = useSelector((state: RootState) => state.tenantApplications.applications);

  // 階数別の内見数を取得
  const getViewingCount = (floorNumber: number) => {
    return viewingReservations.filter(
      (reservation: ViewingReservation) => 
        reservation.floorNumber === floorNumber &&
        reservation.status !== 'cancelled'
    ).length;
  };

  // 階数別の申込数を取得
  const getApplicationCount = (floorNumber: number) => {
    return applications.filter(
      (application: TenantApplication) => application.floorNumber === floorNumber
    ).length;
  };

  const columns = [
    { id: 'floorNumber', label: 'フロア', format: (value: number) => `${value}F` },
    { id: 'area', label: '面積', format: (value: number) => `${value}㎡` },
    { 
      id: 'rent', 
      label: '賃料',
      format: (value: number | undefined) => value ? `¥${value.toLocaleString()}` : '-' 
    },
    { 
      id: 'commonCharge', 
      label: '共益費',
      format: (value: number | undefined) => value ? `¥${value.toLocaleString()}` : '-' 
    },
    { id: 'deposit', label: '敷金', format: (value: string | undefined) => value || '-' },
    { id: 'keyMoney', label: '礼金', format: (value: string | undefined) => value || '-' },
    { 
      id: 'viewingCount', 
      label: '内見数',
      format: (value: any, row: any) => (
        <Chip 
          label={`${getViewingCount(row.floorNumber)}件`}
          color={getViewingCount(row.floorNumber) > 0 ? 'info' : 'default'}
          size="small"
        />
      )
    },
    { 
      id: 'applicationCount', 
      label: '申込数',
      format: (value: any, row: any) => (
        <Chip 
          label={`${getApplicationCount(row.floorNumber)}件`}
          color={getApplicationCount(row.floorNumber) > 0 ? 'success' : 'default'}
          size="small"
        />
      )
    },
    { 
      id: 'status', 
      label: '状況',
      format: (value: 'occupied' | 'vacant', row: any) => {
        if (value === 'occupied') {
          return `入居中（${row.tenantName || ''}）`;
        }
        return <StatusBadge status={value} />;
      }
    },
    { 
      id: 'floorPlanUrl', 
      label: '図面',
      format: (value: string) => (
        <Link href="#" target="_blank">
          {value}
        </Link>
      )
    },
    { 
      id: 'action', 
      label: 'アクション',
      format: (value: any, row: any) => {
        if (row.status === 'vacant') {
          return (
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate(`/broker/viewing?floor=${row.floorNumber}`)}
            >
              内見予約
            </Link>
          );
        }
        return '-';
      }
    },
  ];

  const rows = floors.map((floor: Floor) => ({
    ...floor,
    viewingCount: null, // データは getViewingCount 関数で動的に取得
    applicationCount: null, // データは getApplicationCount 関数で動的に取得
    action: null,
  }));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        空室・入居中一覧
      </Typography>
      <DataTable
        columns={columns}
        rows={rows}
        defaultRowsPerPage={10}
      />
    </Paper>
  );
};

export default FloorAvailabilityTable;
import React from 'react';
import { Box, Typography, Paper, Button, Link } from '@mui/material';
import DataTable from '../../../components/Common/DataTable';
import { useSelector } from 'react-redux';
import { selectPendingApplications } from '../../../store/selectors';
import { useNavigate } from 'react-router-dom';
import { Application } from '../../../types';

const PendingApplications: React.FC = () => {
  const navigate = useNavigate();
  const pendingApplications = useSelector(selectPendingApplications);

  const columns = [
    { id: 'title', label: '件名' },
    { id: 'applicant', label: '申請元' },
    { id: 'applicationDate', label: '申請日' },
    {
      id: 'action',
      label: 'アクション',
      format: (value: any) => (
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/owner/approval')}
        >
          詳細確認・承認
        </Link>
      ),
    },
  ];

  const rows = pendingApplications.map((app: Application) => ({
    ...app,
    action: null,
  }));

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          未承認の申請
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={() => navigate('/owner/approval')}
        >
          すべて表示
        </Button>
      </Box>
      <DataTable
        columns={columns}
        rows={rows}
        defaultRowsPerPage={5}
        rowsPerPageOptions={[5]}
      />
    </Paper>
  );
};

export default PendingApplications;
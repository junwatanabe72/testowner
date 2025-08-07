import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { Application } from '../../../types';
import { updateApplicationStatus } from '../../../store/slices/applicationsSlice';
import { addActivity } from '../../../store/slices/activitiesSlice';
import { showNotification } from '../../../store/slices/uiSlice';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`approval-tabpanel-${index}`}
      aria-labelledby={`approval-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ApprovalManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const applications = useSelector((state: RootState) => state.applications);
  const [tabValue, setTabValue] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [comment, setComment] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getApplicationsByStatus = (status: 'pending' | 'approved' | 'rejected') => {
    const ids = applications.byStatus[status] || [];
    return ids.map((id: string) => applications.entities[id]).filter(Boolean);
  };

  const handleViewDetail = (application: Application) => {
    setSelectedApplication(application);
    setComment('');
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedApplication(null);
    setComment('');
  };

  const handleApprove = () => {
    if (!selectedApplication) return;

    dispatch(updateApplicationStatus({
      id: selectedApplication.id,
      status: 'approved',
      comment
    }));

    dispatch(addActivity({
      type: 'application',
      description: `「${selectedApplication.title}」を承認しました`,
      relatedId: selectedApplication.id
    }));

    dispatch(showNotification({
      message: '申請を承認しました',
      type: 'success'
    }));

    handleCloseDetail();
  };

  const handleReject = () => {
    if (!selectedApplication) return;

    dispatch(updateApplicationStatus({
      id: selectedApplication.id,
      status: 'rejected',
      comment
    }));

    dispatch(addActivity({
      type: 'application',
      description: `「${selectedApplication.title}」を却下しました`,
      relatedId: selectedApplication.id
    }));

    dispatch(showNotification({
      message: '申請を却下しました',
      type: 'error'
    }));

    handleCloseDetail();
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      facility: '施設',
      cleaning: '清掃',
      maintenance: 'メンテナンス',
      construction: '工事'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const colors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
      facility: 'primary',
      cleaning: 'info',
      maintenance: 'warning',
      construction: 'error'
    };
    return colors[type] || 'default';
  };

  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const colors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error'
    };
    return colors[status] || 'default';
  };

  const renderApplicationTable = (applications: Application[]) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>申請日</TableCell>
            <TableCell>種別</TableCell>
            <TableCell>件名</TableCell>
            <TableCell>申請元</TableCell>
            <TableCell>ステータス</TableCell>
            <TableCell>アクション</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                該当する申請はありません
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>{application.applicationDate}</TableCell>
                <TableCell>
                  <Chip
                    label={getTypeLabel(application.type)}
                    color={getTypeColor(application.type)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{application.title}</TableCell>
                <TableCell>{application.applicant}</TableCell>
                <TableCell>
                  <Chip
                    label={application.status === 'pending' ? '未承認' : 
                           application.status === 'approved' ? '承認済' : '却下'}
                    color={getStatusColor(application.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleViewDetail(application)}
                    color="primary"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  {application.status === 'pending' && (
                    <>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedApplication(application);
                          handleApprove();
                        }}
                        color="success"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedApplication(application);
                          handleReject();
                        }}
                        color="error"
                      >
                        <CancelIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        承認管理
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="approval tabs">
          <Tab label={`未承認 (${getApplicationsByStatus('pending').length})`} />
          <Tab label={`承認済み (${getApplicationsByStatus('approved').length})`} />
          <Tab label={`却下 (${getApplicationsByStatus('rejected').length})`} />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        {renderApplicationTable(getApplicationsByStatus('pending'))}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderApplicationTable(getApplicationsByStatus('approved'))}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {renderApplicationTable(getApplicationsByStatus('rejected'))}
      </TabPanel>

      <Dialog open={detailOpen} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
        <DialogTitle>申請詳細</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedApplication.title}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={getTypeLabel(selectedApplication.type)}
                  color={getTypeColor(selectedApplication.type)}
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={selectedApplication.status === 'pending' ? '未承認' : 
                         selectedApplication.status === 'approved' ? '承認済' : '却下'}
                  color={getStatusColor(selectedApplication.status)}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                申請日: {selectedApplication.applicationDate}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                申請元: {selectedApplication.applicant}
              </Typography>
              {selectedApplication.details && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    詳細
                  </Typography>
                  <Typography variant="body2">
                    {selectedApplication.details}
                  </Typography>
                </Box>
              )}
              {selectedApplication.status === 'pending' && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="コメント（任意）"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ mt: 2 }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>閉じる</Button>
          {selectedApplication?.status === 'pending' && (
            <>
              <Button onClick={handleReject} color="error">
                却下
              </Button>
              <Button onClick={handleApprove} variant="contained" color="primary">
                承認
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApprovalManagement;
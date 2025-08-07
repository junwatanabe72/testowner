import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { addActivity } from '../../../store/slices/activitiesSlice';
import { showNotification } from '../../../store/slices/uiSlice';
import { updateApplicationStatus } from '../../../store/slices/tenantApplicationsSlice';
import { TenantApplication, ApplicationDocument } from '../../../types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const ApplicationManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const applications = useSelector((state: RootState) => state.tenantApplications.applications);
  
  const [tabValue, setTabValue] = useState(0);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<TenantApplication | null>(null);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewDetail = (application: TenantApplication) => {
    setSelectedApplication(application);
    setDetailDialogOpen(true);
  };

  const handleApproveApplication = (id: string) => {
    dispatch(updateApplicationStatus({ id, status: 'approved' }));

    const application = applications.find((app: TenantApplication) => app.id === id);
    if (application) {
      dispatch(addActivity({
        type: 'application',
        description: `${application.floorNumber}階の入居申込を承認しました（${application.companyName}）`,
      }));

      dispatch(showNotification({
        message: '申込を承認しました。承認通知メールを送信しました。',
        type: 'success',
      }));
    }
  };

  const handleRejectApplication = (id: string) => {
    if (!rejectionReason.trim()) {
      dispatch(showNotification({
        message: '却下理由を入力してください。',
        type: 'warning',
      }));
      return;
    }

    dispatch(updateApplicationStatus({ 
      id, 
      status: 'rejected', 
      rejectionReason: rejectionReason.trim() 
    }));

    const application = applications.find((app: TenantApplication) => app.id === id);
    if (application) {
      dispatch(addActivity({
        type: 'application',
        description: `${application.floorNumber}階の入居申込を却下しました（${application.companyName}）`,
      }));

      dispatch(showNotification({
        message: '申込を却下しました。却下通知メールを送信しました。',
        type: 'info',
      }));
    }

    setRejectionDialogOpen(false);
    setRejectionReason('');
  };

  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const colors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: '審査中',
      approved: '承認済',
      rejected: '却下',
    };
    return labels[status] || status;
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      application_form: '入居申込書',
      company_registration: '会社登記簿',
      financial_statement: '財務書類',
      guarantor_form: '連帯保証人承諾書',
      other: 'その他',
    };
    return labels[type] || type;
  };

  const getApplicationsByStatus = (status: string) => {
    return applications.filter((app: TenantApplication) => app.status === status);
  };

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );

  const renderApplicationTable = (applicationList: TenantApplication[], showActions: boolean = true) => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>申込日</TableCell>
              <TableCell>希望階数</TableCell>
              <TableCell>申込企業</TableCell>
              <TableCell>代表者</TableCell>
              <TableCell>希望入居日</TableCell>
              <TableCell>仲介業者</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell>アクション</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicationList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  該当する申込はありません
                </TableCell>
              </TableRow>
            ) : (
              applicationList.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon fontSize="small" />
                      {application.applicationDate}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="bold">
                      {application.floorNumber}階
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {application.companyName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                        {application.businessType} ({application.employeeCount}名)
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{application.applicantName}</Typography>
                      <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                        {application.applicantPhone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{application.desiredMoveInDate}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{application.brokerCompany}</Typography>
                      <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                        {application.brokerName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(application.status)}
                      color={getStatusColor(application.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewDetail(application)}
                      >
                        詳細
                      </Button>
                      {showActions && application.status === 'pending' && (
                        <>
                          <Button
                            size="small"
                            color="success"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleApproveApplication(application.id)}
                          >
                            承認
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => {
                              setSelectedApplication(application);
                              setRejectionDialogOpen(true);
                            }}
                          >
                            却下
                          </Button>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        入居申込管理
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        入居申込の審査・承認を管理します。必要書類や申込内容を確認して適切に審査してください。
      </Alert>

      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              審査中
            </Typography>
            <Typography variant="h4" color="warning.main">
              {getApplicationsByStatus('pending').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              承認済み
            </Typography>
            <Typography variant="h4" color="success.main">
              {getApplicationsByStatus('approved').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              却下
            </Typography>
            <Typography variant="h4" color="error.main">
              {getApplicationsByStatus('rejected').length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="全て" />
          <Tab label="審査中" />
          <Tab label="承認済み" />
          <Tab label="却下" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        {renderApplicationTable(applications)}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderApplicationTable(getApplicationsByStatus('pending'))}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {renderApplicationTable(getApplicationsByStatus('approved'), false)}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {renderApplicationTable(getApplicationsByStatus('rejected'), false)}
      </TabPanel>

      {/* 申込詳細ダイアログ */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>入居申込詳細</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                申込情報
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">希望階数</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedApplication.floorNumber}階
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">申込日</Typography>
                  <Typography variant="body1">{selectedApplication.applicationDate}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">希望入居日</Typography>
                  <Typography variant="body1">{selectedApplication.desiredMoveInDate}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">ステータス</Typography>
                  <Chip
                    label={getStatusLabel(selectedApplication.status)}
                    color={getStatusColor(selectedApplication.status)}
                    size="small"
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                申込企業情報
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">企業名</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedApplication.companyName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">業種</Typography>
                  <Typography variant="body1">{selectedApplication.businessType}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">従業員数</Typography>
                  <Typography variant="body1">{selectedApplication.employeeCount}名</Typography>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>
                代表者情報
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">氏名</Typography>
                  <Typography variant="body1">{selectedApplication.applicantName}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">電話番号</Typography>
                  <Typography variant="body1">{selectedApplication.applicantPhone}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">メールアドレス</Typography>
                  <Typography variant="body1">{selectedApplication.applicantEmail}</Typography>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>
                連帯保証人情報
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">氏名</Typography>
                  <Typography variant="body1">{selectedApplication.guarantor.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">電話番号</Typography>
                  <Typography variant="body1">{selectedApplication.guarantor.phone}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">続柄</Typography>
                  <Typography variant="body1">{selectedApplication.guarantor.relationship}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                仲介業者情報
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">仲介業者</Typography>
                  <Typography variant="body1">{selectedApplication.brokerCompany}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">担当者</Typography>
                  <Typography variant="body1">{selectedApplication.brokerName}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">電話番号</Typography>
                  <Typography variant="body1">{selectedApplication.brokerPhone}</Typography>
                </Box>
              </Box>

              {selectedApplication.documents.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    提出書類
                  </Typography>
                  
                  <List>
                    {selectedApplication.documents.map((document) => (
                      <ListItem key={document.id}>
                        <ListItemIcon>
                          <AttachFileIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={document.name}
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                {getDocumentTypeLabel(document.type)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {document.uploadDate} • {document.fileSize}
                              </Typography>
                            </Box>
                          }
                        />
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            dispatch(showNotification({
                              message: 'ファイルダウンロード機能は開発中です',
                              type: 'info',
                            }));
                          }}
                        >
                          ダウンロード
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {selectedApplication.notes && (
                <>
                  <Typography variant="h6" gutterBottom>
                    備考
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedApplication.notes}
                  </Typography>
                </>
              )}

              {selectedApplication.rejectionReason && (
                <>
                  <Typography variant="h6" gutterBottom color="error">
                    却下理由
                  </Typography>
                  <Typography variant="body1" color="error">
                    {selectedApplication.rejectionReason}
                  </Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedApplication && selectedApplication.status === 'pending' && (
            <>
              <Button
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => {
                  handleApproveApplication(selectedApplication.id);
                  setDetailDialogOpen(false);
                }}
              >
                承認
              </Button>
              <Button
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => {
                  setDetailDialogOpen(false);
                  setRejectionDialogOpen(true);
                }}
              >
                却下
              </Button>
            </>
          )}
          <Button onClick={() => setDetailDialogOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>

      {/* 却下理由入力ダイアログ */}
      <Dialog open={rejectionDialogOpen} onClose={() => setRejectionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>申込却下</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              申込を却下します。却下理由を入力してください。
            </Alert>
            <TextField
              fullWidth
              label="却下理由"
              multiline
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="例：事業実績が不十分で、賃料支払い能力に不安があるため"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectionDialogOpen(false)}>
            キャンセル
          </Button>
          <Button
            onClick={() => selectedApplication && handleRejectApplication(selectedApplication.id)}
            color="error"
            variant="contained"
            disabled={!rejectionReason.trim()}
          >
            却下実行
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApplicationManagement;
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
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Alert,
  IconButton,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { Floor, ViewingReservation, TenantApplication } from '../../../types';
import { selectFloors, selectVacantFloors, selectOccupiedFloors } from '../../../store/selectors';
import { updateFloorStatus, updateFloorTerms } from '../../../store/slices/buildingSlice';
import { addActivity } from '../../../store/slices/activitiesSlice';
import { showNotification } from '../../../store/slices/uiSlice';
import { updateViewingReservationStatus, cancelViewingReservation } from '../../../store/slices/viewingReservationsSlice';
import { updateApplicationStatus } from '../../../store/slices/tenantApplicationsSlice';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ApplicationIcon from '@mui/icons-material/Assignment';
import AddIcon from '@mui/icons-material/Add';
import RecruitmentConditionForm from '../components/RecruitmentConditionForm';
import BrokerCompanyManagement from '../components/BrokerCompanyManagement';
import EmailTemplateEditor from '../components/EmailTemplateEditor';

const VacancyManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const floors = useSelector(selectFloors);
  const vacantFloors = useSelector(selectVacantFloors);
  const occupiedFloors = useSelector(selectOccupiedFloors);
  
  const viewingReservations = useSelector((state: RootState) => state.viewingReservations.reservations);
  const applications = useSelector((state: RootState) => state.tenantApplications.applications);
  
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<TenantApplication | null>(null);
  const [applicationDetailDialogOpen, setApplicationDetailDialogOpen] = useState(false);
  const [selectedViewingReservation, setSelectedViewingReservation] = useState<ViewingReservation | null>(null);
  const [viewingDetailDialogOpen, setViewingDetailDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [moveOutDialogOpen, setMoveOutDialogOpen] = useState(false);
  const [selectedMoveOutFloor, setSelectedMoveOutFloor] = useState<Floor | null>(null);
  const [sendNotification, setSendNotification] = useState(true);
  const [moveInDialogOpen, setMoveInDialogOpen] = useState(false);
  const [recruitmentFormOpen, setRecruitmentFormOpen] = useState(false);
  const [recruitmentSubTab, setRecruitmentSubTab] = useState(0);
  
  const [editData, setEditData] = useState({
    rent: 0,
    commonCharge: 0,
    deposit: '',
    keyMoney: '',
  });
  
  const [tenantName, setTenantName] = useState('');

  const handleEditClick = (floor: Floor) => {
    setSelectedFloor(floor);
    setEditData({
      rent: floor.rent || 0,
      commonCharge: floor.commonCharge || 0,
      deposit: floor.deposit || '',
      keyMoney: floor.keyMoney || '',
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!selectedFloor) return;

    dispatch(updateFloorTerms({
      floorNumber: selectedFloor.floorNumber,
      ...editData,
    }));

    dispatch(addActivity({
      type: 'maintenance',
      description: `${selectedFloor.floorNumber}階の募集条件を更新しました`,
    }));

    dispatch(showNotification({
      message: '募集条件を更新しました',
      type: 'success',
    }));

    setEditDialogOpen(false);
  };

  const handleMoveInClick = (floor: Floor) => {
    setSelectedFloor(floor);
    setTenantName('');
    setMoveInDialogOpen(true);
  };

  const handleMoveInSave = () => {
    if (!selectedFloor || !tenantName) return;

    dispatch(updateFloorStatus({
      floorNumber: selectedFloor.floorNumber,
      status: 'occupied',
      tenantName,
    }));

    dispatch(addActivity({
      type: 'tenant_move_in',
      description: `${tenantName}が${selectedFloor.floorNumber}階に入居しました`,
    }));

    dispatch(showNotification({
      message: 'テナントの入居処理が完了しました',
      type: 'success',
    }));

    setMoveInDialogOpen(false);
  };

  const handleMoveOutClick = (floor: Floor) => {
    setSelectedFloor(floor);
    setMoveOutDialogOpen(true);
  };

  const handleMoveOutSave = () => {
    if (!selectedFloor) return;

    const tenantName = selectedFloor.tenantName || '';

    dispatch(updateFloorStatus({
      floorNumber: selectedFloor.floorNumber,
      status: 'vacant',
    }));

    dispatch(addActivity({
      type: 'tenant_move_out',
      description: `${tenantName}が${selectedFloor.floorNumber}階から退去しました`,
    }));

    dispatch(showNotification({
      message: 'テナントの退去処理が完了しました',
      type: 'info',
    }));

    setMoveOutDialogOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 内見予約の承認
  const handleApproveViewingReservation = (id: string) => {
    dispatch(updateViewingReservationStatus({ id, status: 'approved' }));
    
    const reservation = viewingReservations.find((r: ViewingReservation) => r.id === id);
    if (reservation) {
      dispatch(addActivity({
        type: 'viewing',
        description: `${reservation.floorNumber}階の内見予約を承認しました（${reservation.clientName}）`,
      }));

      dispatch(showNotification({
        message: '内見予約を承認しました。確認メールを送信しました。',
        type: 'success',
      }));
    }
  };

  // 内見予約のキャンセル
  const handleCancelViewingReservation = (id: string) => {
    dispatch(cancelViewingReservation(id));
    
    const reservation = viewingReservations.find((r: ViewingReservation) => r.id === id);
    if (reservation) {
      dispatch(addActivity({
        type: 'viewing',
        description: `${reservation.floorNumber}階の内見予約をキャンセルしました（${reservation.clientName}）`,
      }));

      dispatch(showNotification({
        message: '内見予約をキャンセルしました。',
        type: 'info',
      }));
    }
  };

  // 内見予約を完了済みにする
  const handleCompleteViewingReservation = (id: string) => {
    dispatch(updateViewingReservationStatus({ id, status: 'completed' }));
    
    const reservation = viewingReservations.find((r: ViewingReservation) => r.id === id);
    if (reservation) {
      dispatch(addActivity({
        type: 'viewing',
        description: `${reservation.floorNumber}階の内見が完了しました（${reservation.clientName}）`,
      }));

      dispatch(showNotification({
        message: '内見が完了しました。',
        type: 'success',
      }));
    }
  };

  // 入居申込の承認
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

  // 入居申込の却下
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

  const handleViewApplicationDetail = (application: TenantApplication) => {
    setSelectedApplication(application);
    setApplicationDetailDialogOpen(true);
  };

  const handleMoveOut = (floor: Floor) => {
    setSelectedMoveOutFloor(floor);
    setSendNotification(true);
    setMoveOutDialogOpen(true);
  };

  const confirmMoveOut = () => {
    if (!selectedMoveOutFloor) return;

    // 退去処理
    dispatch(updateFloorStatus({
      floorNumber: selectedMoveOutFloor.floorNumber,
      status: 'vacant',
    }));

    dispatch(addActivity({
      type: 'tenant_move_out',
      description: `${selectedMoveOutFloor.floorNumber}階のテナント「${selectedMoveOutFloor.tenantName}」が退去しました`,
    }));

    if (sendNotification) {
      // メール通知送信の処理（UIのみ）
      dispatch(showNotification({
        message: `${selectedMoveOutFloor.floorNumber}階の退去処理を完了し、仲介会社に空室通知メールを送信しました。`,
        type: 'success',
      }));

      dispatch(addActivity({
        type: 'maintenance',
        description: `${selectedMoveOutFloor.floorNumber}階の退去に伴い、仲介会社に空室通知メールを送信しました`,
      }));
    } else {
      dispatch(showNotification({
        message: `${selectedMoveOutFloor.floorNumber}階の退去処理を完了しました。`,
        type: 'success',
      }));
    }

    setMoveOutDialogOpen(false);
    setSelectedMoveOutFloor(null);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

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

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        空室・申込管理
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        空室管理、内見予約、入居申込をワンストップで管理できます。
      </Alert>

      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              空室数
            </Typography>
            <Typography variant="h4" color="warning.main">
              {vacantFloors.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              内見予約
            </Typography>
            <Typography variant="h4" color="info.main">
              {viewingReservations.filter((r: ViewingReservation) => r.status === 'pending').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              入居申込
            </Typography>
            <Typography variant="h4" color="success.main">
              {applications.filter((a: TenantApplication) => a.status === 'pending').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              入居中
            </Typography>
            <Typography variant="h4" color="success.main">
              {occupiedFloors.length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="空室一覧" />
          <Tab label="内見予約" />
          <Tab label="入居申込" />
          <Tab label="入居中一覧" />
          <Tab label="募集条件管理" />
        </Tabs>
      </Paper>

      {/* Tab 0: 空室一覧 */}
      {tabValue === 0 && (
        <Box sx={{ py: 2 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>階数</TableCell>
                  <TableCell>面積</TableCell>
                  <TableCell>賃料</TableCell>
                  <TableCell>共益費</TableCell>
                  <TableCell>敷金</TableCell>
                  <TableCell>礼金</TableCell>
                  <TableCell>内見数</TableCell>
                  <TableCell>申込数</TableCell>
                  <TableCell>ステータス</TableCell>
                  <TableCell>アクション</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vacantFloors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      空室はありません
                    </TableCell>
                  </TableRow>
                ) : (
                  vacantFloors.map((floor: Floor) => (
                    <TableRow key={floor.id}>
                      <TableCell>{floor.floorNumber}階</TableCell>
                      <TableCell>{floor.area}㎡</TableCell>
                      <TableCell>{formatCurrency(floor.rent || 0)}</TableCell>
                      <TableCell>{formatCurrency(floor.commonCharge || 0)}</TableCell>
                      <TableCell>{floor.deposit || '-'}</TableCell>
                      <TableCell>{floor.keyMoney || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={`${getViewingCount(floor.floorNumber)}件`}
                          color={getViewingCount(floor.floorNumber) > 0 ? 'info' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${getApplicationCount(floor.floorNumber)}件`}
                          color={getApplicationCount(floor.floorNumber) > 0 ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label="空室" color="warning" size="small" />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditClick(floor)}
                        >
                          編集
                        </Button>
                        <Button
                          size="small"
                          color="success"
                          startIcon={<PersonAddIcon />}
                          onClick={() => handleMoveInClick(floor)}
                          sx={{ ml: 1 }}
                        >
                          入居
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Tab 1: 内見予約 */}
      {tabValue === 1 && (
        <Box sx={{ py: 2 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>予約日時</TableCell>
                  <TableCell>階数</TableCell>
                  <TableCell>お客様名</TableCell>
                  <TableCell>仲介業者</TableCell>
                  <TableCell>ステータス</TableCell>
                  <TableCell>備考</TableCell>
                  <TableCell>アクション</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {viewingReservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      内見予約はありません
                    </TableCell>
                  </TableRow>
                ) : (
                  viewingReservations.map((reservation: ViewingReservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarTodayIcon fontSize="small" />
                          <Box>
                            <Typography variant="body2">{reservation.reservationDate}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {reservation.timeSlot}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{reservation.floorNumber}階</TableCell>
                      <TableCell>{reservation.clientName}</TableCell>
                      <TableCell>{reservation.brokerCompany}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            reservation.status === 'pending' ? '確認待ち' :
                            reservation.status === 'approved' ? '承認済' :
                            reservation.status === 'completed' ? '完了' :
                            reservation.status === 'cancelled' ? 'キャンセル' : reservation.status
                          }
                          color={
                            reservation.status === 'pending' ? 'warning' :
                            reservation.status === 'approved' ? 'success' :
                            reservation.status === 'completed' ? 'info' :
                            reservation.status === 'cancelled' ? 'error' : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{reservation.notes || '-'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Button
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => {
                              setSelectedViewingReservation(reservation);
                              setViewingDetailDialogOpen(true);
                            }}
                          >
                            詳細
                          </Button>
                          {reservation.status === 'pending' && (
                            <>
                              <Button
                                size="small"
                                color="success"
                                startIcon={<CheckCircleIcon />}
                                onClick={() => handleApproveViewingReservation(reservation.id)}
                              >
                                承認
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                startIcon={<CancelIcon />}
                                onClick={() => handleCancelViewingReservation(reservation.id)}
                              >
                                キャンセル
                              </Button>
                            </>
                          )}
                          {reservation.status === 'approved' && (
                            <Button
                              size="small"
                              color="info"
                              onClick={() => handleCompleteViewingReservation(reservation.id)}
                            >
                              完了
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Tab 2: 入居申込 */}
      {tabValue === 2 && (
        <Box sx={{ py: 2 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>申込日</TableCell>
                  <TableCell>階数</TableCell>
                  <TableCell>申込企業</TableCell>
                  <TableCell>代表者</TableCell>
                  <TableCell>希望入居日</TableCell>
                  <TableCell>ステータス</TableCell>
                  <TableCell>アクション</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      入居申込はありません
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((application: TenantApplication) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ApplicationIcon fontSize="small" />
                          {application.applicationDate}
                        </Box>
                      </TableCell>
                      <TableCell>{application.floorNumber}階</TableCell>
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
                            onClick={() => handleViewApplicationDetail(application)}
                          >
                            詳細
                          </Button>
                          {application.status === 'pending' && (
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
        </Box>
      )}

      {/* Tab 3: 入居中一覧 */}
      {tabValue === 3 && (
        <Box sx={{ py: 2 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>階数</TableCell>
                  <TableCell>面積</TableCell>
                  <TableCell>テナント名</TableCell>
                  <TableCell>内見数</TableCell>
                  <TableCell>申込数</TableCell>
                  <TableCell>ステータス</TableCell>
                  <TableCell>アクション</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {occupiedFloors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      入居中のテナントはありません
                    </TableCell>
                  </TableRow>
                ) : (
                  occupiedFloors.map((floor: Floor) => (
                    <TableRow key={floor.id}>
                      <TableCell>{floor.floorNumber}階</TableCell>
                      <TableCell>{floor.area}㎡</TableCell>
                      <TableCell>{floor.tenantName || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={`${getViewingCount(floor.floorNumber)}件`}
                          color={getViewingCount(floor.floorNumber) > 0 ? 'info' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${getApplicationCount(floor.floorNumber)}件`}
                          color={getApplicationCount(floor.floorNumber) > 0 ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label="入居中" color="success" size="small" />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          color="warning"
                          startIcon={<PersonRemoveIcon />}
                          onClick={() => handleMoveOut(floor)}
                        >
                          退去
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Tab 4: 募集条件管理 */}
      {tabValue === 4 && (
        <Box sx={{ py: 2 }}>
          <Paper sx={{ width: '100%', mb: 3 }}>
            <Tabs value={recruitmentSubTab} onChange={(_, newValue) => setRecruitmentSubTab(newValue)}>
              <Tab label="募集条件設定" />
              <Tab label="仲介会社管理" />
              <Tab label="メールテンプレート" />
            </Tabs>
          </Paper>

          {recruitmentSubTab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  募集条件設定
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setRecruitmentFormOpen(true)}
                  startIcon={<AddIcon />}
                >
                  募集条件を追加
                </Button>
              </Box>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                各空室の募集条件を設定できます。設定した条件は仲介会社への通知メールに自動で反映されます。
              </Alert>
              
              {/* 募集条件一覧の表示はここに実装 */}
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  募集条件の表示機能は今後実装予定です
                </Typography>
              </Paper>
            </Box>
          )}

          {recruitmentSubTab === 1 && <BrokerCompanyManagement />}
          
          {recruitmentSubTab === 2 && <EmailTemplateEditor />}
        </Box>
      )}

      {/* 募集条件編集ダイアログ */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>募集条件の編集</DialogTitle>
        <DialogContent>
          {selectedFloor && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {selectedFloor.floorNumber}階 ({selectedFloor.area}㎡)
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="賃料"
                    type="number"
                    value={editData.rent}
                    onChange={(e) => setEditData({ ...editData, rent: Number(e.target.value) })}
                    InputProps={{ endAdornment: '円' }}
                  />
                  <TextField
                    fullWidth
                    label="共益費"
                    type="number"
                    value={editData.commonCharge}
                    onChange={(e) => setEditData({ ...editData, commonCharge: Number(e.target.value) })}
                    InputProps={{ endAdornment: '円' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="敷金"
                    value={editData.deposit}
                    onChange={(e) => setEditData({ ...editData, deposit: e.target.value })}
                    placeholder="例: 2ヶ月"
                  />
                  <TextField
                    fullWidth
                    label="礼金"
                    value={editData.keyMoney}
                    onChange={(e) => setEditData({ ...editData, keyMoney: e.target.value })}
                    placeholder="例: 1ヶ月"
                  />
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 入居処理ダイアログ */}
      <Dialog open={moveInDialogOpen} onClose={() => setMoveInDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>入居処理</DialogTitle>
        <DialogContent>
          {selectedFloor && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {selectedFloor.floorNumber}階に入居するテナント情報を入力してください
              </Typography>
              <TextField
                fullWidth
                label="テナント名"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                sx={{ mt: 2 }}
                placeholder="例: 株式会社○○"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMoveInDialogOpen(false)}>キャンセル</Button>
          <Button 
            onClick={handleMoveInSave} 
            variant="contained" 
            color="primary"
            disabled={!tenantName}
          >
            入居処理
          </Button>
        </DialogActions>
      </Dialog>

      {/* 退去処理ダイアログ */}
      <Dialog open={moveOutDialogOpen} onClose={() => setMoveOutDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>退去処理</DialogTitle>
        <DialogContent>
          {selectedFloor && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1">
                {selectedFloor.floorNumber}階の{selectedFloor.tenantName}を退去処理しますか？
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                この操作により、フロアは空室状態になります。
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMoveOutDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleMoveOutSave} variant="contained" color="warning">
            退去処理
          </Button>
        </DialogActions>
      </Dialog>

      {/* 申込詳細ダイアログ */}
      <Dialog open={applicationDetailDialogOpen} onClose={() => setApplicationDetailDialogOpen(false)} maxWidth="md" fullWidth>
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
                  setApplicationDetailDialogOpen(false);
                }}
              >
                承認
              </Button>
              <Button
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => {
                  handleRejectApplication(selectedApplication.id);
                  setApplicationDetailDialogOpen(false);
                }}
              >
                却下
              </Button>
            </>
          )}
          <Button onClick={() => setApplicationDetailDialogOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>

      {/* 内見予約詳細ダイアログ */}
      <Dialog open={viewingDetailDialogOpen} onClose={() => setViewingDetailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>内見予約詳細</DialogTitle>
        <DialogContent>
          {selectedViewingReservation && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                予約情報
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">階数</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedViewingReservation.floorNumber}階
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">予約日時</Typography>
                  <Typography variant="body1">
                    {selectedViewingReservation.reservationDate} {selectedViewingReservation.timeSlot}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">ステータス</Typography>
                  <Chip
                    label={
                      selectedViewingReservation.status === 'pending' ? '確認待ち' :
                      selectedViewingReservation.status === 'approved' ? '承認済' :
                      selectedViewingReservation.status === 'completed' ? '完了' :
                      selectedViewingReservation.status === 'cancelled' ? 'キャンセル' : selectedViewingReservation.status
                    }
                    color={
                      selectedViewingReservation.status === 'pending' ? 'warning' :
                      selectedViewingReservation.status === 'approved' ? 'success' :
                      selectedViewingReservation.status === 'completed' ? 'info' :
                      selectedViewingReservation.status === 'cancelled' ? 'error' : 'default'
                    }
                    size="small"
                  />
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>
                お客様情報
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">お名前</Typography>
                  <Typography variant="body1">{selectedViewingReservation.clientName}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">仲介業者</Typography>
                  <Typography variant="body1">{selectedViewingReservation.brokerCompany}</Typography>
                </Box>
              </Box>

              {selectedViewingReservation.notes && (
                <>
                  <Typography variant="h6" gutterBottom>
                    備考
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedViewingReservation.notes}
                  </Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedViewingReservation && selectedViewingReservation.status === 'pending' && (
            <>
              <Button
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => {
                  handleApproveViewingReservation(selectedViewingReservation.id);
                  setViewingDetailDialogOpen(false);
                }}
              >
                承認
              </Button>
              <Button
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => {
                  handleCancelViewingReservation(selectedViewingReservation.id);
                  setViewingDetailDialogOpen(false);
                }}
              >
                キャンセル
              </Button>
            </>
          )}
          {selectedViewingReservation && selectedViewingReservation.status === 'approved' && (
            <Button
              color="info"
              onClick={() => {
                handleCompleteViewingReservation(selectedViewingReservation.id);
                setViewingDetailDialogOpen(false);
              }}
            >
              完了にする
            </Button>
          )}
          <Button onClick={() => setViewingDetailDialogOpen(false)}>閉じる</Button>
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

      {/* 退去確認ダイアログ */}
      <Dialog open={moveOutDialogOpen} onClose={() => setMoveOutDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          退去処理確認
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {selectedMoveOutFloor && (
              <>
                <Alert severity="warning" sx={{ mb: 3 }}>
                  以下のテナントの退去処理を行います。この操作は取り消せません。
                </Alert>
                
                <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    退去対象
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">階数</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {selectedMoveOutFloor.floorNumber}階
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">面積</Typography>
                      <Typography variant="body1">
                        {selectedMoveOutFloor.area}㎡
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">テナント名</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedMoveOutFloor.tenantName}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                <FormControlLabel
                  control={
                    <Switch
                      checked={sendNotification}
                      onChange={(e) => setSendNotification(e.target.checked)}
                    />
                  }
                  label="仲介会社に空室通知メールを送信する"
                />
                
                {sendNotification && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    登録された仲介会社（配信有効）に退去通知メールを自動送信します。
                    募集条件が設定されている場合は、そちらの情報も含めて送信されます。
                  </Alert>
                )}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMoveOutDialogOpen(false)}>
            キャンセル
          </Button>
          <Button
            onClick={confirmMoveOut}
            color="warning"
            variant="contained"
            startIcon={<PersonRemoveIcon />}
          >
            退去処理を実行
          </Button>
        </DialogActions>
      </Dialog>

      {/* 募集条件フォーム */}
      <RecruitmentConditionForm
        open={recruitmentFormOpen}
        onClose={() => setRecruitmentFormOpen(false)}
      />
    </Box>
  );
};

export default VacancyManagement;
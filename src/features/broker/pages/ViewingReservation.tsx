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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Alert,
  Badge,
  Tooltip,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { addActivity } from '../../../store/slices/activitiesSlice';
import { showNotification } from '../../../store/slices/uiSlice';
import { selectVacantFloors } from '../../../store/selectors';
import { addViewingReservation, cancelViewingReservation } from '../../../store/slices/viewingReservationsSlice';
import { Floor, ViewingReservation } from '../../../types';
import { nanoid } from '@reduxjs/toolkit';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AIChat from '../components/AIChat';

interface ExtendedViewingReservationData {
  id: string;
  floorNumber: number;
  date: string;
  time: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName: string;
  purpose: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

const ViewingReservationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const vacantFloors = useSelector(selectVacantFloors);
  const allViewingReservations = useSelector((state: RootState) => state.viewingReservations.reservations);
  
  // 現在ログイン中の仲介会社（実際のアプリでは認証情報から取得）
  const currentBrokerCompany = 'エステート不動産';
  
  // 自社の予約のみフィルタリング
  const viewingReservations = allViewingReservations.filter(
    (reservation: ViewingReservation) => reservation.brokerCompany === currentBrokerCompany
  );
  
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ExtendedViewingReservationData | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  // 拡張された予約データ（仲介会社側で管理する追加情報）
  const [extendedReservationData, setExtendedReservationData] = useState<{ 
    [key: string]: { 
      clientEmail: string; 
      clientPhone: string; 
      purpose: string; 
      createdAt: string; 
    } 
  }>({
    'res-1': {
      clientEmail: 'yamada@example.com',
      clientPhone: '090-1234-5678',
      purpose: 'オフィス移転検討',
      createdAt: '2025-08-06 09:30',
    },
    'res-2': {
      clientEmail: 'sato@xyz-corp.com',
      clientPhone: '080-9876-5432',
      purpose: '支店開設検討',
      createdAt: '2025-08-05 16:20',
    },
    'res-3': {
      clientEmail: 'tanaka@startup.jp',
      clientPhone: '070-5555-1234',
      purpose: '新規事業立ち上げ',
      createdAt: '2025-08-01 14:15',
    },
  });

  // ViewingReservationDataとViewingReservationを結合
  const combinedReservations = viewingReservations.map((reservation: ViewingReservation) => {
    const extended = extendedReservationData[reservation.id] || {
      clientEmail: '',
      clientPhone: '',
      purpose: '',
      createdAt: new Date().toLocaleString('ja-JP'),
    };
    
    return {
      ...reservation,
      ...extended,
      date: reservation.reservationDate,
      time: reservation.timeSlot.split('-')[0], // '10:00-11:00' -> '10:00'
      companyName: reservation.clientName + '所属',
    };
  });

  const [newReservation, setNewReservation] = useState({
    floorNumber: '',
    date: '',
    time: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    companyName: '',
    purpose: '',
    notes: '',
  });

  const handleAddReservation = () => {
    const reservationId = nanoid();
    const reservation: ViewingReservation = {
      id: reservationId,
      floorNumber: Number(newReservation.floorNumber),
      reservationDate: newReservation.date,
      timeSlot: `${newReservation.time}-${(parseInt(newReservation.time.split(':')[0]) + 1).toString().padStart(2, '0')}:${newReservation.time.split(':')[1]}`,
      status: 'pending',
      brokerCompany: currentBrokerCompany, // ログイン中の仲介会社名
      clientName: newReservation.clientName,
      notes: newReservation.notes,
    };

    // 拡張データを保存
    setExtendedReservationData(prev => ({
      ...prev,
      [reservationId]: {
        clientEmail: newReservation.clientEmail,
        clientPhone: newReservation.clientPhone,
        purpose: newReservation.purpose,
        createdAt: new Date().toLocaleString('ja-JP'),
      },
    }));

    dispatch(addViewingReservation(reservation));

    dispatch(addActivity({
      type: 'viewing',
      description: `${newReservation.floorNumber}階の内見予約申請がありました（${currentBrokerCompany} - ${newReservation.clientName}）`,
    }));

    dispatch(showNotification({
      message: '内見予約を受け付けました。確認メールを送信しました。',
      type: 'success',
    }));

    setReservationDialogOpen(false);
    setNewReservation({
      floorNumber: '',
      date: '',
      time: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      companyName: '',
      purpose: '',
      notes: '',
    });
  };

  const handleCancelReservation = (id: string) => {
    dispatch(cancelViewingReservation(id));

    const reservation = viewingReservations.find((r: ViewingReservation) => r.id === id);
    if (reservation) {
      dispatch(addActivity({
        type: 'viewing',
        description: `${reservation.floorNumber}階の内見予約がキャンセルされました（${reservation.brokerCompany} - ${reservation.clientName}）`,
      }));

      dispatch(showNotification({
        message: '内見予約をキャンセルしました。キャンセル通知メールを送信しました。',
        type: 'info',
      }));
    }
  };

  const handleViewDetail = (reservation: ExtendedViewingReservationData) => {
    setSelectedReservation(reservation);
    setDetailDialogOpen(true);
  };

  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const colors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
      pending: 'warning',
      approved: 'success',
      completed: 'info',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: '確認待ち',
      approved: '承認済',
      completed: '完了',
      cancelled: 'キャンセル',
    };
    return labels[status] || status;
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // 指定日・階・時間の予約状況を確認
  const getReservationStatus = (date: string, floorNumber: number, timeSlot: string) => {
    const existingReservations = allViewingReservations.filter(
      (reservation: ViewingReservation) => 
        reservation.reservationDate === date &&
        reservation.floorNumber === floorNumber &&
        reservation.timeSlot.startsWith(timeSlot) &&
        reservation.status !== 'cancelled'
    );
    
    if (existingReservations.length === 0) {
      return { available: true, brokerCompany: null };
    }
    
    return {
      available: false,
      brokerCompany: existingReservations[0].brokerCompany,
      isSelfReservation: existingReservations[0].brokerCompany === currentBrokerCompany
    };
  };

  // 指定日の予約可能時間帯を取得
  const getAvailableTimeSlots = (date: string, floorNumber: number) => {
    return timeSlots.map(time => {
      const status = getReservationStatus(date, floorNumber, time);
      return {
        time,
        ...status
      };
    });
  };


  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        内見予約管理
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        空室の内見予約を管理できます。自社の予約のみ表示されますが、他社の予約状況も考慮して予約時間を選択してください。
      </Alert>
      

      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              自社・今日の予約
            </Typography>
            <Typography variant="h4">
              {combinedReservations.filter((r: ExtendedViewingReservationData) => r.date === new Date().toISOString().split('T')[0] && r.status !== 'cancelled').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              自社・確認待ち
            </Typography>
            <Typography variant="h4" color="warning.main">
              {combinedReservations.filter((r: ExtendedViewingReservationData) => r.status === 'pending').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              全業者・総内見数
            </Typography>
            <Typography variant="h4" color="primary.main">
              {allViewingReservations.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              （自社: {viewingReservations.length}件）
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              自社・今月完了
            </Typography>
            <Typography variant="h4" color="success.main">
              {combinedReservations.filter((r: ExtendedViewingReservationData) => r.status === 'completed').length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">内見予約一覧</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setReservationDialogOpen(true)}
        >
          新規予約
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>予約日時</TableCell>
              <TableCell>階数</TableCell>
              <TableCell>お客様情報</TableCell>
              <TableCell>会社名</TableCell>
              <TableCell>目的</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell>アクション</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {combinedReservations.map((reservation: ExtendedViewingReservationData) => (
              <TableRow key={reservation.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon fontSize="small" />
                    <Box>
                      <Typography variant="body2">{reservation.date}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {reservation.time}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="bold">
                    {reservation.floorNumber}階
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" />
                    <Box>
                      <Typography variant="body2">{reservation.clientName}</Typography>
                      <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                        {reservation.clientEmail}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{reservation.companyName}</TableCell>
                <TableCell>{reservation.purpose}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(reservation.status)}
                    color={getStatusColor(reservation.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleViewDetail(reservation)}
                  >
                    詳細
                  </Button>
                  {reservation.status === 'pending' || reservation.status === 'confirmed' ? (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      キャンセル
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 新規予約ダイアログ */}
      <Dialog open={reservationDialogOpen} onClose={() => setReservationDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>新規内見予約</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Alert severity="warning">
              内見予約は営業時間内（9:00-18:00）のみ受付可能です。
            </Alert>
            
            <Typography variant="h6" gutterBottom>
              物件情報
            </Typography>
            
            <FormControl fullWidth>
              <InputLabel>希望階数</InputLabel>
              <Select
                value={newReservation.floorNumber}
                onChange={(e) => setNewReservation({ ...newReservation, floorNumber: e.target.value })}
                label="希望階数"
              >
                {vacantFloors.map((floor: Floor) => (
                  <MenuItem key={floor.id} value={floor.floorNumber}>
                    {floor.floorNumber}階 ({floor.area}㎡) - ¥{(floor.rent || 0).toLocaleString()}/月
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="希望日"
              type="date"
              value={newReservation.date}
              onChange={(e) => setNewReservation({ ...newReservation, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: new Date().toISOString().split('T')[0],
              }}
              sx={{ mb: 2 }}
            />
            
            {newReservation.floorNumber && newReservation.date && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  希望時間を選択
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  🟢 予約可能　🔴 予約済み（他社）　🟡 予約済み（自社）
                </Alert>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
                  {getAvailableTimeSlots(newReservation.date, Number(newReservation.floorNumber)).map(({ time, available, brokerCompany, isSelfReservation }) => (
                    <Tooltip
                      key={time}
                      title={
                        available 
                          ? '予約可能' 
                          : isSelfReservation 
                            ? `予約済み（自社）` 
                            : `予約済み（${brokerCompany}）`
                      }
                    >
                      <Button
                        variant={newReservation.time === time ? 'contained' : 'outlined'}
                        onClick={() => available && setNewReservation({ ...newReservation, time })}
                        disabled={!available}
                        sx={{
                          minWidth: 80,
                          height: 40,
                          backgroundColor: available 
                            ? newReservation.time === time 
                              ? 'primary.main' 
                              : 'transparent'
                            : isSelfReservation 
                              ? 'warning.light' 
                              : 'error.light',
                          '&:hover': {
                            backgroundColor: available 
                              ? 'primary.light' 
                              : isSelfReservation 
                                ? 'warning.light' 
                                : 'error.light'
                          },
                          '&.Mui-disabled': {
                            backgroundColor: isSelfReservation ? 'warning.light' : 'error.light',
                            color: 'white'
                          }
                        }}
                      >
                        {time}
                      </Button>
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              お客様情報
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                label="お名前"
                value={newReservation.clientName}
                onChange={(e) => setNewReservation({ ...newReservation, clientName: e.target.value })}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              <TextField
                sx={{ flex: 1 }}
                label="会社名"
                value={newReservation.companyName}
                onChange={(e) => setNewReservation({ ...newReservation, companyName: e.target.value })}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                label="メールアドレス"
                type="email"
                value={newReservation.clientEmail}
                onChange={(e) => setNewReservation({ ...newReservation, clientEmail: e.target.value })}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              <TextField
                sx={{ flex: 1 }}
                label="電話番号"
                value={newReservation.clientPhone}
                onChange={(e) => setNewReservation({ ...newReservation, clientPhone: e.target.value })}
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Box>
            
            <TextField
              fullWidth
              label="内見目的"
              value={newReservation.purpose}
              onChange={(e) => setNewReservation({ ...newReservation, purpose: e.target.value })}
              placeholder="例：オフィス移転検討、新規事業立ち上げなど"
            />
            
            <TextField
              fullWidth
              label="備考・質問事項"
              multiline
              rows={3}
              value={newReservation.notes}
              onChange={(e) => setNewReservation({ ...newReservation, notes: e.target.value })}
              placeholder="駐車場利用、設備に関する質問など"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReservationDialogOpen(false)}>キャンセル</Button>
          <Button 
            onClick={handleAddReservation} 
            variant="contained"
            disabled={!newReservation.floorNumber || !newReservation.date || !newReservation.time || !newReservation.clientName || !newReservation.clientEmail}
          >
            予約申請
          </Button>
        </DialogActions>
      </Dialog>

      {/* 予約詳細ダイアログ */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>内見予約詳細</DialogTitle>
        <DialogContent>
          {selectedReservation && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                予約情報
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">階数</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedReservation.floorNumber}階
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">予約日時</Typography>
                  <Typography variant="body1">
                    {selectedReservation.date} {selectedReservation.time}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                お客様情報
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">お名前</Typography>
                  <Typography variant="body1">{selectedReservation.clientName}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">会社名</Typography>
                  <Typography variant="body1">{selectedReservation.companyName}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">メールアドレス</Typography>
                  <Typography variant="body1">{selectedReservation.clientEmail}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">電話番号</Typography>
                  <Typography variant="body1">{selectedReservation.clientPhone}</Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">内見目的</Typography>
                <Typography variant="body1">{selectedReservation.purpose}</Typography>
              </Box>
              
              {selectedReservation.notes && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">備考・質問事項</Typography>
                  <Typography variant="body1">{selectedReservation.notes}</Typography>
                </Box>
              )}
              
              <Box>
                <Typography variant="body2" color="text.secondary">申込日時</Typography>
                <Typography variant="body1">{selectedReservation.createdAt}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>

      <AIChat />
    </Box>
  );
};

export default ViewingReservationPage;
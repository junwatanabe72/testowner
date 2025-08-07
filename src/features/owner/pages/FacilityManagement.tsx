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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { addActivity } from '../../../store/slices/activitiesSlice';
import { showNotification } from '../../../store/slices/uiSlice';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

interface FacilityReservation {
  id: string;
  facilityName: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  requester: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface Facility {
  id: string;
  name: string;
  type: 'meeting_room' | 'conference_room' | 'lounge';
  capacity: number;
  equipment: string[];
  location: string;
  hourlyRate?: number;
}

const FacilityManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [tabValue, setTabValue] = useState(0);
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const [facilityDialogOpen, setFacilityDialogOpen] = useState(false);
  
  // ダミーデータ
  const [facilities] = useState<Facility[]>([
    {
      id: 'room-1',
      name: '会議室A',
      type: 'meeting_room',
      capacity: 8,
      equipment: ['プロジェクター', 'ホワイトボード', 'Wi-Fi'],
      location: '2階',
      hourlyRate: 2000,
    },
    {
      id: 'room-2',
      name: '会議室B',
      type: 'meeting_room',
      capacity: 12,
      equipment: ['大型モニター', 'テレビ会議システム', 'Wi-Fi'],
      location: '3階',
      hourlyRate: 3000,
    },
    {
      id: 'room-3',
      name: '大会議室',
      type: 'conference_room',
      capacity: 20,
      equipment: ['プロジェクター', 'マイクシステム', 'Wi-Fi'],
      location: '4階',
      hourlyRate: 5000,
    },
    {
      id: 'lounge-1',
      name: '共用ラウンジ',
      type: 'lounge',
      capacity: 15,
      equipment: ['Wi-Fi', 'コーヒーマシン'],
      location: '1階',
    },
  ]);

  const [reservations, setReservations] = useState<FacilityReservation[]>([
    {
      id: 'res-1',
      facilityName: '会議室A',
      date: '2025-08-07',
      startTime: '10:00',
      endTime: '12:00',
      purpose: '営業会議',
      requester: 'ワタナベ企画',
      status: 'confirmed',
    },
    {
      id: 'res-2',
      facilityName: '大会議室',
      date: '2025-08-08',
      startTime: '14:00',
      endTime: '16:00',
      purpose: '全体会議',
      requester: '佐藤システムズ',
      status: 'pending',
    },
    {
      id: 'res-3',
      facilityName: '会議室B',
      date: '2025-08-09',
      startTime: '09:00',
      endTime: '11:00',
      purpose: 'プロジェクト会議',
      requester: '田中商事',
      status: 'confirmed',
    },
  ]);

  const [newReservation, setNewReservation] = useState({
    facilityName: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    requester: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddReservation = () => {
    const reservation: FacilityReservation = {
      id: `res-${Date.now()}`,
      ...newReservation,
      status: 'pending',
    };

    setReservations([...reservations, reservation]);

    dispatch(addActivity({
      type: 'application',
      description: `${newReservation.facilityName}の予約申請がありました（${newReservation.requester}）`,
    }));

    dispatch(showNotification({
      message: '予約を受け付けました',
      type: 'success',
    }));

    setReservationDialogOpen(false);
    setNewReservation({
      facilityName: '',
      date: '',
      startTime: '',
      endTime: '',
      purpose: '',
      requester: '',
    });
  };

  const handleApproveReservation = (id: string) => {
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, status: 'confirmed' } : res
    ));

    const reservation = reservations.find(r => r.id === id);
    if (reservation) {
      dispatch(addActivity({
        type: 'application',
        description: `${reservation.facilityName}の予約を承認しました（${reservation.requester}）`,
      }));

      dispatch(showNotification({
        message: '予約を承認しました',
        type: 'success',
      }));
    }
  };

  const handleCancelReservation = (id: string) => {
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, status: 'cancelled' } : res
    ));

    const reservation = reservations.find(r => r.id === id);
    if (reservation) {
      dispatch(addActivity({
        type: 'application',
        description: `${reservation.facilityName}の予約をキャンセルしました（${reservation.requester}）`,
      }));

      dispatch(showNotification({
        message: '予約をキャンセルしました',
        type: 'info',
      }));
    }
  };

  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const colors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
      confirmed: 'success',
      pending: 'warning',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      confirmed: '確定',
      pending: '承認待ち',
      cancelled: 'キャンセル',
    };
    return labels[status] || status;
  };

  const getFacilityTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      meeting_room: '会議室',
      conference_room: '大会議室',
      lounge: 'ラウンジ',
    };
    return labels[type] || type;
  };

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        施設管理
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              総施設数
            </Typography>
            <Typography variant="h4">
              {facilities.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              今日の予約
            </Typography>
            <Typography variant="h4" color="primary.main">
              {reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              承認待ち
            </Typography>
            <Typography variant="h4" color="warning.main">
              {reservations.filter(r => r.status === 'pending').length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="予約管理" icon={<EventIcon />} />
          <Tab label="施設一覧" icon={<MeetingRoomIcon />} />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">施設予約状況</Typography>
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
                <TableCell>日時</TableCell>
                <TableCell>施設名</TableCell>
                <TableCell>時間</TableCell>
                <TableCell>目的</TableCell>
                <TableCell>申請者</TableCell>
                <TableCell>ステータス</TableCell>
                <TableCell>アクション</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    予約はありません
                  </TableCell>
                </TableRow>
              ) : (
                reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>{reservation.date}</TableCell>
                    <TableCell>{reservation.facilityName}</TableCell>
                    <TableCell>{reservation.startTime} - {reservation.endTime}</TableCell>
                    <TableCell>{reservation.purpose}</TableCell>
                    <TableCell>{reservation.requester}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(reservation.status)}
                        color={getStatusColor(reservation.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {reservation.status === 'pending' && (
                        <>
                          <Button
                            size="small"
                            color="success"
                            onClick={() => handleApproveReservation(reservation.id)}
                          >
                            承認
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleCancelReservation(reservation.id)}
                          >
                            却下
                          </Button>
                        </>
                      )}
                      {reservation.status === 'confirmed' && (
                        <Button
                          size="small"
                          color="warning"
                          onClick={() => handleCancelReservation(reservation.id)}
                        >
                          キャンセル
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          施設一覧
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>施設名</TableCell>
                <TableCell>種別</TableCell>
                <TableCell>場所</TableCell>
                <TableCell>収容人数</TableCell>
                <TableCell>設備</TableCell>
                <TableCell>時間料金</TableCell>
                <TableCell>アクション</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {facilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell>{facility.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getFacilityTypeLabel(facility.type)} 
                      size="small"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>{facility.location}</TableCell>
                  <TableCell>{facility.capacity}名</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {facility.equipment.map((eq, index) => (
                        <Chip key={index} label={eq} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {facility.hourlyRate ? `¥${facility.hourlyRate.toLocaleString()}/時間` : '無料'}
                  </TableCell>
                  <TableCell>
                    <Button size="small" startIcon={<EditIcon />}>
                      編集
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* 新規予約ダイアログ */}
      <Dialog open={reservationDialogOpen} onClose={() => setReservationDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>新規予約</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>施設名</InputLabel>
              <Select
                value={newReservation.facilityName}
                onChange={(e) => setNewReservation({ ...newReservation, facilityName: e.target.value })}
                label="施設名"
              >
                {facilities.map((facility) => (
                  <MenuItem key={facility.id} value={facility.name}>
                    {facility.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="日付"
              type="date"
              value={newReservation.date}
              onChange={(e) => setNewReservation({ ...newReservation, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="開始時間"
                type="time"
                value={newReservation.startTime}
                onChange={(e) => setNewReservation({ ...newReservation, startTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="終了時間"
                type="time"
                value={newReservation.endTime}
                onChange={(e) => setNewReservation({ ...newReservation, endTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            
            <TextField
              fullWidth
              label="利用目的"
              value={newReservation.purpose}
              onChange={(e) => setNewReservation({ ...newReservation, purpose: e.target.value })}
            />
            
            <FormControl fullWidth>
              <InputLabel>申請者</InputLabel>
              <Select
                value={newReservation.requester}
                onChange={(e) => setNewReservation({ ...newReservation, requester: e.target.value })}
                label="申請者"
              >
                <MenuItem value="ワタナベ企画">ワタナベ企画</MenuItem>
                <MenuItem value="佐藤システムズ">佐藤システムズ</MenuItem>
                <MenuItem value="田中商事">田中商事</MenuItem>
                <MenuItem value="山田製作所">山田製作所</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReservationDialogOpen(false)}>キャンセル</Button>
          <Button 
            onClick={handleAddReservation} 
            variant="contained"
            disabled={!newReservation.facilityName || !newReservation.date || !newReservation.startTime || !newReservation.endTime || !newReservation.requester}
          >
            予約
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacilityManagement;
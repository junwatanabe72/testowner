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
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { Floor } from '../../../types';
import { selectOccupiedFloors, selectOccupancyRate } from '../../../store/selectors';
import { updateFloorStatus } from '../../../store/slices/buildingSlice';
import { addActivity } from '../../../store/slices/activitiesSlice';
import { showNotification } from '../../../store/slices/uiSlice';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

interface TenantInfo {
  name: string;
  floorNumber: number;
  area: number;
  moveInDate?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  businessType?: string;
}

const TenantManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const occupiedFloors = useSelector(selectOccupiedFloors);
  const occupancyRate = useSelector(selectOccupancyRate);
  
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [moveOutDialogOpen, setMoveOutDialogOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<TenantInfo | null>(null);
  
  const [editData, setEditData] = useState({
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    businessType: '',
  });

  // ダミーのテナント詳細情報
  const getTenantInfo = (floor: Floor): TenantInfo => {
    const tenantData: { [key: string]: Partial<TenantInfo> } = {
      'ワタナベ企画株式会社': {
        moveInDate: '2023-04-01',
        contactPerson: '渡辺太郎',
        contactPhone: '03-1234-5678',
        contactEmail: 'watanabe@example.com',
        businessType: 'IT・ソフトウェア開発',
      },
      '佐藤システムズ合同会社': {
        moveInDate: '2022-07-15',
        contactPerson: '佐藤次郎',
        contactPhone: '03-2345-6789',
        contactEmail: 'sato@example.com',
        businessType: 'システムインテグレーション',
      },
      '田中商事株式会社': {
        moveInDate: '2021-10-01',
        contactPerson: '田中三郎',
        contactPhone: '03-3456-7890',
        contactEmail: 'tanaka@example.com',
        businessType: '商社・卸売業',
      },
    };

    return {
      name: floor.tenantName || '',
      floorNumber: floor.floorNumber,
      area: floor.area,
      ...tenantData[floor.tenantName || ''],
    };
  };

  const handleDetailClick = (floor: Floor) => {
    setSelectedFloor(floor);
    setSelectedTenant(getTenantInfo(floor));
    setDetailDialogOpen(true);
  };

  const handleEditClick = (floor: Floor) => {
    const tenantInfo = getTenantInfo(floor);
    setSelectedFloor(floor);
    setSelectedTenant(tenantInfo);
    setEditData({
      contactPerson: tenantInfo.contactPerson || '',
      contactPhone: tenantInfo.contactPhone || '',
      contactEmail: tenantInfo.contactEmail || '',
      businessType: tenantInfo.businessType || '',
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!selectedFloor || !selectedTenant) return;

    // 実際のアプリケーションでは、ここでテナント情報を更新する処理を実装
    dispatch(addActivity({
      type: 'maintenance',
      description: `${selectedTenant.name}の情報を更新しました`,
    }));

    dispatch(showNotification({
      message: 'テナント情報を更新しました',
      type: 'success',
    }));

    setEditDialogOpen(false);
  };

  const handleMoveOutClick = (floor: Floor) => {
    setSelectedFloor(floor);
    setSelectedTenant(getTenantInfo(floor));
    setMoveOutDialogOpen(true);
  };

  const handleMoveOutConfirm = () => {
    if (!selectedFloor || !selectedTenant) return;

    dispatch(updateFloorStatus({
      floorNumber: selectedFloor.floorNumber,
      status: 'vacant',
    }));

    dispatch(addActivity({
      type: 'tenant_move_out',
      description: `${selectedTenant.name}が${selectedFloor.floorNumber}階から退去しました`,
    }));

    dispatch(showNotification({
      message: 'テナントの退去処理が完了しました',
      type: 'info',
    }));

    setMoveOutDialogOpen(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        テナント管理
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              入居テナント数
            </Typography>
            <Typography variant="h4">
              {occupiedFloors.length} 社
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              稼働率
            </Typography>
            <Typography variant="h4" color={occupancyRate >= 80 ? 'success.main' : 'warning.main'}>
              {occupancyRate}%
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h5" gutterBottom>
        テナント一覧
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>階数</TableCell>
              <TableCell>テナント名</TableCell>
              <TableCell>面積</TableCell>
              <TableCell>業種</TableCell>
              <TableCell>入居日</TableCell>
              <TableCell>連絡先</TableCell>
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
              occupiedFloors.map((floor: Floor) => {
                const tenantInfo = getTenantInfo(floor);
                return (
                  <TableRow key={floor.id}>
                    <TableCell>{floor.floorNumber}階</TableCell>
                    <TableCell>{floor.tenantName}</TableCell>
                    <TableCell>{floor.area}㎡</TableCell>
                    <TableCell>{tenantInfo.businessType || '-'}</TableCell>
                    <TableCell>{tenantInfo.moveInDate || '-'}</TableCell>
                    <TableCell>{tenantInfo.contactPerson || '-'}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleDetailClick(floor)}
                      >
                        <InfoIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(floor)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => handleMoveOutClick(floor)}
                      >
                        <PersonRemoveIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* テナント詳細ダイアログ */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>テナント詳細情報</DialogTitle>
        <DialogContent>
          {selectedTenant && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedTenant.name}
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="階数"
                    secondary={`${selectedTenant.floorNumber}階`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="面積"
                    secondary={`${selectedTenant.area}㎡`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="業種"
                    secondary={selectedTenant.businessType || '-'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="入居日"
                    secondary={selectedTenant.moveInDate || '-'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="担当者"
                    secondary={selectedTenant.contactPerson || '-'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="電話番号"
                    secondary={selectedTenant.contactPhone || '-'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="メールアドレス"
                    secondary={selectedTenant.contactEmail || '-'}
                  />
                </ListItem>
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>

      {/* テナント情報編集ダイアログ */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>テナント情報の編集</DialogTitle>
        <DialogContent>
          {selectedTenant && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedTenant.name}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="担当者名"
                  value={editData.contactPerson}
                  onChange={(e) => setEditData({ ...editData, contactPerson: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="電話番号"
                  value={editData.contactPhone}
                  onChange={(e) => setEditData({ ...editData, contactPhone: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="メールアドレス"
                  type="email"
                  value={editData.contactEmail}
                  onChange={(e) => setEditData({ ...editData, contactEmail: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="業種"
                  value={editData.businessType}
                  onChange={(e) => setEditData({ ...editData, businessType: e.target.value })}
                />
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

      {/* 退去確認ダイアログ */}
      <Dialog open={moveOutDialogOpen} onClose={() => setMoveOutDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>退去処理の確認</DialogTitle>
        <DialogContent>
          {selectedTenant && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1">
                以下のテナントを退去処理しますか？
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {selectedTenant.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  階数: {selectedTenant.floorNumber}階
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  入居日: {selectedTenant.moveInDate || '-'}
                </Typography>
              </Box>
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                ※ この操作により、フロアは空室状態になります。
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMoveOutDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleMoveOutConfirm} variant="contained" color="warning">
            退去処理を実行
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TenantManagement;
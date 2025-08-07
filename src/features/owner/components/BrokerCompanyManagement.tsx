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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  IconButton,
  Chip,
  Alert,
  Grid,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import {
  addBrokerCompany,
  updateBrokerCompany,
  deleteBrokerCompany,
  toggleBrokerCompany,
} from '../../../store/slices/recruitmentSlice';
import { showNotification } from '../../../store/slices/uiSlice';
import { addActivity } from '../../../store/slices/activitiesSlice';
import { BrokerCompany } from '../../../types';
import { nanoid } from '@reduxjs/toolkit';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';

const BrokerCompanyManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const brokerCompanies = useSelector((state: RootState) => state.recruitment.brokerCompanies);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<BrokerCompany | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<BrokerCompany | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      isActive: true,
    });
  };

  const handleAddCompany = () => {
    setEditingCompany(null);
    resetForm();
    setDialogOpen(true);
  };

  const handleEditCompany = (company: BrokerCompany) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      contactPerson: company.contactPerson,
      email: company.email,
      phone: company.phone,
      address: company.address,
      isActive: company.isActive,
    });
    setDialogOpen(true);
  };

  const handleDeleteCompany = (company: BrokerCompany) => {
    setCompanyToDelete(company);
    setDeleteConfirmOpen(true);
  };

  const handleToggleActive = (id: string) => {
    dispatch(toggleBrokerCompany(id));
    const company = brokerCompanies.find((c: BrokerCompany) => c.id === id);
    if (company) {
      dispatch(addActivity({
        type: 'maintenance',
        description: `${company.name}の配信設定を${company.isActive ? '無効' : '有効'}にしました`,
      }));
    }
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.contactPerson.trim() || !formData.email.trim()) {
      dispatch(showNotification({
        message: '会社名、担当者名、メールアドレスは必須項目です。',
        type: 'warning',
      }));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      dispatch(showNotification({
        message: '正しいメールアドレスを入力してください。',
        type: 'warning',
      }));
      return;
    }

    const companyData: BrokerCompany = {
      id: editingCompany?.id || nanoid(),
      name: formData.name.trim(),
      contactPerson: formData.contactPerson.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      isActive: formData.isActive,
      createdAt: editingCompany?.createdAt || new Date().toLocaleString('ja-JP'),
    };

    if (editingCompany) {
      dispatch(updateBrokerCompany(companyData));
      dispatch(addActivity({
        type: 'maintenance',
        description: `仲介会社「${formData.name}」の情報を更新しました`,
      }));
      dispatch(showNotification({
        message: '仲介会社情報を更新しました。',
        type: 'success',
      }));
    } else {
      dispatch(addBrokerCompany(companyData));
      dispatch(addActivity({
        type: 'maintenance',
        description: `仲介会社「${formData.name}」を追加しました`,
      }));
      dispatch(showNotification({
        message: '仲介会社を追加しました。',
        type: 'success',
      }));
    }

    setDialogOpen(false);
    resetForm();
  };

  const confirmDelete = () => {
    if (companyToDelete) {
      dispatch(deleteBrokerCompany(companyToDelete.id));
      dispatch(addActivity({
        type: 'maintenance',
        description: `仲介会社「${companyToDelete.name}」を削除しました`,
      }));
      dispatch(showNotification({
        message: '仲介会社を削除しました。',
        type: 'info',
      }));
    }
    setDeleteConfirmOpen(false);
    setCompanyToDelete(null);
  };

  const activeCompanies = brokerCompanies.filter((c: BrokerCompany) => c.isActive);
  const inactiveCompanies = brokerCompanies.filter((c: BrokerCompany) => !c.isActive);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          仲介会社管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCompany}
        >
          仲介会社追加
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        空室発生時に自動配信する仲介会社を管理します。「配信有効」の会社にのみメールが送信されます。
      </Alert>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="subtitle2" color="success.main" gutterBottom>
            配信有効
          </Typography>
          <Typography variant="h4" color="success.main">
            {activeCompanies.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            社
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            配信無効
          </Typography>
          <Typography variant="h4" color="text.secondary">
            {inactiveCompanies.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            社
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="subtitle2" color="primary.main" gutterBottom>
            総登録数
          </Typography>
          <Typography variant="h4" color="primary.main">
            {brokerCompanies.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            社
          </Typography>
        </Paper>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>会社名</TableCell>
              <TableCell>担当者</TableCell>
              <TableCell>連絡先</TableCell>
              <TableCell>住所</TableCell>
              <TableCell>配信設定</TableCell>
              <TableCell>登録日</TableCell>
              <TableCell>アクション</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brokerCompanies.map((company: BrokerCompany) => (
              <TableRow key={company.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon fontSize="small" />
                    <Typography variant="body2" fontWeight="medium">
                      {company.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" />
                    <Typography variant="body2">
                      {company.contactPerson}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <EmailIcon fontSize="small" />
                      <Typography variant="body2" fontSize="0.875rem">
                        {company.email}
                      </Typography>
                    </Box>
                    {company.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" />
                        <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                          {company.phone}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                    {company.address || '－'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Switch
                      checked={company.isActive}
                      onChange={() => handleToggleActive(company.id)}
                      size="small"
                    />
                    <Chip
                      label={company.isActive ? '有効' : '無効'}
                      color={company.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                    {company.createdAt.split(' ')[0]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditCompany(company)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteCompany(company)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {brokerCompanies.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  仲介会社が登録されていません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 追加・編集ダイアログ */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCompany ? '仲介会社編集' : '仲介会社追加'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <Box>
                <TextField
                  fullWidth
                  label="会社名"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="担当者名"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="メールアドレス"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="電話番号"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Box>
              <Box sx={{ gridColumn: '1 / -1' }}>
                <TextField
                  fullWidth
                  label="住所"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </Box>
              <Box sx={{ gridColumn: '1 / -1' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                  }
                  label="メール配信を有効にする"
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCompany ? '更新' : '追加'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>仲介会社削除</DialogTitle>
        <DialogContent>
          <Typography>
            「{companyToDelete?.name}」を削除してもよろしいですか？
            この操作は取り消せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>キャンセル</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BrokerCompanyManagement;
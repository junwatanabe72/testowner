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
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  IconButton,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { TenantContract, TenantDocument } from '../../../types';
import { addActivity } from '../../../store/slices/activitiesSlice';
import { showNotification } from '../../../store/slices/uiSlice';
import InfoIcon from '@mui/icons-material/Info';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WarningIcon from '@mui/icons-material/Warning';

const EnhancedTenantManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<TenantContract | null>(null);

  // サンプルデータ
  const [tenantContracts] = useState<TenantContract[]>([
    {
      id: 'tenant-1',
      tenantName: 'ワタナベ企画株式会社',
      floorNumber: 2,
      rent: 450000,
      commonCharge: 45000,
      contractStartDate: '2023-04-01',
      contractEndDate: '2025-03-31',
      deposit: '賃料3ヶ月分',
      keyMoney: '賃料2ヶ月分',
      guarantor: '渡辺太郎（代表取締役）',
      emergencyContact: {
        name: '渡辺花子',
        phone: '090-1234-5678',
        email: 'hanako.watanabe@example.com',
      },
      paymentStatus: 'paid',
      lastPaymentDate: '2025-08-01',
      nextPaymentDue: '2025-09-01',
      renewalStatus: 'on_time',
      documents: [
        {
          id: 'doc-1',
          type: 'contract',
          name: '賃貸借契約書.pdf',
          uploadDate: '2023-03-15',
          fileSize: '3.2MB',
        },
        {
          id: 'doc-2',
          type: 'application',
          name: '入居申込書.pdf',
          uploadDate: '2023-02-28',
          fileSize: '2.1MB',
        },
        {
          id: 'doc-3',
          type: 'insurance',
          name: '火災保険証券.pdf',
          uploadDate: '2023-03-10',
          fileSize: '1.8MB',
        },
      ],
    },
    {
      id: 'tenant-2',
      tenantName: '佐藤システムズ合同会社',
      floorNumber: 3,
      rent: 520000,
      commonCharge: 52000,
      contractStartDate: '2022-07-15',
      contractEndDate: '2024-07-14',
      deposit: '賃料4ヶ月分',
      keyMoney: '賃料1ヶ月分',
      guarantor: '佐藤次郎（代表社員）',
      emergencyContact: {
        name: '佐藤良子',
        phone: '080-9876-5432',
        email: 'ryoko.sato@example.com',
      },
      paymentStatus: 'overdue',
      lastPaymentDate: '2025-07-01',
      nextPaymentDue: '2025-08-01',
      renewalStatus: 'needs_renewal',
      documents: [
        {
          id: 'doc-4',
          type: 'contract',
          name: '賃貸借契約書.pdf',
          uploadDate: '2022-06-30',
          fileSize: '3.5MB',
        },
        {
          id: 'doc-5',
          type: 'guarantor',
          name: '連帯保証人承諾書.pdf',
          uploadDate: '2022-06-25',
          fileSize: '1.2MB',
        },
      ],
    },
    {
      id: 'tenant-3',
      tenantName: '田中商事株式会社',
      floorNumber: 4,
      rent: 380000,
      commonCharge: 38000,
      contractStartDate: '2021-10-01',
      contractEndDate: '2025-09-30',
      deposit: '賃料2ヶ月分',
      keyMoney: '賃料1ヶ月分',
      guarantor: '田中三郎（代表取締役）',
      emergencyContact: {
        name: '田中美代子',
        phone: '070-1111-2222',
        email: 'miyoko.tanaka@example.com',
      },
      paymentStatus: 'paid',
      lastPaymentDate: '2025-08-01',
      nextPaymentDue: '2025-09-01',
      renewalStatus: 'auto_renewal',
      documents: [
        {
          id: 'doc-6',
          type: 'contract',
          name: '賃貸借契約書.pdf',
          uploadDate: '2021-09-15',
          fileSize: '2.9MB',
        },
        {
          id: 'doc-7',
          type: 'insurance',
          name: '火災保険証券.pdf',
          uploadDate: '2021-09-20',
          fileSize: '1.5MB',
        },
        {
          id: 'doc-8',
          type: 'other',
          name: '事業計画書.pdf',
          uploadDate: '2021-09-10',
          fileSize: '2.7MB',
        },
      ],
    },
  ]);

  const handleViewDetail = (tenant: TenantContract) => {
    setSelectedTenant(tenant);
    setDetailDialogOpen(true);
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      contract: '賃貸借契約書',
      application: '入居申込書',
      guarantor: '連帯保証人承諾書',
      insurance: '火災保険証券',
      other: 'その他書類',
    };
    return labels[type] || type;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const isContractExpiring = (endDate: string) => {
    const today = new Date();
    const contractEnd = new Date(endDate);
    const monthsToExpiry = (contractEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsToExpiry <= 6 && monthsToExpiry > 0;
  };

  const isContractExpired = (endDate: string) => {
    const today = new Date();
    const contractEnd = new Date(endDate);
    return contractEnd < today;
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
              入居中テナント
            </Typography>
            <Typography variant="h4">
              {tenantContracts.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              今月の賃料収入
            </Typography>
            <Typography variant="h4" color="success.main">
              {formatCurrency(tenantContracts.reduce((sum, t) => sum + t.rent + t.commonCharge, 0))}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              支払遅延
            </Typography>
            <Typography variant="h4" color="error.main">
              {tenantContracts.filter(t => t.paymentStatus === 'overdue').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              契約期限間近
            </Typography>
            <Typography variant="h4" color="warning.main">
              {tenantContracts.filter(t => isContractExpiring(t.contractEndDate)).length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h6" gutterBottom>
        入居中テナント一覧
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>階数</TableCell>
              <TableCell>テナント名</TableCell>
              <TableCell>賃料</TableCell>
              <TableCell>共益費</TableCell>
              <TableCell>支払状況</TableCell>
              <TableCell>契約満了</TableCell>
              <TableCell>更新状況</TableCell>
              <TableCell>アクション</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenantContracts.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell>
                  <Typography variant="body1" fontWeight="bold">
                    {tenant.floorNumber}階
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {tenant.tenantName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {formatCurrency(tenant.rent)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    {formatCurrency(tenant.commonCharge)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Chip
                      label={
                        tenant.paymentStatus === 'paid' ? '入金済' :
                        tenant.paymentStatus === 'pending' ? '確認中' : '滞納'
                      }
                      color={
                        tenant.paymentStatus === 'paid' ? 'success' :
                        tenant.paymentStatus === 'pending' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                      次回: {tenant.nextPaymentDue}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isContractExpired(tenant.contractEndDate) && (
                      <WarningIcon color="error" fontSize="small" />
                    )}
                    {isContractExpiring(tenant.contractEndDate) && !isContractExpired(tenant.contractEndDate) && (
                      <WarningIcon color="warning" fontSize="small" />
                    )}
                    <Typography 
                      variant="body1"
                      color={
                        isContractExpired(tenant.contractEndDate) ? 'error' :
                        isContractExpiring(tenant.contractEndDate) ? 'warning.main' : 'inherit'
                      }
                    >
                      {tenant.contractEndDate}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      tenant.renewalStatus === 'on_time' ? '正常' :
                      tenant.renewalStatus === 'needs_renewal' ? '要更新' :
                      tenant.renewalStatus === 'auto_renewal' ? '自動更新' : '期限切れ'
                    }
                    color={
                      tenant.renewalStatus === 'on_time' || tenant.renewalStatus === 'auto_renewal' ? 'success' :
                      tenant.renewalStatus === 'needs_renewal' ? 'warning' : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewDetail(tenant)}
                    title="詳細情報を表示"
                  >
                    <InfoIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* テナント詳細ダイアログ */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>テナント詳細情報</DialogTitle>
        <DialogContent>
          {selectedTenant && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <BusinessIcon />
                <Typography variant="h5">{selectedTenant.tenantName}</Typography>
                <Chip 
                  label={`${selectedTenant.floorNumber}階`} 
                  color="primary" 
                  variant="outlined" 
                />
              </Box>

              <Alert severity="info" sx={{ mb: 3 }}>
                契約期間: {selectedTenant.contractStartDate} 〜 {selectedTenant.contractEndDate}
                {isContractExpiring(selectedTenant.contractEndDate) && (
                  <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                    ⚠️ 契約期限が近づいています。更新手続きを確認してください。
                  </Typography>
                )}
                {isContractExpired(selectedTenant.contractEndDate) && (
                  <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                    ❌ 契約期限が過ぎています。至急対応が必要です。
                  </Typography>
                )}
              </Alert>

              <Typography variant="h6" gutterBottom>
                契約情報
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">賃料</Typography>
                  <Typography variant="body1" fontWeight="bold" fontSize="1.1rem">
                    {formatCurrency(selectedTenant.rent)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">共益費</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(selectedTenant.commonCharge)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">敷金</Typography>
                  <Typography variant="body1">{selectedTenant.deposit}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">礼金</Typography>
                  <Typography variant="body1">{selectedTenant.keyMoney}</Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">連帯保証人</Typography>
                <Typography variant="body1">{selectedTenant.guarantor}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                支払・契約状況
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">支払状況</Typography>
                  <Chip
                    label={
                      selectedTenant.paymentStatus === 'paid' ? '入金済' :
                      selectedTenant.paymentStatus === 'pending' ? '確認中' : '滞納'
                    }
                    color={
                      selectedTenant.paymentStatus === 'paid' ? 'success' :
                      selectedTenant.paymentStatus === 'pending' ? 'warning' : 'error'
                    }
                    size="medium"
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">最終入金日</Typography>
                  <Typography variant="body1">{selectedTenant.lastPaymentDate}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">次回支払日</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedTenant.nextPaymentDue}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">更新状況</Typography>
                  <Chip
                    label={
                      selectedTenant.renewalStatus === 'on_time' ? '正常' :
                      selectedTenant.renewalStatus === 'needs_renewal' ? '要更新' :
                      selectedTenant.renewalStatus === 'auto_renewal' ? '自動更新' : '期限切れ'
                    }
                    color={
                      selectedTenant.renewalStatus === 'on_time' || selectedTenant.renewalStatus === 'auto_renewal' ? 'success' :
                      selectedTenant.renewalStatus === 'needs_renewal' ? 'warning' : 'error'
                    }
                    size="medium"
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                緊急連絡先
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">担当者</Typography>
                    <Typography variant="body1">{selectedTenant.emergencyContact.name}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">電話番号</Typography>
                    <Typography variant="body1">{selectedTenant.emergencyContact.phone}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">メールアドレス</Typography>
                    <Typography variant="body1">{selectedTenant.emergencyContact.email}</Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                契約関連書類
              </Typography>
              
              <List>
                {selectedTenant.documents.map((document) => (
                  <ListItem key={document.id}>
                    <ListItemIcon>
                      <AttachFileIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" fontWeight="medium">
                            {document.name}
                          </Typography>
                          <Chip 
                            label={getDocumentTypeLabel(document.type)} 
                            size="small" 
                            variant="outlined" 
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarTodayIcon fontSize="small" color="disabled" />
                            <Typography variant="body2" color="text.secondary">
                              {document.uploadDate}
                            </Typography>
                          </Box>
                          {document.fileSize && (
                            <Typography variant="body2" color="text.secondary">
                              {document.fileSize}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AttachFileIcon />}
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

              {selectedTenant.documents.length === 0 && (
                <Alert severity="warning">
                  登録されている書類がありません。
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnhancedTenantManagement;
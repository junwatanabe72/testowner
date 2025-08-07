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
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { addActivity } from '../../../store/slices/activitiesSlice';
import { showNotification } from '../../../store/slices/uiSlice';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SecurityIcon from '@mui/icons-material/Security';
import PhoneIcon from '@mui/icons-material/Phone';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CallIcon from '@mui/icons-material/Call';

interface EmergencyIncident {
  id: string;
  title: string;
  type: 'fire' | 'medical' | 'security' | 'facility' | 'natural_disaster';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'responding' | 'resolved' | 'closed';
  location: string;
  reportedBy: string;
  reportedAt: string;
  resolvedAt?: string;
  description: string;
  actions: EmergencyAction[];
}

interface EmergencyAction {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  notes?: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  primary: string;
  secondary?: string;
  email: string;
  category: 'fire' | 'medical' | 'police' | 'facility' | 'management';
  available24h: boolean;
}

const EmergencyManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [tabValue, setTabValue] = useState(0);
  const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<EmergencyIncident | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  const [incidents, setIncidents] = useState<EmergencyIncident[]>([
    {
      id: 'inc-1',
      title: '2階廊下の水漏れ',
      type: 'facility',
      severity: 'medium',
      status: 'responding',
      location: '2階東側廊下',
      reportedBy: '田中商事',
      reportedAt: '2025-08-06 14:30',
      description: '天井から水が滴り落ちています。配管の故障の可能性があります。',
      actions: [
        {
          id: 'act-1',
          action: '現場確認',
          performedBy: '管理人',
          timestamp: '2025-08-06 14:45',
          notes: '上階の配管から水漏れを確認'
        },
        {
          id: 'act-2',
          action: '応急処置（バケツ設置）',
          performedBy: '管理人',
          timestamp: '2025-08-06 15:00',
        }
      ]
    },
    {
      id: 'inc-2',
      title: 'エレベーター停止',
      type: 'facility',
      severity: 'high',
      status: 'resolved',
      location: 'エレベーター',
      reportedBy: '山田製作所',
      reportedAt: '2025-08-05 09:15',
      resolvedAt: '2025-08-05 11:30',
      description: 'エレベーターが3階で停止し、扉が開かない状態です。',
      actions: [
        {
          id: 'act-3',
          action: 'エレベーター会社に連絡',
          performedBy: '管理人',
          timestamp: '2025-08-05 09:20',
        },
        {
          id: 'act-4',
          action: '技術者による修理完了',
          performedBy: '東京エレベーター',
          timestamp: '2025-08-05 11:30',
        }
      ]
    },
  ]);

  const [emergencyContacts] = useState<EmergencyContact[]>([
    {
      id: 'contact-1',
      name: '消防署',
      role: '緊急通報',
      primary: '119',
      category: 'fire',
      email: '',
      available24h: true,
    },
    {
      id: 'contact-2',
      name: '警察署',
      role: '緊急通報',
      primary: '110',
      category: 'police',
      email: '',
      available24h: true,
    },
    {
      id: 'contact-3',
      name: '救急',
      role: '医療緊急事態',
      primary: '119',
      category: 'medical',
      email: '',
      available24h: true,
    },
    {
      id: 'contact-4',
      name: 'ビル管理会社',
      role: '24時間管理',
      primary: '03-1234-5678',
      secondary: '080-1234-5678',
      email: 'emergency@management.com',
      category: 'management',
      available24h: true,
    },
    {
      id: 'contact-5',
      name: '東京エレベーター',
      role: 'エレベーター緊急',
      primary: '03-2345-6789',
      secondary: '080-2345-6789',
      email: 'emergency@elevator.com',
      category: 'facility',
      available24h: true,
    },
    {
      id: 'contact-6',
      name: '電力会社',
      role: '停電対応',
      primary: '0120-995-007',
      category: 'facility',
      email: 'support@power.com',
      available24h: true,
    },
  ]);

  const [newIncident, setNewIncident] = useState({
    title: '',
    type: 'facility' as 'fire' | 'medical' | 'security' | 'facility' | 'natural_disaster',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    location: '',
    reportedBy: '',
    description: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddIncident = () => {
    const incident: EmergencyIncident = {
      id: `inc-${Date.now()}`,
      title: newIncident.title,
      type: newIncident.type,
      severity: newIncident.severity,
      status: 'reported',
      location: newIncident.location,
      reportedBy: newIncident.reportedBy,
      reportedAt: new Date().toLocaleString('ja-JP'),
      description: newIncident.description,
      actions: [],
    };

    setIncidents([incident, ...incidents]);

    dispatch(addActivity({
      type: 'maintenance',
      description: `緊急事態が報告されました：${newIncident.title}`,
    }));

    dispatch(showNotification({
      message: '緊急事態を登録しました',
      type: 'warning',
    }));

    setIncidentDialogOpen(false);
    setNewIncident({
      title: '',
      type: 'facility',
      severity: 'medium',
      location: '',
      reportedBy: '',
      description: '',
    });
  };

  const handleViewDetail = (incident: EmergencyIncident) => {
    setSelectedIncident(incident);
    setDetailDialogOpen(true);
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setIncidents(incidents.map(inc => 
      inc.id === id ? { 
        ...inc, 
        status: newStatus as any,
        resolvedAt: newStatus === 'resolved' ? new Date().toLocaleString('ja-JP') : undefined
      } : inc
    ));

    const incident = incidents.find(i => i.id === id);
    if (incident) {
      dispatch(addActivity({
        type: 'maintenance',
        description: `${incident.title}のステータスが更新されました：${newStatus}`,
      }));

      dispatch(showNotification({
        message: '事件ステータスを更新しました',
        type: 'success',
      }));
    }
  };

  const getSeverityColor = (severity: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const colors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
      low: 'info',
      medium: 'warning',
      high: 'error',
      critical: 'error',
    };
    return colors[severity] || 'default';
  };

  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const colors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
      reported: 'error',
      responding: 'warning',
      resolved: 'success',
      closed: 'default',
    };
    return colors[status] || 'default';
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: React.ReactElement } = {
      fire: <LocalFireDepartmentIcon />,
      medical: <LocalHospitalIcon />,
      security: <SecurityIcon />,
      facility: <ReportProblemIcon />,
      natural_disaster: <WarningIcon />,
    };
    return icons[type] || <InfoIcon />;
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      reported: '報告済',
      responding: '対応中',
      resolved: '解決済',
      closed: '完了',
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      fire: '火災',
      medical: '医療',
      security: 'セキュリティ',
      facility: '設備',
      natural_disaster: '災害',
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
        緊急対応管理
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        緊急事態発生時は、まず人命の安全を最優先に行動してください。
      </Alert>

      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              進行中の事案
            </Typography>
            <Typography variant="h4" color="error.main">
              {incidents.filter(i => i.status === 'reported' || i.status === 'responding').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              今月の解決件数
            </Typography>
            <Typography variant="h4" color="success.main">
              {incidents.filter(i => i.status === 'resolved' || i.status === 'closed').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              高緊急度案件
            </Typography>
            <Typography variant="h4" color="warning.main">
              {incidents.filter(i => i.severity === 'high' || i.severity === 'critical').length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="事案管理" icon={<ReportProblemIcon />} />
          <Tab label="緊急連絡先" icon={<PhoneIcon />} />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">緊急事案一覧</Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<ReportProblemIcon />}
            onClick={() => setIncidentDialogOpen(true)}
          >
            緊急事案報告
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>種別</TableCell>
                <TableCell>事案名</TableCell>
                <TableCell>場所</TableCell>
                <TableCell>緊急度</TableCell>
                <TableCell>報告者</TableCell>
                <TableCell>報告日時</TableCell>
                <TableCell>ステータス</TableCell>
                <TableCell>アクション</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getTypeIcon(incident.type)}
                      <Chip
                        label={getTypeLabel(incident.type)}
                        size="small"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      onClick={() => handleViewDetail(incident)}
                    >
                      {incident.title}
                    </Button>
                  </TableCell>
                  <TableCell>{incident.location}</TableCell>
                  <TableCell>
                    <Chip
                      label={incident.severity.toUpperCase()}
                      color={getSeverityColor(incident.severity)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{incident.reportedBy}</TableCell>
                  <TableCell>{incident.reportedAt}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(incident.status)}
                      color={getStatusColor(incident.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {incident.status === 'reported' && (
                      <Button
                        size="small"
                        color="warning"
                        onClick={() => handleUpdateStatus(incident.id, 'responding')}
                      >
                        対応開始
                      </Button>
                    )}
                    {incident.status === 'responding' && (
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleUpdateStatus(incident.id, 'resolved')}
                      >
                        解決済
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          緊急連絡先一覧
        </Typography>
        
        {Object.entries(
          emergencyContacts.reduce((acc, contact) => {
            if (!acc[contact.category]) acc[contact.category] = [];
            acc[contact.category].push(contact);
            return acc;
          }, {} as { [key: string]: EmergencyContact[] })
        ).map(([category, contacts]) => (
          <Accordion key={category} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                {category === 'fire' ? '消防・火災' :
                 category === 'medical' ? '医療・救急' :
                 category === 'police' ? '警察・セキュリティ' :
                 category === 'facility' ? '設備・メンテナンス' :
                 category === 'management' ? '管理' : category}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {contacts.map((contact) => (
                  <ListItem key={contact.id}>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">{contact.name}</Typography>
                          {contact.available24h && (
                            <Chip label="24時間対応" size="small" color="success" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2">{contact.role}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2">メイン:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {contact.primary}
                              </Typography>
                              <IconButton size="small" color="primary">
                                <CallIcon fontSize="small" />
                              </IconButton>
                            </Box>
                            {contact.secondary && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2">サブ:</Typography>
                                <Typography variant="body2">
                                  {contact.secondary}
                                </Typography>
                                <IconButton size="small" color="primary">
                                  <CallIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                          </Box>
                          {contact.email && (
                            <Typography variant="body2" color="text.secondary">
                              {contact.email}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </TabPanel>

      {/* 事案詳細ダイアログ */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>事案詳細</DialogTitle>
        <DialogContent>
          {selectedIncident && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedIncident.title}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    種別
                  </Typography>
                  <Typography variant="body1">{getTypeLabel(selectedIncident.type)}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    緊急度
                  </Typography>
                  <Chip
                    label={selectedIncident.severity.toUpperCase()}
                    color={getSeverityColor(selectedIncident.severity)}
                    size="small"
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    場所
                  </Typography>
                  <Typography variant="body1">{selectedIncident.location}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    報告者
                  </Typography>
                  <Typography variant="body1">{selectedIncident.reportedBy}</Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  事案詳細
                </Typography>
                <Typography variant="body1">{selectedIncident.description}</Typography>
              </Box>

              {selectedIncident.actions.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    対応履歴
                  </Typography>
                  <List>
                    {selectedIncident.actions.map((action) => (
                      <ListItem key={action.id}>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={action.action}
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                {action.timestamp} - {action.performedBy}
                              </Typography>
                              {action.notes && (
                                <Typography variant="body2" color="text.secondary">
                                  {action.notes}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>

      {/* 新規事案報告ダイアログ */}
      <Dialog open={incidentDialogOpen} onClose={() => setIncidentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>緊急事案報告</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="事案名"
              value={newIncident.title}
              onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>種別</InputLabel>
                <Select
                  value={newIncident.type}
                  onChange={(e) => setNewIncident({ ...newIncident, type: e.target.value as any })}
                  label="種別"
                >
                  <MenuItem value="fire">火災</MenuItem>
                  <MenuItem value="medical">医療</MenuItem>
                  <MenuItem value="security">セキュリティ</MenuItem>
                  <MenuItem value="facility">設備</MenuItem>
                  <MenuItem value="natural_disaster">災害</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>緊急度</InputLabel>
                <Select
                  value={newIncident.severity}
                  onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value as any })}
                  label="緊急度"
                >
                  <MenuItem value="low">低</MenuItem>
                  <MenuItem value="medium">中</MenuItem>
                  <MenuItem value="high">高</MenuItem>
                  <MenuItem value="critical">緊急</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              fullWidth
              label="発生場所"
              value={newIncident.location}
              onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
            />
            
            <TextField
              fullWidth
              label="報告者"
              value={newIncident.reportedBy}
              onChange={(e) => setNewIncident({ ...newIncident, reportedBy: e.target.value })}
            />
            
            <TextField
              fullWidth
              label="事案詳細"
              multiline
              rows={4}
              value={newIncident.description}
              onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIncidentDialogOpen(false)}>キャンセル</Button>
          <Button 
            onClick={handleAddIncident} 
            variant="contained"
            color="error"
            disabled={!newIncident.title || !newIncident.location || !newIncident.reportedBy}
          >
            報告
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmergencyManagement;
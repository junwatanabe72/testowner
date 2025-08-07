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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { addActivity } from '../../../store/slices/activitiesSlice';
import { showNotification } from '../../../store/slices/uiSlice';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import BuildIcon from '@mui/icons-material/Build';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface MaintenanceTask {
  id: string;
  title: string;
  type: 'preventive' | 'corrective' | 'inspection';
  category: 'facility' | 'cleaning' | 'security' | 'fire_safety' | 'other';
  equipment: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  completedDate?: string;
  assignedTo: string;
  description: string;
  estimatedCost?: number;
  actualCost?: number;
  reportFile?: string;
}

interface Equipment {
  id: string;
  name: string;
  category: string;
  location: string;
  installDate: string;
  lastMaintenance?: string;
  nextMaintenance: string;
  status: 'normal' | 'warning' | 'critical';
  warranty?: string;
}

const MaintenanceManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [tabValue, setTabValue] = useState(0);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [equipmentDialogOpen, setEquipmentDialogOpen] = useState(false);
  
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([
    {
      id: 'task-1',
      title: 'エレベーター定期点検',
      type: 'inspection',
      category: 'facility',
      equipment: 'エレベーター',
      location: '全館',
      priority: 'high',
      status: 'scheduled',
      scheduledDate: '2025-08-15',
      assignedTo: '東京エレベーター',
      description: '法定点検の実施',
      estimatedCost: 50000,
    },
    {
      id: 'task-2',
      title: '共用部清掃',
      type: 'preventive',
      category: 'cleaning',
      equipment: '清掃用具',
      location: '各フロア共用部',
      priority: 'medium',
      status: 'in_progress',
      scheduledDate: '2025-08-10',
      assignedTo: 'ABC清掃サービス',
      description: '日常清掃とワックス掛け',
      estimatedCost: 30000,
    },
    {
      id: 'task-3',
      title: '照明器具交換',
      type: 'corrective',
      category: 'facility',
      equipment: 'LED照明',
      location: '2階共用部',
      priority: 'low',
      status: 'completed',
      scheduledDate: '2025-08-05',
      completedDate: '2025-08-05',
      assignedTo: 'A&Bメンテナンス',
      description: '故障したLED照明の交換',
      estimatedCost: 15000,
      actualCost: 12000,
      reportFile: '照明交換作業報告書_2025080.pdf',
    },
    {
      id: 'task-4',
      title: '防犯カメラ点検',
      type: 'inspection',
      category: 'security',
      equipment: '防犯カメラシステム',
      location: '全館',
      priority: 'high',
      status: 'completed',
      scheduledDate: '2025-08-01',
      completedDate: '2025-08-01',
      assignedTo: 'セキュリティ東京',
      description: '防犯カメラの動作確認と清掃',
      estimatedCost: 25000,
      actualCost: 25000,
      reportFile: '防犯カメラ点検報告書_20250801.pdf',
    },
    {
      id: 'task-5',
      title: '消防設備点検',
      type: 'inspection',
      category: 'fire_safety',
      equipment: '自動火災報知設備',
      location: '全館',
      priority: 'urgent',
      status: 'scheduled',
      scheduledDate: '2025-08-20',
      assignedTo: '消防設備サービス',
      description: '法定消防設備点検',
      estimatedCost: 45000,
    },
  ]);

  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: 'eq-1',
      name: 'エレベーター',
      category: '昇降設備',
      location: '全館',
      installDate: '2020-03-15',
      lastMaintenance: '2025-02-15',
      nextMaintenance: '2025-08-15',
      status: 'normal',
      warranty: '2025-03-14まで',
    },
    {
      id: 'eq-2',
      name: '中央空調システム',
      category: '空調設備',
      location: '屋上機械室',
      installDate: '2019-05-20',
      lastMaintenance: '2025-05-20',
      nextMaintenance: '2025-08-20',
      status: 'normal',
    },
    {
      id: 'eq-3',
      name: '自動火災報知設備',
      category: '防災設備',
      location: '全館',
      installDate: '2018-12-10',
      lastMaintenance: '2024-12-10',
      nextMaintenance: '2025-12-10',
      status: 'warning',
    },
    {
      id: 'eq-4',
      name: '非常用発電機',
      category: '電気設備',
      location: '地下機械室',
      installDate: '2017-08-30',
      lastMaintenance: '2025-02-28',
      nextMaintenance: '2025-08-30',
      status: 'critical',
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    type: 'preventive' as 'preventive' | 'corrective' | 'inspection',
    category: 'facility' as 'facility' | 'cleaning' | 'security' | 'fire_safety' | 'other',
    equipment: '',
    location: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    scheduledDate: '',
    assignedTo: '',
    description: '',
    estimatedCost: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddTask = () => {
    const task: MaintenanceTask = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      type: newTask.type,
      category: newTask.category,
      equipment: newTask.equipment,
      location: newTask.location,
      priority: newTask.priority,
      status: 'scheduled',
      scheduledDate: newTask.scheduledDate,
      assignedTo: newTask.assignedTo,
      description: newTask.description,
      estimatedCost: newTask.estimatedCost ? Number(newTask.estimatedCost) : undefined,
    };

    setMaintenanceTasks([...maintenanceTasks, task]);

    dispatch(addActivity({
      type: 'maintenance',
      description: `メンテナンス作業を予定しました：${newTask.title}`,
    }));

    dispatch(showNotification({
      message: 'メンテナンス作業を追加しました',
      type: 'success',
    }));

    setTaskDialogOpen(false);
    setNewTask({
      title: '',
      type: 'preventive',
      category: 'facility',
      equipment: '',
      location: '',
      priority: 'medium',
      scheduledDate: '',
      assignedTo: '',
      description: '',
      estimatedCost: '',
    });
  };

  const handleCompleteTask = (id: string) => {
    setMaintenanceTasks(maintenanceTasks.map(task => 
      task.id === id ? { 
        ...task, 
        status: 'completed',
        completedDate: new Date().toISOString().split('T')[0]
      } : task
    ));

    const task = maintenanceTasks.find(t => t.id === id);
    if (task) {
      dispatch(addActivity({
        type: 'maintenance',
        description: `メンテナンス作業が完了しました：${task.title}`,
      }));

      dispatch(showNotification({
        message: 'メンテナンス作業を完了しました',
        type: 'success',
      }));
    }
  };

  const getPriorityColor = (priority: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const colors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
      low: 'info',
      medium: 'primary',
      high: 'warning',
      urgent: 'error',
    };
    return colors[priority] || 'default';
  };

  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const colors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
      scheduled: 'info',
      in_progress: 'warning',
      completed: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getEquipmentStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const colors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
      normal: 'success',
      warning: 'warning',
      critical: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      scheduled: '予定',
      in_progress: '実施中',
      completed: '完了',
      cancelled: 'キャンセル',
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      preventive: '予防保全',
      corrective: '修理',
      inspection: '点検',
    };
    return labels[type] || type;
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      facility: '設備',
      cleaning: '清掃',
      security: '警備',
      fire_safety: '消防',
      other: 'その他',
    };
    return labels[category] || category;
  };

  const getTasksByCategory = (category: string) => {
    return maintenanceTasks.filter(task => task.category === category);
  };

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  const renderMaintenanceTable = (category: string, title: string) => {
    const tasks = getTasksByCategory(category);
    
    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">{title}</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setTaskDialogOpen(true)}
          >
            新規作業
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>作業名</TableCell>
                <TableCell>種別</TableCell>
                <TableCell>設備</TableCell>
                <TableCell>場所</TableCell>
                <TableCell>優先度</TableCell>
                <TableCell>予定日</TableCell>
                <TableCell>担当者</TableCell>
                <TableCell>ステータス</TableCell>
                <TableCell>報告書</TableCell>
                <TableCell>アクション</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    {title}の作業はありません
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>
                      <Chip label={getTypeLabel(task.type)} size="small" />
                    </TableCell>
                    <TableCell>{task.equipment}</TableCell>
                    <TableCell>{task.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={task.priority.toUpperCase()}
                        color={getPriorityColor(task.priority)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{task.scheduledDate}</TableCell>
                    <TableCell>{task.assignedTo}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(task.status)}
                        color={getStatusColor(task.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {task.reportFile ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            // ファイルダウンロード機能（後で実装）
                            dispatch(showNotification({
                              message: '報告書のダウンロード機能は開発中です',
                              type: 'info',
                            }));
                          }}
                        >
                          報告書
                        </Button>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {task.status === 'scheduled' || task.status === 'in_progress' ? (
                        <Button
                          size="small"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          完了
                        </Button>
                      ) : null}
                      <Button size="small" startIcon={<EditIcon />}>
                        編集
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        メンテナンス管理
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              予定中の作業
            </Typography>
            <Typography variant="h4">
              {maintenanceTasks.filter(t => t.status === 'scheduled').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              実施中の作業
            </Typography>
            <Typography variant="h4" color="warning.main">
              {maintenanceTasks.filter(t => t.status === 'in_progress').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              今月完了
            </Typography>
            <Typography variant="h4" color="success.main">
              {maintenanceTasks.filter(t => t.status === 'completed').length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="設備" icon={<BuildIcon />} />
          <Tab label="清掃" />
          <Tab label="警備" />
          <Tab label="消防" />
          <Tab label="その他" />
          <Tab label="設備管理" icon={<ScheduleIcon />} />
        </Tabs>
      </Paper>

      {/* 設備カテゴリ */}
      <TabPanel value={tabValue} index={0}>
        {renderMaintenanceTable('facility', '設備メンテナンス')}
      </TabPanel>

      {/* 清掃カテゴリ */}
      <TabPanel value={tabValue} index={1}>
        {renderMaintenanceTable('cleaning', '清掃作業')}
      </TabPanel>

      {/* 警備カテゴリ */}
      <TabPanel value={tabValue} index={2}>
        {renderMaintenanceTable('security', '警備業務')}
      </TabPanel>

      {/* 消防カテゴリ */}
      <TabPanel value={tabValue} index={3}>
        {renderMaintenanceTable('fire_safety', '消防設備')}
      </TabPanel>

      {/* その他カテゴリ */}
      <TabPanel value={tabValue} index={4}>
        {renderMaintenanceTable('other', 'その他')}
      </TabPanel>

      <TabPanel value={tabValue} index={5}>
        <Typography variant="h6" gutterBottom>
          設備一覧
        </Typography>
        
        {equipment.map((eq) => (
          <Accordion key={eq.id} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {eq.name}
                </Typography>
                <Chip
                  label={eq.status.toUpperCase()}
                  color={getEquipmentStatusColor(eq.status)}
                  size="small"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      カテゴリ
                    </Typography>
                    <Typography variant="body1">{eq.category}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      設置場所
                    </Typography>
                    <Typography variant="body1">{eq.location}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      設置日
                    </Typography>
                    <Typography variant="body1">{eq.installDate}</Typography>
                  </Box>
                  {eq.warranty && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        保証期間
                      </Typography>
                      <Typography variant="body1">{eq.warranty}</Typography>
                    </Box>
                  )}
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    メンテナンス状況
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="body2">
                        前回: {eq.lastMaintenance || '未実施'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2">
                        次回: {eq.nextMaintenance}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* メンテナンス進捗バー（ダミー） */}
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      次回メンテナンスまで
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={eq.status === 'critical' ? 90 : eq.status === 'warning' ? 70 : 30} 
                      color={eq.status === 'critical' ? 'error' : eq.status === 'warning' ? 'warning' : 'primary'}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </TabPanel>

      {/* 新規作業ダイアログ */}
      <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>新規メンテナンス作業</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="作業名"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>カテゴリ</InputLabel>
                <Select
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value as any })}
                  label="カテゴリ"
                >
                  <MenuItem value="facility">設備</MenuItem>
                  <MenuItem value="cleaning">清掃</MenuItem>
                  <MenuItem value="security">警備</MenuItem>
                  <MenuItem value="fire_safety">消防</MenuItem>
                  <MenuItem value="other">その他</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>作業種別</InputLabel>
                <Select
                  value={newTask.type}
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value as any })}
                  label="作業種別"
                >
                  <MenuItem value="preventive">予防保全</MenuItem>
                  <MenuItem value="corrective">修理</MenuItem>
                  <MenuItem value="inspection">点検</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <FormControl fullWidth>
              <InputLabel>優先度</InputLabel>
              <Select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                label="優先度"
              >
                <MenuItem value="low">低</MenuItem>
                <MenuItem value="medium">中</MenuItem>
                <MenuItem value="high">高</MenuItem>
                <MenuItem value="urgent">緊急</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                label="設備名"
                value={newTask.equipment}
                onChange={(e) => setNewTask({ ...newTask, equipment: e.target.value })}
              />
              <TextField
                sx={{ flex: 1 }}
                label="場所"
                value={newTask.location}
                onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                label="予定日"
                type="date"
                value={newTask.scheduledDate}
                onChange={(e) => setNewTask({ ...newTask, scheduledDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                sx={{ flex: 1 }}
                label="担当者"
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
              />
            </Box>
            
            <TextField
              fullWidth
              label="見積金額"
              type="number"
              value={newTask.estimatedCost}
              onChange={(e) => setNewTask({ ...newTask, estimatedCost: e.target.value })}
              InputProps={{ endAdornment: '円' }}
            />
            
            <TextField
              fullWidth
              label="作業内容"
              multiline
              rows={3}
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialogOpen(false)}>キャンセル</Button>
          <Button 
            onClick={handleAddTask} 
            variant="contained"
            disabled={!newTask.title || !newTask.equipment || !newTask.scheduledDate || !newTask.assignedTo}
          >
            追加
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaintenanceManagement;
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
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Tabs,
  Tab,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { addActivity } from '../../../store/slices/activitiesSlice';
import { showNotification } from '../../../store/slices/uiSlice';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ConstructionIcon from '@mui/icons-material/Construction';

interface ConstructionProject {
  id: string;
  title: string;
  category: 'building' | 'tenant';
  type: 'renovation' | 'repair' | 'improvement' | 'new_installation';
  location: string;
  contractor: string;
  status: 'planning' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  budget?: number;
  actualCost?: number;
  progress: number;
  description: string;
  permits: string[];
  phases: ProjectPhase[];
  reportFile?: string;
  tenantName?: string;
}

interface ProjectPhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  description: string;
}

const ConstructionManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [tabValue, setTabValue] = useState(0);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ConstructionProject | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  const [projects, setProjects] = useState<ConstructionProject[]>([
    // ビル工事
    {
      id: 'proj-1',
      title: '外壁補修工事',
      category: 'building',
      type: 'repair',
      location: '北側外壁',
      contractor: '建設工業株式会社',
      status: 'in_progress',
      startDate: '2025-08-20',
      endDate: '2025-08-25',
      budget: 800000,
      actualCost: 650000,
      progress: 75,
      description: '外壁のクラック補修とシーリング工事',
      permits: ['建築基準法確認', '近隣説明書'],
      phases: [
        {
          id: 'phase-1',
          name: '準備・足場設置',
          startDate: '2025-08-20',
          endDate: '2025-08-21',
          status: 'completed',
          description: '足場の組み立てと安全対策'
        },
        {
          id: 'phase-2',
          name: 'クラック補修',
          startDate: '2025-08-22',
          endDate: '2025-08-24',
          status: 'in_progress',
          description: 'クラック部分の補修作業'
        },
        {
          id: 'phase-3',
          name: '仕上げ・清掃',
          startDate: '2025-08-24',
          endDate: '2025-08-25',
          status: 'pending',
          description: '仕上げ工事と現場清掃'
        }
      ]
    },
    {
      id: 'proj-2',
      title: 'LED照明更新工事',
      category: 'building',
      type: 'improvement',
      location: '共用部全体',
      contractor: '電気工事サービス',
      status: 'planning',
      startDate: '2025-09-01',
      endDate: '2025-09-05',
      budget: 450000,
      progress: 0,
      description: '共用部照明のLED化による省エネ対策',
      permits: ['電気工事業届出'],
      phases: [
        {
          id: 'phase-4',
          name: '既存照明撤去',
          startDate: '2025-09-01',
          endDate: '2025-09-02',
          status: 'pending',
          description: '既存の照明器具の撤去'
        },
        {
          id: 'phase-5',
          name: 'LED照明設置',
          startDate: '2025-09-03',
          endDate: '2025-09-04',
          status: 'pending',
          description: 'LED照明器具の設置・配線工事'
        },
        {
          id: 'phase-6',
          name: '動作確認・清掃',
          startDate: '2025-09-05',
          endDate: '2025-09-05',
          status: 'pending',
          description: '点灯確認と現場清掃'
        }
      ]
    },
    {
      id: 'proj-3',
      title: 'エントランス改装工事',
      category: 'building',
      type: 'renovation',
      location: '1階エントランス',
      contractor: 'インテリア工房',
      status: 'completed',
      startDate: '2025-07-15',
      endDate: '2025-07-30',
      budget: 1200000,
      actualCost: 1150000,
      progress: 100,
      description: 'エントランスの美観向上と機能性改善',
      permits: ['建築基準法確認', '消防法確認'],
      reportFile: 'エントランス改装工事完了報告書_20250730.pdf',
      phases: [
        {
          id: 'phase-7',
          name: '解体・撤去',
          startDate: '2025-07-15',
          endDate: '2025-07-18',
          status: 'completed',
          description: '既存内装の解体・撤去'
        },
        {
          id: 'phase-8',
          name: '内装工事',
          startDate: '2025-07-19',
          endDate: '2025-07-28',
          status: 'completed',
          description: '床・壁・天井の内装工事'
        },
        {
          id: 'phase-9',
          name: '仕上げ・清掃',
          startDate: '2025-07-29',
          endDate: '2025-07-30',
          status: 'completed',
          description: '最終仕上げと清掃作業'
        }
      ]
    },
    // テナント工事
    {
      id: 'proj-4',
      title: '内装改修工事',
      category: 'tenant',
      type: 'renovation',
      location: '3階',
      contractor: '内装工事アライアンス',
      status: 'in_progress',
      startDate: '2025-08-10',
      endDate: '2025-08-20',
      progress: 60,
      description: 'オフィス内装の全面リニューアル',
      permits: ['内装工事届出'],
      tenantName: '佐藤システムズ',
      phases: [
        {
          id: 'phase-10',
          name: '既存内装撤去',
          startDate: '2025-08-10',
          endDate: '2025-08-12',
          status: 'completed',
          description: '既存パーティションと床材の撤去'
        },
        {
          id: 'phase-11',
          name: '内装工事',
          startDate: '2025-08-13',
          endDate: '2025-08-18',
          status: 'in_progress',
          description: '新しい内装材の設置'
        },
        {
          id: 'phase-12',
          name: '最終確認',
          startDate: '2025-08-19',
          endDate: '2025-08-20',
          status: 'pending',
          description: '仕上げ確認と清掃'
        }
      ]
    },
    {
      id: 'proj-5',
      title: '電気設備増設工事',
      category: 'tenant',
      type: 'new_installation',
      location: '2階',
      contractor: '電設テクノ',
      status: 'completed',
      startDate: '2025-07-20',
      endDate: '2025-07-25',
      progress: 100,
      description: '新規機器導入のための電気配線増設',
      permits: ['電気工事届出'],
      tenantName: '田中商事',
      reportFile: '電気設備増設工事完了報告書_20250725.pdf',
      phases: [
        {
          id: 'phase-13',
          name: '配線工事',
          startDate: '2025-07-20',
          endDate: '2025-07-23',
          status: 'completed',
          description: '新規配線の敷設'
        },
        {
          id: 'phase-14',
          name: '動作確認',
          startDate: '2025-07-24',
          endDate: '2025-07-25',
          status: 'completed',
          description: '電気系統の動作確認'
        }
      ]
    },
  ]);

  const [newProject, setNewProject] = useState({
    title: '',
    type: 'repair' as 'renovation' | 'repair' | 'improvement' | 'new_installation',
    location: '',
    contractor: '',
    startDate: '',
    endDate: '',
    budget: '',
    description: '',
  });

  const getBuildingProjects = () => {
    return projects.filter(project => project.category === 'building');
  };

  const getTenantProjects = () => {
    return projects.filter(project => project.category === 'tenant');
  };

  const handleAddProject = () => {
    const project: ConstructionProject = {
      id: `proj-${Date.now()}`,
      title: newProject.title,
      category: 'building',
      type: newProject.type,
      location: newProject.location,
      contractor: newProject.contractor,
      status: 'planning',
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      budget: Number(newProject.budget),
      progress: 0,
      description: newProject.description,
      permits: [],
      phases: [],
    };

    setProjects([...projects, project]);

    dispatch(addActivity({
      type: 'application',
      description: `新しい工事プロジェクトが追加されました：${newProject.title}`,
    }));

    dispatch(showNotification({
      message: '工事プロジェクトを追加しました',
      type: 'success',
    }));

    setProjectDialogOpen(false);
    setNewProject({
      title: '',
      type: 'repair',
      location: '',
      contractor: '',
      startDate: '',
      endDate: '',
      budget: '',
      description: '',
    });
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setProjects(projects.map(proj => 
      proj.id === id ? { ...proj, status: newStatus as any } : proj
    ));

    const project = projects.find(p => p.id === id);
    if (project) {
      dispatch(addActivity({
        type: 'application',
        description: `${project.title}のステータスが更新されました：${newStatus}`,
      }));

      dispatch(showNotification({
        message: 'プロジェクトステータスを更新しました',
        type: 'success',
      }));
    }
  };

  const handleViewDetail = (project: ConstructionProject) => {
    setSelectedProject(project);
    setDetailDialogOpen(true);
  };

  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const colors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
      planning: 'info',
      approved: 'primary',
      in_progress: 'warning',
      completed: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      renovation: '改装工事',
      repair: '修繕工事',
      improvement: '改善工事',
      new_installation: '新設工事',
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      planning: '計画中',
      approved: '承認済',
      in_progress: '工事中',
      completed: '完了',
      cancelled: 'キャンセル',
    };
    return labels[status] || status;
  };

  const getPhaseStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const colors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
      pending: 'default',
      in_progress: 'warning',
      completed: 'success',
    };
    return colors[status] || 'default';
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const TabPanel = ({ children, value, index }: any) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );

  const renderProjectTable = (projectList: ConstructionProject[], title: string, showBudget: boolean) => {
    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">{title}</Typography>
          {showBudget && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setProjectDialogOpen(true)}
            >
              新規プロジェクト
            </Button>
          )}
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>プロジェクト名</TableCell>
                <TableCell>工事種別</TableCell>
                <TableCell>場所</TableCell>
                {!showBudget && <TableCell>テナント</TableCell>}
                <TableCell>施工業者</TableCell>
                <TableCell>工期</TableCell>
                {showBudget && <TableCell>予算</TableCell>}
                <TableCell>進捗</TableCell>
                <TableCell>ステータス</TableCell>
                <TableCell>報告書</TableCell>
                <TableCell>アクション</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={showBudget ? 10 : 10} align="center">
                    {title}はありません
                  </TableCell>
                </TableRow>
              ) : (
                projectList.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Button
                        variant="text"
                        onClick={() => handleViewDetail(project)}
                      >
                        {project.title}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Chip label={getTypeLabel(project.type)} size="small" />
                    </TableCell>
                    <TableCell>{project.location}</TableCell>
                    {!showBudget && <TableCell>{project.tenantName}</TableCell>}
                    <TableCell>{project.contractor}</TableCell>
                    <TableCell>
                      {project.startDate} ~ {project.endDate}
                    </TableCell>
                    {showBudget && (
                      <TableCell>
                        {project.budget ? `¥${project.budget.toLocaleString()}` : '-'}
                      </TableCell>
                    )}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={project.progress}
                          sx={{ width: 100 }}
                        />
                        <Typography variant="body2">{project.progress}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(project.status)}
                        color={getStatusColor(project.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {project.reportFile ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
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
                      {showBudget && (
                        <>
                          {project.status === 'planning' && (
                            <Button
                              size="small"
                              color="primary"
                              onClick={() => handleUpdateStatus(project.id, 'approved')}
                            >
                              承認
                            </Button>
                          )}
                          {project.status === 'approved' && (
                            <Button
                              size="small"
                              color="warning"
                              onClick={() => handleUpdateStatus(project.id, 'in_progress')}
                            >
                              開始
                            </Button>
                          )}
                          {project.status === 'in_progress' && (
                            <Button
                              size="small"
                              color="success"
                              onClick={() => handleUpdateStatus(project.id, 'completed')}
                            >
                              完了
                            </Button>
                          )}
                          <Button size="small" startIcon={<EditIcon />}>
                            編集
                          </Button>
                        </>
                      )}
                      {!showBudget && (
                        <Button size="small" onClick={() => handleViewDetail(project)}>
                          詳細
                        </Button>
                      )}
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
        工事管理
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              進行中プロジェクト
            </Typography>
            <Typography variant="h4">
              {projects.filter(p => p.status === 'in_progress').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              計画中プロジェクト
            </Typography>
            <Typography variant="h4" color="info.main">
              {projects.filter(p => p.status === 'planning').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              総予算（ビル工事）
            </Typography>
            <Typography variant="h4" color="primary.main">
              ¥{getBuildingProjects().reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="ビル工事" icon={<ConstructionIcon />} />
          <Tab label="テナント工事" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        {renderProjectTable(getBuildingProjects(), 'ビル工事', true)}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderProjectTable(getTenantProjects(), 'テナント工事', false)}
      </TabPanel>

      {/* プロジェクト詳細ダイアログ */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>プロジェクト詳細</DialogTitle>
        <DialogContent>
          {selectedProject && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedProject.title}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    工事種別
                  </Typography>
                  <Typography variant="body1">{getTypeLabel(selectedProject.type)}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    施工場所
                  </Typography>
                  <Typography variant="body1">{selectedProject.location}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    施工業者
                  </Typography>
                  <Typography variant="body1">{selectedProject.contractor}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    工期
                  </Typography>
                  <Typography variant="body1">
                    {selectedProject.startDate} ~ {selectedProject.endDate}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  工事概要
                </Typography>
                <Typography variant="body1">{selectedProject.description}</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    予算
                  </Typography>
                  <Typography variant="body1">
                    {selectedProject.budget ? `¥${selectedProject.budget.toLocaleString()}` : '未設定'}
                  </Typography>
                </Box>
                {selectedProject.actualCost && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      実績金額
                    </Typography>
                    <Typography variant="body1">¥{selectedProject.actualCost.toLocaleString()}</Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    進捗
                  </Typography>
                  <Typography variant="body1">{selectedProject.progress}%</Typography>
                </Box>
              </Box>

              {selectedProject.phases.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    工事フェーズ
                  </Typography>
                  <Stepper orientation="vertical">
                    {selectedProject.phases.map((phase, index) => (
                      <Step key={phase.id} active={true} completed={phase.status === 'completed'}>
                        <StepLabel>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography>{phase.name}</Typography>
                            <Chip
                              label={phase.status}
                              color={getPhaseStatusColor(phase.status)}
                              size="small"
                            />
                          </Box>
                        </StepLabel>
                        <StepContent>
                          <Typography variant="body2" color="text.secondary">
                            {phase.startDate} ~ {phase.endDate}
                          </Typography>
                          <Typography variant="body2">
                            {phase.description}
                          </Typography>
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>

      {/* 新規プロジェクトダイアログ */}
      <Dialog open={projectDialogOpen} onClose={() => setProjectDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>新規工事プロジェクト</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="プロジェクト名"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>工事種別</InputLabel>
                <Select
                  value={newProject.type}
                  onChange={(e) => setNewProject({ ...newProject, type: e.target.value as any })}
                  label="工事種別"
                >
                  <MenuItem value="renovation">改装工事</MenuItem>
                  <MenuItem value="repair">修繕工事</MenuItem>
                  <MenuItem value="improvement">改善工事</MenuItem>
                  <MenuItem value="new_installation">新設工事</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                sx={{ flex: 1 }}
                label="施工場所"
                value={newProject.location}
                onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
              />
            </Box>
            
            <TextField
              fullWidth
              label="施工業者"
              value={newProject.contractor}
              onChange={(e) => setNewProject({ ...newProject, contractor: e.target.value })}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                label="開始予定日"
                type="date"
                value={newProject.startDate}
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                sx={{ flex: 1 }}
                label="完了予定日"
                type="date"
                value={newProject.endDate}
                onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            
            <TextField
              fullWidth
              label="予算"
              type="number"
              value={newProject.budget}
              onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
              InputProps={{ endAdornment: '円' }}
            />
            
            <TextField
              fullWidth
              label="工事概要"
              multiline
              rows={3}
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProjectDialogOpen(false)}>キャンセル</Button>
          <Button 
            onClick={handleAddProject} 
            variant="contained"
            disabled={!newProject.title || !newProject.contractor || !newProject.startDate || !newProject.endDate}
          >
            追加
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConstructionManagement;
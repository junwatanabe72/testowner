import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { updateEmailTemplate } from '../../../store/slices/recruitmentSlice';
import { showNotification } from '../../../store/slices/uiSlice';
import { addActivity } from '../../../store/slices/activitiesSlice';
import { EmailTemplate } from '../../../types';
import SaveIcon from '@mui/icons-material/Save';
import PreviewIcon from '@mui/icons-material/Preview';
import EmailIcon from '@mui/icons-material/Email';

const EmailTemplateEditor: React.FC = () => {
  const dispatch = useAppDispatch();
  const emailTemplates = useAppSelector((state) => state.recruitment.emailTemplates);
  const building = useAppSelector((state) => state.building.data);
  
  const [currentTab, setCurrentTab] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(5);
  
  const [templates, setTemplates] = useState<{[key: string]: {subject: string, body: string}}>({
    'vacancy_notification': {
      subject: emailTemplates.find((t: EmailTemplate) => t.type === 'vacancy_notification')?.subject || '',
      body: emailTemplates.find((t: EmailTemplate) => t.type === 'vacancy_notification')?.body || '',
    },
    'move_out_notification': {
      subject: emailTemplates.find((t: EmailTemplate) => t.type === 'move_out_notification')?.subject || '',
      body: emailTemplates.find((t: EmailTemplate) => t.type === 'move_out_notification')?.body || '',
    },
  });

  const templateTypes = [
    { key: 'vacancy_notification', label: '空室通知メール' },
    { key: 'move_out_notification', label: '退去予定通知メール' },
  ];

  const currentTemplateType = templateTypes[currentTab].key as 'vacancy_notification' | 'move_out_notification';
  const currentTemplate = emailTemplates.find((t: EmailTemplate) => t.type === currentTemplateType);

  const handleTemplateChange = (field: 'subject' | 'body', value: string) => {
    setTemplates(prev => ({
      ...prev,
      [currentTemplateType]: {
        ...prev[currentTemplateType],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    if (!currentTemplate) return;

    const updatedTemplate: EmailTemplate = {
      ...currentTemplate,
      subject: templates[currentTemplateType].subject,
      body: templates[currentTemplateType].body,
      updatedAt: new Date().toLocaleString('ja-JP'),
    };

    dispatch(updateEmailTemplate(updatedTemplate));
    dispatch(addActivity({
      type: 'maintenance',
      description: `${templateTypes[currentTab].label}テンプレートを更新しました`,
    }));
    dispatch(showNotification({
      message: 'メールテンプレートを更新しました。',
      type: 'success',
    }));
  };

  const insertVariable = (variable: string) => {
    const textArea = document.activeElement as HTMLTextAreaElement;
    if (textArea && textArea.tagName === 'TEXTAREA') {
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const currentValue = templates[currentTemplateType].body;
      const newValue = currentValue.substring(0, start) + `{{${variable}}}` + currentValue.substring(end);
      
      handleTemplateChange('body', newValue);
      
      // カーソル位置を調整
      setTimeout(() => {
        textArea.selectionStart = textArea.selectionEnd = start + variable.length + 4;
        textArea.focus();
      }, 0);
    }
  };

  const generatePreview = () => {
    if (!currentTemplate) return { subject: '', body: '' };

    const sampleData = {
      buildingName: building?.info?.name || 'サンプルビル',
      floorNumber: selectedFloor.toString(),
      area: '120',
      rent: '350,000',
      commonCharge: '30,000',
      deposit: '家賃2ヶ月分',
      keyMoney: '家賃1ヶ月分',
      moveInDate: '即入居可',
      features: '駅近、敷金礼金相談可、法人契約可',
      description: '最上階の明るいオフィスです。眺望良好で快適な作業環境を提供します。',
      brokerName: 'エステート不動産',
      ownerName: '物件オーナー',
      ownerPhone: '03-1234-5678',
      ownerEmail: 'owner@example.com',
      currentTenant: 'ABC株式会社',
      moveOutDate: '2025-08-31',
      recruitmentStartDate: '2025-09-01',
    };

    let previewSubject = templates[currentTemplateType].subject;
    let previewBody = templates[currentTemplateType].body;

    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      previewSubject = previewSubject.replace(regex, value);
      previewBody = previewBody.replace(regex, value);
    });

    return { subject: previewSubject, body: previewBody };
  };

  if (!currentTemplate) return null;

  const variablesByType = {
    vacancy_notification: [
      'buildingName', 'floorNumber', 'area', 'rent', 'commonCharge', 
      'deposit', 'keyMoney', 'moveInDate', 'features', 'description',
      'brokerName', 'ownerName', 'ownerPhone', 'ownerEmail'
    ],
    move_out_notification: [
      'buildingName', 'floorNumber', 'currentTenant', 'moveOutDate', 
      'recruitmentStartDate', 'brokerName', 'ownerName', 'ownerPhone', 'ownerEmail'
    ],
  };

  const variableLabels = {
    buildingName: 'ビル名',
    floorNumber: '階数',
    area: '面積',
    rent: '賃料',
    commonCharge: '共益費',
    deposit: '敷金',
    keyMoney: '礼金',
    moveInDate: '入居可能日',
    features: '特徴',
    description: '詳細説明',
    brokerName: '仲介会社名',
    ownerName: 'オーナー名',
    ownerPhone: 'オーナー電話番号',
    ownerEmail: 'オーナーメールアドレス',
    currentTenant: '現在のテナント',
    moveOutDate: '退去予定日',
    recruitmentStartDate: '募集開始予定日',
  };

  const preview = previewMode ? generatePreview() : null;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          メールテンプレート編集
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={previewMode ? 'contained' : 'outlined'}
            startIcon={<PreviewIcon />}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? '編集モード' : 'プレビュー'}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={previewMode}
          >
            保存
          </Button>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        メール配信時に自動で使用されるテンプレートを編集できます。{'{変数名}'}で動的な値を挿入できます。
      </Alert>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          {templateTypes.map((type, index) => (
            <Tab key={type.key} label={type.label} />
          ))}
        </Tabs>
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
          <Box>
            <Paper sx={{ p: 3 }}>
              {previewMode ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Typography variant="h6">プレビュー</Typography>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>サンプル階</InputLabel>
                      <Select
                        value={selectedFloor}
                        onChange={(e) => setSelectedFloor(Number(e.target.value))}
                        label="サンプル階"
                      >
                        <MenuItem value={5}>5階</MenuItem>
                        <MenuItem value={6}>6階</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
                      <EmailIcon color="primary" />
                      <Typography variant="subtitle1" fontWeight="bold">
                        {preview?.subject}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      component="pre"
                      sx={{ 
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        lineHeight: 1.6,
                        bgcolor: 'grey.50',
                        p: 2,
                        borderRadius: 1,
                      }}
                    >
                      {preview?.body}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {templateTypes[currentTab].label}
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="件名"
                      value={templates[currentTemplateType].subject}
                      onChange={(e) => handleTemplateChange('subject', e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    
                    <TextField
                      fullWidth
                      label="本文"
                      multiline
                      rows={15}
                      value={templates[currentTemplateType].body}
                      onChange={(e) => handleTemplateChange('body', e.target.value)}
                      sx={{ '& textarea': { fontFamily: 'monospace' } }}
                    />
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
          
          <Box>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                使用可能な変数
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem' }}>
                クリックするとカーソル位置に変数が挿入されます
              </Alert>
              
              <List dense>
                {variablesByType[currentTemplateType].map((variable) => (
                  <ListItem 
                    key={variable} 
                    sx={{ px: 0, py: 0.5 }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {variableLabels[variable as keyof typeof variableLabels]}
                        </Typography>
                        {!previewMode && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => insertVariable(variable)}
                            sx={{ minWidth: 'auto', px: 1, fontSize: '0.75rem' }}
                          >
                            挿入
                          </Button>
                        )}
                      </Box>
                      <Chip
                        label={`{{${variable}}}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem', height: 20 }}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                テンプレート更新履歴
              </Typography>
              <Typography variant="body2" color="text.secondary">
                最終更新: {currentTemplate.updatedAt}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                作成日: {currentTemplate.createdAt}
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailTemplateEditor;

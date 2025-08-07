import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  FormControlLabel,
  Switch,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { selectVacantFloors } from '../../../store/selectors';
import { addRecruitmentCondition, updateRecruitmentCondition } from '../../../store/slices/recruitmentSlice';
import { showNotification } from '../../../store/slices/uiSlice';
import { addActivity } from '../../../store/slices/activitiesSlice';
import { RecruitmentCondition, Floor } from '../../../types';
import { nanoid } from '@reduxjs/toolkit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface RecruitmentConditionFormProps {
  condition?: RecruitmentCondition;
  onClose: () => void;
  open: boolean;
}

const RecruitmentConditionForm: React.FC<RecruitmentConditionFormProps> = ({
  condition,
  onClose,
  open,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const vacantFloors = useSelector(selectVacantFloors);
  
  const [formData, setFormData] = useState<Partial<RecruitmentCondition>>({
    floorNumber: condition?.floorNumber || 0,
    rent: condition?.rent || 0,
    commonCharge: condition?.commonCharge || 0,
    deposit: condition?.deposit || '',
    keyMoney: condition?.keyMoney || '',
    contractPeriod: condition?.contractPeriod || '2年',
    moveInDate: condition?.moveInDate || '即入居可',
    features: condition?.features || [],
    description: condition?.description || '',
    isActive: condition?.isActive ?? true,
  });
  
  const [newFeature, setNewFeature] = useState('');
  
  const availableFeatures = [
    '駅近', '敷金礼金相談可', '法人契約可', '個人契約可', 'ペット可',
    '楽器可', '事務所可', 'SOHO可', '24時間利用可', 'エレベーター直結',
    '最上階', '角部屋', '南向き', 'バルコニー付き', '駐車場付き',
    '会議室完備', '給湯室完備', 'セキュリティ完備'
  ];

  const handleInputChange = (field: keyof RecruitmentCondition, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features?.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter(f => f !== feature) || [],
    }));
  };

  const handleSubmit = () => {
    if (!formData.floorNumber || !formData.rent) {
      dispatch(showNotification({
        message: '階数と賃料は必須項目です。',
        type: 'warning',
      }));
      return;
    }

    const now = new Date().toLocaleString('ja-JP');
    const recruitmentData: RecruitmentCondition = {
      id: condition?.id || nanoid(),
      floorNumber: formData.floorNumber as number,
      rent: formData.rent as number,
      commonCharge: formData.commonCharge as number,
      deposit: formData.deposit as string,
      keyMoney: formData.keyMoney as string,
      contractPeriod: formData.contractPeriod as string,
      moveInDate: formData.moveInDate as string,
      features: formData.features as string[],
      description: formData.description as string,
      isActive: formData.isActive as boolean,
      createdAt: condition?.createdAt || now,
      updatedAt: now,
    };

    if (condition) {
      dispatch(updateRecruitmentCondition(recruitmentData));
      dispatch(addActivity({
        type: 'maintenance',
        description: `${formData.floorNumber}階の募集条件を更新しました`,
      }));
      dispatch(showNotification({
        message: '募集条件を更新しました。',
        type: 'success',
      }));
    } else {
      dispatch(addRecruitmentCondition(recruitmentData));
      dispatch(addActivity({
        type: 'maintenance',
        description: `${formData.floorNumber}階の募集条件を設定しました`,
      }));
      dispatch(showNotification({
        message: '募集条件を追加しました。',
        type: 'success',
      }));
    }

    onClose();
  };

  const selectedFloor = vacantFloors.find((f: Floor) => f.floorNumber === formData.floorNumber);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {condition ? '募集条件編集' : '募集条件設定'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            空室の募集条件を設定します。設定した条件は仲介会社への通知メールに自動で反映されます。
          </Alert>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <Box>
              <Autocomplete
                value={vacantFloors.find((f: Floor) => f.floorNumber === formData.floorNumber) || null}
                onChange={(_, newValue) => {
                  if (newValue) {
                    handleInputChange('floorNumber', newValue.floorNumber);
                  }
                }}
                options={vacantFloors}
                getOptionLabel={(option) => `${option.floorNumber}階 (${option.area}㎡)`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="対象階"
                    required
                    helperText="空室のみ選択可能"
                  />
                )}
              />
            </Box>
            
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  />
                }
                label="募集中"
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="賃料"
                type="number"
                value={formData.rent}
                onChange={(e) => handleInputChange('rent', Number(e.target.value))}
                InputProps={{
                  endAdornment: '円/月',
                }}
                required
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="共益費"
                type="number"
                value={formData.commonCharge}
                onChange={(e) => handleInputChange('commonCharge', Number(e.target.value))}
                InputProps={{
                  endAdornment: '円/月',
                }}
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="敷金"
                value={formData.deposit}
                onChange={(e) => handleInputChange('deposit', e.target.value)}
                placeholder="例：家賃2ヶ月分、200,000円"
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="礼金"
                value={formData.keyMoney}
                onChange={(e) => handleInputChange('keyMoney', e.target.value)}
                placeholder="例：家賃1ヶ月分、なし"
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="契約期間"
                value={formData.contractPeriod}
                onChange={(e) => handleInputChange('contractPeriod', e.target.value)}
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="入居可能日"
                value={formData.moveInDate}
                onChange={(e) => handleInputChange('moveInDate', e.target.value)}
                placeholder="例：即入居可、2025-09-01"
              />
            </Box>

            <Box sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="h6" gutterBottom>
                物件特徴
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {formData.features?.map((feature) => (
                  <Chip
                    key={feature}
                    label={feature}
                    onDelete={() => handleRemoveFeature(feature)}
                    deleteIcon={<DeleteIcon />}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Autocomplete
                  sx={{ flex: 1 }}
                  value={newFeature}
                  inputValue={newFeature}
                  onInputChange={(_, newInputValue) => setNewFeature(newInputValue)}
                  options={availableFeatures.filter(f => !formData.features?.includes(f))}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="特徴を追加"
                      placeholder="特徴を選択または入力"
                    />
                  )}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddFeature}
                  startIcon={<AddIcon />}
                  disabled={!newFeature.trim()}
                >
                  追加
                </Button>
              </Box>
            </Box>

            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                fullWidth
                label="詳細説明"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="物件の魅力や詳細情報を入力してください"
              />
            </Box>

            {selectedFloor && (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    選択中物件情報
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedFloor.floorNumber}階 • {selectedFloor.area}㎡
                    {selectedFloor.floorPlanUrl && ` • 図面: ${selectedFloor.floorPlanUrl}`}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={!formData.floorNumber || !formData.rent}
        >
          {condition ? '更新' : '保存'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecruitmentConditionForm;
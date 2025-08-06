import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
} from '@mui/material';

const SimpleTenantPortal: React.FC = () => {
  const [requestType, setRequestType] = useState('');
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDetails, setRequestDetails] = useState('');

  const handleSubmit = () => {
    if (!requestType || !requestTitle || !requestDetails) {
      alert('すべての項目を入力してください');
      return;
    }
    alert('申請を送信しました！');
    // フォームリセット
    setRequestType('');
    setRequestTitle('');
    setRequestDetails('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 1 }}>
        テナントポータル
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        ようこそ、山田製作所様
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 3, mb: 4 }}>
        {/* お知らせ */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            📢 お知らせ
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1, mb: 2 }}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                定期消防設備点検を実施します
              </Typography>
              <Typography variant="body2" color="text.secondary">
                〇月〇日、定期消防設備点検を実施します。
              </Typography>
              <Typography variant="caption" color="text.secondary">
                2025-08-10
              </Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                ビル全体の清掃スケジュール更新
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ビル全体の清掃スケジュールが更新されました。
              </Typography>
              <Typography variant="caption" color="text.secondary">
                2025-08-01
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* 申請状況 */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            📋 申請状況
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', mb: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    エアコンの効きが悪い
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    申請日: 2025-08-05
                  </Typography>
                </Box>
                <Chip label="対応中" color="warning" size="small" />
              </Box>
            </Box>
            <Box sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    会議室利用申請
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    申請日: 2025-08-04
                  </Typography>
                </Box>
                <Chip label="承認済み" color="success" size="small" />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* 各種申請フォーム */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 3 }}>
          📝 各種申請
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
          <TextField
            select
            fullWidth
            label="申請の種類"
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">選択してください</MenuItem>
            <MenuItem value="repair">不具合報告</MenuItem>
            <MenuItem value="cleaning">清掃・ゴミ回収申請</MenuItem>
            <MenuItem value="construction">工事申請</MenuItem>
            <MenuItem value="facility">ビル施設利用申請</MenuItem>
          </TextField>
          
          <TextField
            fullWidth
            label="件名"
            value={requestTitle}
            onChange={(e) => setRequestTitle(e.target.value)}
            placeholder="申請の件名を入力してください"
            sx={{ mb: 2 }}
          />
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          label="詳細"
          value={requestDetails}
          onChange={(e) => setRequestDetails(e.target.value)}
          placeholder="具体的な内容を記入してください"
          sx={{ mb: 3 }}
        />
        
        <Box>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{ mr: 2 }}
          >
            申請する
          </Button>
          <Button variant="outlined" size="large">
            下書き保存
          </Button>
        </Box>
      </Paper>

      {/* システム情報 */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          React版ビルオーナー向けSaaS - フェーズ1テナント機能デモ
        </Typography>
      </Box>
    </Box>
  );
};

export default SimpleTenantPortal;
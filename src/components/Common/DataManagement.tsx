import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { showNotification } from '../../store/slices/uiSlice';
import { clearAllLoading } from '../../store/slices/loadingSlice';
import { clearErrors } from '../../store/slices/errorSlice';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import StorageIcon from '@mui/icons-material/Storage';

const DataManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const handleResetData = () => {
    try {
      // LocalStorageをクリア
      localStorage.removeItem('building-saas-data');
      
      // Redux stateをクリア
      dispatch(clearAllLoading());
      dispatch(clearErrors());
      
      dispatch(showNotification({
        message: 'データをリセットしました。ページを再読み込みします。',
        type: 'success',
      }));
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      dispatch(showNotification({
        message: 'データのリセットに失敗しました。',
        type: 'error',
      }));
    }
    setResetDialogOpen(false);
  };

  const handleExportData = () => {
    try {
      const data = localStorage.getItem('building-saas-data');
      if (!data) {
        dispatch(showNotification({
          message: 'エクスポートするデータがありません。',
          type: 'warning',
        }));
        return;
      }

      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `building-saas-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      dispatch(showNotification({
        message: 'データをエクスポートしました。',
        type: 'success',
      }));
    } catch (error) {
      dispatch(showNotification({
        message: 'データのエクスポートに失敗しました。',
        type: 'error',
      }));
    }
    setExportDialogOpen(false);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string;
            JSON.parse(data); // バリデーション
            localStorage.setItem('building-saas-data', data);
            
            dispatch(showNotification({
              message: 'データをインポートしました。ページを再読み込みします。',
              type: 'success',
            }));
            
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } catch (error) {
            dispatch(showNotification({
              message: '無効なデータファイルです。',
              type: 'error',
            }));
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const getStorageInfo = () => {
    try {
      const data = localStorage.getItem('building-saas-data');
      if (!data) return null;
      
      const sizeInBytes = new Blob([data]).size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);
      const parsedData = JSON.parse(data);
      
      return {
        size: `${sizeInKB} KB`,
        lastModified: new Date(parsedData.timestamp || Date.now()).toLocaleString('ja-JP'),
        itemCount: Object.keys(parsedData).length,
      };
    } catch (error) {
      return null;
    }
  };

  const storageInfo = getStorageInfo();

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        データ管理
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <StorageIcon />
          <Typography variant="h6">
            ストレージ情報
          </Typography>
        </Box>
        
        {storageInfo ? (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Chip
              label={`データサイズ: ${storageInfo.size}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`項目数: ${storageInfo.itemCount}`}
              color="secondary"
              variant="outlined"
            />
            <Chip
              label={`最終更新: ${storageInfo.lastModified}`}
              color="default"
              variant="outlined"
            />
          </Box>
        ) : (
          <Alert severity="info">
            ローカルストレージにデータが保存されていません。
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary">
          アプリケーションのデータはブラウザのローカルストレージに保存されます。
          定期的にバックアップを取ることをお勧めします。
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          データ操作
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={() => setExportDialogOpen(true)}
            disabled={!storageInfo}
          >
            データエクスポート
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<FileUploadIcon />}
            onClick={handleImportData}
          >
            データインポート
          </Button>
          
          <Button
            variant="outlined"
            color="warning"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
          >
            ページ再読み込み
          </Button>
          
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteSweepIcon />}
            onClick={() => setResetDialogOpen(true)}
          >
            データリセット
          </Button>
        </Box>
      </Paper>

      {/* データリセット確認ダイアログ */}
      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
        <DialogTitle>データリセットの確認</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            この操作は取り消せません。
          </Alert>
          <Typography>
            すべてのデータ（建物情報、申請、予約、活動履歴など）がリセットされ、
            初期状態に戻ります。本当に実行しますか？
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={handleResetData} color="error" variant="contained">
            リセット実行
          </Button>
        </DialogActions>
      </Dialog>

      {/* データエクスポート確認ダイアログ */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
        <DialogTitle>データエクスポート</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            現在のアプリケーションデータをJSONファイルとしてダウンロードします。
          </Typography>
          {storageInfo && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                エクスポート内容:
              </Typography>
              <Typography variant="body2">
                • データサイズ: {storageInfo.size}<br/>
                • 最終更新: {storageInfo.lastModified}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={handleExportData} variant="contained">
            エクスポート
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataManagement;
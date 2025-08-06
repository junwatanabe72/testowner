import React from 'react';
import {
  Box,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assignment,
} from '@mui/icons-material';

const SimpleOwnerDashboard: React.FC = () => {
  const theme = useTheme();

  // デモデータ
  const dashboardData = {
    occupancyRate: 80, // 稼働率 80%
    monthlyRevenue: 1500000, // 今月の収益
    monthlyExpenses: 350000, // 今月の費用
    pendingApplications: 3, // 未承認申請
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        オーナーダッシュボード
      </Typography>

      {/* サマリーカード - シンプルなレイアウト */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3, mb: 4 }}>
        {/* 稼働率 */}
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography color="textSecondary" gutterBottom variant="h6">
                現在の稼働率
              </Typography>
              <Typography variant="h3" component="h2" color="primary" fontWeight="bold">
                {dashboardData.occupancyRate}%
              </Typography>
              <Typography color="textSecondary" variant="body2">
                (4/5区画)
              </Typography>
            </Box>
            <TrendingUp sx={{ fontSize: 48, color: 'success.main' }} />
          </Box>
        </Paper>

        {/* 収益 */}
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography color="textSecondary" gutterBottom variant="h6">
                今月の収益
              </Typography>
              <Typography variant="h4" component="h2" color="success.main" fontWeight="bold">
                {formatCurrency(dashboardData.monthlyRevenue)}
              </Typography>
            </Box>
            <TrendingUp sx={{ fontSize: 48, color: 'success.main' }} />
          </Box>
        </Paper>

        {/* 費用 */}
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography color="textSecondary" gutterBottom variant="h6">
                今月の費用
              </Typography>
              <Typography variant="h4" component="h2" color="error.main" fontWeight="bold">
                {formatCurrency(dashboardData.monthlyExpenses)}
              </Typography>
            </Box>
            <TrendingDown sx={{ fontSize: 48, color: 'error.main' }} />
          </Box>
        </Paper>

        {/* 未承認申請 */}
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography color="textSecondary" gutterBottom variant="h6">
                未承認の申請
              </Typography>
              <Typography variant="h3" component="h2" color="warning.main" fontWeight="bold">
                {dashboardData.pendingApplications}件
              </Typography>
            </Box>
            <Assignment sx={{ fontSize: 48, color: 'warning.main' }} />
          </Box>
        </Paper>
      </Box>

      {/* アクション項目 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
        {/* 未承認の申請リスト */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            🔔 未承認の申請
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1, mb: 1 }}>
              <Typography variant="body1" fontWeight="bold">
                会議室利用申請 (202号室)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                山田製作所 (テナント) - 2025-08-04
              </Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="body1" fontWeight="bold">
                清掃業務計画書
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A&Bメンテナンス (管理会社) - 2025-08-03
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* 最近の活動履歴 */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            📊 最近の活動履歴
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', mb: 1 }}>
              <Typography variant="body2">
                2025-08-05: 設備点検報告書が提出されました。
              </Typography>
            </Box>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', mb: 1 }}>
              <Typography variant="body2">
                2025-08-04: 新規テナント (佐藤商事) が205号室に入居しました。
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Typography variant="body2">
                2025-08-02: エアコン修理の依頼が完了しました。
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* システム情報 */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          React版ビルオーナー向けSaaS - フェーズ1デモ実装
        </Typography>
      </Box>
    </Box>
  );
};

export default SimpleOwnerDashboard;
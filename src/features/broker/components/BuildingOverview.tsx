import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import InfoSection from '../../../components/Common/InfoSection';
import { useSelector } from 'react-redux';
import { selectBuilding } from '../../../store/selectors';

const BuildingOverview: React.FC = () => {
  const building = useSelector(selectBuilding);

  if (!building) return null;

  const basicInfo = [
    { label: '物件名', value: building.info.name },
    { label: '所在地', value: building.info.address },
    { label: '交通', value: building.info.access },
    { label: '築年月', value: `${building.info.builtYear}年${building.info.builtMonth}月` },
    { label: '構造・規模', value: building.info.structure },
    { label: 'フロア面積', value: `約${building.info.floorArea}㎡（約${Math.round(building.info.floorArea * 0.3025)}坪）` },
    { label: 'エレベーター', value: `${building.info.elevator}基` },
    { label: '駐車場', value: building.info.parking },
  ];

  const nearbyInfo = Object.entries(building.info.nearbyInfo).map(([key, value]) => ({
    label: key,
    value: value as string,
  }));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        物件概要
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
          <InfoSection
            title="基本情報"
            items={basicInfo}
            columns={1}
          />
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              設備仕様
            </Typography>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {building.info.facilities.map((facility: string, index: number) => (
                <li key={index}>
                  <Typography variant="body2">{facility}</Typography>
                </li>
              ))}
            </ul>
          </Box>
        </Box>
        
        <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              アクセスマップ
            </Typography>
            <Box
              sx={{
                border: 1,
                borderColor: 'divider',
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.50',
              }}
            >
              <Typography color="text.secondary">
                地図表示エリア<br />
                （Google Maps連携予定）
              </Typography>
            </Box>
          </Box>
          
          <InfoSection
            title="周辺環境"
            items={nearbyInfo}
            columns={1}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default BuildingOverview;
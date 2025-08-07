import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface InfoItem {
  label: string;
  value: string | number | string[];
}

interface InfoSectionProps {
  title: string;
  items: InfoItem[];
  columns?: 1 | 2;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, items, columns = 1 }) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" component="h3" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {items.map((item, index) => (
          <Box key={index} sx={{ flexBasis: columns === 2 ? 'calc(50% - 8px)' : '100%', flexGrow: 0 }}>
            <Box sx={{ display: 'flex', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', minWidth: '120px' }}>
                {item.label}:
              </Typography>
              <Typography variant="body2">
                {Array.isArray(item.value) ? (
                  item.value.map((v, i) => (
                    <React.Fragment key={i}>
                      {v}
                      {i < (item.value as string[]).length - 1 && <br />}
                    </React.Fragment>
                  ))
                ) : (
                  item.value
                )}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default InfoSection;
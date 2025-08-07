import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectRecentActivities } from '../../../store/selectors';
import { ActivityLog } from '../../../types';

const ActivityHistory: React.FC = () => {
  const activities = useSelector((state: any) => selectRecentActivities(state, 5));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        最近の活動履歴
      </Typography>
      <List>
        {activities.map((activity: ActivityLog) => (
          <ListItem key={activity.id} disableGutters>
            <ListItemText
              primary={`${activity.date}: ${activity.description}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ActivityHistory;
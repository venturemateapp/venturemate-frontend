import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';
import { 
  CheckCircle, 
  Update, 
  CloudDone, 
  Description,
  Schedule
} from '@mui/icons-material';
import type { StartupActivity } from '@/types/startupStack';

interface ActivityFeedProps {
  activities: StartupActivity[];
}

const activityIcons: Record<string, typeof CheckCircle> = {
  milestone_completed: CheckCircle,
  approval_updated: Update,
  service_connected: CloudDone,
  document_generated: Description,
};

const activityColors: Record<string, string> = {
  milestone_completed: '#10b981',
  approval_updated: '#3b82f6',
  service_connected: '#8b5cf6',
  document_generated: '#f59e0b',
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Schedule sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
            📝 Your journey starts here
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Complete your first task to see activity appear here.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Recent Activity
          </Typography>
        </Box>

        <Box>
          {activities.map((activity, index) => {
            const Icon = activityIcons[activity.activity_type] || CheckCircle;
            const color = activityColors[activity.activity_type] || '#6b7280';
            const isLast = index === activities.length - 1;

            return (
              <Box key={index}>
                <Box sx={{ display: 'flex', gap: 2, py: 1.5 }}>
                  {/* Icon */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        backgroundColor: `${color}20`,
                        color: color,
                      }}
                    >
                      <Icon sx={{ fontSize: 18 }} />
                    </Avatar>
                    {!isLast && (
                      <Box
                        sx={{
                          width: 2,
                          flex: 1,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          mt: 1,
                        }}
                      />
                    )}
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1, pb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'white', mb: 0.5 }}>
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      {formatRelativeTime(activity.occurred_at)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}

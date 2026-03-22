import { Box, Card, CardContent, Typography, Chip, IconButton } from '@mui/material';
import { 
  Flag, 
  CheckCircle, 
  RadioButtonUnchecked,
  Warning,
  ArrowForward,
  Assignment,
  Gavel,
  Article,
  Cloud,
  School
} from '@mui/icons-material';
import { GradientButton } from '@/components/GradientButton';
import type { NextAction } from '@/types/startupStack';

interface NextActionsProps {
  actions: NextAction[];
  onActionClick?: (action: NextAction) => void;
  onMarkComplete?: (actionId: string) => void;
  onViewAll?: () => void;
}

const actionTypeIcons: Record<string, typeof Flag> = {
  milestone: Assignment,
  approval: Gavel,
  document: Article,
  service: Cloud,
  learning: School,
};

const priorityConfig: Record<number, { label: string; color: string; icon: typeof Flag }> = {
  1: { label: 'HIGH PRIORITY', color: '#ef4444', icon: Warning },
  2: { label: 'MEDIUM', color: '#f59e0b', icon: Flag },
  3: { label: 'LOW', color: '#6b7280', icon: Flag },
};

function ActionCard({ 
  action, 
  onClick, 
  onMarkComplete 
}: { 
  action: NextAction; 
  onClick?: () => void;
  onMarkComplete?: () => void;
}) {
  const Icon = actionTypeIcons[action.action_type] || Assignment;
  const priority = priorityConfig[action.priority] || priorityConfig[3];
  const PriorityIcon = priority.icon;

  return (
    <Card
      sx={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 2,
        mb: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.06)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PriorityIcon sx={{ color: priority.color, fontSize: 16 }} />
            <Chip
              label={priority.label}
              size="small"
              sx={{
                backgroundColor: `${priority.color}20`,
                color: priority.color,
                fontWeight: 600,
                fontSize: '0.65rem',
                height: 20,
              }}
            />
          </Box>
          {action.due_date && (
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Due: {new Date(action.due_date).toLocaleDateString()}
            </Typography>
          )}
        </Box>

        {/* Content */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 20 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
              {action.title}
            </Typography>
            {action.description && (
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                {action.description}
              </Typography>
            )}
            {action.metadata && (
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5, display: 'block' }}>
                Est. time: {action.metadata} days
              </Typography>
            )}
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <GradientButton
            variant="outline"
            size="sm"
            onClick={onClick}
            sx={{ minWidth: 100 }}
          >
            Start Task
          </GradientButton>
          <IconButton 
            onClick={onMarkComplete}
            sx={{ 
              color: 'rgba(255,255,255,0.4)',
              '&:hover': { color: '#10b981' }
            }}
          >
            {action.status === 'completed' ? (
              <CheckCircle sx={{ color: '#10b981' }} />
            ) : (
              <RadioButtonUnchecked />
            )}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

export function NextActions({ actions, onActionClick, onMarkComplete, onViewAll }: NextActionsProps) {
  if (actions.length === 0) {
    return (
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
            🎉 All caught up!
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            You've completed all your tasks. Check back tomorrow for new recommendations.
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
            Next Actions
          </Typography>
          <GradientButton variant="ghost" size="sm" endIcon={<ArrowForward />} onClick={onViewAll}>
            View All
          </GradientButton>
        </Box>

        {actions.map((action) => (
          <ActionCard
            key={action.action_id}
            action={action}
            onClick={() => onActionClick?.(action)}
            onMarkComplete={() => onMarkComplete?.(action.action_id)}
          />
        ))}
      </CardContent>
    </Card>
  );
}

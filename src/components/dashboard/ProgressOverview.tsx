import { Box, Card, CardContent, Typography } from '@mui/material';
import { CheckCircle, RadioButtonUnchecked, Schedule } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { StartupProgressResponse } from '@/types/startupStack';

interface ProgressOverviewProps {
  progress: StartupProgressResponse;
}

export function ProgressOverview({ progress }: ProgressOverviewProps) {
  const percentage = progress.overall_percentage || 0;
  const completed = progress.completed_milestones || 0;
  const total = progress.total_milestones || 1;

  return (
    <Card
      sx={{
        height: '100%',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
          Progress Overview
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 3 }}>
          {/* Circular Progress */}
          <Box sx={{ position: 'relative', width: 140, height: 140 }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              {/* Gradient definition */}
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              {/* Background circle */}
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="10"
              />
              {/* Progress circle */}
              <motion.circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 60}`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 60}` }}
                animate={{ strokeDashoffset: `${2 * Math.PI * 60 * (1 - percentage / 100)}` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
              />
            </svg>
            {/* Center text */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h2" sx={{ color: 'white', fontWeight: 700, fontSize: '2.5rem' }}>
                {percentage}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                % Complete
              </Typography>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
              <Typography variant="body1" sx={{ color: 'white' }}>
                <strong>{completed}</strong> of <strong>{total}</strong> milestones completed
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <RadioButtonUnchecked sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 20 }} />
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                <strong>{total - completed}</strong> remaining
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Schedule sx={{ color: '#f59e0b', fontSize: 20 }} />
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                On track to launch
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Quick stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mt: 'auto' }}>
          <Box
            sx={{
              p: 2,
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" sx={{ color: '#3b82f6', fontWeight: 700 }}>
              {progress.completed_approvals || 0}/{progress.total_approvals || 0}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Approvals
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 700 }}>
              {progress.connected_services || 0}/{progress.total_services || 0}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Services
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" sx={{ color: '#8b5cf6', fontWeight: 700 }}>
              {Math.round((completed / total) * 100)}%
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Efficiency
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

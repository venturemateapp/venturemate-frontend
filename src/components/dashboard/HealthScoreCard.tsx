import { Box, Card, CardContent, Typography, Tooltip, LinearProgress } from '@mui/material';
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface HealthScoreCardProps {
  score: number;
  previousScore?: number;
}

const getScoreColor = (score: number): string => {
  if (score <= 30) return '#ef4444'; // Red
  if (score <= 60) return '#eab308'; // Yellow
  if (score <= 80) return '#22c55e'; // Light Green
  return '#15803d'; // Dark Green
};

const getScoreLabel = (score: number): string => {
  if (score <= 30) return 'Critical attention needed';
  if (score <= 60) return 'On track but room for improvement';
  if (score <= 80) return 'Good progress';
  return 'Investment ready!';
};

export function HealthScoreCard({ score, previousScore }: HealthScoreCardProps) {
  const scoreColor = getScoreColor(score);
  const trend = previousScore ? score - previousScore : 0;
  const isPhase1 = score <= 30; // Phase 1 placeholder

  const scoreContent = (
    <Card
      sx={{
        height: '100%',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
          Health Score
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
          {/* Circular Progress */}
          <Box sx={{ position: 'relative', width: 120, height: 120 }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={scoreColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 50}` }}
                animate={{ strokeDashoffset: `${2 * Math.PI * 50 * (1 - score / 100)}` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
              />
            </svg>
            {/* Score text */}
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
              <Typography
                variant="h3"
                sx={{
                  color: scoreColor,
                  fontWeight: 700,
                  fontSize: '2rem',
                }}
              >
                {score}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}>
                / 100
              </Typography>
            </Box>
          </Box>

          {/* Score details */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body1"
              sx={{
                color: scoreColor,
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              {getScoreLabel(score)}
            </Typography>

            {trend !== 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                {trend > 0 ? (
                  <TrendingUp sx={{ color: '#22c55e', fontSize: 16 }} />
                ) : trend < 0 ? (
                  <TrendingDown sx={{ color: '#ef4444', fontSize: 16 }} />
                ) : (
                  <Remove sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }} />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    color: trend > 0 ? '#22c55e' : trend < 0 ? '#ef4444' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {trend > 0 ? `+${trend}` : trend} points
                </Typography>
              </Box>
            )}

            {isPhase1 && (
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block' }}>
                Full health score coming in Phase 3
              </Typography>
            )}
          </Box>
        </Box>

        {/* Score breakdown bars */}
        <Box sx={{ mt: 'auto', pt: 2 }}>
          {[
            { label: 'Compliance', value: score * 0.6 },
            { label: 'Progress', value: score * 0.4 },
            { label: 'Documentation', value: score * 0.3 },
          ].map((item) => (
            <Box key={item.label} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  {item.label}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  {Math.round(item.value)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={item.value}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: scoreColor,
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  if (isPhase1) {
    return (
      <Tooltip title="Health Score is in development. Currently showing placeholder value based on milestone progress.">
        {scoreContent}
      </Tooltip>
    );
  }

  return scoreContent;
}

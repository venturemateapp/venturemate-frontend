import { useState, useEffect } from 'react';
import { GradientButton } from '@/components/GradientButton';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  LinearProgress,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Business as BusinessIcon,
  AccountBalance as FinanceIcon,
  People as PeopleIcon,
  Gavel as ComplianceIcon,
  Language as WebIcon,
  Lightbulb as LightbulbIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { healthApi } from '@/lib/api/client';
import type { StartupHealthScore, HealthRecommendation, PriorityAction } from '@/types';

const componentIcons: Record<string, any> = {
  compliance: ComplianceIcon,
  revenue_viability: FinanceIcon,
  market_fit: LightbulbIcon,
  team_structure: PeopleIcon,
  financial_sustainability: BusinessIcon,
  digital_presence: WebIcon,
};

const componentLabels: Record<string, string> = {
  compliance: 'Compliance',
  revenue_viability: 'Revenue Viability',
  market_fit: 'Market Fit',
  team_structure: 'Team Structure',
  financial_sustainability: 'Financial Sustainability',
  digital_presence: 'Digital Presence',
};

export default function HealthScorePage() {
  const [healthScore, setHealthScore] = useState<StartupHealthScore | null>(null);
  const [recommendations, setRecommendations] = useState<HealthRecommendation[]>([]);
  const [priorityActions, setPriorityActions] = useState<PriorityAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [scoreData, recsData] = await Promise.all([
        healthApi.getHealthScore(),
        healthApi.getRecommendations(),
      ]);
      setHealthScore(scoreData.data);
      setRecommendations(recsData.data || []);
      setPriorityActions(scoreData.data?.priority_actions || []);
    } catch (error) {
      console.error('Failed to load health score:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    try {
      setCalculating(true);
      await healthApi.calculateHealthScore();
      await loadData();
    } catch (error) {
      console.error('Failed to calculate health score:', error);
    } finally {
      setCalculating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'success' };
    if (score >= 60) return { label: 'Good', color: 'warning' };
    if (score >= 40) return { label: 'Needs Work', color: 'warning' };
    return { label: 'Critical', color: 'error' };
  };

  const renderScoreGauge = (scoreValue: number) => {
    const percentage = scoreValue;
    const color = getScoreColor(scoreValue);
    
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={220}
          thickness={6}
          color={color as any}
        />
        <Box sx={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Typography variant="h1" fontWeight={700}>{scoreValue}</Typography>
          <Typography variant="h5" color={`${color}.main`}>
            {getScoreStatus(scoreValue).label}
          </Typography>
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LinearProgress />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Startup Health Score™
        </Typography>
        <Typography color="text.secondary">
          Track your startup's overall health and get personalized recommendations
        </Typography>
      </Box>

      {healthScore && (
        <Grid container spacing={3}>
          {/* Main Score */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <Typography variant="h6" gutterBottom>Overall Health Score</Typography>
              {renderScoreGauge(healthScore.overall_score)}
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Your startup is performing
                </Typography>
                <Chip
                  label={getScoreStatus(healthScore.overall_score).label}
                  color={getScoreStatus(healthScore.overall_score).color as any}
                  sx={{ fontSize: '1rem', py: 1 }}
                />
              </Box>

              <GradientButton
                variant="outline"
                size="md"
                sx={{ mt: 3 }}
                onClick={handleCalculate}
                disabled={calculating}
                startIcon={calculating ? <CircularProgress size={16} /> : null}
              >
                {calculating ? 'Calculating...' : 'Recalculate Score'}
              </GradientButton>
            </Paper>
          </Grid>

          {/* Component Breakdown */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Score Breakdown</Typography>
              
              {healthScore.components && Object.entries(healthScore.components).map(([key, component]) => {
                const Icon = componentIcons[key] || BusinessIcon;
                return (
                  <Box key={key} sx={{ mb: 3 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Icon color={component.score >= 60 ? 'success' : 'warning'} />
                      <Typography fontWeight={500} sx={{ flex: 1 }}>
                        {componentLabels[key] || key}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {component.score}/{component.max_score}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(component.score / component.max_score) * 100}
                      sx={{ height: 10, borderRadius: 5 }}
                      color={component.score >= 80 ? 'success' : component.score >= 60 ? 'warning' : 'error'}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {component.status === 'excellent' ? 'Excellent' : 
                       component.status === 'good' ? 'Good' :
                       component.status === 'needs_work' ? 'Needs Work' : 'Critical'}
                    </Typography>
                  </Box>
                );
              })}
            </Paper>
          </Grid>

          {/* Priority Actions */}
          {priorityActions.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Priority Actions</Typography>
                <Grid container spacing={2}>
                  {priorityActions.map((action) => (
                    <Grid size={{ xs: 12, md: 6 }} key={action.action_id}>
                      <Alert 
                        severity={action.urgency === 'urgent' ? 'error' : action.urgency === 'high' ? 'warning' : 'info'}
                        sx={{ height: '100%' }}
                        action={
                          <GradientButton variant="ghost" size="sm" endIcon={<ArrowIcon />}>
                            Act
                          </GradientButton>
                        }
                      >
                        <AlertTitle>{action.title}</AlertTitle>
                        {action.description}
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Est. time: {action.estimated_time}
                        </Typography>
                      </Alert>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Smart Recommendations</Typography>
                <List>
                  {recommendations.map((rec, idx) => (
                    <ListItem key={idx} sx={{ bgcolor: 'grey.50', mb: 1, borderRadius: 2 }}>
                      <ListItemIcon>
                        {rec.impact === 'high' ? (
                          <TrendingUpIcon color="success" />
                        ) : rec.impact === 'medium' ? (
                          <CheckCircleIcon color="info" />
                        ) : (
                          <LightbulbIcon color="warning" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={rec.title}
                        secondary={rec.description}
                      />
                      <Box display="flex" gap={1}>
                        <Chip 
                          label={rec.impact} 
                          size="small" 
                          color={rec.impact === 'high' ? 'success' : 'default'}
                        />
                        <Chip 
                          label={rec.effort} 
                          size="small" 
                          variant="outlined"
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}

          {/* Insights */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Health Insights</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography fontWeight={500}>Strengths</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Your compliance and digital presence are strong areas
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <WarningIcon color="warning" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography fontWeight={500}>Opportunities</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Focus on building your team structure and revenue model
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <LightbulbIcon color="info" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography fontWeight={500}>Next Steps</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Complete your business plan and pitch deck for better scores
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </DashboardLayout>
  );
}

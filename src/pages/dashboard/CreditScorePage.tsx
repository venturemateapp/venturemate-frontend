import { useState, useEffect } from 'react';
import { GradientButton } from '@/components/GradientButton';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  AccountBalance as BankIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { creditApi } from '@/lib/api/client';
import type { CreditScore, CreditScoreHistory, FinancingOffer, FinancingApplication } from '@/types';

export default function CreditScorePage() {
  const [activeTab, setActiveTab] = useState(0);
  
  const [score, setScore] = useState<CreditScore | null>(null);
  const [history, setHistory] = useState<CreditScoreHistory[]>([]);
  const [offers, setOffers] = useState<FinancingOffer[]>([]);
  const [applications, setApplications] = useState<FinancingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [scoreData, historyData, offersData, applicationsData] = await Promise.all([
        creditApi.getCreditScore(),
        creditApi.getScoreHistory(),
        creditApi.getFinancingOffers(),
        creditApi.getApplications(),
      ]);
      setScore(scoreData.data);
      setHistory(historyData.data || []);
      setOffers(offersData.data || []);
      setApplications(applicationsData.data || []);
    } catch (error) {
      console.error('Failed to load credit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateScore = async () => {
    try {
      setCalculating(true);
      await creditApi.calculateScore(true);
      await loadData();
    } catch (error) {
      console.error('Failed to calculate score:', error);
    } finally {
      setCalculating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'success';
    if (score >= 650) return 'warning';
    if (score >= 500) return 'info';
    return 'error';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 800) return 'A';
    if (score >= 700) return 'B';
    if (score >= 600) return 'C';
    if (score >= 500) return 'D';
    return 'F';
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'low': return { label: 'Low Risk', color: 'success' };
      case 'moderate': return { label: 'Moderate Risk', color: 'warning' };
      case 'high': return { label: 'High Risk', color: 'error' };
      default: return { label: 'Very High Risk', color: 'error' };
    }
  };

  const renderScoreGauge = (scoreValue: number) => {
    const percentage = Math.min((scoreValue / 850) * 100, 100);
    const color = getScoreColor(scoreValue);
    
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={200}
          thickness={8}
          color={color as any}
        />
        <Box sx={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Typography variant="h2" fontWeight={700}>{scoreValue}</Typography>
          <Typography variant="h4" color={`${color}.main`}>{getScoreGrade(scoreValue)}</Typography>
        </Box>
      </Box>
    );
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Credit Score & Financing
        </Typography>
        <Typography color="text.secondary">
          Monitor your startup creditworthiness and access financing options
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Credit Score" />
          <Tab label="Financing Offers" />
          <Tab label="Applications" />
        </Tabs>
      </Paper>

      {loading ? (
        <LinearProgress />
      ) : (
        <>
          {activeTab === 0 && score && (
            <Grid container spacing={3}>
              {/* Main Score Card */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>Your Startup Credit Score</Typography>
                  {renderScoreGauge(score.overall_score)}
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={getRiskLabel(score.risk_level).label}
                      color={getRiskLabel(score.risk_level).color as any}
                      sx={{ fontSize: '1rem', py: 1 }}
                    />
                  </Box>
                  {score.suggested_credit_limit && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Suggested Credit Limit
                      </Typography>
                      <Typography variant="h5" fontWeight={600}>
                        ${score.suggested_credit_limit.toLocaleString()}
                      </Typography>
                    </Box>
                  )}
                  <GradientButton
                    variant="outline"
                    size="md"
                    sx={{ mt: 3 }}
                    onClick={handleCalculateScore}
                    disabled={calculating}
                  >
                    {calculating ? 'Calculating...' : 'Recalculate Score'}
                  </GradientButton>
                </Paper>
              </Grid>

              {/* Component Scores */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Score Components</Typography>
                  {[
                    { label: 'Payment History', score: score.payment_history_score, weight: 25 },
                    { label: 'Financial Stability', score: score.financial_stability_score, weight: 25 },
                    { label: 'Business Viability', score: score.business_viability_score, weight: 20 },
                    { label: 'Compliance', score: score.compliance_score, weight: 15 },
                    { label: 'Market Position', score: score.market_position_score, weight: 15 },
                  ].map((component) => (
                    <Box key={component.label} sx={{ mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2">{component.label}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {component.score}/100 ({component.weight}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={component.score}
                        sx={{ height: 8, borderRadius: 4 }}
                        color={component.score >= 70 ? 'success' : component.score >= 50 ? 'warning' : 'error'}
                      />
                    </Box>
                  ))}
                </Paper>
              </Grid>

              {/* Score History */}
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Score History</Typography>
                  {history.length > 0 ? (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Score</TableCell>
                            <TableCell>Grade</TableCell>
                            <TableCell>Change</TableCell>
                            <TableCell>Reason</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {history.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>{new Date(record.recorded_at).toLocaleDateString()}</TableCell>
                              <TableCell sx={{ fontWeight: 500 }}>{record.score}</TableCell>
                              <TableCell>
                                <Chip label={record.score_grade} size="small" />
                              </TableCell>
                              <TableCell>
                                {record.change_from_previous > 0 ? (
                                  <Box display="flex" alignItems="center" color="success.main">
                                    <TrendingUpIcon fontSize="small" />
                                    +{record.change_from_previous}
                                  </Box>
                                ) : record.change_from_previous < 0 ? (
                                  <Box display="flex" alignItems="center" color="error.main">
                                    <TrendingDownIcon fontSize="small" />
                                    {record.change_from_previous}
                                  </Box>
                                ) : (
                                  <Box display="flex" alignItems="center" color="text.secondary">
                                    <TrendingFlatIcon fontSize="small" />
                                    0
                                  </Box>
                                )}
                              </TableCell>
                              <TableCell>{record.reason || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="text.secondary">No history available yet.</Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <>
              <Alert severity="info" sx={{ mb: 3 }}>
                Based on your credit score of {score?.overall_score || 0}, here are financing options available to you.
              </Alert>
              <Grid container spacing={3}>
                {offers.map((offer) => (
                  <Grid size={{ xs: 12, md: 6 }} key={offer.id}>
                    <Card>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                          <Box>
                            <Typography variant="h6">{offer.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {offer.provider_name}
                            </Typography>
                          </Box>
                          <Chip label={offer.offer_type} size="small" color="primary" />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {offer.description}
                        </Typography>
                        
                        <Box display="flex" gap={3} mb={2}>
                          <Box>
                            <Typography variant="h6" color="primary">
                              ${offer.max_amount?.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Max Amount
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="h6">
                              {offer.interest_rate_min || 0}%-{offer.interest_rate_max || 0}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Interest Rate
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="h6">
                              {offer.term_months_min || 0}-{offer.term_months_max || 0} mo
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Term
                            </Typography>
                          </Box>
                        </Box>

                        <GradientButton
                          variant="contained"
                          size="md"
                          animated
                          fullWidth
                        >
                          Apply Now
                        </GradientButton>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {activeTab === 2 && (
            <>
              {applications.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <BankIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>No Applications Yet</Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Browse financing offers and apply for funding to grow your startup
                  </Typography>
                  <GradientButton variant="contained" size="md" animated onClick={() => setActiveTab(1)}>
                    View Financing Offers
                  </GradientButton>
                </Paper>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Provider</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Submitted</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell>Provider</TableCell>
                          <TableCell>Loan</TableCell>
                          <TableCell sx={{ fontWeight: 500 }}>
                            ${app.requested_amount?.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={app.status}
                              size="small"
                              color={app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'error' : 'warning'}
                            />
                          </TableCell>
                          <TableCell>
                            {app.submitted_at 
                              ? new Date(app.submitted_at).toLocaleDateString()
                              : 'Not submitted'
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

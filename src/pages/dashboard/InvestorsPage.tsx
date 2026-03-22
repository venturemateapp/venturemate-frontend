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
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Send as SendIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { investorApi } from '@/lib/api/client';
import type { InvestorMatch, DataRoom, MatchmakingStats } from '@/types';

export default function InvestorsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState<MatchmakingStats | null>(null);
  const [matches, setMatches] = useState<InvestorMatch[]>([]);
  const [dataRooms, setDataRooms] = useState<DataRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<InvestorMatch | null>(null);
  const [openPitchDialog, setOpenPitchDialog] = useState(false);
  const [openDataRoomDialog, setOpenDataRoomDialog] = useState(false);
  const [pitchMessage, setPitchMessage] = useState('');
  const [newDataRoom, setNewDataRoom] = useState({
    name: '',
    description: '',
    is_public: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, matchesData, dataRoomsData] = await Promise.all([
        investorApi.getStats(),
        investorApi.getMatches(),
        investorApi.getDataRooms(),
      ]);
      setStats(statsData);
      setMatches(matchesData.data || []);
      setDataRooms(dataRoomsData.data || []);
    } catch (error) {
      console.error('Failed to load investor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPitch = async () => {
    if (!selectedMatch) return;
    try {
      await investorApi.submitPitch(selectedMatch.id, { pitch_message: pitchMessage });
      setOpenPitchDialog(false);
      setPitchMessage('');
      setSelectedMatch(null);
      loadData();
    } catch (error) {
      console.error('Failed to submit pitch:', error);
    }
  };

  const handleCreateDataRoom = async () => {
    try {
      await investorApi.createDataRoom(newDataRoom);
      setOpenDataRoomDialog(false);
      setNewDataRoom({ name: '', description: '', is_public: false });
      loadData();
    } catch (error) {
      console.error('Failed to create data room:', error);
    }
  };

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case 'invested': return 'success';
      case 'connected':
      case 'pitched': return 'primary';
      case 'interested': return 'info';
      case 'passed': return 'error';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Investor Matchmaking
        </Typography>
        <Typography color="text.secondary">
          Connect with investors matched to your startup profile
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Total Investors</Typography>
              <Typography variant="h4" fontWeight={600}>{stats?.total_investors || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Your Matches</Typography>
              <Typography variant="h4" fontWeight={600}>{stats?.matched_investors || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Interested</Typography>
              <Typography variant="h4" fontWeight={600} color="success">
                {stats?.interested_investors || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Meetings</Typography>
              <Typography variant="h4" fontWeight={600}>
                {stats?.meetings_scheduled || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label={`Matches (${matches.length})`} />
          <Tab label="Data Rooms" />
          <Tab label="Pitch Progress" />
        </Tabs>
      </Paper>

      {loading ? (
        <LinearProgress />
      ) : (
        <>
          {activeTab === 0 && (
            <Grid container spacing={3}>
              {matches.map((match) => (
                <Grid size={{ xs: 12, md: 6 }} key={match.id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ width: 56, height: 56 }}>
                            {(match as any).investor?.firm_name?.[0] || 'I'}
                          </Avatar>
                          <Box>
                            <Typography variant="h6">
                              {(match as any).investor?.firm_name || 'Unknown Investor'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {(match as any).investor?.investor_type}
                            </Typography>
                          </Box>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="h4" color="primary" fontWeight={700}>
                            {match.match_score}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Match Score
                          </Typography>
                        </Box>
                      </Box>

                      <Box mb={2}>
                        {match.match_reasons?.map((reason, idx) => (
                          <Chip
                            key={idx}
                            label={reason}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>

                      {(match as any).investor?.check_size_range && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>Check Size:</strong> {(match as any).investor.check_size_range}
                        </Typography>
                      )}

                      {(match as any).investor?.investment_stage && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          <strong>Stages:</strong> {(match as any).investor.investment_stage.join(', ')}
                        </Typography>
                      )}

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Chip
                          label={match.status}
                          color={getMatchStatusColor(match.status) as any}
                        />
                        {match.status === 'pending' && (
                          <GradientButton
                            variant="contained"
                            size="md"
                            animated
                            startIcon={<SendIcon />}
                            onClick={() => {
                              setSelectedMatch(match);
                              setOpenPitchDialog(true);
                            }}
                          >
                            Send Pitch
                          </GradientButton>
                        )}
                        {match.status === 'pitched' && (
                          <Typography variant="caption" color="text.secondary">
                            Awaiting response...
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {activeTab === 1 && (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Your Data Rooms</Typography>
                <GradientButton
                  variant="contained"
                  size="md"
                  animated
                  startIcon={<FolderIcon />}
                  onClick={() => setOpenDataRoomDialog(true)}
                >
                  Create Data Room
                </GradientButton>
              </Box>
              <Grid container spacing={3}>
                {dataRooms.map((room) => (
                  <Grid size={{ xs: 12, md: 6 }} key={room.id}>
                    <Card>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                          <Typography variant="h6">{room.name}</Typography>
                          <Chip
                            label={room.is_public ? 'Public' : 'Private'}
                            size="small"
                            color={room.is_public ? 'success' : 'default'}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {room.description || 'No description'}
                        </Typography>
                        <Box display="flex" gap={3}>
                          <Box>
                            <Typography variant="h6">{(room as any).document_count || 0}</Typography>
                            <Typography variant="caption" color="text.secondary">Documents</Typography>
                          </Box>
                          <Box>
                            <Typography variant="h6">{room.view_count}</Typography>
                            <Typography variant="caption" color="text.secondary">Views</Typography>
                          </Box>
                          <Box>
                            <Typography variant="h6">{room.download_count}</Typography>
                            <Typography variant="caption" color="text.secondary">Downloads</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {activeTab === 2 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Your Fundraising Journey</Typography>
              <Stepper activeStep={1} orientation="vertical" sx={{ mt: 3 }}>
                <Step completed>
                  <StepLabel>
                    <Typography fontWeight={500}>Profile Created</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Your startup profile is complete and visible to investors
                    </Typography>
                  </StepLabel>
                </Step>
                <Step active>
                  <StepLabel>
                    <Typography fontWeight={500}>Investor Matching</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {matches.length} investors matched to your profile
                    </Typography>
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel>
                    <Typography fontWeight={500}>Pitch Submitted</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Send your pitch to interested investors
                    </Typography>
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel>
                    <Typography fontWeight={500}>Due Diligence</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Share your data room with interested investors
                    </Typography>
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel>
                    <Typography fontWeight={500}>Term Sheet</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Negotiate and finalize investment terms
                    </Typography>
                  </StepLabel>
                </Step>
              </Stepper>
            </Paper>
          )}
        </>
      )}

      {/* Pitch Dialog */}
      <Dialog open={openPitchDialog} onClose={() => setOpenPitchDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Send Pitch to {(selectedMatch as any)?.investor?.firm_name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Craft a compelling pitch message. Highlight your traction, team, and what makes your startup unique.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            label="Your Pitch"
            value={pitchMessage}
            onChange={(e) => setPitchMessage(e.target.value)}
            placeholder="Hi, I'm reaching out about our startup..."
          />
        </DialogContent>
        <DialogActions>
          <GradientButton variant="outline" size="md" onClick={() => setOpenPitchDialog(false)}>Cancel</GradientButton>
          <GradientButton
            variant="contained"
            size="md"
            animated
            startIcon={<SendIcon />}
            onClick={handleSubmitPitch}
            disabled={!pitchMessage.trim()}
          >
            Send Pitch
          </GradientButton>
        </DialogActions>
      </Dialog>

      {/* Create Data Room Dialog */}
      <Dialog open={openDataRoomDialog} onClose={() => setOpenDataRoomDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Data Room</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={newDataRoom.name}
            onChange={(e) => setNewDataRoom({ ...newDataRoom, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={newDataRoom.description}
            onChange={(e) => setNewDataRoom({ ...newDataRoom, description: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <GradientButton variant="outline" size="md" onClick={() => setOpenDataRoomDialog(false)}>Cancel</GradientButton>
          <GradientButton variant="contained" size="md" animated onClick={handleCreateDataRoom}>
            Create
          </GradientButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

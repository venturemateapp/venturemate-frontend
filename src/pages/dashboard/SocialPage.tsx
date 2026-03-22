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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Avatar,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Facebook as FacebookIcon,
  SmartToy as AiIcon,
  Send as SendIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { socialApi } from '@/lib/api/client';
import type { SocialMediaAccount, ContentCalendarItem, SocialDashboard } from '@/types';

const platforms = [
  { key: 'instagram', name: 'Instagram', icon: InstagramIcon, color: '#E4405F' },
  { key: 'twitter', name: 'Twitter', icon: TwitterIcon, color: '#1DA1F2' },
  { key: 'linkedin', name: 'LinkedIn', icon: LinkedInIcon, color: '#0A66C2' },
  { key: 'facebook', name: 'Facebook', icon: FacebookIcon, color: '#1877F2' },
];

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [dashboard, setDashboard] = useState<SocialDashboard | null>(null);
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([]);
  const [content, setContent] = useState<ContentCalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openConnectDialog, setOpenConnectDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openAiDialog, setOpenAiDialog] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [newPost, setNewPost] = useState({
    content_type: 'post',
    topic: '',
    content: '',
  });
  const [aiGenerated, setAiGenerated] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashboardData, accountsData, contentData] = await Promise.all([
        socialApi.getDashboard(),
        socialApi.getAccounts(),
        socialApi.getContentCalendar(),
      ]);
      setDashboard(dashboardData);
      setAccounts(accountsData.data || []);
      setContent(contentData.data || []);
    } catch (error) {
      console.error('Failed to load social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAccount = async () => {
    try {
      await socialApi.connectAccount({
        platform: selectedPlatform,
        auth_code: 'demo_auth_code',
        redirect_uri: window.location.origin,
      });
      setOpenConnectDialog(false);
      loadData();
    } catch (error) {
      console.error('Failed to connect account:', error);
    }
  };

  const handleGenerateAiContent = async () => {
    try {
      setGenerating(true);
      const result = await socialApi.generateAiContent({
        content_type: newPost.content_type,
        topic: newPost.topic,
        tone: 'professional',
      });
      setAiGenerated(result);
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      await socialApi.createContent({
        content_type: newPost.content_type,
        topic: newPost.topic,
        ai_generate: false,
      });
      setOpenCreateDialog(false);
      setNewPost({ content_type: 'post', topic: '', content: '' });
      loadData();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const p = platforms.find(p => p.key === platform);
    return p ? <p.icon sx={{ color: p.color }} /> : null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'scheduled': return 'primary';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Social Media
        </Typography>
        <Typography color="text.secondary">
          Manage your social presence and content calendar
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Connected Accounts</Typography>
              <Typography variant="h4" fontWeight={600}>{dashboard?.total_accounts || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Total Followers</Typography>
              <Typography variant="h4" fontWeight={600}>
                {(dashboard?.total_followers || 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Scheduled</Typography>
              <Typography variant="h4" fontWeight={600}>{dashboard?.scheduled_posts || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Published</Typography>
              <Typography variant="h4" fontWeight={600}>{dashboard?.published_posts || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Accounts" />
          <Tab label="Content Calendar" />
          <Tab label="AI Generator" />
        </Tabs>
      </Paper>

      {loading ? (
        <LinearProgress />
      ) : (
        <>
          {activeTab === 0 && (
            <Grid container spacing={3}>
              {platforms.map((platform) => {
                const connected = accounts.find(a => a.platform === platform.key);
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={platform.key}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: connected ? `2px solid ${platform.color}` : '1px solid',
                        borderColor: connected ? platform.color : 'divider',
                      }}
                      onClick={() => {
                        if (!connected) {
                          setSelectedPlatform(platform.key);
                          setOpenConnectDialog(true);
                        }
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar sx={{ bgcolor: platform.color, width: 56, height: 56, mx: 'auto', mb: 2 }}>
                          <platform.icon sx={{ color: 'white' }} />
                        </Avatar>
                        <Typography variant="h6" gutterBottom>{platform.name}</Typography>
                        {connected ? (
                          <>
                            <Chip 
                              label="Connected" 
                              color="success" 
                              size="small"
                              sx={{ mb: 1 }}
                            />
                            <Typography variant="caption" display="block" color="text.secondary">
                              @{connected.account_handle || 'account'}
                            </Typography>
                            {connected.follower_count !== undefined && (
                              <Typography variant="body2" fontWeight={500}>
                                {connected.follower_count.toLocaleString()} followers
                              </Typography>
                            )}
                          </>
                        ) : (
                          <GradientButton variant="outline" size="sm">
                            Connect
                          </GradientButton>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}

          {activeTab === 1 && (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <ToggleButtonGroup size="small" value="all">
                  <ToggleButton value="all">All</ToggleButton>
                  <ToggleButton value="draft">Drafts</ToggleButton>
                  <ToggleButton value="scheduled">Scheduled</ToggleButton>
                  <ToggleButton value="published">Published</ToggleButton>
                </ToggleButtonGroup>
                <GradientButton
                  variant="contained"
                  size="md"
                  animated
                  startIcon={<AiIcon />}
                  onClick={() => setOpenAiDialog(true)}
                >
                  AI Generate
                </GradientButton>
              </Box>
              <Grid container spacing={2}>
                {content.map((item) => (
                  <Grid size={{ xs: 12, md: 6 }} key={item.id}>
                    <Paper sx={{ p: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getPlatformIcon(item.social_account_id || 'instagram')}
                          <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                            {item.content_type}
                          </Typography>
                        </Box>
                        <Chip 
                          label={item.status} 
                          size="small"
                          color={getStatusColor(item.status) as any}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {item.content || item.title || 'No content'}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          {item.scheduled_at 
                            ? `Scheduled for ${new Date(item.scheduled_at).toLocaleDateString()}`
                            : 'Not scheduled'
                          }
                        </Typography>
                        <Box>
                          {item.status === 'draft' && (
                            <IconButton size="small" color="primary">
                              <SendIcon />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              <Fab
                color="primary"
                sx={{ position: 'fixed', bottom: 24, right: 24 }}
                onClick={() => setOpenCreateDialog(true)}
              >
                <AddIcon />
              </Fab>
            </>
          )}

          {activeTab === 2 && (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <AutoAwesomeIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>AI Content Generator</Typography>
              <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                Generate engaging social media content tailored to your brand voice. 
                Our AI can create posts, suggest hashtags, and recommend optimal posting times.
              </Typography>
              <GradientButton
                variant="contained"
                size="md"
                animated
                startIcon={<AiIcon />}
                onClick={() => setOpenAiDialog(true)}
              >
                Generate Content
              </GradientButton>
            </Paper>
          )}
        </>
      )}

      {/* Connect Account Dialog */}
      <Dialog open={openConnectDialog} onClose={() => setOpenConnectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Connect {selectedPlatform} Account</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Connect your {selectedPlatform} account to start posting and scheduling content.
            You will be redirected to authorize VentureMate.
          </Typography>
        </DialogContent>
        <DialogActions>
          <GradientButton variant="outline" size="md" onClick={() => setOpenConnectDialog(false)}>Cancel</GradientButton>
          <GradientButton variant="contained" size="md" animated onClick={handleConnectAccount}>
            Connect Account
          </GradientButton>
        </DialogActions>
      </Dialog>

      {/* Create Post Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="Content Type"
            value={newPost.content_type}
            onChange={(e) => setNewPost({ ...newPost, content_type: e.target.value })}
            margin="normal"
          >
            <MenuItem value="post">Post</MenuItem>
            <MenuItem value="story">Story</MenuItem>
            <MenuItem value="reel">Reel</MenuItem>
            <MenuItem value="thread">Thread</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Topic"
            value={newPost.topic}
            onChange={(e) => setNewPost({ ...newPost, topic: e.target.value })}
            margin="normal"
            placeholder="What is this post about?"
          />
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={4}
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <GradientButton variant="outline" size="md" onClick={() => setOpenCreateDialog(false)}>Cancel</GradientButton>
          <GradientButton variant="contained" size="md" animated onClick={handleCreatePost}>
            Create Draft
          </GradientButton>
        </DialogActions>
      </Dialog>

      {/* AI Generate Dialog */}
      <Dialog open={openAiDialog} onClose={() => setOpenAiDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <AutoAwesomeIcon color="primary" />
            AI Content Generator
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="Content Type"
            value={newPost.content_type}
            onChange={(e) => setNewPost({ ...newPost, content_type: e.target.value })}
            margin="normal"
          >
            <MenuItem value="post">Post</MenuItem>
            <MenuItem value="story">Story</MenuItem>
            <MenuItem value="reel">Reel</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Topic or Theme"
            value={newPost.topic}
            onChange={(e) => setNewPost({ ...newPost, topic: e.target.value })}
            margin="normal"
            placeholder="e.g., Product launch announcement, Customer testimonial, Industry insights"
          />
          <GradientButton
            variant="contained"
            size="md"
            animated
            fullWidth
            startIcon={generating ? <CircularProgress size={20} /> : <AiIcon />}
            onClick={handleGenerateAiContent}
            disabled={generating || !newPost.topic}
            sx={{ mt: 2 }}
          >
            {generating ? 'Generating...' : 'Generate Content'}
          </GradientButton>
          
          {aiGenerated && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Generated Content:</Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                {aiGenerated.content}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Hashtags: {aiGenerated.hashtags?.join(' ')}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Best posting time: {aiGenerated.best_posting_time}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Predicted engagement: {aiGenerated.predicted_engagement}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <GradientButton variant="outline" size="md" onClick={() => setOpenAiDialog(false)}>Close</GradientButton>
          {aiGenerated && (
            <GradientButton variant="contained" size="md" animated onClick={handleCreatePost}>
              Save to Calendar
            </GradientButton>
          )}
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

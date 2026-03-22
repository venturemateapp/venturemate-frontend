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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Fab,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { crmApi } from '@/lib/api/client';
import type { Contact, Deal, CrmDashboardStats } from '@/types';

const contactTypes = [
  { value: 'lead', label: 'Lead' },
  { value: 'customer', label: 'Customer' },
  { value: 'partner', label: 'Partner' },
  { value: 'investor', label: 'Investor' },
];

const dealStages = [
  { value: 'prospecting', label: 'Prospecting', color: 'default' },
  { value: 'qualification', label: 'Qualification', color: 'info' },
  { value: 'proposal', label: 'Proposal', color: 'warning' },
  { value: 'negotiation', label: 'Negotiation', color: 'primary' },
  { value: 'closed_won', label: 'Closed Won', color: 'success' },
  { value: 'closed_lost', label: 'Closed Lost', color: 'error' },
];

export default function CrmPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState<CrmDashboardStats | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [_activities, setActivities] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [openDealDialog, setOpenDealDialog] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    job_title: '',
    contact_type: 'lead',
    source: '',
    notes: '',
  });
  const [newDeal, setNewDeal] = useState({
    title: '',
    contact_id: '',
    value: 0,
    currency: 'USD',
    stage: 'prospecting',
    probability: 10,
    expected_close_date: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, contactsData, dealsData, activitiesData] = await Promise.all([
        crmApi.getDashboard(),
        crmApi.getContacts(),
        crmApi.getDeals(),
        crmApi.getActivities(),
      ]);
      setStats(statsData);
      setContacts(contactsData.data || []);
      setDeals(dealsData.data || []);
      setActivities(activitiesData.data || []);
      
    } catch (error) {
      console.error('Failed to load CRM data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = async () => {
    try {
      await crmApi.createContact(newContact);
      setOpenContactDialog(false);
      setNewContact({
        name: '',
        email: '',
        phone: '',
        company: '',
        job_title: '',
        contact_type: 'lead',
        source: '',
        notes: '',
      });
      loadData();
    } catch (error) {
      console.error('Failed to create contact:', error);
    }
  };

  const handleCreateDeal = async () => {
    try {
      await crmApi.createDeal(newDeal);
      setOpenDealDialog(false);
      setNewDeal({
        title: '',
        contact_id: '',
        value: 0,
        currency: 'USD',
        stage: 'prospecting',
        probability: 10,
        expected_close_date: '',
      });
      loadData();
    } catch (error) {
      console.error('Failed to create deal:', error);
    }
  };

  const getStageColor = (stage: string) => {
    const stageConfig = dealStages.find(s => s.value === stage);
    return stageConfig?.color || 'default';
  };

  const renderDashboard = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <PeopleIcon color="primary" />
              <Typography color="text.secondary" variant="body2">Total Contacts</Typography>
            </Box>
            <Typography variant="h3">{stats?.total_contacts || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <BusinessIcon color="success" />
              <Typography color="text.secondary" variant="body2">Active Deals</Typography>
            </Box>
            <Typography variant="h3">{stats?.total_deals || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <TrendingUpIcon color="warning" />
              <Typography color="text.secondary" variant="body2">Pipeline Value</Typography>
            </Box>
            <Typography variant="h3">
              ${(stats?.total_pipeline_value || 0).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <CheckCircleIcon color="info" />
              <Typography color="text.secondary" variant="body2">Win Rate</Typography>
            </Box>
            <Typography variant="h3">--%</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Pipeline by Stage */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Pipeline by Stage</Typography>
          {stats?.deals_by_stage.map((stage) => (
            <Box key={stage.stage} sx={{ mb: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {stage.stage.replace('_', ' ')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stage.count} deals · ${stage.total_value.toLocaleString()}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min((stage.count / (stats.total_deals || 1)) * 100, 100)}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          ))}
        </Paper>
      </Grid>

      {/* Recent Activities */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Recent Activities</Typography>
          {stats?.recent_activities?.slice(0, 5).map((activity) => (
            <Box key={activity.id} sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" fontWeight={500}>
                {activity.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {activity.activity_type} · {new Date(activity.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );

  const renderContacts = () => (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact Info</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <Typography fontWeight={500}>{contact.name}</Typography>
                </TableCell>
                <TableCell>
                  {contact.email && (
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2">{contact.email}</Typography>
                    </Box>
                  )}
                  {contact.phone && (
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">{contact.phone}</Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  {contact.company && (
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <BusinessIcon fontSize="small" color="action" />
                      <Typography variant="body2">{contact.company}</Typography>
                      {contact.job_title && (
                        <Typography variant="caption" color="text.secondary">
                          ({contact.job_title})
                        </Typography>
                      )}
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={contact.contact_type} 
                    size="small"
                    color={contact.contact_type === 'lead' ? 'warning' : contact.contact_type === 'customer' ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Chip label={contact.status} size="small" variant="outlined" />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small"><EditIcon /></IconButton>
                  <IconButton size="small" color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => setOpenContactDialog(true)}
      >
        <AddIcon />
      </Fab>
    </>
  );

  const renderDeals = () => (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Deal</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Probability</TableCell>
              <TableCell>Expected Close</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell>
                  <Typography fontWeight={500}>{deal.title}</Typography>
                </TableCell>
                <TableCell>
                  {deal.value ? `$${deal.value.toLocaleString()}` : '--'}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={deal.stage.replace('_', ' ')} 
                    size="small"
                    color={getStageColor(deal.stage) as any}
                  />
                </TableCell>
                <TableCell>
                  <LinearProgress 
                    variant="determinate" 
                    value={deal.probability}
                    sx={{ width: 60, height: 6, borderRadius: 3 }}
                  />
                  <Typography variant="caption">{deal.probability}%</Typography>
                </TableCell>
                <TableCell>
                  {deal.expected_close_date 
                    ? new Date(deal.expected_close_date).toLocaleDateString()
                    : '--'
                  }
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small"><EditIcon /></IconButton>
                  <IconButton size="small" color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => setOpenDealDialog(true)}
      >
        <AddIcon />
      </Fab>
    </>
  );

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          CRM
        </Typography>
        <Typography color="text.secondary">
          Manage your contacts, deals, and sales pipeline
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Dashboard" />
          <Tab label={`Contacts (${contacts.length})`} />
          <Tab label={`Deals (${deals.length})`} />
          <Tab label="Activities" />
        </Tabs>
      </Paper>

      {loading ? (
        <LinearProgress />
      ) : (
        <>
          {activeTab === 0 && renderDashboard()}
          {activeTab === 1 && renderContacts()}
          {activeTab === 2 && renderDeals()}
          {activeTab === 3 && (
            <Typography>Activities view coming soon...</Typography>
          )}
        </>
      )}

      {/* New Contact Dialog */}
      <Dialog open={openContactDialog} onClose={() => setOpenContactDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Contact</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newContact.email}
            onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Company"
            value={newContact.company}
            onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Contact Type"
            value={newContact.contact_type}
            onChange={(e) => setNewContact({ ...newContact, contact_type: e.target.value })}
            margin="normal"
          >
            {contactTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
            value={newContact.notes}
            onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <GradientButton variant="outline" size="md" onClick={() => setOpenContactDialog(false)}>Cancel</GradientButton>
          <GradientButton variant="contained" size="md" animated onClick={handleCreateContact}>
            Create Contact
          </GradientButton>
        </DialogActions>
      </Dialog>

      {/* New Deal Dialog */}
      <Dialog open={openDealDialog} onClose={() => setOpenDealDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Deal</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Deal Title"
            value={newDeal.title}
            onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            select
            label="Contact"
            value={newDeal.contact_id}
            onChange={(e) => setNewDeal({ ...newDeal, contact_id: e.target.value })}
            margin="normal"
          >
            {contacts.map((contact) => (
              <MenuItem key={contact.id} value={contact.id}>{contact.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Value"
            type="number"
            value={newDeal.value}
            onChange={(e) => setNewDeal({ ...newDeal, value: Number(e.target.value) })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Stage"
            value={newDeal.stage}
            onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
            margin="normal"
          >
            {dealStages.map((stage) => (
              <MenuItem key={stage.value} value={stage.value}>{stage.label}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Expected Close Date"
            type="date"
            value={newDeal.expected_close_date}
            onChange={(e) => setNewDeal({ ...newDeal, expected_close_date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <GradientButton variant="outline" size="md" onClick={() => setOpenDealDialog(false)}>Cancel</GradientButton>
          <GradientButton variant="contained" size="md" animated onClick={handleCreateDeal}>
            Create Deal
          </GradientButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

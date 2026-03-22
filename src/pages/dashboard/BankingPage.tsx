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
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  AccountBalance as BankIcon,
  Receipt as InvoiceIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { bankingApi } from '@/lib/api/client';
import type { BankAccount, PaymentTransaction, InvoiceItem, BankingDashboard } from '@/types';

export default function BankingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [dashboard, setDashboard] = useState<BankingDashboard | null>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAccountDialog, setOpenAccountDialog] = useState(false);
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [newAccount, setNewAccount] = useState({
    bank_name: '',
    account_type: 'checking',
    account_number: '',
    account_name: '',
    currency: 'USD',
    country_code: 'US',
  });
  const [newInvoice, setNewInvoice] = useState({
    customer_name: '',
    customer_email: '',
    due_date: '',
    line_items: [{ description: '', quantity: 1, unit_price: 0 }],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashboardData, accountsData, transactionsData, invoicesData] = await Promise.all([
        bankingApi.getDashboard(),
        bankingApi.getAccounts(),
        bankingApi.getTransactions(),
        bankingApi.getInvoices(),
      ]);
      setDashboard(dashboardData);
      setAccounts(accountsData.data || []);
      setTransactions(transactionsData.data || []);
      setInvoices(invoicesData.data || []);
    } catch (error) {
      console.error('Failed to load banking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    try {
      await bankingApi.createAccount(newAccount);
      setOpenAccountDialog(false);
      loadData();
    } catch (error) {
      console.error('Failed to create account:', error);
    }
  };

  const handleCreateInvoice = async () => {
    try {
      await bankingApi.createInvoice({
        ...newInvoice,
        due_date: new Date(newInvoice.due_date).toISOString(),
        line_items: newInvoice.line_items.map(item => ({
          ...item,
          unit_price: Math.round(item.unit_price * 100), // Convert to cents
        })),
      });
      setOpenInvoiceDialog(false);
      loadData();
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'success';
      case 'pending':
      case 'sent':
        return 'warning';
      case 'failed':
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Banking & Payments
        </Typography>
        <Typography color="text.secondary">
          Manage accounts, transactions, and invoicing
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Total Balance</Typography>
              <Typography variant="h4" fontWeight={600}>
                ${dashboard?.total_balance?.toLocaleString() || '0'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {dashboard?.currency || 'USD'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Monthly Revenue</Typography>
              <Typography variant="h4" fontWeight={600}>
                ${dashboard?.monthly_revenue?.toLocaleString() || '0'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Pending Invoices</Typography>
              <Typography variant="h4" fontWeight={600}>
                {dashboard?.pending_invoices || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2">Overdue</Typography>
              <Typography variant="h4" fontWeight={600} color="error">
                {dashboard?.overdue_invoices || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Overview" />
          <Tab label={`Accounts (${accounts.length})`} />
          <Tab label={`Transactions (${transactions.length})`} />
          <Tab label={`Invoices (${invoices.length})`} />
        </Tabs>
      </Paper>

      {loading ? (
        <LinearProgress />
      ) : (
        <>
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Connected Accounts</Typography>
                  {accounts.length === 0 ? (
                    <Alert severity="info">No accounts connected yet. Add your first bank account.</Alert>
                  ) : (
                    accounts.map((account) => (
                      <Box key={account.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box display="flex" alignItems="center" gap={1}>
                            <BankIcon color="primary" />
                            <Box>
                              <Typography fontWeight={500}>{account.bank_name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {account.account_type} · ****{account.account_number?.slice(-4)}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography fontWeight={600}>
                            ${account.balance?.toLocaleString() || '0'}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  )}
                  <GradientButton
                    variant="outline"
                    size="md"
                    startIcon={<AddIcon />}
                    fullWidth
                    onClick={() => setOpenAccountDialog(true)}
                    sx={{ mt: 2 }}
                  >
                    Add Account
                  </GradientButton>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
                  {dashboard?.recent_transactions?.slice(0, 5).map((tx) => (
                    <Box key={tx.id} sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">{tx.description || tx.transaction_type}</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {tx.transaction_type === 'incoming' ? '+' : '-'}${tx.amount?.toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Bank</TableCell>
                      <TableCell>Account Type</TableCell>
                      <TableCell>Account Number</TableCell>
                      <TableCell>Balance</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {accounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <BankIcon color="primary" />
                            <Typography fontWeight={500}>{account.bank_name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>{account.account_type}</TableCell>
                        <TableCell>****{account.account_number?.slice(-4)}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>${account.balance?.toLocaleString() || '0'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={account.status} 
                            size="small"
                            color={account.status === 'active' ? 'success' : 'warning'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Fab
                color="primary"
                sx={{ position: 'fixed', bottom: 24, right: 24 }}
                onClick={() => setOpenAccountDialog(true)}
              >
                <AddIcon />
              </Fab>
            </>
          )}

          {activeTab === 2 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{new Date(tx.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{tx.description || tx.reference || '-'}</TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{tx.transaction_type}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {tx.transaction_type === 'incoming' ? '+' : '-'}${tx.amount?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={tx.status} 
                          size="small"
                          color={getStatusColor(tx.status) as any}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 3 && (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Invoice #</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.invoice_number}</TableCell>
                        <TableCell>
                          <Typography fontWeight={500}>{invoice.customer_name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {invoice.customer_email}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>${invoice.amount_total?.toLocaleString()}</TableCell>
                        <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip 
                            label={invoice.status} 
                            size="small"
                            color={getStatusColor(invoice.status) as any}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {invoice.status === 'draft' && (
                            <IconButton size="small" color="primary">
                              <SendIcon />
                            </IconButton>
                          )}
                          {invoice.status === 'sent' && (
                            <IconButton size="small" color="success">
                              <CheckCircleIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Fab
                color="primary"
                sx={{ position: 'fixed', bottom: 24, right: 24 }}
                onClick={() => setOpenInvoiceDialog(true)}
              >
                <InvoiceIcon />
              </Fab>
            </>
          )}
        </>
      )}

      {/* Add Account Dialog */}
      <Dialog open={openAccountDialog} onClose={() => setOpenAccountDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Bank Account</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Bank Name"
            value={newAccount.bank_name}
            onChange={(e) => setNewAccount({ ...newAccount, bank_name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Account Name"
            value={newAccount.account_name}
            onChange={(e) => setNewAccount({ ...newAccount, account_name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Account Number"
            value={newAccount.account_number}
            onChange={(e) => setNewAccount({ ...newAccount, account_number: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            select
            label="Account Type"
            value={newAccount.account_type}
            onChange={(e) => setNewAccount({ ...newAccount, account_type: e.target.value })}
            margin="normal"
          >
            <MenuItem value="checking">Checking</MenuItem>
            <MenuItem value="savings">Savings</MenuItem>
            <MenuItem value="merchant">Merchant</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <GradientButton variant="outline" size="md" onClick={() => setOpenAccountDialog(false)}>Cancel</GradientButton>
          <GradientButton variant="contained" size="md" animated onClick={handleCreateAccount}>
            Add Account
          </GradientButton>
        </DialogActions>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog open={openInvoiceDialog} onClose={() => setOpenInvoiceDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Invoice</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Customer Name"
            value={newInvoice.customer_name}
            onChange={(e) => setNewInvoice({ ...newInvoice, customer_name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Customer Email"
            type="email"
            value={newInvoice.customer_email}
            onChange={(e) => setNewInvoice({ ...newInvoice, customer_email: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Due Date"
            type="date"
            value={newInvoice.due_date}
            onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Line Items</Typography>
            {newInvoice.line_items.map((item, index) => (
              <Box key={index} display="flex" gap={2} sx={{ mb: 1 }}>
                <TextField
                  label="Description"
                  value={item.description}
                  onChange={(e) => {
                    const items = [...newInvoice.line_items];
                    items[index].description = e.target.value;
                    setNewInvoice({ ...newInvoice, line_items: items });
                  }}
                  size="small"
                  sx={{ flex: 2 }}
                />
                <TextField
                  label="Qty"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const items = [...newInvoice.line_items];
                    items[index].quantity = Number(e.target.value);
                    setNewInvoice({ ...newInvoice, line_items: items });
                  }}
                  size="small"
                  sx={{ flex: 0.5 }}
                />
                <TextField
                  label="Price"
                  type="number"
                  value={item.unit_price}
                  onChange={(e) => {
                    const items = [...newInvoice.line_items];
                    items[index].unit_price = Number(e.target.value);
                    setNewInvoice({ ...newInvoice, line_items: items });
                  }}
                  size="small"
                  sx={{ flex: 1 }}
                />
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <GradientButton variant="outline" size="md" onClick={() => setOpenInvoiceDialog(false)}>Cancel</GradientButton>
          <GradientButton variant="contained" size="md" animated onClick={handleCreateInvoice}>
            Create Invoice
          </GradientButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

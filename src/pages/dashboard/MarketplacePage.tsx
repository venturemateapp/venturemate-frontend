import { useState, useEffect } from 'react';
import { GradientButton } from '@/components/GradientButton';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Chip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { marketplaceApi } from '@/lib/api/client';
import type { MarketplaceService, ServiceBooking, ServiceProvider } from '@/types';

const serviceCategories = [
  'All',
  'Legal',
  'Accounting',
  'Marketing',
  'Design',
  'Development',
  'Consulting',
];

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [services, setServices] = useState<MarketplaceService[]>([]);
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<MarketplaceService | null>(null);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    requirements: '',
    agreed_price: 0,
    deadline: '',
  });

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesData, bookingsData, providersData] = await Promise.all([
        marketplaceApi.getServices(selectedCategory === 'All' ? undefined : selectedCategory.toLowerCase()),
        marketplaceApi.getMyBookings(),
        marketplaceApi.getProviders(),
      ]);
      setServices(servicesData.data || []);
      setBookings(bookingsData.data || []);
      setProviders(providersData.data || []);
    } catch (error) {
      console.error('Failed to load marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = async () => {
    if (!selectedService) return;
    try {
      await marketplaceApi.bookService(selectedService.id, {
        requirements: bookingForm.requirements,
        agreed_price: bookingForm.agreed_price,
        deadline: bookingForm.deadline ? new Date(bookingForm.deadline).toISOString() : undefined,
      });
      setOpenBookingDialog(false);
      setSelectedService(null);
      setBookingForm({ requirements: '', agreed_price: 0, deadline: '' });
      loadData();
    } catch (error) {
      console.error('Failed to book service:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'primary';
      case 'accepted': return 'info';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Founder Marketplace
        </Typography>
        <Typography color="text.secondary">
          Find expert services to help grow your startup
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Browse Services" />
          <Tab label="My Bookings" />
          <Tab label="Top Providers" />
        </Tabs>
      </Paper>

      {loading ? (
        <LinearProgress />
      ) : (
        <>
          {activeTab === 0 && (
            <>
              <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {serviceCategories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => setSelectedCategory(category)}
                    color={selectedCategory === category ? 'primary' : 'default'}
                    variant={selectedCategory === category ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
              <Grid container spacing={3}>
                {services.map((service) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardMedia
                        component="div"
                        sx={{ height: 140, bgcolor: 'grey.100' }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                          <Chip 
                            label={service.category} 
                            size="small" 
                            color="primary"
                            variant="outlined"
                          />
                          {service.delivery_time_days && (
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <TimeIcon fontSize="small" color="action" />
                              <Typography variant="caption">
                                {service.delivery_time_days} days
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          {service.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {service.description || 'No description available'}
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="h6" color="primary" fontWeight={600}>
                              {service.price_from 
                                ? `$${service.price_from.toLocaleString()}+`
                                : 'Contact for pricing'
                              }
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {service.order_count} orders completed
                            </Typography>
                          </Box>
                          <GradientButton
                            variant="contained"
                            size="sm"
                            animated
                            onClick={() => {
                              setSelectedService(service);
                              setOpenBookingDialog(true);
                            }}
                          >
                            Book Now
                          </GradientButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {activeTab === 1 && (
            <>
              {bookings.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <CartIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>No Bookings Yet</Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Browse services and book professionals to help with your startup
                  </Typography>
                  <GradientButton 
                    variant="contained" 
                    size="md"
                    animated
                    onClick={() => setActiveTab(0)}
                  >
                    Browse Services
                  </GradientButton>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {bookings.map((booking) => (
                    <Grid size={{ xs: 12 }} key={booking.id}>
                      <Paper sx={{ p: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="start">
                          <Box>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <Chip 
                                label={booking.status} 
                                size="small"
                                color={getStatusColor(booking.status) as any}
                              />
                              <Typography variant="caption" color="text.secondary">
                                Booked on {new Date(booking.requested_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Typography variant="h6" gutterBottom>
                              Service Booking
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {booking.requirements}
                            </Typography>
                          </Box>
                          <Box textAlign="right">
                            {booking.agreed_price && (
                              <Typography variant="h6" fontWeight={600}>
                                ${booking.agreed_price.toLocaleString()}
                              </Typography>
                            )}
                            {booking.deadline && (
                              <Typography variant="caption" color="text.secondary">
                                Due: {new Date(booking.deadline).toLocaleDateString()}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}

          {activeTab === 2 && (
            <Grid container spacing={3}>
              {providers.map((provider) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={provider.id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar sx={{ width: 56, height: 56 }}>
                          {provider.company_name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{provider.company_name}</Typography>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Rating value={provider.rating} precision={0.1} size="small" readOnly />
                            <Typography variant="caption">({provider.review_count})</Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {provider.description || 'No description available'}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          {provider.completed_projects} projects completed
                        </Typography>
                        {provider.is_verified && (
                          <Chip 
                            icon={<CheckCircleIcon />} 
                            label="Verified" 
                            size="small" 
                            color="success"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Booking Dialog */}
      <Dialog open={openBookingDialog} onClose={() => setOpenBookingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book Service</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>{selectedService?.title}</Typography>
          <TextField
            fullWidth
            label="Requirements"
            multiline
            rows={4}
            value={bookingForm.requirements}
            onChange={(e) => setBookingForm({ ...bookingForm, requirements: e.target.value })}
            margin="normal"
            placeholder="Describe what you need..."
            required
          />
          <TextField
            fullWidth
            label="Budget (USD)"
            type="number"
            value={bookingForm.agreed_price}
            onChange={(e) => setBookingForm({ ...bookingForm, agreed_price: Number(e.target.value) })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Deadline"
            type="date"
            value={bookingForm.deadline}
            onChange={(e) => setBookingForm({ ...bookingForm, deadline: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <GradientButton variant="outline" size="md" onClick={() => setOpenBookingDialog(false)}>Cancel</GradientButton>
          <GradientButton variant="contained" size="md" animated onClick={handleBookService}>
            Submit Request
          </GradientButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

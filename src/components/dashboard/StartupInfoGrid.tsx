import { Box, Card, CardContent, Typography, Grid, IconButton } from '@mui/material';
import { 
  Business, 
  Group, 
  Gavel, 
  Description, 
  Cloud, 
  AccountBalance,
  Edit,
  ChevronRight
} from '@mui/icons-material';
import { GradientButton } from '@/components/GradientButton';
import type { QuickStats, StartupOverview } from '@/types/startupStack';

interface StartupInfoGridProps {
  startup: StartupOverview;
  stats: QuickStats;
}

interface InfoCardProps {
  icon: typeof Business;
  title: string;
  children: React.ReactNode;
  action?: { label: string; onClick: () => void };
}

function InfoCard({ icon: Icon, title, children, action }: InfoCardProps) {
  return (
    <Card
      sx={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 2,
        height: '100%',
        transition: 'all 0.2s ease',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.12)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Icon sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>{children}</Box>
        {action && (
          <GradientButton
            variant="ghost"
            size="sm"
            endIcon={<ChevronRight />}
            onClick={action.onClick}
            sx={{ mt: 1, justifyContent: 'flex-start', px: 0 }}
          >
            {action.label}
          </GradientButton>
        )}
      </CardContent>
    </Card>
  );
}

export function StartupInfoGrid({ startup, stats }: StartupInfoGridProps) {
  const cards = [
    {
      icon: Business,
      title: 'Business Info',
      content: (
        <Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
            {startup.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Stage: {startup.status}
          </Typography>
        </Box>
      ),
      action: { label: 'Edit Details', onClick: () => {} },
    },
    {
      icon: Group,
      title: 'Team',
      content: (
        <Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
            Solo Founder
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            1 member
          </Typography>
        </Box>
      ),
      action: { label: 'Manage Team', onClick: () => {} },
    },
    {
      icon: Gavel,
      title: 'Compliance',
      content: (
        <Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
            {stats.approvals_completed || 0}/{stats.approvals_total || 0}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Approvals completed
          </Typography>
        </Box>
      ),
      action: { label: 'View All', onClick: () => {} },
    },
    {
      icon: Description,
      title: 'Documents',
      content: (
        <Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
            {stats.documents_uploaded || 0}/{stats.documents_total || 0}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Documents ready
          </Typography>
        </Box>
      ),
      action: { label: 'Generate', onClick: () => {} },
    },
    {
      icon: Cloud,
      title: 'Services',
      content: (
        <Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
            {stats.services_connected || 0}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Services connected
          </Typography>
        </Box>
      ),
      action: { label: 'Browse', onClick: () => {} },
    },
    {
      icon: AccountBalance,
      title: 'Funding',
      content: (
        <Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
            Pre-seed
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Not raised yet
          </Typography>
        </Box>
      ),
      action: { label: 'Update', onClick: () => {} },
    },
  ];

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
            Startup Details
          </Typography>
          <IconButton sx={{ color: 'rgba(255,255,255,0.5)' }}>
            <Edit />
          </IconButton>
        </Box>

        <Grid container spacing={2}>
          {cards.map((card) => (
            <Grid key={card.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <InfoCard icon={card.icon} title={card.title} action={card.action}>
                {card.content}
              </InfoCard>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

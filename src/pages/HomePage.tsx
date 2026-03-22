import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Stack,
  IconButton,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Divider,
} from "@mui/material";
import {
  Menu,
  Close,
  ExpandMore,
  CheckCircle,
  Palette,
  Language,
  Description,
  Verified,
  AutoAwesome,
  Timeline,
  Rocket,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GradientButton } from "@/components/GradientButton";
import { TypeWriter } from "@/components/TypeWriter";

const features = [
  {
    icon: <Palette sx={{ fontSize: 28, color: "#5a7c5a" }} />,
    title: "Branding",
    subtitle: "Logo, colors, and identity kit.",
    gradient: "linear-gradient(135deg, #8fbc8f 0%, #6b8e6b 100%)",
    bgColor: "#1a2f1a",
    iconBg: "rgba(143, 188, 143, 0.15)",
  },
  {
    icon: <Language sx={{ fontSize: 28, color: "#5a7a8a" }} />,
    title: "Website",
    subtitle: "Optimized templates & hosting.",
    gradient: "linear-gradient(135deg, #7ba3b0 0%, #5a8a9a 100%)",
    bgColor: "#1a2a30",
    iconBg: "rgba(123, 163, 176, 0.15)",
  },
  {
    icon: <Verified sx={{ fontSize: 28, color: "#8a7a5a" }} />,
    title: "Compliance",
    subtitle: "Checklists and reg workflows.",
    gradient: "linear-gradient(135deg, #c4a77d 0%, #a68b5b 100%)",
    bgColor: "#2a2518",
    iconBg: "rgba(196, 167, 125, 0.15)",
  },
  {
    icon: <Description sx={{ fontSize: 28, color: "#6a8a6a" }} />,
    title: "Pitch Decks",
    subtitle: "VC and Grant-ready versions.",
    gradient: "linear-gradient(135deg, #9ab89a 0%, #7a9a7a 100%)",
    bgColor: "#1f2f1f",
    iconBg: "rgba(154, 184, 154, 0.15)",
  },
];

const steps = [
  {
    number: "1",
    title: "Describe your idea",
    description: "Answer a few questions about your vision. We use prompts so you don't get stuck.",
    icon: <AutoAwesome sx={{ fontSize: 32 }} />,
  },
  {
    number: "2",
    title: "Get your plan",
    description: "Instantly receive a checklist, timeline, and recommended compliance steps.",
    icon: <Timeline sx={{ fontSize: 32 }} />,
  },
  {
    number: "3",
    title: "Launch & grow",
    description: "Build your website, register the company, and track everything in real-time.",
    icon: <Rocket sx={{ fontSize: 32 }} />,
  },
];

const faqs = [
  {
    question: "Is VentureMate only for tech startups?",
    answer: "Not at all. It's built for any founder starting a real business, from local services to retail to online brands.",
  },
  {
    question: "Can I get human support too?",
    answer: "Yes! Our Growth plan includes priority support with real humans who can guide you through complex decisions.",
  },
  {
    question: "What countries do you support?",
    answer: "We currently support business registration in Ghana, Nigeria, Kenya, and South Africa, with more countries coming soon.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. No long-term contracts. Upgrade, downgrade, or cancel whenever you need.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0a0f", overflow: "hidden" }}>
      {/* Navigation */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          bgcolor: "rgba(10, 10, 15, 0.9)", 
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <Toolbar 
          sx={{ 
            justifyContent: "space-between",
            px: { xs: 2, sm: 3, md: 4 },
            minHeight: { xs: 72, md: 80 },
          }}
        >
          <Link to="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <img
              src="/VentureMate-logo.png"
              alt="VentureMate"
              style={{ 
                objectFit: "contain",
                width: "auto",
                height: 48,
              }}
            />
          </Link>

          {/* Desktop Nav */}
          <Box sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center", gap: 0.5 }}>
            <GradientButton variant="ghost" size="sm" onClick={() => document.getElementById('solution')?.scrollIntoView()}>
              Solution
            </GradientButton>
            <GradientButton variant="ghost" size="sm" onClick={() => document.getElementById('how-it-works')?.scrollIntoView()}>
              How it Works
            </GradientButton>
            <GradientButton variant="ghost" size="sm" onClick={() => document.getElementById('toolkit')?.scrollIntoView()}>
              Toolkit
            </GradientButton>
            <GradientButton variant="ghost" size="sm" onClick={() => document.getElementById('pricing')?.scrollIntoView()}>
              Pricing
            </GradientButton>
            <GradientButton variant="ghost" size="sm" onClick={() => document.getElementById('faq')?.scrollIntoView()}>
              FAQ
            </GradientButton>
            <Box sx={{ width: "1px", height: 24, bgcolor: "rgba(255,255,255,0.1)", mx: 1.5 }} />
            <GradientButton
              onClick={() => navigate('/signin')}
              variant="primary"
              size="sm"
              animated
            >
              Get Started
            </GradientButton>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton 
            sx={{ 
              display: { xs: "flex", lg: "none" }, 
              color: "white",
              ml: 1,
            }}
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 320 },
            bgcolor: "#0a0a0f",
            borderLeft: "1px solid rgba(255,255,255,0.05)",
          },
        }}
      >
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <img
              src="/VentureMate-logo.png"
              alt="VentureMate"
              style={{ objectFit: "contain", height: 48, width: "auto" }}
            />
          </Link>
          <IconButton 
            onClick={() => setMobileMenuOpen(false)}
            sx={{ color: "white" }}
          >
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
        <List sx={{ px: 2, py: 2 }}>
          {[
            { text: "Solution", href: "#solution" },
            { text: "How it Works", href: "#how-it-works" },
            { text: "Toolkit", href: "#toolkit" },
            { text: "Pricing", href: "#pricing" },
            { text: "FAQ", href: "#faq" },
          ].map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  color: "#94a3b8",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.05)",
                    color: "#fff",
                  },
                }}
              >
                <Typography sx={{ fontWeight: 500 }}>{item.text}</Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ px: 3, pb: 3, mt: "auto" }}>
          <GradientButton
            component={Link}
            to="/signin"
            variant="primary"
            size="lg"
            fullWidth
            animated
            onClick={() => setMobileMenuOpen(false)}
          >
            Get Started
          </GradientButton>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box 
        sx={{ 
          pt: { xs: 14, md: 20 }, 
          pb: { xs: 8, md: 12 },
          position: "relative",
        }}
      >
        {/* Animated Background */}
        <Box 
          sx={{ 
            position: "absolute",
            top: "5%",
            left: "-10%",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(76, 175, 80, 0.2) 0%, transparent 60%)",
            filter: "blur(80px)",
            zIndex: 0,
            animation: "pulse 8s ease-in-out infinite",
          }}
        />
        <Box 
          sx={{ 
            position: "absolute",
            top: "20%",
            right: "-5%",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(33, 150, 243, 0.15) 0%, transparent 60%)",
            filter: "blur(80px)",
            zIndex: 0,
            animation: "pulse 8s ease-in-out infinite 1s",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center", maxWidth: "900px", mx: "auto" }}>
            <Box data-aos="fade-down" data-aos-delay="100">
              <Chip 
                label="Your entrepreneur's best friend" 
                sx={{ 
                  mb: 4, 
                  bgcolor: "rgba(76, 175, 80, 0.1)", 
                  color: "#4CAF50",
                  border: "1px solid rgba(76, 175, 80, 0.3)",
                  fontWeight: 500,
                  borderRadius: "9999px",
                  px: 2,
                  py: 0.5,
                  fontSize: "0.9rem",
                }} 
              />
            </Box>
            
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: "2.5rem", md: "4rem", lg: "5rem" },
                fontWeight: 800,
                lineHeight: 1.1,
                mb: 3,
                letterSpacing: "-0.03em",
              }}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Turn your idea into a{" "}
              <TypeWriter
                words={[
                  { text: "real business", mobileText: "business", gradient: true },
                  { text: "thriving startup", mobileText: "startup", gradient: true },
                  { text: "registered company", mobileText: "company", gradient: true },
                  { text: "funded venture", mobileText: "venture", gradient: true },
                  { text: "global brand", mobileText: "brand", gradient: true },
                ]}
                typingSpeed={70}
                deletingSpeed={40}
                pauseDuration={2000}
              />
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: "#94a3b8", 
                mb: 5,
                maxWidth: "600px",
                mx: "auto",
                fontSize: { xs: "1.1rem", md: "1.35rem" },
                lineHeight: 1.7,
                fontWeight: 400,
              }}
            >
              Describe your idea once. Get everything you need to build, register, launch, and grow, all from one calm dashboard.
            </Typography>
            
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={2} 
              justifyContent="center"
              sx={{ mb: 6 }}
            >
              <GradientButton
                onClick={() => navigate('/signup')}
                variant="primary"
                size="lg"
                animated
              >
                Start free
              </GradientButton>
              <GradientButton variant="outline" size="lg">
                Watch demo
              </GradientButton>
            </Stack>

            {/* Trust Badges */}
            <Stack 
              direction="row" 
              spacing={4} 
              justifyContent="center"
              sx={{ mb: 8 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748b" }}>
                <CheckCircle sx={{ fontSize: 18, color: "#4CAF50" }} />
                <Typography fontSize="0.9rem">Founder-friendly</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748b" }}>
                <CheckCircle sx={{ fontSize: 18, color: "#4CAF50" }} />
                <Typography fontSize="0.9rem">Local compliance ready</Typography>
              </Box>
            </Stack>
          </Box>

          {/* Dashboard Preview Card */}
          <Box sx={{ maxWidth: "1000px", mx: "auto", position: "relative" }}>
            <Card
              sx={{
                bgcolor: "rgba(18, 18, 26, 0.8)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(76, 175, 80, 0.2)",
                borderRadius: "32px",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 25px 80px rgba(76, 175, 80, 0.15), 0 10px 40px rgba(0, 0, 0, 0.4)",
              }}
            >
              {/* Header */}
              <Box sx={{ 
                p: 3, 
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#ef4444" }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#f59e0b" }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#4CAF50" }} />
                </Box>
                <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                  VentureMate Dashboard
                </Typography>
                <Box sx={{ width: 60 }} />
              </Box>

              {/* Dashboard Content */}
              <CardContent sx={{ p: 4 }}>
                <Typography 
                  variant="overline" 
                  sx={{ color: "#4CAF50", fontWeight: 600, letterSpacing: "0.1em" }}
                >
                  Idea → Launch
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: "rgba(76, 175, 80, 0.05)",
                      borderRadius: "16px",
                      border: "1px solid rgba(76, 175, 80, 0.1)",
                    }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <Verified sx={{ color: "#4CAF50" }} />
                        <Typography fontWeight={600}>Registration</Typography>
                      </Box>
                      <Typography sx={{ color: "#64748b", fontSize: "0.9rem", mb: 2 }}>
                        Checklist created. 42% Done.
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={42} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: "rgba(76, 175, 80, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: "#4CAF50",
                            borderRadius: 3,
                          }
                        }} 
                      />
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: "rgba(33, 150, 243, 0.05)",
                      borderRadius: "16px",
                      border: "1px solid rgba(33, 150, 243, 0.1)",
                    }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <Palette sx={{ color: "#2196F3" }} />
                        <Typography fontWeight={600}>Branding Kit</Typography>
                      </Box>
                      <Typography sx={{ color: "#64748b", fontSize: "0.9rem" }}>
                        Logo + colors ready.
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: "#4CAF50" }} />
                        <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: "#2196F3" }} />
                        <Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: "#fff" }} />
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: "rgba(76, 175, 80, 0.05)",
                      borderRadius: "16px",
                      border: "1px solid rgba(76, 175, 80, 0.1)",
                    }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <Language sx={{ color: "#4CAF50" }} />
                        <Typography fontWeight={600}>Website Setup</Typography>
                      </Box>
                      <Typography sx={{ color: "#64748b", fontSize: "0.9rem" }}>
                        Domain connected.
                      </Typography>
                      <Chip 
                        label="Live" 
                        size="small"
                        sx={{ 
                          mt: 2,
                          bgcolor: "rgba(76, 175, 80, 0.2)", 
                          color: "#4CAF50",
                          fontWeight: 500,
                        }} 
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* Growth Score */}
                <Box sx={{ 
                  mt: 3, 
                  p: 3, 
                  bgcolor: "rgba(255,255,255,0.02)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                  <Box>
                    <Typography fontWeight={600}>Growth Score</Typography>
                    <Typography sx={{ color: "#64748b", fontSize: "0.9rem" }}>
                      Your startup is on track
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      85
                    </Typography>
                    <Typography sx={{ color: "#4CAF50", fontSize: "0.85rem" }}>
                      Optimized
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Floating Elements */}
            <Box sx={{
              position: "absolute",
              top: -20,
              right: -30,
              width: 80,
              height: 80,
              borderRadius: "20px",
              bgcolor: "rgba(76, 175, 80, 0.2)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(76, 175, 80, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "float 6s ease-in-out infinite",
            }}>
              <Rocket sx={{ color: "#4CAF50", fontSize: 32 }} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Solution Section */}
      <Box id="solution" sx={{ py: { xs: 10, md: 16 }, position: "relative" }}>
        <Box 
          sx={{ 
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "800px",
            background: "radial-gradient(circle, rgba(76, 175, 80, 0.1) 0%, transparent 60%)",
            filter: "blur(100px)",
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center", mb: 8 }} data-aos="fade-up">
            <Typography 
              variant="overline" 
              sx={{ color: "#4CAF50", fontWeight: 600, letterSpacing: "0.1em" }}
            >
              The Solution
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                mt: 2, 
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              One platform. Everything.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, idx) => (
              <Grid key={idx} size={{ xs: 6, md: 3 }} data-aos="fade-up" data-aos-delay={idx * 100}>
                <Card
                  sx={{
                    height: "100%",
                    background: feature.bgColor,
                    borderRadius: "20px",
                    border: `1px solid ${feature.iconBg}`,
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      borderColor: feature.gradient.split(' ')[1],
                      boxShadow: `0 20px 40px ${feature.iconBg}`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography fontWeight={700} fontSize="1.1rem" mb={1}>
                      {feature.title}
                    </Typography>
                    <Typography sx={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                      {feature.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How it Works Section */}
      <Box id="how-it-works" sx={{ py: { xs: 10, md: 16 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 10 }} data-aos="fade-up">
            <Typography 
              variant="overline" 
              sx={{ color: "#4CAF50", fontWeight: 600, letterSpacing: "0.1em" }}
            >
              How it Works
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                mt: 2, 
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              From idea to launch in three steps.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {steps.map((step, idx) => (
              <Grid key={idx} size={{ xs: 12, md: 4 }} data-aos="fade-up" data-aos-delay={idx * 150}>
                <Card
                  sx={{
                    height: "100%",
                    bgcolor: "rgba(18, 18, 26, 0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: "24px",
                    p: 1,
                    position: "relative",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      borderColor: idx % 2 === 0 ? "rgba(76, 175, 80, 0.3)" : "rgba(33, 150, 243, 0.3)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                      <Box sx={{ 
                        width: 50, 
                        height: 50, 
                        borderRadius: "16px",
                        background: idx % 2 === 0 
                          ? "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)"
                          : "linear-gradient(135deg, #2196F3 0%, #1565C0 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "1.25rem",
                      }}>
                        {step.number}
                      </Box>
                      <Box sx={{ color: idx % 2 === 0 ? "#4CAF50" : "#2196F3" }}>
                        {step.icon}
                      </Box>
                    </Box>
                    <Typography variant="h6" fontWeight={700} mb={2}>
                      {step.title}
                    </Typography>
                    <Typography sx={{ color: "#64748b", lineHeight: 1.7 }}>
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box id="faq" sx={{ py: { xs: 10, md: 16 } }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", mb: 8 }} data-aos="fade-up">
            <Typography 
              variant="overline" 
              sx={{ color: "#4CAF50", fontWeight: 600, letterSpacing: "0.1em" }}
            >
              FAQ
            </Typography>
            <Typography 
              variant="h2" 
              sx={{ 
                mt: 2, 
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Common questions
            </Typography>
          </Box>

          <Box data-aos="fade-up">
            {faqs.map((faq, idx) => (
              <Accordion
                key={idx}
                sx={{
                  mb: 2,
                  bgcolor: "rgba(18, 18, 26, 0.6)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: "16px !important",
                  overflow: "hidden",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography fontWeight={600}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: "#94a3b8" }}>{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 10, md: 16 }, position: "relative" }}>
        <Box 
          sx={{ 
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 0%, rgba(76, 175, 80, 0.05) 50%, transparent 100%)",
          }}
        />
        <Container maxWidth="md" sx={{ position: "relative", textAlign: "center" }}>
          <Typography variant="h2" fontWeight={800} sx={{ mb: 3, fontSize: { xs: "2rem", md: "3rem" } }}>
            Ready to launch your startup?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Join thousands of founders building their dreams with VentureMate.
          </Typography>
          <GradientButton
            onClick={() => navigate('/signup')}
            variant="primary"
            size="lg"
            animated
          >
            Get Started Free
          </GradientButton>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Link to="/" style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <img
                  src="/VentureMate-logo.png"
                  alt="VentureMate"
                  style={{ objectFit: "contain", height: 40, width: "auto" }}
                />
              </Link>
              <Typography sx={{ color: "#64748b", fontSize: "0.9rem", maxWidth: 300 }}>
                The all-in-one digital launchpad for the modern founder.
              </Typography>
            </Grid>
            
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography fontWeight={700} mb={2}>Product</Typography>
              <Stack spacing={1}>
                {["How it Works", "Toolkit", "Pricing"].map((item) => (
                  <Typography 
                    key={item}
                    sx={{ 
                      color: "#64748b", 
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      "&:hover": { color: "#4CAF50" },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Grid>
            
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography fontWeight={700} mb={2}>Company</Typography>
              <Stack spacing={1}>
                {["About Us", "Support", "Privacy Policy"].map((item) => (
                  <Typography 
                    key={item}
                    sx={{ 
                      color: "#64748b", 
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      "&:hover": { color: "#4CAF50" },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography fontWeight={700} mb={2}>Stay Updated</Typography>
              <Typography sx={{ color: "#64748b", fontSize: "0.9rem", mb: 2 }}>
                Get the latest updates on new features and releases.
              </Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.05)" }} />
          
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              © 2025 VentureMate. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Typography component={Link} to="/terms" variant="body2" color="text.secondary" sx={{ textDecoration: "none" }}>
                Terms
              </Typography>
              <Typography component={Link} to="/privacy" variant="body2" color="text.secondary" sx={{ textDecoration: "none" }}>
                Privacy
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

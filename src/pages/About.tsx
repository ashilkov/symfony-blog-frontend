import { Alert, Box, Typography, Container, Grid, Card, CardContent, Stack, Chip } from "@mui/material";
import { useLocation } from "react-router";
import { 
  EditNote, 
  Group, 
  Public, 
  Speed, 
  Security, 
  Forum 
} from "@mui/icons-material";

const About = () => {
  const location = useLocation();
  const message = location.state?.message;

  const features = [
    {
      icon: <EditNote sx={{ fontSize: 40 }} color="primary" />,
      title: "Easy Content Creation",
      description: "Write and edit posts with our rich text editor. Format your content exactly how you want it."
    },
    {
      icon: <Group sx={{ fontSize: 40 }} color="primary" />,
      title: "Community Driven",
      description: "Connect with other writers, subscribe to favorite blogs, and build your audience."
    },
    {
      icon: <Public sx={{ fontSize: 40 }} color="primary" />,
      title: "Discover Content",
      description: "Explore blogs and posts from diverse perspectives. Find inspiration from our growing community."
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} color="primary" />,
      title: "Fast & Responsive",
      description: "Enjoy a seamless experience across all your devices with our optimized platform."
    },
    {
      icon: <Security sx={{ fontSize: 40 }} color="primary" />,
      title: "Secure Platform",
      description: "Your content and data are protected with modern security practices."
    },
    {
      icon: <Forum sx={{ fontSize: 40 }} color="primary" />,
      title: "Engage with Comments",
      description: "Build conversations around your posts with our comment system."
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {message && (
        <Alert severity="success" sx={{ mb: 4 }}>
          {message}
        </Alert>
      )}
      
      {/* Hero Section */}
      <Box textAlign="center" sx={{ py: 8 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            mb: 2
          }}
        >
          Welcome to PostHaven
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          Your personal blogging platform where you can create, share, and discover amazing content.
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
          <Chip label="Modern" color="primary" variant="outlined" />
          <Chip label="User-Friendly" color="primary" variant="outlined" />
          <Chip label="Community-Focused" color="primary" variant="outlined" />
        </Stack>
      </Box>

      {/* Mission Statement */}
      <Card sx={{ mb: 6, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom textAlign="center">
            Our Mission
          </Typography>
          <Typography variant="h6" component="p" textAlign="center" color="text.secondary">
            To provide a clean, intuitive platform that empowers writers to share their stories 
            and connect with readers worldwide. We believe everyone has a story worth telling.
          </Typography>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <Typography variant="h3" component="h2" gutterBottom textAlign="center" sx={{ mb: 4 }}>
        Why Choose PostHaven?
      </Typography>
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 4,
          mb: 8
        }}
      >
        {features.map((feature, index) => (
          <Card 
            key={index}
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              minHeight: 300,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
          >
            <CardContent 
              sx={{ 
                p: 3, 
                textAlign: 'center', 
                display: 'flex', 
                flexDirection: 'column',
                height: '100%',
                flexGrow: 1 
              }}
            >
              <Box sx={{ mb: 2 }}>
                {feature.icon}
              </Box>
              <Typography 
                variant="h5" 
                component="h3" 
                gutterBottom
                sx={{ mb: 2 }}
              >
                {feature.title}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ flexGrow: 1 }}
              >
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Call to Action */}
      <Box textAlign="center" sx={{ py: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to Start Your Journey?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Join thousands of writers who are already sharing their stories on PostHaven. 
          Create your first blog or start writing today!
        </Typography>
      </Box>
    </Container>
  );
};

export default About;

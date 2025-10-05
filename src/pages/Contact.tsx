import {
  Box,
  Container,
  Typography,
  Link as MuiLink,
  IconButton,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import { GitHub, Twitter, LinkedIn, Email } from "@mui/icons-material";

const Contact = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box textAlign="center" sx={{ mb: 6 }}>
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
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          We'd love to hear from you. Feel free to reach out through any of the channels below.
        </Typography>
      </Box>

      <Card 
        sx={{ 
          maxWidth: 600, 
          mx: "auto", 
          p: 4,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4
          }
        }}
      >
        <CardContent>
          <Stack spacing={4}>
            <Box textAlign="center">
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Get in Touch
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Whether you have questions, suggestions, or just want to say hello, we're here to help.
              </Typography>
            </Box>

            <Box textAlign="center">
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Email
              </Typography>
              <MuiLink
                href="mailto:aishilkov94@gmail.com"
                color="primary"
                underline="hover"
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: 1,
                  fontSize: '1.1rem',
                  fontWeight: 500
                }}
              >
                <Email />
                aishilkov94@gmail.com
              </MuiLink>
            </Box>

            <Box textAlign="center">
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Follow Us
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <IconButton
                  aria-label="GitHub"
                  sx={{ 
                    color: 'primary.main',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                      transform: 'scale(1.05)'
                    },
                    transition: 'transform 0.2s',
                    width: 56,
                    height: 56
                  }}
                  component="a"
                  href="https://github.com/ashilkov"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHub fontSize="large" />
                </IconButton>
                <IconButton
                  aria-label="Twitter"
                  sx={{ 
                    color: 'primary.main',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                      transform: 'scale(1.05)'
                    },
                    transition: 'transform 0.2s',
                    width: 56,
                    height: 56
                  }}
                  component="a"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter fontSize="large" />
                </IconButton>
                <IconButton
                  aria-label="LinkedIn"
                  sx={{ 
                    color: 'primary.main',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                      transform: 'scale(1.05)'
                    },
                    transition: 'transform 0.2s',
                    width: 56,
                    height: 56
                  }}
                  component="a"
                  href="https://www.linkedin.com/in/ashilkov/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedIn fontSize="large" />
                </IconButton>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Contact;

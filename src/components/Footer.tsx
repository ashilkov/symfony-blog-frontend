import {
  Box,
  Container,
  Typography,
  Link as MuiLink,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import { GitHub, Twitter, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
        color: 'white',
      }}
    >
      <Container sx={{ py: 6 }}>
        <Stack
          spacing={4}
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
        >
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
                backgroundClip: 'text',
                textFillColor: 'transparent'
              }}
            >
              PostHaven
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              A clean, modern blog platform for sharing ideas and stories.
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: 'white' }}>
              Links
            </Typography>
            <Stack spacing={1}>
              <MuiLink href="/about" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                About
              </MuiLink>
              <MuiLink href="/contact" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Contact
              </MuiLink>
              <MuiLink href="#" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Privacy
              </MuiLink>
              <MuiLink href="#" color="inherit" underline="hover" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Terms
              </MuiLink>
            </Stack>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: 'white' }}>
              Follow
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                aria-label="GitHub"
                sx={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'transform 0.2s'
                }}
                component="a"
                href="https://github.com/ashilkov"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHub />
              </IconButton>
              <IconButton
                aria-label="Twitter"
                sx={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'transform 0.2s'
                }}
                component="a"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter />
              </IconButton>
              <IconButton
                aria-label="LinkedIn"
                sx={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'transform 0.2s'
                }}
                component="a"
                href="https://www.linkedin.com/in/ashilkov/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedIn />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }} display="block">
          © {new Date().getFullYear()} PostHaven. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

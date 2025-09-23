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
import { Link } from "react-router";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container sx={{ py: 4 }}>
        <Stack
          spacing={4}
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              PostHaven
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A clean, modern blog platform for sharing ideas and stories.
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Links
            </Typography>
            <Stack spacing={1}>
              <MuiLink href="#" color="inherit" underline="hover">
                About
              </MuiLink>
              <MuiLink href="#" color="inherit" underline="hover">
                Contact
              </MuiLink>
              <MuiLink href="#" color="inherit" underline="hover">
                Privacy
              </MuiLink>
              <MuiLink href="#" color="inherit" underline="hover">
                Terms
              </MuiLink>
            </Stack>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Follow
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                aria-label="GitHub"
                color="inherit"
                component="a"
                href="https://github.com/ashilkov"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHub />
              </IconButton>
              <IconButton
                aria-label="Twitter"
                color="inherit"
                component="a"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter />
              </IconButton>
              <IconButton
                aria-label="LinkedIn"
                color="inherit"
                component="a"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedIn />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Typography variant="caption" color="text.secondary" display="block">
          © {new Date().getFullYear()} PostHaven. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

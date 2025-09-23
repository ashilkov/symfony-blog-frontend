import { Alert, Box, Typography } from "@mui/material";
import { useLocation } from "react-router";

const About = () => {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <Box sx={{ p: 3 }}>
      {message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to PostHaven
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Your personal blogging platform where you can create, share, and
        discover amazing content.
      </Typography>
    </Box>
  );
};

export default About;

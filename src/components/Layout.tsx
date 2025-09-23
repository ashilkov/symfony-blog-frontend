import React from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import Navbar from './Navbar'
import Footer from './Footer'

interface LayoutProps {
    children: React.ReactNode;
  }
  
  const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
          color: 'text.primary',
        }}
      >
        <CssBaseline />
        <Navbar />
        <Container
          component="main"
          maxWidth="xl"
          sx={{
            flex: '1 0 auto',
            py: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {children}
        </Container>
        <Footer />
      </Box>
    );
  };
  
  export default Layout; 
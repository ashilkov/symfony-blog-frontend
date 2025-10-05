import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
} from "@mui/material";
import { Person, Menu as MenuIcon, Add } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [plusAnchorEl, setPlusAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const { isAuthenticated } = useAuth();

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const openPlusMenu = (event: React.MouseEvent<HTMLElement>) => {
    setPlusAnchorEl(event.currentTarget);
  };

  const closePlusMenu = () => {
    setPlusAnchorEl(null);
  };

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Blogs", to: "/blogs" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
        boxShadow: 'none'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h4"
            component={Link}
            to="/"
            color="inherit"
            sx={{ 
              textDecoration: "none", 
              mr: 2,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent'
            }}
          >
            PostHaven
          </Typography>

          <Box
            sx={{ display: { xs: "none", sm: "flex" }, gap: 1, flexGrow: 1, ml: 4 }}
          >
            {navItems.map((item) => (
              <Button
                key={item.to}
                component={Link}
                to={item.to}
                color="inherit"
                sx={{ 
                  textTransform: "none",
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
            {isAuthenticated && (
              <>
                <IconButton
                  color="inherit"
                  onClick={openPlusMenu}
                  aria-label="create new content"
                  sx={{ 
                    ml: 1,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      transform: 'scale(1.05)'
                    },
                    transition: 'transform 0.2s'
                  }}
                >
                  <Add />
                </IconButton>
                <Menu
                  anchorEl={plusAnchorEl}
                  open={Boolean(plusAnchorEl)}
                  onClose={closePlusMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <MenuItem
                    onClick={closePlusMenu}
                    component={Link}
                    to="/blogs/new"
                    sx={{ fontWeight: 500 }}
                  >
                    New Blog
                  </MenuItem>
                  <MenuItem
                    onClick={closePlusMenu}
                    component={Link}
                    to="/posts/new"
                    sx={{ fontWeight: 500 }}
                  >
                    New Post
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

          <Box sx={{ display: { xs: "flex", sm: "none" }, ml: "auto", gap: 1 }}>
            {isAuthenticated && (
              <>
                <IconButton
                  color="inherit"
                  onClick={openPlusMenu}
                  aria-label="create new content"
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  <Add />
                </IconButton>
                <Menu
                  anchorEl={plusAnchorEl}
                  open={Boolean(plusAnchorEl)}
                  onClose={closePlusMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <MenuItem
                    onClick={closePlusMenu}
                    component={Link}
                    to="/blogs/new"
                    sx={{ fontWeight: 500 }}
                  >
                    New Blog
                  </MenuItem>
                  <MenuItem
                    onClick={closePlusMenu}
                    component={Link}
                    to="/posts/new"
                    sx={{ fontWeight: 500 }}
                  >
                    New Post
                  </MenuItem>
                </Menu>
              </>
            )}
            <IconButton
              color="inherit"
              onClick={openMenu}
              aria-label="open navigation menu"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={closeMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.to}
                  onClick={closeMenu}
                  component={Link}
                  to={item.to}
                  sx={{ fontWeight: 500 }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ display: "flex", ml: { xs: 1, md: "auto" } }}>
            <IconButton
              color="inherit"
              component={Link}
              to={isAuthenticated ? "/account" : "/login"}
              aria-label={isAuthenticated ? "account" : "login"}
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  transform: 'scale(1.05)'
                },
                transition: 'transform 0.2s'
              }}
            >
              <Person />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

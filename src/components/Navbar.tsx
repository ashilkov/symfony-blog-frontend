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
    <AppBar position="static" color="primary">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            color="inherit"
            sx={{ textDecoration: "none", mr: 2 }}
          >
            PostHaven
          </Typography>

          <Box
            sx={{ display: { xs: "none", sm: "flex" }, gap: 1, flexGrow: 1 }}
          >
            {navItems.map((item) => (
              <Button
                key={item.to}
                component={Link}
                to={item.to}
                color="inherit"
                sx={{ textTransform: "none" }}
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
                  sx={{ ml: 1 }}
                >
                  <Add />
                </IconButton>
                <Menu
                  anchorEl={plusAnchorEl}
                  open={Boolean(plusAnchorEl)}
                  onClose={closePlusMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem
                    onClick={closePlusMenu}
                    component={Link}
                    to="/blogs/new"
                  >
                    New Blog
                  </MenuItem>
                  <MenuItem
                    onClick={closePlusMenu}
                    component={Link}
                    to="/posts/new"
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
                >
                  <Add />
                </IconButton>
                <Menu
                  anchorEl={plusAnchorEl}
                  open={Boolean(plusAnchorEl)}
                  onClose={closePlusMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem
                    onClick={closePlusMenu}
                    component={Link}
                    to="/blogs/new"
                  >
                    New Blog
                  </MenuItem>
                  <MenuItem
                    onClick={closePlusMenu}
                    component={Link}
                    to="/posts/new"
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
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={closeMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.to}
                  onClick={closeMenu}
                  component={Link}
                  to={item.to}
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

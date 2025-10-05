import { useEffect, useState } from "react";
import { fetchBlogs, type Blog } from "../lib/api";
import { subscribe, unsubscribe } from "../lib/subscription";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Tooltip,
  Snackbar,
  Container,
  Chip,
} from "@mui/material";
import { Add, NotificationsNone, NotificationsOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DOMPurify from "dompurify";

const truncate = (s: string, n = 200) =>
  s.length > n ? s.slice(0, n).trim() + "…" : s;

const stripHtmlToText = (html = "") => {
  const sanitized = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  // simple tag removal; acceptable for short excerpts
  const text = sanitized
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text;
};

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isAuthenticated } = useAuth();
  const [processingIds, setProcessingIds] = useState<Record<string, boolean>>(
    {}
  );
  const [snack, setSnack] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchBlogs()
      .then((data) => {
        if (mounted) {
          setBlogs(data);
          setError(null);
        }
      })
      .catch((e) => {
        if (mounted) {
          setError(e?.message || "Failed to load blogs");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubscribe = async (blogId: number) => {
    setProcessingIds((s) => ({ ...s, [blogId]: true }));
    setBlogs(
      (prev) =>
        prev?.map((b) => (b._id === blogId ? { ...b, subscribed: true } : b)) ??
        prev
    );

    try {
      await subscribe({ blogId: blogId });
      setSnack({ open: true, message: "Subscribed" });
    } catch (e: any) {
      setBlogs(
        (prev) =>
          prev?.map((b) =>
            b._id === blogId ? { ...b, subscribed: false } : b
          ) ?? prev
      );
      setSnack({ open: true, message: e?.message ?? "Failed to subscribe" });
    } finally {
      setProcessingIds((s) => {
        const copy = { ...s };
        delete copy[blogId];
        return copy;
      });
    }
  };

  const handleUnsubscribe = async (blogId: number) => {
    setProcessingIds((s) => ({ ...s, [blogId]: true }));
    // optimistic UI
    setBlogs(
      (prev) =>
        prev?.map((b) =>
          b._id === blogId ? { ...b, subscribed: false } : b
        ) ?? prev
    );

    try {
      await unsubscribe({ blogId: Number(blogId) });
      setSnack({ open: true, message: "Unsubscribed" });
    } catch (e: any) {
      // revert on error
      setBlogs(
        (prev) =>
          prev?.map((b) =>
            b._id === blogId ? { ...b, subscribed: true } : b
          ) ?? prev
      );
      setSnack({ open: true, message: e?.message ?? "Failed to unsubscribe" });
    } finally {
      setProcessingIds((s) => {
        const copy = { ...s };
        delete copy[blogId];
        return copy;
      });
    }
  };

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
          Discover Blogs
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Explore diverse perspectives and find your next favorite blog from our growing community.
        </Typography>
      </Box>

      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        {isAuthenticated && (
          <>
            <IconButton
              color="primary"
              onClick={openMenu}
              aria-label="create new content"
              size="large"
              sx={{ 
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'scale(1.05)'
                },
                transition: 'transform 0.2s'
              }}
            >
              <Add />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={closeMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={closeMenu} component={Link} to="/posts/new">
                New Post
              </MenuItem>
              <MenuItem onClick={closeMenu} component={Link} to="/blogs/new">
                New Blog
              </MenuItem>
            </Menu>
          </>
        )}
      </Stack>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <>
          {(blogs ?? []).length === 0 ? (
            <Alert severity="info" sx={{ textAlign: 'center' }}>No blogs found.</Alert>
          ) : (
            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
              }}
            >
              {(blogs ?? []).map((b) => {
                const plain = stripHtmlToText(b.description ?? "");
                const excerpt = truncate(plain, 220);
                const avatarLabel =
                  b.name?.trim().charAt(0).toUpperCase() ?? "B";

                return (
                  <Card
                    key={b.id}
                    variant="outlined"
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar 
                          sx={{ 
                            bgcolor: 'primary.main',
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {avatarLabel}
                        </Avatar>
                      }
                      title={
                        <Typography
                          component={Link}
                          to={`/blog/${b._id}`}
                          sx={{ 
                            textDecoration: "none", 
                            color: "inherit",
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            '&:hover': {
                              color: 'primary.main'
                            }
                          }}
                          variant="h6"
                        >
                          {b.name}
                        </Typography>
                      }
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {excerpt || <i>No preview text available</i>}
                      </Typography>
                    </CardContent>

                    <CardActions
                      sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Button
                          size="small"
                          component={Link}
                          to={`/blog/${b._id}`}
                          variant="outlined"
                          color="primary"
                        >
                          Explore
                        </Button>

                        {/* show subscribe button only when user is authenticated and blog is not subscribed */}
                        {isAuthenticated && !b.subscribed && (
                          <Tooltip title="Subscribe to this blog">
                            <span>
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                startIcon={<NotificationsNone />}
                                onClick={() => handleSubscribe(b._id)}
                                disabled={!!processingIds[b._id]}
                                sx={{ 
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                Subscribe
                              </Button>
                            </span>
                          </Tooltip>
                        )}

                        {/* if already subscribed, show an unsubscribe button */}
                        {isAuthenticated && b.subscribed && (
                          <Tooltip title="Unsubscribe from this blog">
                            <span>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<NotificationsOff />}
                                color="primary"
                                onClick={() => handleUnsubscribe(b._id)}
                                disabled={!!processingIds[b._id]}
                                sx={{ 
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                Unsubscribe
                              </Button>
                            </span>
                          </Tooltip>
                        )}
                      </Stack>
                    </CardActions>
                  </Card>
                );
              })}
            </Box>
          )}
        </>
      )}

      <Snackbar
        open={snack.open}
        onClose={() => setSnack({ open: false, message: "" })}
        message={snack.message}
        autoHideDuration={3000}
      />
    </Container>
  );
};

export default Blogs;

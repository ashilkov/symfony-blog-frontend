import { useEffect, useState } from "react";
import { fetchPosts, type PostExtended } from "../lib/api";
import {
  Box,
  Typography,
  Alert,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Button,
  Chip,
  Skeleton,
  Divider,
  Link as MuiLink,
  Container,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DOMPurify from "dompurify";

const relativeTime = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

const stripHtmlToText = (html = "") => {
  const sanitized = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  // simple tag removal; acceptable for short excerpts
  const text = sanitized
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text;
};

const truncate = (s: string, n = 200) =>
  s.length > n ? s.slice(0, n).trim() + "…" : s;

const Posts = () => {
  const [posts, setPosts] = useState<PostExtended[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isAuthenticated } = useAuth();

  const openMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchPosts()
      .then((data) => {
        if (!mounted) return;
        setPosts(data);
        setError(null);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message || "Failed to load posts");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

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
          Latest Posts
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Discover the latest stories and insights from our community of writers.
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
        <Stack spacing={2}>
          {[1, 2, 3].map((n) => (
            <Card key={n} sx={{ p: 1 }}>
              <CardHeader
                avatar={<Skeleton variant="circular" width={40} height={40} />}
                title={<Skeleton width="40%" />}
                subheader={<Skeleton width="30%" />}
              />
              <CardContent>
                <Skeleton variant="rectangular" height={60} />
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <>
          {(!posts || posts.length === 0) && (
            <Alert severity="info">No posts yet.</Alert>
          )}

          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3
            }}
          >
            {(posts ?? []).map((p) => {
              const id = p._id;
              const createdAt =
                (p as any).createdAt ?? (p as any).created_at ?? null;
              const authorName =
                (p as any).author?.name ?? (p as any).authorName ?? null;
              const avatarUrl = (p as any).author?.avatarUrl ?? null;
              const plain = stripHtmlToText(p.content ?? "");
              const excerpt = truncate(plain, 220);

              return (
                <Card 
                  key={id} 
                  variant="outlined"
                  sx={{ 
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}
                >
                  <CardHeader
                    avatar={
                      avatarUrl ? (
                        <Avatar src={avatarUrl} />
                      ) : (
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {(authorName || p.title || "P").charAt(0)}
                        </Avatar>
                      )
                    }
                    title={
                      <MuiLink
                        component={Link}
                        to={`/post/${id}`}
                        underline="hover"
                        color="inherit"
                        sx={{ fontWeight: 600, fontSize: '1.1rem' }}
                      >
                        {p.title}
                      </MuiLink>
                    }
                    subheader={
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        {p.blog && (
                          <Chip 
                            size="small" 
                            label={p.blog.name} 
                            variant="outlined"
                            color="primary"
                          />
                        )}
                        {authorName && (
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {authorName}
                          </Typography>
                        )}
                        {createdAt && (
                          <Typography variant="caption" color="text.secondary">
                            • {relativeTime(createdAt)} ago
                          </Typography>
                        )}
                      </Stack>
                    }
                    sx={{ pb: 0 }}
                  />

                  <CardContent sx={{ pt: 1, flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {excerpt || <i>No preview text available</i>}
                    </Typography>
                  </CardContent>

                  <Divider />

                  <CardActions sx={{ justifyContent: "flex-end", px: 2, py: 1 }}>
                    <Button 
                      size="small" 
                      component={Link} 
                      to={`/post/${id}`}
                      variant="outlined"
                      color="primary"
                    >
                      Read full story
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
          </Box>
        </>
      )}
    </Container>
  );
};

export default Posts;

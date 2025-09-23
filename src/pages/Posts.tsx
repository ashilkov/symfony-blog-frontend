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
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5">Posts</Typography>
        {isAuthenticated && (
          <>
            <IconButton
              color="primary"
              onClick={openMenu}
              aria-label="create new content"
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

          <Stack spacing={2}>
            {(posts ?? []).map((p) => {
              const id = p.id;
              const createdAt =
                (p as any).createdAt ?? (p as any).created_at ?? null;
              const authorName =
                (p as any).author?.name ?? (p as any).authorName ?? null;
              const avatarUrl = (p as any).author?.avatarUrl ?? null;
              const plain = stripHtmlToText(p.content ?? "");
              const excerpt = truncate(plain, 220);

              return (
                <Card key={id} variant="outlined">
                  <CardHeader
                    avatar={
                      avatarUrl ? (
                        <Avatar src={avatarUrl} />
                      ) : (
                        <Avatar>
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
                        sx={{ fontWeight: 600 }}
                      >
                        {p.title}
                      </MuiLink>
                    }
                    subheader={
                      <Stack direction="row" spacing={1} alignItems="center">
                        {p.blog && <Chip size="small" label={p.blog.name} />}
                        {authorName && (
                          <Typography variant="caption">
                            {authorName}
                          </Typography>
                        )}
                        {createdAt && (
                          <Typography variant="caption">
                            • {relativeTime(createdAt)} ago
                          </Typography>
                        )}
                      </Stack>
                    }
                    sx={{ pb: 0 }}
                  />

                  <CardContent sx={{ pt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {excerpt || <i>No preview text available</i>}
                    </Typography>
                  </CardContent>

                  <Divider />

                  <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
                    <Box>
                      <Button size="small" component={Link} to={`/post/${id}`}>
                        Read full
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              );
            })}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default Posts;

import { useEffect, useState } from "react";
import { fetchBlogs, type Blog } from "../lib/api";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TiptapViewer } from "../components/TiptapViewer";
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

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5">Blogs</Typography>
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
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <>
          <Box>
            <Stack spacing={2}>
              {(blogs ?? []).map((b) => {
                const plain = stripHtmlToText(b.description ?? "");
                const excerpt = truncate(plain, 220);
                return (
                  <Card key={b.id} variant="outlined">
                    <CardHeader
                      title={<Link to={`/blog/${b.id}`}>{b.name}</Link>}
                    />
                    <CardContent sx={{ pt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {excerpt || <i>No preview text available</i>}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Blogs;

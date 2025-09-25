import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { fetchBlog } from "../lib/blog";
import type { BlogExtended } from "../lib/types";
import { TiptapViewer } from "../components/TiptapViewer";
import DOMPurify from "dompurify";

const Blog = () => {
  const { blogId } = useParams<{ blogId?: string }>();
  const [blog, setBlog] = useState<BlogExtended | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!blogId) return;

    let mounted = true;
    setLoading(true);
    setError(null);
    setBlog(null);

    fetchBlog(blogId)
      .then((data) => {
        if (!mounted) return;
        setBlog(data);
        setError(null);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message || "Failed to load blog");
        setBlog(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [blogId]);

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", px: 2, py: { xs: 2, md: 4 } }}>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {!blogId && (
          <Box sx={{ mt: 6 }}>
            <Alert severity="info">No Post id provided.</Alert>
          </Box>
        )}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && blog === null && blogId && (
          <Box sx={{ mt: 6 }}>
            <Alert severity="info">Blog not found.</Alert>
          </Box>
        )}

        {!loading && !error && blog && (
          <Stack>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {blog.name}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />
            <TiptapViewer content={blog.description} />
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                mt: 1,
              }}
            >
              {(blog.posts ?? []).map((post) => {
                const safeHtml = DOMPurify.sanitize(post.content, {
                  USE_PROFILES: { html: true },
                });

                return (
                  <Card
                    key={post.id}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardActionArea
                      component={Link}
                      to={`/post/${post.id}`}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                        flexGrow: 1,
                        position: "relative",
                      }}
                    >
                      <CardContent
                        sx={{
                          top: 8,
                          left: 8,
                          right: 8,
                          bgcolor: "rgba(0,0,0,0.55)",
                          color: "common.white",
                          borderRadius: 1,
                          py: 0.5,
                          px: 1,
                          pointerEvents: "none",
                          zIndex: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700 }}
                        >
                          {post.title}
                        </Typography>
                      </CardContent>

                      <CardContent sx={{ textAlign: "left" }}>
                        <Box
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            "& > *": {
                              margin: 0,
                            },
                          }}
                        >
                          <TiptapViewer content={safeHtml} />
                        </Box>
                      </CardContent>
                    </CardActionArea>

                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        mt: "auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        size="small"
                        component={Link}
                        to={`/post/${post.id}`}
                      >
                        Read
                      </Button>
                    </Box>
                  </Card>
                );
              })}
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default Blog;

import { useEffect, useState, useMemo } from "react";
import { fetchPost, type PostExtended, type Comment } from "../lib/api";
import { createComment } from "../lib/comment";
import { useParams } from "react-router";
import DOMPurify from "dompurify";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { TiptapViewer } from "../components/TiptapViewer";
import { TiptapEditor } from "../components/TiptapEditor";
import EditIcon from "@mui/icons-material/Edit";
import { Link as RouterLink } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "../context/AuthContext";

function calcReadTime(html: string) {
  // rough word count from textContent
  const text =
    new DOMParser().parseFromString(html, "text/html").body.textContent || "";
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wpm = 200;
  return Math.max(1, Math.round(words / wpm));
}

const Post = () => {
  const { postId } = useParams<{ postId?: string }>();
  const [post, setPost] = useState<PostExtended | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  // For demo purposes: determine logged in state (adapt as needed)
  const isLoggedIn = useAuth().isAuthenticated;

  if (!postId) {
    setError("No post id provided");
    setLoading(false);
    return null;
  }

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchPost(postId)
      .then((data) => {
        if (mounted) {
          console.log(data);
          setPost(data);
          // assume data.comments returns an array of comments; if not available, leave comments empty.
          setComments(data.comments || []);
          setError(null);
        }
      })
      .catch((e) => {
        if (mounted) {
          setError(e?.message || "Failed to load post");
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
  }, [postId]);

  const sanitized = useMemo(() => {
    if (!post?.content) return "";
    return DOMPurify.sanitize(post.content, { USE_PROFILES: { html: true } });
  }, [post?.content]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      // createComment should accept postId and comment text; adjust parameters as needed.
      const newComment = await createComment({
        postId: parseInt(postId),
        content: commentText,
      });
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    } catch (err: any) {
      alert(err.message || "Failed to add comment");
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", px: 2, py: { xs: 2, md: 4 } }}>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && post === null && postId && (
          <Box sx={{ mt: 6 }}>
            <Alert severity="info">Blog not found.</Alert>
          </Box>
        )}
        {!loading && !error && post && (
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{ fontWeight: 700 }}
                  >
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.author ?? "Unknown author"} •{" "}
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString()
                      : "—"}{" "}
                    • ~ {calcReadTime(post.content)} mins read
                  </Typography>
                </Box>
              </Stack>
              {post.allowedActions.includes("edit") && (
                <Tooltip title="Edit post">
                  <IconButton
                    component={RouterLink}
                    to={`/post/${postId}/edit`}
                    color="primary"
                    size="large"
                    aria-label="Edit post"
                    sx={{ ml: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Paper
              elevation={0}
              sx={{ p: 0, borderRadius: 2, overflow: "hidden" }}
            >
              <TiptapViewer content={sanitized} />
            </Paper>

            {/* Comment Section */}
            <Divider sx={{ my: 4 }} />
            <Box>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Comments
              </Typography>
              {comments.length === 0 ? (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  No comments yet.
                </Typography>
              ) : (
                comments.map((c) => (
                  <Paper key={c.id} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2">
                      {c.author} •{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </Typography>
                    <TiptapViewer
                      content={DOMPurify.sanitize(c.content, {
                        USE_PROFILES: { html: true },
                      })}
                    />
                  </Paper>
                ))
              )}

              {isLoggedIn ? (
                <Box sx={{ mt: 2 }}>
                  <TiptapEditor
                    content={commentText}
                    onChange={setCommentText}
                  />
                  <Button
                    variant="contained"
                    sx={{ mt: 1 }}
                    onClick={handleCommentSubmit}
                  >
                    Post Comment
                  </Button>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  You must be logged in to post a comment.
                </Typography>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Post;

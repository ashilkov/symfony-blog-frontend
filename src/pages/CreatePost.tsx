import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createPost, fetchBlogs, generatePost, type Blog } from "../lib/api";

import { TiptapEditor } from "../components/TiptapEditor";

type FormValues = {
  title: string;
  content: string;
  blog: string;
};

const schema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .max(200, "Max 200 characters"),
  content: yup
    .string()
    .required("Content is required")
    .max(20000, "Max 20000 characters"),
  blog: yup.string().required("Choose a blog"),
});

const CreatePost = () => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
    control,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { title: "", content: "", blog: "" },
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState<boolean>(true);
  const [loading, setLoading] = useState(false); // generating overlay

  useEffect(() => {
    let mounted = true;
    fetchBlogs()
      .then((list) => {
        if (!mounted) return;
        setBlogs(list);
        if (list.length > 0) {
          setValue("blog", list[0].id);
        }
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message || "Failed to load blogs");
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingBlogs(false);
      });
    return () => {
      mounted = false;
    };
  }, [setValue]);

  const onSubmit = async (values: FormValues) => {
    setSuccess(null);
    setError(null);
    try {
      const post = await createPost(values);
      setSuccess(`Post "${post.title}" created.`);
      reset();
    } catch (e: any) {
      setError(e?.message || "Failed to create post");
    }
  };

  const onGenerateClick = async () => {
    setLoading(true);
    setError(null);
    // Get current form values if needed
    const { title, content, blog } = getValues();
    try {
      const response = await generatePost(title, content, blog.toString());
      // Update the form fields with setValue
      setValue("title", response.title);
      setValue("content", response.content);
    } catch (e: any) {
      setError(e?.message || "Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 720,
          p: { xs: 2, sm: 3 },
          mt: { xs: 2, sm: 4 },
        }}
        aria-busy={loading}
      >
        <Typography variant="h5" gutterBottom align="center">
          Create Post
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <FormControl
              fullWidth
              disabled={loadingBlogs || loading}
              error={!!errors.blog}
            >
              <InputLabel id="blog-select-label">Blog</InputLabel>
              <Controller
                name="blog"
                control={control}
                render={({ field }) => (
                  <Select
                    labelId="blog-select-label"
                    label="Blog"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {loadingBlogs && (
                      <MenuItem value="" disabled>
                        <CircularProgress size={16} sx={{ mr: 1 }} /> Loading...
                      </MenuItem>
                    )}
                    {blogs.map((b) => (
                      <MenuItem key={b._id} value={b._id}>
                        {b.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  disabled={loading}
                />
              )}
            />

            {/* Tiptap editor (with HTML source mode) wired to react-hook-form */}
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <>
                  <TiptapEditor
                    content={field.value}
                    onChange={field.onChange}
                    // if TiptapEditor supports a disabled prop, you could pass it here
                  />
                  {errors.content && (
                    <Typography variant="caption" color="error">
                      {errors.content.message}
                    </Typography>
                  )}
                </>
              )}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? "Creating..." : "Create Post"}
            </Button>
            <Button
              type="button"
              variant="contained"
              disabled={isSubmitting || loading}
              onClick={onGenerateClick}
            >
              {loading ? "Generating..." : "Generate content"}
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Full screen MUI Backdrop shown while generating */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
        open={loading}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress color="inherit" />
          <Typography>Generating…</Typography>
        </Stack>
      </Backdrop>
    </Box>
  );
};

export default CreatePost;

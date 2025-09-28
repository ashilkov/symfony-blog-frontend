import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchPost, editPost, generatePost } from "../lib/api";
import { TiptapEditor } from "../components/TiptapEditor";

type FormValues = {
  title: string;
  content: string;
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
});

const EditPost = () => {
  const { postId } = useParams<{ postId?: string }>();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    getValues,
    control,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { title: "", content: "" },
  });

  const [loadingPost, setLoadingPost] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingGenerate, setLoadingGenerate] = useState(false);

  // store blog id here (hidden, not editable)
  const [blogId, setBlogId] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setError("No post id provided");
      setLoadingPost(false);
      return;
    }

    let mounted = true;
    setLoadingPost(true);
    fetchPost(postId)
      .then((data: any) => {
        if (!mounted) return;
        setValue("title", data.title ?? "");
        setValue("content", data.content ?? "");
        // try several common shapes for blog id
        const blogVal =
          (data.blog_id ?? data.blog?.id ?? data.blog ?? "")?.toString?.() ??
          "";
        setBlogId(blogVal || null);
        setError(null);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message || "Failed to load post");
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingPost(false);
      });

    return () => {
      mounted = false;
    };
  }, [postId, setValue]);

  const onSubmit = async (values: FormValues) => {
    if (!postId) {
      setError("No post id provided");
      return;
    }
    setError(null);
    setSuccess(null);
    let input = { id: postId, content: values.content, title: values.title };
    try {
      const updated = await editPost(input);
      setSuccess(`Post "${updated.title}" updated.`);
      reset(values);
    } catch (e: any) {
      setError(e?.message || "Failed to update post");
    }
  };

  const onGenerateClick = async () => {
    if (!blogId) {
      setError("Cannot generate content: blog id missing");
      return;
    }
    setLoadingGenerate(true);
    const { title, content } = getValues();
    try {
      // pass blogId even though blog isn't editable
      const response = await generatePost(title, content, blogId);
      setValue("title", response.title);
      setValue("content", response.content);
    } catch (e: any) {
      setError(e?.message || "Failed to generate content");
    } finally {
      setLoadingGenerate(false);
    }
  };

  if (!postId) {
    return (
      <Box sx={{ maxWidth: 720, mx: "auto", px: 2, py: 4 }}>
        <Alert severity="error">No post id provided</Alert>
      </Box>
    );
  }

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
      >
        <Typography variant="h5" gutterBottom align="center">
          Edit Post
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

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
                />
              )}
            />

            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <>
                  <TiptapEditor
                    content={field.value}
                    onChange={field.onChange}
                  />
                  {errors.content && (
                    <Typography variant="caption" color="error">
                      {errors.content.message}
                    </Typography>
                  )}
                </>
              )}
            />

            <Stack direction="row" spacing={1}>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || loadingPost}
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
              <Button
                type="button"
                variant="outlined"
                disabled={isSubmitting || loadingGenerate}
                onClick={onGenerateClick}
              >
                {loadingGenerate ? "Generating..." : "Generate content"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditPost;

import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { createBlog, generateBlog } from "../lib/api";
import { TiptapEditor } from "../components/TiptapEditor";

type FormValues = {
  name: string;
  description: string;
};

const schema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .max(120, "Max 120 characters"),
  description: yup
    .string()
    .required("Description is required")
    .max(2000, "Max 2000 characters"),
});

const CreateBlog = () => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
    getValues,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", description: "" },
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    setSuccess(null);
    setError(null);
    try {
      const blog = await createBlog(values);
      setSuccess(`Blog "${blog.name}" created.`);
      reset();
    } catch (e: any) {
      setError(e?.message || "Failed to create blog");
    }
  };

  const onGenerateClick = async () => {
    setLoading(true);
    // Get current form values if needed
    const { name, description } = getValues();
    try {
      const response = await generateBlog(name, description);
      // Update the form fields with setValue
      setValue("name", response.name);
      setValue("description", response.description);
      setLoading(false);
    } catch (e: any) {
      setError(e?.message);
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
      >
        <Typography variant="h5" gutterBottom align="center">
          Create Blog
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <FormControl fullWidth>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <TiptapEditor
                      name="description"
                      content={value}
                      onChange={onChange}
                      placeholder="Descibe your blog"
                    />
                  </>
                )}
              />
            </FormControl>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Blog"}
            </Button>
            <Button
              type="button"
              variant="contained"
              disabled={isSubmitting}
              onClick={onGenerateClick}
            >
              {isSubmitting ? "Generating..." : "Generate content"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateBlog;

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
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { createBlog } from "../lib/api";
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
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", description: "" },
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <FormControl fullWidth>
              <TextField
                label="Name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register("name")}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <>
                    <TiptapEditor
                      name="description"
                      onChange={field.onChange}
                    />
                  </>
                )}
              />
            </FormControl>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Blog"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateBlog;

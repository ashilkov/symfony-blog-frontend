import { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Stack, TextField, Button, Alert, FormControl,
  InputLabel, Select, MenuItem, CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createPost, fetchBlogs, type Blog } from '../lib/api';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
// Optional sanitization import (recommended):
// import DOMPurify from 'dompurify';

type FormValues = {
  title: string;
  content: string;
  blog: string;
};

const schema = yup.object({
  title: yup.string().required('Title is required').max(200, 'Max 200 characters'),
  content: yup.string().required('Content is required').max(20000, 'Max 20000 characters'),
  blog: yup.string().required('Choose a blog'),
});

function TiptapWithHtmlMode({
  value,
  onChange,
  onBlur,
}: {
  value: string;
  onChange?: (html: string) => void;
  onBlur?: () => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Keep editor content in sync when external value changes
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((value || '') !== current) {
      // Use setContent to completely replace content
      editor.commands.setContent(value || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  const [htmlMode, setHtmlMode] = useState(false);
  const [htmlValue, setHtmlValue] = useState(value || '');

  useEffect(() => {
    setHtmlValue(value || '');
  }, [value]);

  const enterHtmlMode = () => {
    setHtmlValue(editor?.getHTML() ?? value ?? '');
    setHtmlMode(true);
  };

  const applyHtml = () => {
    if (!editor) return;
    // Optional: sanitize htmlValue before inserting:
    // const clean = DOMPurify.sanitize(htmlValue);
    // editor.commands.setContent(clean);
    editor.commands.setContent(htmlValue);
    onChange?.(htmlValue);
    setHtmlMode(false);
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
        <Button
          size="small"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editor}
          variant="outlined"
        >
          Bold
        </Button>
        <Button
          size="small"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editor}
          variant="outlined"
        >
          Italic
        </Button>
        <Button
          size="small"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          disabled={!editor}
          variant="outlined"
        >
          Bullet list
        </Button>
        <Button
          size="small"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          disabled={!editor}
          variant="outlined"
        >
          Numbered
        </Button>
        <Button
          size="small"
          onClick={enterHtmlMode}
          disabled={!editor}
          variant="outlined"
        >
          Edit HTML
        </Button>
      </Stack>

      {htmlMode ? (
        <>
          <TextField
            label="HTML source"
            multiline
            minRows={8}
            fullWidth
            value={htmlValue}
            onChange={(e) => setHtmlValue(e.target.value)}
          />
          <Stack direction="row" spacing={1} mt={1}>
            <Button size="small" variant="contained" onClick={applyHtml}>Apply HTML</Button>
            <Button size="small" variant="outlined" onClick={() => setHtmlMode(false)}>Cancel</Button>
          </Stack>
        </>
      ) : (
        <Paper variant="outlined" sx={{ p: 2, minHeight: 200 }}>
          <div onBlur={() => onBlur?.()}>
            <EditorContent editor={editor} />
          </div>
        </Paper>
      )}
    </Box>
  );
}

const CreatePost = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, control } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { title: '', content: '', blog: '' },
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    fetchBlogs()
      .then((list) => {
        if (!mounted) return;
        setBlogs(list);
        if (list.length > 0) {
          setValue('blog', list[0].id);
        }
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message || 'Failed to load blogs');
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingBlogs(false);
      });
    return () => { mounted = false };
  }, [setValue]);

  const onSubmit = async (values: FormValues) => {
    setSuccess(null);
    setError(null);
    try {
      const post = await createPost(values);
      setSuccess(`Post "${post.title}" created.`);
      reset();
    } catch (e: any) {
      setError(e?.message || 'Failed to create post');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 720, p: { xs: 2, sm: 3 }, mt: { xs: 2, sm: 4 } }}>
        <Typography variant="h5" gutterBottom align="center">Create Post</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <FormControl fullWidth disabled={loadingBlogs} error={!!errors.blog}>
              <InputLabel id="blog-select-label">Blog</InputLabel>
              <Controller
                name="blog"
                control={control}
                render={({ field }) => (
                  <Select
                    labelId="blog-select-label"
                    label="Blog"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {loadingBlogs && (
                      <MenuItem value="" disabled>
                        <CircularProgress size={16} sx={{ mr: 1 }} /> Loading...
                      </MenuItem>
                    )}
                    {blogs.map((b) => (
                      <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <TextField
              label="Title"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register('title')}
            />

            {/* Tiptap editor (with HTML source mode) wired to react-hook-form */}
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <>
                  <Typography variant="subtitle1">Content</Typography>
                  <TiptapWithHtmlMode
                    value={field.value}
                    onChange={(html) => {
                      // Option 1: update via field.onChange so RHF stores the HTML value
                      field.onChange(html);
                      // Option 2 (if you need to force validation/dirty flags):
                      // setValue('content', html, { shouldValidate: true, shouldDirty: true });
                    }}
                    onBlur={field.onBlur}
                  />
                  {errors.content && <Typography variant="caption" color="error">{errors.content.message}</Typography>}
                </>
              )}
            />

            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreatePost;

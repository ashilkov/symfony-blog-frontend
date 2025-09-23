import { useEffect, useState, useMemo } from 'react';
import { fetchPost, type PostExtended } from '../lib/api';
import { useParams } from 'react-router';
import DOMPurify from 'dompurify';
import { Alert, Box, CircularProgress, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import { TiptapViewer } from '../components/TiptapViewer';


function calcReadTime(html: string) {
    // rough word count from textContent
    const text = (new DOMParser().parseFromString(html, 'text/html')).body.textContent || '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const wpm = 200;
    return Math.max(1, Math.round(words / wpm));
}

const Post = () => { 
    const {postId} = useParams<{postId?: string}>();
    const [post, setPost] = useState<PostExtended|null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    if (!postId){
        setError('No post id provided');
        setLoading(false);

        return;
    }

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchPost(postId)
            .then((data) => { if (mounted) { setPost(data); setError(null); } })
            .catch((e) => { if (mounted) { setError(e?.message || 'Failed to load post'); } })
            .finally(() => { if (mounted) { setLoading(false); } });
        return () => { mounted = false };
    }, []);

    const sanitized = useMemo(() => {
        if (!post?.content) return '';
        return DOMPurify.sanitize(post.content, { USE_PROFILES: { html: true } });
      }, [post?.content]);
      
    if (!post) {
        return (
            <Container sx={{ mt: 6 }}>
                <Alert severity="info">Post not found.</Alert>
            </Container>
        );
    }
    
    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: 2, py: { xs: 2, md: 4 } }}>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                )}
                {error && <Alert severity="error">{error}</Alert>}
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                                {post.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {post.user?.username ?? 'Unknown author'} • {post.created_at ? new Date(post.created_at).toLocaleDateString() : '—'}  • ~ {calcReadTime(post.content)} mins read
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Paper elevation={0} sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
                    <TiptapViewer content={sanitized} />
                </Paper>
            </Box>
        </Box>
    );
}

export default Post;
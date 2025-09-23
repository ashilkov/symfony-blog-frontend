import { useEffect, useState } from 'react';
import { fetchBlogs, type Blog } from '../lib/api';
import { Box, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Alert, Stack, IconButton, Menu, MenuItem } from '@mui/material';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
            .then((data) => { if (mounted) { setBlogs(data); setError(null); } })
            .catch((e) => { if (mounted) { setError(e?.message || 'Failed to load blogs'); } })
            .finally(() => { if (mounted) { setLoading(false); } });
        return () => { mounted = false };
    }, []);

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
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
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
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
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            )}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && (
                <Paper>
                    <List>
                        {(blogs ?? []).map((b) => (
                            <ListItem key={b.id} divider component={Link} to={`/blog/${b.id}`}>
                                <ListItemText
                                    primary={b.name}
                                    secondary={b.description}
                                />
                            </ListItem>
                        ))}
                        {(!blogs || blogs.length === 0) && (
                            <ListItem>
                                <ListItemText primary="No blogs yet." />
                            </ListItem>
                        )}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default Blogs;



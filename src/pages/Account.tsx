import { Box, Paper, Typography, Stack, Divider, Button, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Account = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleLogout = () => {
        logout();
        setShowSuccessMessage(true);
        // Redirect to homepage after a short delay to show the success message
        setTimeout(() => {
            navigate('/', { 
                state: { message: 'You have been successfully logged out.' } 
            });
        }, 1500);
    };

    if (!user) {
        return (
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6">You are not logged in.</Typography>
                <Typography variant="body2" color="text.secondary">Please log in to view your account.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper elevation={3} sx={{ width: '100%', maxWidth: 720, p: { xs: 2, sm: 3 } }}>
                <Typography variant="h5" gutterBottom>My Account</Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                    {showSuccessMessage && (
                        <Alert severity="success">
                            Logging out... You will be redirected to the homepage.
                        </Alert>
                    )}
                    <Stack spacing={1}>
                        <Typography><strong>Full name:</strong> {user.fullname}</Typography>
                        <Typography><strong>Username:</strong> {user.username}</Typography>
                        <Typography><strong>Email:</strong> {user.email}</Typography>
                        <Typography variant="caption" color="text.secondary">ID: {user.id}</Typography>
                    </Stack>
                    <Divider />
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={handleLogout}
                        disabled={showSuccessMessage}
                        sx={{ alignSelf: 'flex-start' }}
                    >
                        {showSuccessMessage ? 'Logging out...' : 'Logout'}
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default Account;



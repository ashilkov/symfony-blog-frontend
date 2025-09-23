import { Box, Button, TextField, Typography, Stack, Link as MuiLink, Alert, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { login, fetchMeUser } from '../lib/api';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

type FormValues = { username: string; password: string };

const schema = yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().min(6, 'At least 6 characters').required('Password is required'),
});

const Login = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: { username: '', password: '' },
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const onSubmit = async (values: FormValues) => {
        setErrorMessage(null);
        try {
            await login(values);
            const me = await fetchMeUser();
            setUser(me);
            navigate('/');
        } catch (err: any) {
            setErrorMessage(err?.message || 'Login failed');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper elevation={3} sx={{ width: '100%', maxWidth: 480, p: { xs: 2, sm: 3 }, mt: { xs: 2, sm: 4 } }}>
                <Typography variant="h5" gutterBottom align="center">Login</Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={2}>
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    <TextField
                        label="Username"
                        fullWidth
                        error={!!errors.username}
                        helperText={errors.username?.message}
                        {...register('username')}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        {...register('password')}
                    />
                    <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </Button>
                    </Stack>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} align="center">
                    Don&apos;t have an account? <MuiLink component={Link} to="/register">Register</MuiLink>
                </Typography>
            </Paper>
        </Box>
    );
};

export default Login;



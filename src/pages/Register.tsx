import { useState } from 'react';
import { Box, Button, TextField, Typography, Stack, Link as MuiLink, Alert, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { register as apiRegister } from '../lib/api';

const Register = () => {
    type FormValues = { name: string; email: string; password: string; confirmPassword: string };

    const schema = yup.object({
        name: yup.string().required('Name is required'),
        email: yup.string().email('Enter a valid email').required('Email is required'),
        password: yup.string().min(6, 'At least 6 characters').required('Password is required'),
        confirmPassword: yup.string()
            .oneOf([yup.ref('password')], 'Passwords must match')
            .required('Confirm your password'),
    });

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const onSubmit = async (values: FormValues) => {
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            await apiRegister({ name: values.name, email: values.email, password: values.password });
            setSuccessMessage('Registration successful. You can now log in.');
        } catch (err: any) {
            setErrorMessage(err?.message || 'Registration failed');
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper elevation={3} sx={{ width: '100%', maxWidth: 560, p: { xs: 2, sm: 3 }, mt: { xs: 2, sm: 4 } }}>
                <Typography variant="h5" gutterBottom align="center">Register</Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={2}>
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}
                    <TextField
                        label="Name"
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        {...register('name')}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        {...register('email')}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        {...register('password')}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />
                        <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </Stack>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} align="center">
                    Already have an account? <MuiLink component={Link} to="/login">Login</MuiLink>
                </Typography>
            </Paper>
        </Box>
    );
};

export default Register;



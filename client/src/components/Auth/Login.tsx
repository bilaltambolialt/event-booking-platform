import { useFormik } from 'formik';
import * as Yup from 'yup';
import React from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

interface LoginValues {
  email: string;
  password: string;
}

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik<LoginValues>({
    initialValues: { 
      email: '', 
      password: '' 
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await api.post('/auth/login', values);
        login(response.data.token);
        toast.success('Login successful!');
        navigate('/'); // ✅ Redirect to home after login
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || 'Login failed. Please try again.'
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box sx={{ 
      maxWidth: 400, 
      mx: 'auto', 
      mt: 4,
      p: 3,
      boxShadow: 3,
      borderRadius: 2
    }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Login
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email Address"
          variant="outlined"
          margin="normal"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 3, mb: 2 }}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Box>
  );
};

export default Login;

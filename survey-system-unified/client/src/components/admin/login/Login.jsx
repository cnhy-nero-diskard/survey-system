import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import bgimage from './Designer.png';
import {
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Styled components
const LoginContainer = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ isDesktop }) =>
    isDesktop
      ? 'linear-gradient(to right, rgb(142, 149, 255) 50%, rgb(185, 204, 255) 50%)'
      : '#f5f5f5'};
`;

const StyledPaper = styled(Paper)`
  padding: 2rem;
  width: 100%;
  border-radius: 20px;
  max-width: 400px;
  background: rgb(255, 255, 255);
`;

const StyledForm = styled.form`
  margin-bottom: 1.5rem;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 1.5rem;
`;

const StyledButton = styled(Button)`
  padding: 0.75rem;
  border-radius: 20px;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${bgimage});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
`;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [showPassword, setShowPassword] = useState(false);

  // Formik setup with Yup validation
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/api/auth/login`,
          values,
          { withCredentials: true }
        );
        login(); // Update authentication state
        navigate('/admin'); // Redirect to admin dashboard
      } catch (err) {
        if (err.response) {
          if (err.response.status === 401) {
            setErrors({ submit: 'Invalid username or password' });
          } else {
            setErrors({ submit: 'An unexpected error occurred.' });
          }
        } else if (err.request) {
          setErrors({ submit: 'Network error. Please check your connection.' });
        } else {
          setErrors({ submit: 'An unexpected error occurred.' });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <LoginContainer isDesktop={isDesktop}>
      <Grid container sx={{ maxWidth: '1200px', margin: 'auto' }}>
        {/* Login Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
          }}
        >
          <StyledPaper elevation={3}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Login
            </Typography>
            {formik.errors.submit && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formik.errors.submit}
              </Alert>
            )}
            <StyledForm onSubmit={formik.handleSubmit}>
              <StyledTextField
                fullWidth
                id="username"
                name="username"
                label="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                disabled={formik.isSubmitting}
              />
              <StyledTextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                disabled={formik.isSubmitting}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <StyledButton
                fullWidth
                variant="contained"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? 'Logging in...' : 'Login'}
              </StyledButton>
            </StyledForm>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              <a href="/forgot-password" style={{ textDecoration: 'none' }}>
                Forgot your password?
              </a>
            </Typography>
          </StyledPaper>
        </Grid>

        {/* Placeholder Image (Desktop Only) */}
        {isDesktop && (
          <Grid
            item
            md={6}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
            }}
          >
            <ImageContainer />
          </Grid>
        )}
      </Grid>
    </LoginContainer>
  );
};

export default Login;

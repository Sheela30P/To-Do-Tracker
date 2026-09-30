import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Typography } from '@mui/material';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';


// Styled-components for custom styles
const StyledBox = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

const StyledForm = styled.form`
  width: 100%;
  max-width: 400px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem !important;
`;

const StyledButton = styled(Button)`
  margin-top: 1rem !important;
`;

// Styled Link for navigation
const StyledLink = styled(Link)`
  display: block;
  margin-top: 1rem;
  text-align: center;
  text-decoration: none;
  color: #1976d2;
  &:hover {
    color: #1565c0;
    text-decoration: underline;
  }
`;
const Login = () => {
  const [error, setError] = useState('');
  const { setLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:8080/user/loginCheck", data);
      const token = response.data.token; // assuming the token is in the response
      localStorage.setItem('authToken', token); // store the token
      setLoggedIn(true);
      navigate("/mainview");
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <StyledBox>
      <StyledForm onSubmit={handleSubmit(onSubmit)} >
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <StyledTextField
          label="Email"
          variant="outlined"
          fullWidth
          {...register('userEmail', {
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Email is not valid'
            }
          })}
          error={!!errors.userEmail}
          helperText={errors.userEmail ? errors.userEmail.message : ''}
        />

        <StyledTextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          {...register('password', { required: 'Password is required' })}
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ''}
        />
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
        <StyledButton type="submit" variant="contained" color="primary" fullWidth>
          Login
        </StyledButton>
        <StyledLink to="/forgot-password">Forgot Password?</StyledLink>
        <StyledLink to="/signup">Sign Up</StyledLink>
      </StyledForm>
    </StyledBox>
  );
};

export default Login;

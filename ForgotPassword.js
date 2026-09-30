import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

const ForgotPassword = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'error' or 'success'
  const navigate = useNavigate();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const sendOtp = async (data) => {
    try {
      const { email } = data;
      const response = await axios.get(`http://localhost:8080/user/checkEmailExists?userEmail=${email}`);
      if (response.data.exists) {
        await axios.post(`http://localhost:8080/user/sendOtp?email=${email}`);
        setOtpSent(true);
        setSnackbarMessage('OTP sent to your email');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Email does not exist. Please check your email.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setSnackbarMessage('Error sending OTP: ' + (error.response?.data?.message || 'Something went wrong!'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const onVerifyOtp = async (data) => {
    try {
      const userEmail = watch('email');
      const response = await axios.post(`http://localhost:8080/user/verifyOtp?email=${userEmail}&otp=${data.otp}`);
      if (response.data === 'OTP verified successfully') {
        setVerified(true);
        setSnackbarMessage('Email verified. You can now reset your password.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Invalid OTP');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setSnackbarMessage('Error verifying OTP: ' + (error.response?.data?.message || 'Please try again.'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const onUpdatePassword = async (data) => {
    try {
      const userEmail = watch('email');
      const newPassword = data.newPassword;
  
      console.log(userEmail);
      console.log(newPassword);
  
      const response = await axios.put(`http://localhost:8080/user/updatePassword?userEmail=${encodeURIComponent(userEmail)}&newPassword=${encodeURIComponent(newPassword)}`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      setSnackbarMessage('Password updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      alert('Password updated successfully!');
      reset();  // Reset the form
      setVerified(false);  // Reset verification state
      setOtpSent(false);  // Reset OTP state
      navigate("/login");
    } catch (error) {
      console.error('Error updating password:', error);
      setSnackbarMessage('Error updating password. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <StyledBox>
      {!otpSent ? (
        <StyledForm onSubmit={handleSubmit(sendOtp)}>
          <Typography variant="h5" align="center" gutterBottom>
            Forgot Password
          </Typography>
          <StyledTextField
            label="Email"
            variant="outlined"
            fullWidth
            {...register('email', { required: 'Email is required' })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
          />
          <StyledButton type="submit" variant="contained" color="primary" fullWidth>
            Send OTP
          </StyledButton>
        </StyledForm>
      ) : !verified ? (
        <StyledForm onSubmit={handleSubmit(onVerifyOtp)}>
          <Typography variant="h5" align="center" gutterBottom>
            Verify OTP
          </Typography>
          <StyledTextField
            label="OTP"
            variant="outlined"
            fullWidth
            {...register('otp', { required: 'OTP is required' })}
            error={!!errors.otp}
            helperText={errors.otp ? errors.otp.message : ''}
          />
          <StyledButton type="submit" variant="contained" color="primary" fullWidth>
            Verify OTP
          </StyledButton>
        </StyledForm>
      ) : (
        <StyledForm onSubmit={handleSubmit(onUpdatePassword)}>
          <Typography variant="h5" align="center" gutterBottom>
            Reset Password
          </Typography>
          <StyledTextField
            label="New Password"
            variant="outlined"
            type="password"
            fullWidth
            {...register('newPassword', { required: 'New password is required' })}
            error={!!errors.newPassword}
            helperText={errors.newPassword ? errors.newPassword.message : ''}
          />
          <StyledButton type="submit" variant="contained" color="primary" fullWidth>
            Update Password
          </StyledButton>
        </StyledForm>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </StyledBox>
  );
};

export default ForgotPassword;

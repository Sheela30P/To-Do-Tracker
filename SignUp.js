import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import styled from 'styled-components';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Styled components
const Button = styled.button`
  background-color: #007bff;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #0056b3;
  }
`;

const LoginButton = styled(Button)`
  background-color: #28a745;

  &:hover {
    background-color: #218838;
  }
`;

const SignUpWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding-bottom: 50px;
`;

const FormField = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Error = styled.p`
  color: red;
`;

const SignUp = () => {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');

  // Snackbar state management
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const sendOtp = async (userEmail) => {
    if (!userEmail) {
      setSnackbarMessage('Please enter your email before sending OTP.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      console.log(`Checking if email exists: ${userEmail}`);
      const response = await axios.get(`http://localhost:8080/user/checkEmailExists?userEmail=${userEmail}`);
      const exists = response.data.exists;

      console.log(`Email exists: ${exists}`);

      if (exists) {
        setSnackbarMessage('Email already exists. Cannot send OTP for verification.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return; // Early return if email exists
      }

      await axios.post(`http://localhost:8080/user/sendOtp?email=${userEmail}`);
      setOtpSent(true);
      setSnackbarMessage('OTP sent to your email');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setSnackbarMessage('Error sending OTP: ' + (error.response?.data?.message || 'Something went wrong!'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/user/verifyOtp?email=${watch('userEmail')}&otp=${otp}`);
      if (response.data === 'OTP verified successfully') {
        setEmailVerified(true);
        setSnackbarMessage('Email verified');
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

  const onSubmit = async (data) => {
    if (!emailVerified) {
      setSnackbarMessage('Please verify your email before signing up.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (emailExists) {
      setSnackbarMessage('Email already exists or is already verified.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return; // Prevent form submission if the email already exists
    }

    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('usermobile', data.mobileNo);
    formData.append('email', data.userEmail);
    formData.append('password', data.password);
    formData.append('profileImage', data.profileImage[0]);

    try {
      await axios.post('http://localhost:8080/user/addUser', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSnackbarMessage('User created successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      reset();
      localStorage.removeItem('emailVerified'); // Clear the status on successful sign-up

      // Show an alert and navigate to the login page
      alert('Sign-up successful! You can now log in.');
      window.location.href = '/login';

    } catch (error) {
      console.error('Error registering user!', error);
      setSnackbarMessage('Error registering user: ' + (error.response?.data?.message || 'Something went wrong!'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <SignUpWrapper>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField>
          <Label htmlFor="userEmail">Email</Label>
          <Input
            id="userEmail"
            type="email"
            {...register('userEmail', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Email is not valid'
              }
            })}
            disabled={emailVerified}
          />
          <Button
            type="button"
            onClick={() => sendOtp(watch('userEmail'))}
            disabled={emailExists || emailVerified}
          >
            {otpSent ? 'Resend OTP' : 'Send OTP'}
          </Button>
          {otpSent && (
            <>
              <FormField>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
              </FormField>
              <Button type="button" onClick={verifyOtp}>Verify OTP</Button>
            </>
          )}
          {errors.userEmail && <Error>{errors.userEmail.message}</Error>}
          {emailExists && <Error>{emailMessage}</Error>}
        </FormField>

        {emailVerified && (
          <>
            <FormField>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                {...register('username', {
                  required: 'Username is required',
                  pattern: {
                    value: /^[A-Za-z ]+$/,
                    message: 'Username must contain only letters'
                  }
                })}
              />
              {errors.username && <Error>{errors.username.message}</Error>}
            </FormField>

            <FormField>
              <Label htmlFor="mobileNo">Mobile Number</Label>
              <Input
                id="mobileNo"
                type="text"
                {...register('mobileNo', {
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^(?:[6-9]\d{9})$/,
                    message: 'Mobile number must be 10 digits and start with 6, 7, 8, or 9'
                  }
                })}
              />
              {errors.mobileNo && <Error>{errors.mobileNo.message}</Error>}
            </FormField>

            <FormField>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  pattern: {
                    value: /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Za-z]).{8,}$/,
                    message: 'Password must contain at least one letter, one number, and one special character',
                  }
                })}
              />
              {errors.password && <Error>{errors.password.message}</Error>}
            </FormField>

            <FormField>
              <Label htmlFor="profileImage">Profile Image</Label>
              <Input id="profileImage" type="file" {...register('profileImage')} />
            </FormField>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <Button type="submit" disabled={!emailVerified || emailExists}>Sign Up</Button>

          {/* Only show the 'Already a user?' and Login button if the email is not verified */}
          {!emailVerified && (
            <div style={{ display: 'flex', alignItems: 'center', textAlign: 'right' }}>
              <p style={{ margin: '0 10px 0 0' }}>Already a user?</p>
              <LoginButton type="button" onClick={() => window.location.href = '/login'}>
                Login
              </LoginButton>
            </div>
          )}
        </div>


      </form>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SignUpWrapper>
  );
};

export default SignUp;

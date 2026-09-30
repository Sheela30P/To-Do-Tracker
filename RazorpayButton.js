import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Ensure you have this installed
import styled from 'styled-components';

const PayButton = styled.button`
  background-color: #28a745; /* Green background */
  color: white; /* White text */
  padding: 10px 20px; /* Padding for better spacing */
  font-size: 16px; /* Text size */
  border: none; /* Remove default border */
  border-radius: 5px; /* Rounded corners */
  cursor: pointer; /* Pointer cursor on hover */
  transition: background-color 0.3s ease; /* Smooth background change on hover */
  
  &:hover {
    background-color: #218838; /* Darker green on hover */
  }
  
  &:active {
    background-color: #1e7e34; /* Even darker green when pressed */
    transform: scale(0.98); /* Slightly shrink on click for feedback */
  }
`;

const RazorpayButton = ({ onSuccess }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const options = {
      key: "rzp_test_TfbnV6gTYPWzIi", // Replace with your Razorpay Test API Key
      amount: 50000, // Amount in paise (50000 paise = INR 500)
      currency: 'INR',
      name: 'NoteLog',
      description: 'Test Transaction',
      image: 'https://your-logo-url.com/logo.png', // Add a valid logo URL
      handler: (response) => handlePaymentSuccess(response),
      prefill: {
        name: 'John Doe',
        email: 'john@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Razorpay Corporate Office',
      },
      theme: {
        color: '#F37254',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handlePaymentSuccess = async (response) => {
    if (!response.razorpay_payment_id) {
      alert('Payment failed. Please try again.');
      return;
    }

    alert(`Payment ID: ${response.razorpay_payment_id}`);
    await updateSubscriptionStatus(response.razorpay_payment_id);
  };

  const updateSubscriptionStatus = async (paymentId) => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert('Authentication token not found.');
      return;
    }

    const email = jwtDecode(authToken).ThisUserEmail;

    const formData = new FormData();
    formData.append('paymentId', paymentId);
    formData.append('email', email);

    try {
      const response = await axios.post('http://localhost:8080/user/subscribe', formData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Subscription updated successfully! You can now add more notes.');
        setIsSubscribed(true); // Update state
        onSuccess(); // Notify MainView about successful subscription
      } else {
        alert('Failed to update subscription. Please contact support.');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('An error occurred while updating subscription. Check console for details.');
      if (error.response) {
        console.error('Error details:', error.response.data);
      }
    }
  };

  return (
    <div>
      <PayButton onClick={handlePayment}>Pay Now</PayButton>
    </div>
  );
};

export default RazorpayButton;

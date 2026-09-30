import { useForm } from "react-hook-form";
import axios from "axios";
import {
  TextField,
  Button,
  Snackbar,
} from "@mui/material";
import styled from "styled-components";
import {jwtDecode} from "jwt-decode"; // Fixed import syntax
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

// Styled-components for form layout
const FormContainer = styled.div`
  width: 400px;
  margin: 0 auto;
  margin-top: 50px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #1976d2;
`;

const FormField = styled.div`
  margin-bottom: 20px;
`;

const SubmitButton = styled(Button)`
  && {
    color: white;
  }
`;

export default function EditProfile() {
  const token = localStorage.getItem("authToken");
  const [decodedToken, setDecodedToken] = useState(null); // State for decoded token
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // State to hold the uploaded image file
  const { setLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue, // Add setValue to update form fields
  } = useForm();

  useEffect(() => {
    // Decode token safely
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);

        // Set values in the form after decoding
        setValue("userEmail", decoded.ThisUserEmail);
        setValue("userName", decoded.ThisUserName);
        setValue("mobileNo", decoded.ThisMobileNumber);

      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("No token found");
    }
  }, [token, setValue]);

  const onSubmit = (data) => {
    if (!decodedToken) {
      console.error("No decoded token available");
      return; // Exit if token decoding failed
    }

    const formData = new FormData();
    formData.append("userName", data.userName || decodedToken.userName);
    formData.append("mobileNo", data.mobileNo || decodedToken.mobileNo);
    formData.append("userEmail", data.userEmail || decodedToken.ThisUserEmail);

    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }

    axios
      .put("http://localhost:8080/user/updateUser", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setOpen(true);
        reset();

        // Fetch updated user data and update context/state
        axios
          .get("http://localhost:8080/user/getUser", {
            headers: {
              Authorization: `Bearer ${token}`, // Send the token to get the updated user details
            },
          })
          .then((res) => {
            // Update the context/state with the new user data
            localStorage.setItem("authToken", response.data.token); // Update token in storage
            setLoggedIn(true); // Ensure the updated data is reflected
            navigate("/editProfile"); // Redirect after updating
          })
          .catch((err) => console.error("Error fetching updated user data", err));
      })
      .catch((error) => {
        console.error("Error updating profile", error.response?.data);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Correctly update the selected file state
    }
  };

  return (
    <FormContainer>
      <Title>Edit Profile</Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField>
          <TextField
            id="userEmail"
            label="Email"
            fullWidth
            variant="standard"
            InputProps={{
              readOnly: true,
            }}
            {...register("userEmail", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            error={!!errors.userEmail}
            helperText={errors.userEmail ? errors.userEmail.message : ""}
          />
        </FormField>

        <FormField>
          <TextField
            id="userName"
            label="User Name"
            fullWidth
            variant="standard"
            {...register("userName")}
            error={!!errors.userName}
            helperText={errors.userName ? errors.userName.message : ""}
          />
        </FormField>

        <FormField>
          <TextField
            id="mobileNo"
            label="Mobile Number"
            fullWidth
            variant="standard"
            {...register("mobileNo", {
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Invalid mobile number",
              },
            })}
            error={!!errors.mobileNo}
            helperText={errors.mobileNo ? errors.mobileNo.message : ""}
          />
        </FormField>
 
        <FormField>
          <input
            type="file"
            accept="image/*"
            {...register("profilePicture")}
            onChange={handleImageChange} // Handle image upload
          />
          {errors.profilePicture && (
            <p style={{ color: "red" }}>{errors.profilePicture.message}</p>
          )}
        </FormField>

        <SubmitButton type="submit" fullWidth variant="contained" color="primary">
          Save Changes
        </SubmitButton>
      </form>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        message="Profile Updated Successfully"
      /> 
      
    </FormContainer>
  );
}
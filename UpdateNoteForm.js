import React, { useState } from 'react';
import styled from 'styled-components';
import {jwtDecode} from 'jwt-decode'; // Assuming you've already installed jwt-decode
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// Styled-components for the form elements
const CardNote = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: auto;
`;

const FormTitle = styled.h3`
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  width: 95%;
  padding: 10px;
  border: 1px solid ${props => (props.error ? 'red' : '#ccc')};
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  width: 95%;
  padding: 10px;
  border: 1px solid ${props => (props.error ? 'red' : '#ccc')};
  border-radius: 4px;
  min-height: 120px;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.875rem;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => (props.primary ? '#007bff' : '#6c757d')};
  color: #fff;
`;

// Alert component for the Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UpdateNoteForm = ({ noteId, currentTitle, currentContent, onCancel, onUpdate }) => {
  const [title, setTitle] = useState(currentTitle || '');
  const [content, setContent] = useState(currentContent || '');
  const [error, setError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state

  const token = localStorage.getItem('authToken');

  const isTokenExpired = (token) => {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  };

  if (!token || isTokenExpired(token)) {
    alert('Your session has expired. Please log in again.');
    return null; // Optionally redirect or call a logout function here
  }

  const decodedToken = jwtDecode(token);
  const userEmail = decodedToken.ThisUserEmail;

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Title validation
    if (title.trim() === '') {
      setTitleError('Title cannot be empty');
      return;
    } else {
      setTitleError(''); // Clear any previous title errors
    }

    const updatedNote = {
      title,
      content,
    };

    console.log("Note ID being updated:", noteId);

    try {
      const response = await fetch(`http://localhost:8081/api/v1/listNote/note/update/${userEmail}/${noteId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to update note');
      }

      // Show success message via Snackbar
      setOpenSnackbar(true);

      setError(''); // Clear any previous errors
      onUpdate(title, content); // Call the onUpdate callback with the updated data
      setTitle(''); // Reset fields after successful update
      setContent('');
    } catch (error) {
      console.error('Update error:', error.message);
      setError(error.message);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <CardNote>
      <FormTitle>Update Note</FormTitle>
      {error && <ErrorText>{error}</ErrorText>}
      <Form onSubmit={handleUpdate}>
        <FormGroup>
          <Label htmlFor="title">Title:</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={titleError}
            required
          />
          {titleError && <ErrorText>{titleError}</ErrorText>}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="content">Content:</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            error={false}
            required
          />
        </FormGroup>
        <FormActions>
          <Button type="submit" primary>Update Note</Button>
          <Button type="button" onClick={onCancel}>Cancel</Button>
        </FormActions>
      </Form>

      {/* Snackbar for successful update */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Note updated successfully!
        </Alert>
      </Snackbar>
    </CardNote>
  );
};

export default UpdateNoteForm;

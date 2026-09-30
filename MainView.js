import React, { useState, useEffect } from "react";
import { Button, FormControl, Input, InputLabel, TextField, CardContent, RadioGroup, FormControlLabel, Radio, FormLabel, Snackbar } from "@mui/material";
import MuiAlert from '@mui/material/Alert'; // Import Alert component for Snackbar
import styled from "styled-components";
import axios from "axios";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import Grid from '@mui/material/Grid';
import CardList from "./CardList";
import RazorpayButton from "./RazorpayButton"; // Import the Razorpay button component

const FullWidthContainer = styled.div`
  width: 100vw; 
  padding: 0;
  margin: 0;
  height: 100vh; 
  padding-top: 80px;
  padding-bottom: 200px;
  padding-right: 15px;
  box-sizing: border-box; 
  background-image: url('/images/image10.jpg'); /* Change this to your image path */
  background-size: cover; /* Cover the entire container */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Prevent the image from repeating */
`;


const StyledCard = styled.div`
  width: 100%; 
  max-width: 500px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 0 auto; 
`;

const StyledHeader = styled.h2`
  cursor: pointer;
  text-align: center;
  margin-bottom: 16px;
  font-size: 15px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const ToggleButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  height:50px;
`;

const SmallButton = styled(Button)`
  padding: 5px 10px; // Adjusted padding for a more attractive size
  border-radius: 20px;
  background-color: #1976d2; // Set a primary color for better visibility
  color: white; // Ensure text is visible
  &:hover {
    background-color: #115293; // Darker shade on hover
  }
`;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function MainView({ cardData, setCardData, onComplete }) {
  const [toggle, setToggle] = useState(false);
  const [priority, setPriority] = useState("low");
  const [today, setToday] = useState('');
  const [noteLimitReached, setNoteLimitReached] = useState(false); 
  const [isSubscribed, setIsSubscribed] = useState(false); 

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // can be 'success', 'error', 'warning', 'info'

  const { register, handleSubmit, reset, formState: { errors }, trigger } = useForm();

  const authToken = localStorage.getItem("authToken");
  const decodedToken = jwtDecode(authToken);
  const email = decodedToken.ThisUserEmail;

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    setToday(formattedDate);
  
    const subscriptionStatus = localStorage.getItem(`isSubscribed_${email}`);
    setIsSubscribed(subscriptionStatus === "true");
  
    checkNoteLimit();
  }, [cardData]);

  const checkNoteLimit = () => {
    const notesCount = cardData?.allNotes?.length || 0;
    setNoteLimitReached(notesCount >= 10 && !isSubscribed);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const onSubmit = async (data) => {
    if (noteLimitReached && !isSubscribed) {
      setSnackbarMessage("You have reached the note limit. Please subscribe to post more notes.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const newNote = {
      title: data.title,
      content: data.content,
      duedate: data.duedate,
      priority: priority,
    };

    try {
      const response = await axios.post(
        `http://localhost:8081/api/v1/listNote/addNotes/${email}`,
        newNote,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        setSnackbarMessage("Note Posted Successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        let fetchedNotes = response.data.allNotes;
        const storedArchivedNotes = JSON.parse(localStorage.getItem(`archivedNotes_${email}`)) || [];

        const filteredNotes = fetchedNotes.filter(
          (note) => !storedArchivedNotes.some(archivedNote => archivedNote.noteId === note.noteId)
        );

        setCardData({
          ...response.data,
          allNotes: filteredNotes,
        });

        reset();
      }
    } catch (error) {
      console.error("Error posting note:", error);
      setSnackbarMessage("Error posting note.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSubscriptionSuccess = () => {
    setIsSubscribed(true); 
    localStorage.setItem(`isSubscribed_${email}`, true);
    setSnackbarMessage("Subscription successful!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleToggle = () => {
    setToggle((prevToggle) => !prevToggle);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  let notes = cardData?.allNotes ?? [];

  return (
    <div>
      <FullWidthContainer>
        <ToggleButtonContainer>
          {!isSubscribed && notes.length >= 10 ? (
            <SmallButton variant="contained" onClick={() => { }}>
              Subscribe to Add More Notes
            </SmallButton>
          ) : (
            <SmallButton variant="contained" onClick={handleToggle}>
              <StyledHeader>{toggle ? "Close" : "Add Note"}</StyledHeader>
            </SmallButton>
          )}
        </ToggleButtonContainer>

        {toggle && (
          <StyledCard>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel htmlFor="title">Title</InputLabel>
                  <Input
                    id="title"
                    {...register("title", {
                      required: "Title is required",
                      maxLength: {
                        value: 20,
                        message: "Title must be within 20 characters long",
                      },
                    })}
                    error={Boolean(errors.title)}
                    onBlur={() => trigger("title")}
                  />
                  {errors.title && <p style={{ color: 'red' }}>{errors.title.message}</p>}
                </FormControl>

                <TextField
                  fullWidth
                  label="Content"
                  id="content"
                  multiline
                  rows={6}
                  {...register("content", { required: true })}
                  sx={{
                    marginTop: '15px', // Add padding
                  }}
                />

                <FormControl component="fieldset" fullWidth>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <FormLabel component="legend">Due Date</FormLabel>
                    </Grid>

                    <Grid item xs>
                      <TextField
                        type="date"
                        {...register("duedate", { required: true })}
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                        onBlur={() => trigger("duedate")}
                        inputProps={{ min: today }}
                        sx={{
                          marginTop: '15px', // Add padding
                        }}
                      />
                    </Grid>
                  </Grid>
                </FormControl>

                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Priority</FormLabel>
                  <RadioGroup
                    row
                    value={priority}
                    onChange={handlePriorityChange}
                    sx={{ justifyContent: "space-around",
                        marginTop: '15px', // Add padding
                     }}
                  >
                    <FormControlLabel value="low" control={<Radio />} label="Low" />
                    <FormControlLabel value="moderate" control={<Radio />} label="Moderate" />
                    <FormControlLabel value="high" control={<Radio />} label="High" />
                  </RadioGroup>
                </FormControl>

                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </form>
            </CardContent>
          </StyledCard>
        )}

        {noteLimitReached && !isSubscribed && (
          <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <h3>You have reached the limit of 10 notes. Please subscribe to add more.</h3>
            <RazorpayButton onSuccess={handleSubscriptionSuccess} /> 
          </div>
        )}

        <main>
          <CardList cardData={cardData} setCardData={setCardData} onComplete={onComplete} />
        </main>
      </FullWidthContainer>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

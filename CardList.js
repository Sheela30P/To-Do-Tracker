import React, { useState } from "react";
import CardNote from "./CardNote";
import { Grid, Typography, Box, Radio, RadioGroup, FormControlLabel, FormControl } from "@mui/material";
import styled from "styled-components";

const FullWidthCardList = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const NotesHeading = styled.h2`
  font-family: 'Lucida Handwriting', cursive;
  font-size: 2rem; /* Adjust the size if needed */
  color: #333; /* Optional: Set a color */
   /* Optional: Add space below the heading */
`;

export default function CardList({ cardData, onComplete }) {
  const [filter, setFilter] = useState("dueDate");

  const notes = cardData?.allNotes?.filter(note => !note.isArchive) ?? [];

  const today = new Date().toISOString().split('T')[0];

  const formatDate = (date) => {
    if (!date) return '';
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return '';
    return parsedDate.toISOString().split('T')[0];
  };

  const pastDueNotes = notes.filter(note => formatDate(note.duedate) < today);
  const todayDueNotes = notes.filter(note => formatDate(note.duedate) === today);
  const futureDueNotes = notes.filter(note => formatDate(note.duedate) > today);

  const highPriorityNotes = notes.filter(note => note.priority === "high");
  const moderatePriorityNotes = notes.filter(note => note.priority === "moderate");
  const lowPriorityNotes = notes.filter(note => note.priority === "low");

  const getFilteredNotes = () => {
    if (filter === "dueDate") {
      return {
        past: pastDueNotes,
        today: todayDueNotes,
        future: futureDueNotes,
      };
    } else {
      return {
        high: highPriorityNotes,
        moderate: moderatePriorityNotes,
        low: lowPriorityNotes,
      };
    }
  };

  const { past, today: todayNotes, future, high, moderate, low } = getFilteredNotes();

  const headingStyles = {
    fontWeight: "bold",
    fontSize: "1.2rem",
    textAlign: "center",
    padding: "8px",
    color: "#333",
    backgroundColor: "#3499f7",
    borderRadius: "8px",
    marginBottom: "10px",
    marginTop: 0,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  };

  return (
    <FullWidthCardList>
       <HeaderContainer>
        <NotesHeading>Your Notes</NotesHeading>
        <FormControl component="fieldset">
          <RadioGroup
            row
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <FormControlLabel value="dueDate" control={<Radio />} label="Filter by Due Date" />
            <FormControlLabel value="priority" control={<Radio />} label="Filter by Priority" />
          </RadioGroup>
        </FormControl>
      </HeaderContainer>

      <Grid container spacing={2} sx={{ margin: 0, padding: 0 }}> 
        {filter === "dueDate" ? (
          <>
            <Grid item xs={4} sx={{ padding: '0 8px' }}> 
              <Typography sx={headingStyles}>Past Due Date ({past.length})</Typography>
              <Box sx={{ 
                maxHeight: 400, 
                overflowY: "auto", 
                border: "1px solid #ccc", 
                padding: "10px", 
                backgroundColor: "#ffcccb", 
                borderRadius: "20px",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f1f1",
                } }}>
                {past.length > 0 ? (
                  past.map((note, noteId ) => (
                    <CardNote
                      key={note.noteId}
                      title={note.title}
                      content={note.content}
                      image={note.image}
                      duedate={note.duedate}
                      priority={note.priority}
                      status={note.status}
                      cardId={note.noteId}
                      onComplete={onComplete}
                    />
                  ))
                ) : (
                  <Typography align="center">No Past Due Notes</Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={4} sx={{ padding: '0 8px' }}> {/* Added horizontal padding */}
              <Typography sx={headingStyles}>Today Due Date ({todayNotes.length})</Typography>
              <Box sx={{ 
              maxHeight: 400, 
              overflowY: "auto", 
              border: "1px solid #ccc", 
              padding: "10px", 
              backgroundColor: "#ffffe0", 
              borderRadius: "20px",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f1f1",
                } }}>
                {todayNotes.length > 0 ? (
                  todayNotes.map((note, noteId) => (
                    <CardNote
                      key={note.noteId}
                      title={note.title}
                      content={note.content}
                      image={note.image}
                      duedate={note.duedate}
                      priority={note.priority}
                      status={note.status}
                      cardId={note.noteId}
                      onComplete={onComplete}
                    />
                  ))
                ) : (
                  <Typography align="center">No Notes Due Today</Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={4} sx={{ padding: '0 8px' }}> {/* Added horizontal padding */}
              <Typography sx={headingStyles}>Future Due Date ({future.length})</Typography>
              <Box sx={{ 
                maxHeight: 400, 
                overflowY: "auto", 
                border: "1px solid #ccc", 
                padding: "10px", 
                backgroundColor: "#d0f0c0", 
                borderRadius: "20px",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f1f1",
                } }}>
                {future.length > 0 ? (
                  future.map((note, noteId) => (
                    <CardNote
                      key={note.noteId}
                      title={note.title}
                      content={note.content}
                      image={note.image}
                      duedate={note.duedate}
                      priority={note.priority}
                      status={note.status}
                      cardId={note.noteId}
                      onComplete={onComplete}
                    />
                  ))
                ) : (
                  <Typography align="center">No Future Due Notes</Typography>
                )}
              </Box>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={4} sx={{ padding: '0 8px' }}> {/* Added horizontal padding */}
              <Typography sx={headingStyles}>High Priority ({high.length})</Typography>
              <Box
                sx={{
                  maxHeight: 400,
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  padding: "10px",
                  backgroundColor: "#ffcccb" ,
                  borderRadius: "20px",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f1f1",
                }
                }}
              >
                {high.length > 0 ? (
                  high.map((note, noteId) => (
                    <CardNote
                      key={note.noteId}
                      title={note.title}
                      content={note.content}
                      image={note.image}
                      duedate={note.duedate}
                      priority={note.priority}
                      status={note.status}
                      cardId={note.noteId}
                      onComplete={onComplete}
                    />
                  ))
                ) : (
                  <Typography align="center">No High Priority Notes</Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={4} sx={{ padding: '0 8px' }}> {/* Added horizontal padding */}
              <Typography sx={headingStyles}>Moderate Priority ({moderate.length})</Typography>
              <Box
                sx={{
                  maxHeight: 400,
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  padding: "10px",
                  backgroundColor: "#ffffe0",
                  borderRadius: "20px",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f1f1",
                }
                }}
              >
                {moderate.length > 0 ? (
                  moderate.map((note, noteId) => (
                    <CardNote
                      key={note.noteId}
                      title={note.title}
                      content={note.content}
                      image={note.image}
                      duedate={note.duedate}
                      priority={note.priority}
                      status={note.status}
                      cardId={note.noteId}
                      onComplete={onComplete}
                    />
                  ))
                ) : (
                  <Typography align="center">No Moderate Priority Notes</Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={4} sx={{ padding: '0 8px' }}> {/* Added horizontal padding */}
              <Typography sx={headingStyles}>Low Priority ({low.length})</Typography>
              <Box
                sx={{
                  maxHeight: 400,
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  padding: "10px",
                  backgroundColor: "#d0f0c0",
                  borderRadius: "20px",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f1f1",
                }
                }}
              >
                {low.length > 0 ? (
                  low.map((note, noteId) => (
                    <CardNote
                      key={note.noteId}
                      title={note.title}
                      content={note.content}
                      image={note.image}
                      duedate={note.duedate}
                      priority={note.priority}
                      status={note.status}
                      cardId={note.noteId}
                      onComplete={onComplete}
                    />
                  ))
                ) : (
                  <Typography align="center">No Low Priority Notes</Typography>
                )}
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </FullWidthCardList>
  );
}

import React, { useEffect } from 'react';
import './ArchiveNotes.css';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

function ArchivedNotes({ archivedNotes, setArchivedNotes, userEmail }) {
  const authToken = localStorage.getItem("authToken");

  // Decode token to get email
  let email;
  if (authToken) {
    const decodedToken = jwtDecode(authToken);
    email = decodedToken.ThisUserEmail; // Ensure you're using the right key for email from the token
  }

  // Retrieve archived notes from localStorage when the component mounts
  useEffect(() => {
    if (email) {
      const savedArchivedNotes = localStorage.getItem(`archivedNotes_${email}`);
      if (savedArchivedNotes) {
        setArchivedNotes(JSON.parse(savedArchivedNotes)); // Set notes from localStorage if they exist
      }
    }
  }, [email, setArchivedNotes]);

  // Handle delete request for an archived note
  const handleDelete = async (noteId) => {
    if (!email) {
      console.error("No email found in token");
      return;
    }

    try {
      // Make DELETE request to backend with Authorization header
      const response = await axios.delete(
        `http://localhost:8081/api/v1/listNote/note/${noteId}/${email}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include JWT token
          },
        }
      );

      if (response.status === 200) {
        // Remove the note from archivedNotes
        const updatedArchivedNotes = archivedNotes.filter((note) => note.noteId !== noteId);

        // Update the state with filtered notes
        setArchivedNotes(updatedArchivedNotes);

        // Save the updated archived notes to localStorage under the user's email
        localStorage.setItem(`archivedNotes_${email}`, JSON.stringify(updatedArchivedNotes));
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="archived-notes-container">
      <h2>Archived Notes</h2>
      {archivedNotes.length === 0 ? (
        <p>No archived notes available.</p>
      ) : (
        <div className="notes-grid">
          {archivedNotes.map((note) => (
            <div key={note.noteId} className="note-card">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <button className="delete-button" onClick={() => handleDelete(note.noteId)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArchivedNotes;

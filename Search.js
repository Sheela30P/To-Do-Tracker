import { useEffect } from "react";
import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import styled from 'styled-components';

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  flex-grow: 1;
  margin-left: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 10px 40px 10px 10px; /* Adjust padding for clear button */
  border-radius: 20px;
  border: 1px solid #dcdcdc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: border 0.3s;

  &:focus {
    outline: none;
    border: 1px solid orange;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 10px; /* Adjust to position the button properly */
  top: 50%;
  transform: translateY(-50%); /* Center vertically */
  border: none;
  background: none;
  cursor: pointer;
  color: red;
  font-size: 16px; /* Increase font size for visibility */
  z-index: 1; /* Ensure button is above input */

  &:hover {
    color: orange;
  }
`;

const ResultsContainer = styled.div`
  margin-top: 10px;
`;

const NoteItem = styled.div`
  padding: 8px;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  margin: 5px 0;
`;

export default function Search({ searchQuery, setSearchQuery }) {
  const [cardData, setCardData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchNotesByTitle = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        const userEmail = decodedToken.ThisUserEmail;

        if (searchQuery) {
          try {
            const response = await axios.get(`http://localhost:8081/api/v1/listNote/title/${searchQuery}/${userEmail}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              },
            });
            setCardData(response.data); // Update state with the fetched notes
            setErrorMessage(""); // Clear error message on successful fetch
          } catch (error) {
            console.error("Error fetching notes by title:", error);
            setErrorMessage("Error fetching notes by title. Please check your input."); // Set error message
          }
        } else {
          // Reset cardData if searchQuery is empty
          setCardData([]);
        }
      }
    };

    fetchNotesByTitle(); // Call the async function
  }, [searchQuery]); // Depend on searchQuery so it fetches when this value changes

  return (
    <div></div>
  );
}

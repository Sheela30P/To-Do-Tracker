import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPalette, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import UpdateNoteForm from './UpdateNoteForm';

// Styled components for card
const CardContainer = styled.div`
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  padding: 24px;
   margin: 10px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  background-color: ${({ bgColor }) => bgColor || '#fff'};
  height: 350px;
  max-height: 350px;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
  position: relative; /* Added for positioning icons */
`;

const Title = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.75rem;
  color: #333;
`;

const Content = styled.p`
  margin: 5px 0 10px 0;
  font-size: 1.125rem;
  color: black;
  line-height: 1.6;
  overflow-y: auto;
  word-wrap: break-word;
  flex-grow: 1;
  text-align: left; /* Added for left alignment */
`;


const Details = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  position:absolute;
  bottom:5px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
  
  &:hover {
    opacity: 0.8;
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* Align icons to the bottom right */
  margin-top: 10px;
  position: absolute; /* Positioning to place it at the bottom */
  bottom: 20px;
  right: 20px;
`;

const ColorPalette = styled.div`
  display: flex;
  margin-top: 10px;
`;

const ColorOption = styled.div`
  width: 30px;
  height: 30px;
  margin: 0 5px;
   z-index: 10;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${({ color }) => color};

  &:hover {
    opacity: 0.8;
  }
`;

const colors = ['#FFB6C1', '#FFDAB9', '#FFFACD', '#E6E6FA', '#B0E0E6', '#98FB98', '#F5DEB3'];


// Styled components for the update form
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
   width: 95%; /* Reduce the width slightly to keep space around the input */
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  font-size: 1rem;
  color: #333;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const TextArea = styled.textarea`
  width: 95%;
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  font-size: 1rem;
  color: #333;
  resize: none;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  margin-left: 10px;
  &:hover {
    background-color: #0056b3;
  }
`;

const CancelButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

export default function CardNote({
  title: initialTitle,
  content: initialContent,
  duedate,
  cardId,
  onComplete
}) {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [showPalette, setShowPalette] = useState(false);

  useEffect(() => {
    const storedColor = localStorage.getItem(`cardColor-${cardId}`);
    if (storedColor) {
      setBgColor(storedColor);
    }
  }, [cardId]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTitle(initialTitle); // Reset title to initial value on cancel
    setContent(initialContent); // Reset content to initial value on cancel
  };

  const handleColorChange = (color) => {
    setBgColor(color);
    localStorage.setItem(`cardColor-${cardId}`, color);
    setShowPalette(false);
  };

  const handleCompleteClick = (noteId) => {
    onComplete(noteId); // Call the onComplete prop to move the note to archive
  };

  return (
    <CardContainer bgColor={bgColor}>
      {isEditing ? (
        <UpdateNoteForm
          noteId={cardId}
          currentTitle={title}
          currentContent={content}
          onCancel={handleCancelEdit}
          onUpdate={(updatedTitle, updatedContent) => {
            setTitle(updatedTitle);
            setContent(updatedContent);
            setIsEditing(false);
          }}
        />
      ) : (
        <>
          <Title>{title}</Title>
          <Content>{content}</Content>
          <Details>
            <p>Due Date: {duedate}</p>
          </Details>
          <IconContainer>
            <IconButton onClick={handleEditClick}>
              <FontAwesomeIcon icon={faEdit} size="2x" style={{ color: '#007bff' }} />
            </IconButton>
            <IconButton onClick={() => setShowPalette(!showPalette)}>
              <FontAwesomeIcon icon={faPalette} size="2x" style={{ color: '#6c757d' }} />
            </IconButton>
            <IconButton onClick={() => handleCompleteClick(cardId)}>
              <FontAwesomeIcon icon={faCheckCircle} size="2x" style={{ color: 'green' }} />
            </IconButton>
          </IconContainer>
          {showPalette && (
            <ColorPalette>
              {colors.map((color) => (
                <ColorOption
                  key={color}
                  color={color}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </ColorPalette>
          )}
        </>
      )}
    </CardContainer>
  );
}
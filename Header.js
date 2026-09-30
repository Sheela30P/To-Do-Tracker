import React, { useState } from 'react';
import styled from 'styled-components';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import ArchiveIcon from '@mui/icons-material/Archive';
import NoteIcon from '@mui/icons-material/Note';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { useAuth } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Corrected import
import RazorpayButton from './RazorpayButton';
import { useEffect } from 'react';

// Styled components
const StyledAppBar = styled(AppBar)`
  width: 100%;
  background-color: #f5f5f5;
  color: black;
  border-top: 1px solid #dcdcdc;
  border-bottom: 1px solid #dcdcdc;
  height: 70px;
  position: fixed; /* Make header fixed */
  top: 0; /* Align it to the top of the viewport */
  z-index: 1000;
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 80px;
`;

const NoteIconStyled = styled(NoteIcon)`
  font-size: 3rem;
  color: orange;
  margin-right: 1rem;
`;

const Title = styled(Typography)`
  font-size: 1.5rem;
`;

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
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #dcdcdc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: border 0.3s;

  &:focus {
    outline: none;
    border: 1px solid orange;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit; /* This will inherit the parent element's color */
  &:hover {
    text-decoration: none;
    color: inherit;
  }
`;

const ClearButton = styled(Button)`
  margin-left: 10px;
  color: black;
  background-color: white;
  border: none;
  font-size: 16px;
`;

const ProfileMenuBox = styled(Tooltip)`
  flex-grow: 0;
`;

const MenuBox = styled(Menu)`
  margin-top: 45px;
`;

const Greeting = styled.div`
  font-size: 1.5rem; 
  color: #d9dade; /* Darker gray for a softer look compared to pure black */
  margin-right: 20px; /* Space on the right */
  font-weight: 500; /* Medium font weight for emphasis */
  display: flex; /* Flexbox for alignment */
  align-items: center; /* Vertically center the content */
  letter-spacing: 0.5px; /* Add slight letter spacing for clarity */
  padding: 5px 10px; /* Add padding for better spacing */
  border-radius: 8px; /* Rounded edges for smoother appearance */
 font-family: "Lucida Handwriting", cursive;
`;


export default function Header({ searchQuery, onClear, handleChange }) {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [showPaymentOption, setShowPaymentOption] = useState(false);
  const [userImage, setUserImage] = useState(''); // State for profile image
  const navigate = useNavigate();
  const { setLoggedIn, isLoggedIn } = useAuth();

  // Fetch token from localStorage
  const token = localStorage.getItem('authToken');
  let decodedToken = {};
  let isSubscribed = false;

  try {
    decodedToken = token ? jwtDecode(token) : {};
    isSubscribed = decodedToken?.ThisIsSubscribed || false;
  } catch (error) {
    console.error('Error decoding token:', error);
    decodedToken = {};
  }

  // Extract user information
  const username = decodedToken?.ThisUserName || 'User';
  const imageToken = decodedToken?.ThisUserImage || 'default-avatar.jpg'; // Fallback if no image is present

  // Define base URL for profile images
  const imageBaseURL = 'http://localhost:8080/profile-image/'; // Ensure this is your actual backend URL
  useEffect(() => {
    if (imageToken) {
      setUserImage(`${imageBaseURL}${imageToken}`);
    } else {
      setUserImage('https://your-server.com/images/default-avatar.jpg'); // Fallback default avatar
    }
  }, [imageToken]); // Update only when imageToken changes

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    setShowPaymentOption(false); 
  };

  const handleLogout = () => {
    setLoggedIn(false);
    navigate('/');
    handleCloseUserMenu();
  };

  const handleSubscribe = () => {
    setShowPaymentOption(true); // Show the Pay Now option
  };

  return (
    <div>
      <StyledAppBar position="fixed">
        <StyledToolbar variant="dense">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <NoteIconStyled />
            <Title variant="h5" component="div">
              NoteLog
            </Title>
          </div>

          <SearchContainer>
            <SearchInput
              type="text"
              value={searchQuery}
              onChange={handleChange}
              placeholder="Search..."
            />
            <ClearButton onClick={onClear}>Clear</ClearButton>
          </SearchContainer>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isLoggedIn && (
              <Greeting>
                Hi, {username}
              </Greeting>
            )}

            <IconButton>
              <StyledLink to="/mainview">
                <HomeIcon fontSize="large" />
              </StyledLink>
            </IconButton>

            {isLoggedIn && (
            <IconButton component={Link} to="/archiveNotes">
              <ArchiveIcon fontSize="large" />
            </IconButton>
            )}


            {isLoggedIn && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ProfileMenuBox title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={username}
                      src={userImage}
                      onError={(e) => {
                        e.target.src = 'https://your-server.com/images/default-avatar.jpg'; // Fallback image
                      }}
                    />
                  </IconButton>
                </ProfileMenuBox>
                <MenuBox
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <StyledLink to="/editProfile">
                      <Typography sx={{ textAlign: 'center' }}>Profile</Typography>
                    </StyledLink>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleSubscribe}>
                    <Typography sx={{ textAlign: 'center' }}>
                      {isSubscribed ? 'Subscribed' : 'Subscribe'}
                    </Typography>
                  </MenuItem>

                  {/* Show RazorpayButton only if not subscribed */}
                  {!isSubscribed && showPaymentOption && (
                    <MenuItem>
                      <RazorpayButton />
                    </MenuItem>
                  )}
                </MenuBox>
              </div>
            )}
          </div>
        </StyledToolbar>
      </StyledAppBar>
    </div>
  );
}

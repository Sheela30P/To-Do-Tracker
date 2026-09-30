import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import styled from 'styled-components';

// Styled Components for Footer
const FooterContainer = styled(Box)`
  background-color: skyblue;
  padding: 10px 20px;
  color: #333;
  display: flex;
  justify-content: space-between; /* Aligns content side by side */
  align-items: center;            /* Vertically centers content */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;     /* Fixes the footer at the bottom */
  bottom: 0;           /* Positions it at the bottom */
  width: calc(100% ); /* Slightly reduces width to avoid scroll bar overlap */
  z-index: 1000;       /* Ensures it stays on top if necessary */
  box-sizing: border-box; /* Ensures padding is calculated within the width */
  height:40px;
`;

const FooterLinks = styled(Box)`
  color: #fff;
  display: flex;
  justify-content: center;
  gap: 20px;  
  flex-wrap: wrap; 
`;

const FooterLink = styled(Link)`
  color: gray;  
  text-decoration: 
  none;
  font-size: 16px;
  display: flex;  
  align-items: center;  
  gap: 8px; 
   
  
  &:hover {
    color: #ff5722;  
    text-decoration: none;
  }
`;

const SocialIcon = styled(IconButton)`
  color: inherit;  
  padding: 0;  
   
  &:hover {
    color: #ff5722; 
  }
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FooterLinks>
        <FooterLink href="/about">About</FooterLink>
        <FooterLink href="/privacypolicy">Privacy Policy</FooterLink>
        <FooterLink href="/contactus">Contact</FooterLink>
      </FooterLinks>

      <Box>
        <Typography variant="body2">
          NoteLog © 2024. All Rights Reserved.
        </Typography>
      </Box>

      <Box>
        <SocialIcon aria-label="facebook" href="https://facebook.com">
          <Facebook />
        </SocialIcon>
        <SocialIcon aria-label="twitter" href="https://twitter.com">
          <Twitter />
        </SocialIcon>
        <SocialIcon aria-label="instagram" href="https://instagram.com">
          <Instagram />
        </SocialIcon>
        <SocialIcon aria-label="linkedin" href="https://linkedin.com">
          <LinkedIn />
        </SocialIcon>
      </Box>
    </FooterContainer>
  );
}

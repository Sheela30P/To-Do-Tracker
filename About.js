import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  min-height: 100vh; /* Ensure it covers at least the full viewport height */
  display: flex;      /* Enables Flexbox */
  flex-direction: column; /* Stack children vertically */
  justify-content: center; /* Center content vertically */
  align-items: center; /* Center content horizontally */
`;

const Title = styled.h1`
  font-size: 36px;
  color: #333;
`;

const Paragraph = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 20px;
`;

const AboutPage = () => {
  return (
    <AboutContainer>
      <Title>About Notelog</Title>
      <Paragraph>
        Welcome to Notelog, your personal note-taking application crafted to help you organize your thoughts and ideas with ease. Notelog allows you to effortlessly create, manage, and store your notes in one accessible place.
      </Paragraph>
      <Paragraph>
        Whether you're recording important information, capturing your next big idea, or simply keeping track of daily tasks, Notelog is designed to provide you with all the tools you need to keep your notes structured and easily retrievable.
      </Paragraph>
      <Paragraph>
        You can add, edit, and delete notes seamlessly, categorize them for quick access, and even archive notes when you're done with them. With its minimalist design and user-friendly interface, Notelog makes sure you stay productive without distractions.
      </Paragraph>
      <Paragraph>
        Thank you for choosing Notelog—start logging your notes today and stay organized like never before!
      </Paragraph>
    </AboutContainer>
  );
};

export default AboutPage;

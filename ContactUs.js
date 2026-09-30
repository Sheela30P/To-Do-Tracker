import React from 'react';
import styled from 'styled-components';

const ContactContainer = styled.div`
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

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 10px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  resize: none;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #218838;
  }
`;

const ContactPage = () => {
  return (
    <ContactContainer>
      <Title>Contact Us</Title>
      <Paragraph>
        We would love to hear from you! If you have any questions, feedback, or suggestions, please feel free to reach out to us using the contact form below or via email at <a href="mailto:notelog24@gmail.com">support@notelog.com</a>.
      </Paragraph>
      {/* <ContactForm>
        <Label htmlFor="name">Name:</Label>
        <Input type="text" id="name" name="name" required />

        <Label htmlFor="email">Email:</Label>
        <Input type="email" id="email" name="email" required />

        <Label htmlFor="message">Message:</Label>
        <TextArea id="message" name="message" rows="5" required />

        <Button type="submit">Send Message</Button>
      </ContactForm> */}
    </ContactContainer>
  );
};

export default ContactPage;

import React from 'react';
import styled from 'styled-components';

const PrivacyPolicyContainer = styled.div`
  padding: 40px 20px; /* Increased top padding for better spacing */
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  min-height: 100vh; /* Ensures the container covers at least the full viewport height */
  display: flex;      /* Enables Flexbox */
  flex-direction: column; /* Stacks children vertically */
  justify-content: flex-start;
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

const PrivacyPolicyPage = () => {
  return (
    <PrivacyPolicyContainer>
      <Title>Privacy Policy for Notelog</Title>
      <Paragraph>
        At Notelog, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our application.
      </Paragraph>
      <Paragraph>
        <strong>Information We Collect:</strong>
        <br />
        We may collect personal information that you provide directly to us, such as your name, email address, and notes content. We also collect non-personal information automatically, including your device information, IP address, and usage data.
      </Paragraph>
      <Paragraph>
        <strong>How We Use Your Information:</strong>
        <br />
        The information we collect is used to:
        <ul>
          <li>Provide, maintain, and improve our application;</li>
          <li>Understand and analyze usage trends;</li>
          <li>Communicate with you regarding your account and updates;</li>
          <li>Respond to your comments and questions;</li>
          <li>Send you marketing communications, if you opt-in.</li>
        </ul>
      </Paragraph>
      <Paragraph>
        <strong>Data Security:</strong>
        <br />
        We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, please remember that no method of transmission over the Internet or method of electronic storage is 100% secure.
      </Paragraph>
      <Paragraph>
        <strong>Your Rights:</strong>
        <br />
        You have the right to access, correct, or delete your personal information at any time. If you wish to exercise these rights, please contact us using the information below.
      </Paragraph>
      <Paragraph>
        <strong>Contact Us:</strong>
        <br />
        If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at: <a href="mailto:notelog24@gmail.com">support@notelog.com</a>.
      </Paragraph>
      <Paragraph>
        This Privacy Policy is effective as of [insert effective date]. We may update this policy from time to time, and we will notify you of any changes by posting the new policy on this page.
      </Paragraph> 
    </PrivacyPolicyContainer>
  );
};

export default PrivacyPolicyPage;

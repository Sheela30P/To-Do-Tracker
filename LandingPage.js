import React from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import './LandingPage.css'; // You can style your page using this CSS file.

const LandingPage = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleButtonClick = () => {
    navigate("/login"); // Navigate to the login page when the button is clicked
  };

  return (
    <div className="landing-page">
      <div className="landing-page-content">
        <div className="hero-section">
          <div className="hero-content">
            <h1>Welcome to NoteLog!</h1>
            <p>Your smart, simple, and efficient note management app.</p>
            <button className="cta-button" onClick={handleButtonClick}>
              Start Managing Your Notes
            </button>
          </div>
          <img
            src="images/image1.jpg" // Replace with an appropriate image link
            alt="Notes"
            className="hero-image"
          />
        </div>
      </div>

      <div className="features-section">
      <div style={{
  backgroundColor: '#ff6b6b', // Example background color (coral)
  display: 'inline-block',      // Ensures the background only covers the text
  padding: '10px 20px',        // Adds padding around the text
  borderRadius: '5px',         // Optional: rounds the corners
  color: 'white',                // White text color
  fontWeight: 'bold',           // Makes the text bold
}}>
  <h2 style={{ margin: 0 }}>Why Use NoteLog?</h2> {/* Remove default margin from h2 */}
</div>

        <div className="features-list">
          <div className="feature-item">
            <img
              src="images/image2.jpg" // Replace with an appropriate image link
              alt="Add Note"
              className="feature-image"
            />
            <h3>Add and Manage Notes</h3>
            <p>Easily create new notes and set due dates, priorities, and more.</p>
          </div>

          <div className="feature-item">
            <img
              src="images/image3.png" // Replace with an appropriate image link
              alt="Edit Note"
              className="feature-image"
            />
            <h3>Edit Notes Anytime</h3>
            <p>Edit your notes whenever you want, ensuring they're always up-to-date.</p>
          </div>

          <div className="feature-item">
            <img
              src="images/image4.png" // Replace with an appropriate image link
              alt="Priority Management"
              className="feature-image"
            />
            <h3>Prioritize Your Tasks</h3>
            <p>Set priorities for each note, helping you stay focused on what’s important.</p>
          </div>

          <div className="feature-item">
            <img
              src="images/image5.jpg" // Replace with an appropriate image link
              alt="Complete Note"
              className="feature-image"
            />
            <h3>Mark Notes as Complete</h3>
            <p>With one click, mark your tasks complete and stay organized.</p>
          </div>

          <div className="feature-item">
            <img
              src="images/image6.webp" // Replace with an appropriate image link
              alt="Colorful Notes"
              className="feature-image"
            />
            <h3>Color-coded Notes</h3>
            <p>Assign colors to your notes for a more organized and visually appealing layout.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

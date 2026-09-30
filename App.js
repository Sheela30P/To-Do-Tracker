import { useAuth } from "./componets/AuthContext";
import Header from "./componets/Header";
import Login from "./componets/Login";
import MainView from "./componets/MainView";
import ProtectedRoute from "./componets/ProtectedRoute";
import SignUp from "./componets/SignUp";
import Footer from "./componets/Footer";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import ArchivedNotes from "./componets/ArchiveNotes";
import LandingPage from "./componets/LandingPage";
import ForgotPassword from "./componets/ForgotPassword";
import EditProfile from "./componets/EditProfile"
import About from "./componets/About"
import PrivacyPolicy from "./componets/PrivacyPolicy"
import ContactUs from "./componets/ContactUs"



function App() {
  const [cardData, setCardData] = useState([]); // State for all notes
  const [archivedNotes, setArchivedNotes] = useState([]); // State for archived notes
  const { isLoggedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [userEmail, setUserEmail] = useState(null); // To store the logged-in user's email

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const decodedToken = jwtDecode(token);
        const emailId = decodedToken.ThisUserEmail;

       
        setCardData([]); 
        setArchivedNotes([]); 

        setUserEmail(emailId); // Set the current user's email

        const url = searchQuery !== ""
          ? `http://localhost:8081/api/v1/listNote/title/${searchQuery}/${emailId}`
          : `http://localhost:8081/api/v1/listNote/allNotes/${emailId}`;

        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        let fetchedNotes = response.data.allNotes;

        // Load archived notes from localStorage specific to the logged-in user
        const storedArchivedNotes = JSON.parse(localStorage.getItem(`archivedNotes_${emailId}`)) || [];

        // Filter out archived notes
        const filteredNotes = fetchedNotes.filter(
          (note) => !storedArchivedNotes.some(archivedNote => archivedNote.noteId === note.noteId)
        );

        // Set the filtered notes
        setCardData({
          ...response.data,
          allNotes: filteredNotes,
        });

        // Set the archived notes
        setArchivedNotes(storedArchivedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    if (isLoggedIn) {
      fetchData();
    }
  }, [searchQuery, isLoggedIn]);

  function onClear() {
    setSearchQuery("");
  }

  function handleChange(e) {
    setSearchQuery(e.target.value);
  }

  

  const handleComplete = (noteId) => {
    // Find the note to archive
    const noteToArchive = cardData.allNotes.find((note) => note.noteId === noteId);

    if (noteToArchive && userEmail) {
      // Move note to archivedNotes
      setArchivedNotes((prevArchivedNotes) => {
        const updatedArchivedNotes = [...prevArchivedNotes, noteToArchive];
        localStorage.setItem(`archivedNotes_${userEmail}`, JSON.stringify(updatedArchivedNotes)); // Save to localStorage under user's email
        return updatedArchivedNotes;
      });

      // Remove note from active notes (cardData)
      setCardData((prevCardData) => ({
        ...prevCardData,
        allNotes: prevCardData.allNotes.filter((note) => note.noteId !== noteId),
      }));
    } else {
      console.error(`Note with ID ${noteId} not found in cardData`);
    }
  };

  return (
    <Router>
      <div className="App">
        <Header 
          searchQuery={searchQuery} 
          onClear={onClear} 
          handleChange={handleChange} 
          archivedNotes={archivedNotes} // Pass archivedNotes to header
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/editProfile" element={<EditProfile />} />
          <Route path="/archiveNotes" element={<ArchivedNotes archivedNotes={archivedNotes} setArchivedNotes={setArchivedNotes} userEmail={userEmail} />} />
          <Route path="/about" element={<About/>}/>
          <Route path="/privacypolicy" element={<PrivacyPolicy/>}/>
          <Route path="/contactus" element={<ContactUs/>}/>
          <Route path="/mainview" element={
            <ProtectedRoute>
              <MainView 
                cardData={cardData} 
                setCardData={setCardData} 
                onComplete={handleComplete} 
              />
            </ProtectedRoute>
          }/>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

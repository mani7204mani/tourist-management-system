// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm'; // We will create this component next
import Dashboard from './Dashboard'; // We will create this component next
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to check login status on mount
  const checkLoginStatus = () => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        setIsLoggedIn(data.isLoggedIn);
        setUsername(data.username);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to check status:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    checkLoginStatus();
  }, []); // Run only once on component mount

  if (loading) {
    return <div className="App"><p>Verifying session...</p></div>;
  }

  // CONDITIONAL RENDERING: Show Dashboard if logged in, otherwise show Login
  return (
    <div className="App">
      {isLoggedIn ? (
        <Dashboard username={username} setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />
      ) : (
        <LoginForm checkLoginStatus={checkLoginStatus} />
      )}
    </div>
    
  );
}

export default App;
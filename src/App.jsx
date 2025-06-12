import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import LoginComponent from './components/LoginComponent';
import Dashboard from './components/Dashboard';
import './styles/App.css';

// Firebase configuration - replace with your own keys
const firebaseConfig = {
  apiKey: "AIzaSyB9ererNsNonAzH0zQo_GS79XPOyCoMxr4",
      authDomain: "waterdtection.firebaseapp.com",
      databaseURL: "https://waterdtection-default-rtdb.firebaseio.com",
      projectId: "waterdtection",
      storageBucket: "waterdtection.firebasestorage.app",
      messagingSenderId: "690886375729",
      appId: "1:690886375729:web:172c3a47dda6585e4e1810",
      measurementId: "G-TXF33Y6XY0"
};

// Initialize Firebase
initializeApp(firebaseConfig);
window.firebaseInitialized = true;

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  // Login handler
  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };
  
  // Logout handler
  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };
  
  return (
    <div className="app">
      {!isLoggedIn ? (
        <LoginComponent onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;